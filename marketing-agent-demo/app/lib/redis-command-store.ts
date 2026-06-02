/**
 * Redis-backed co-navigation command store.
 *
 * Sections:
 * - Types
 * - Adapter
 * - Helpers
 */

import { type NavigateCommand } from "@/lib/navigation-command";
import {
  type CommandLogEntry,
  type CommandStore,
  type SessionSnapshot,
} from "@/lib/command-store";

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
type RedisValue = string | number;

interface RedisResponse<T> {
  result?: T;
  error?: string;
}

// ------------------------------------------------------------------------------
// Adapter
// ------------------------------------------------------------------------------
export class RedisCommandStore implements CommandStore {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(baseUrl: string, token: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
    this.token = token;
  }

  async deliver(
    sessionId: string,
    cmd: NavigateCommand,
    source: "agent" | "admin" = "agent",
  ): Promise<void> {
    const now = Date.now();
    const payload = JSON.stringify({ command: cmd, deliveredAt: now, source });
    await this.pipeline([
      ["RPUSH", queueKey(sessionId), JSON.stringify(cmd)],
      ["EXPIRE", queueKey(sessionId), 600],
      ["HSET", stateKey(sessionId), "lastSeenAt", now],
      ["EXPIRE", stateKey(sessionId), 1800],
      ["LPUSH", logKey(sessionId), payload],
      ["LTRIM", logKey(sessionId), 0, 7],
      ["EXPIRE", logKey(sessionId), 1800],
      ["ZADD", sessionsKey(), now, sessionId],
    ]);
  }

  async poll(
    sessionId: string,
    timeoutMs = 29_000,
  ): Promise<NavigateCommand | null> {
    const startedAt = Date.now();
    await this.pipeline([
      [
        "HSET",
        stateKey(sessionId),
        "connected",
        1,
        "lastSeenAt",
        startedAt,
        "waitingSince",
        startedAt,
      ],
      ["EXPIRE", stateKey(sessionId), 1800],
      ["ZADD", sessionsKey(), startedAt, sessionId],
    ]);

    const deadline = startedAt + timeoutMs;
    while (Date.now() < deadline) {
      const raw = await this.command<string | null>([
        "LPOP",
        queueKey(sessionId),
      ]);
      if (raw) {
        await this.markIdle(sessionId);
        return JSON.parse(raw) as NavigateCommand;
      }
      await sleep(500);
    }

    await this.markIdle(sessionId);
    return null;
  }

  async snapshot(): Promise<SessionSnapshot[]> {
    const ids = await this.command<string[]>([
      "ZREVRANGE",
      sessionsKey(),
      0,
      24,
    ]);
    if (!ids || ids.length === 0) return [];

    const rows = await Promise.all(
      ids.map((sessionId) => this.snapshotOne(sessionId)),
    );
    return rows.filter((row): row is SessionSnapshot => row !== null);
  }

  private async snapshotOne(
    sessionId: string,
  ): Promise<SessionSnapshot | null> {
    const [stateRes, queueRes, logRes] = await this.pipeline([
      ["HGETALL", stateKey(sessionId)],
      ["LLEN", queueKey(sessionId)],
      ["LRANGE", logKey(sessionId), 0, 7],
    ]);

    const state = pairsToRecord(stateRes.result);
    const lastSeenAt = Number(state.lastSeenAt ?? 0);
    if (!lastSeenAt) return null;

    return {
      sessionId,
      connected: state.connected === "1",
      lastSeenAt,
      waitingSince: state.waitingSince ? Number(state.waitingSince) : undefined,
      pendingCommand: Number(queueRes.result ?? 0) > 0 ? {} : undefined,
      recentCommands: Array.isArray(logRes.result)
        ? logRes.result.map(parseLogEntry).filter((entry) => entry !== null)
        : [],
    };
  }

  private async markIdle(sessionId: string): Promise<void> {
    const now = Date.now();
    await this.pipeline([
      [
        "HSET",
        stateKey(sessionId),
        "connected",
        0,
        "lastSeenAt",
        now,
        "waitingSince",
        "",
      ],
      ["EXPIRE", stateKey(sessionId), 1800],
      ["ZADD", sessionsKey(), now, sessionId],
    ]);
  }

  private async command<T>(command: RedisValue[]): Promise<T | undefined> {
    const res = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });
    const data = (await res.json()) as RedisResponse<T>;
    if (!res.ok || data.error) {
      throw new Error(data.error || `Redis command failed: ${res.status}`);
    }
    return data.result;
  }

  private async pipeline(
    commands: RedisValue[][],
  ): Promise<RedisResponse<unknown>[]> {
    const res = await fetch(`${this.baseUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    const data = (await res.json()) as RedisResponse<unknown>[];
    if (!res.ok) {
      throw new Error(`Redis pipeline failed: ${res.status}`);
    }
    const failed = data.find((item) => item.error);
    if (failed?.error) throw new Error(failed.error);
    return data;
  }
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function queueKey(sessionId: string): string {
  return `ttai:conav:${sessionId}:queue`;
}

function stateKey(sessionId: string): string {
  return `ttai:conav:${sessionId}:state`;
}

function logKey(sessionId: string): string {
  return `ttai:conav:${sessionId}:log`;
}

function sessionsKey(): string {
  return "ttai:conav:sessions";
}

function pairsToRecord(value: unknown): Record<string, string> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, String(item)]),
    );
  }
  if (!Array.isArray(value)) return {};
  const out: Record<string, string> = {};
  for (let i = 0; i < value.length; i += 2) {
    out[String(value[i])] = String(value[i + 1] ?? "");
  }
  return out;
}

function parseLogEntry(value: unknown): CommandLogEntry | null {
  if (typeof value !== "string") return null;
  try {
    const parsed = JSON.parse(value) as CommandLogEntry;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}
