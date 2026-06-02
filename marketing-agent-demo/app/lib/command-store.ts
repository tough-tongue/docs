/**
 * In-memory navigation command store.
 *
 * Holds pending commands (when no poller is waiting) and live waiters
 * (when a poll is in progress). On Vercel, each serverless invocation
 * is a separate process. Set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN to use the Redis adapter in production.
 *
 * Sections:
 * - Types
 * - In-memory adapter
 * - Store facade
 */

import { Config } from "@/lib/config";
import { type NavigateCommand } from "@/lib/navigation-command";
import { RedisCommandStore } from "@/lib/redis-command-store";

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
export interface CommandLogEntry {
  command: NavigateCommand;
  deliveredAt: number;
  source: "agent" | "admin";
}

export interface SessionSnapshot {
  sessionId: string;
  connected: boolean;
  lastSeenAt: number;
  waitingSince?: number;
  pendingCommand?: NavigateCommand;
  recentCommands: CommandLogEntry[];
}

export interface CommandStore {
  deliver(
    sessionId: string,
    cmd: NavigateCommand,
    source?: "agent" | "admin",
  ): Promise<void>;
  poll(sessionId: string, timeoutMs?: number): Promise<NavigateCommand | null>;
  snapshot(): Promise<SessionSnapshot[]>;
}

// ------------------------------------------------------------------------------
// In-memory adapter
// ------------------------------------------------------------------------------
// Module-level maps — shared across requests in the same serverless warm instance.
const _pending = new Map<string, NavigateCommand[]>();
const _waiters = new Map<
  string,
  {
    resolve: (cmd: NavigateCommand | null) => void;
    timer: ReturnType<typeof setTimeout>;
  }
>();
const _sessions = new Map<string, SessionSnapshot>();

function sessionFor(sessionId: string): SessionSnapshot {
  const existing = _sessions.get(sessionId);
  if (existing) return existing;

  const created: SessionSnapshot = {
    sessionId,
    connected: false,
    lastSeenAt: Date.now(),
    recentCommands: [],
  };
  _sessions.set(sessionId, created);
  return created;
}

function rememberCommand(
  sessionId: string,
  command: NavigateCommand,
  source: "agent" | "admin",
): void {
  const session = sessionFor(sessionId);
  session.recentCommands = [
    { command, deliveredAt: Date.now(), source },
    ...session.recentCommands,
  ].slice(0, 8);
}

function pruneSessions(): void {
  const cutoff = Date.now() - 30 * 60 * 1000;
  for (const [sessionId, session] of _sessions) {
    if (!session.connected && session.lastSeenAt < cutoff) {
      _sessions.delete(sessionId);
    }
  }
}

const memoryCommandStore: CommandStore = {
  /** Deliver a command — wakes a waiting poller or stores for later pickup. */
  async deliver(
    sessionId: string,
    cmd: NavigateCommand,
    source: "agent" | "admin" = "agent",
  ): Promise<void> {
    const session = sessionFor(sessionId);
    session.lastSeenAt = Date.now();
    rememberCommand(sessionId, cmd, source);

    const waiter = _waiters.get(sessionId);
    if (waiter) {
      clearTimeout(waiter.timer);
      _waiters.delete(sessionId);
      session.connected = false;
      session.waitingSince = undefined;
      session.pendingCommand = undefined;
      waiter.resolve(cmd);
    } else {
      const queue = _pending.get(sessionId) ?? [];
      queue.push(cmd);
      _pending.set(sessionId, queue);
      session.pendingCommand = cmd;
    }
  },

  /** Long-poll: resolves when a command arrives or after timeoutMs. */
  poll(
    sessionId: string,
    timeoutMs = 29_000,
  ): Promise<NavigateCommand | null> {
    const session = sessionFor(sessionId);
    session.lastSeenAt = Date.now();

    const pendingQueue = _pending.get(sessionId);
    const pending = pendingQueue?.shift();
    if (pending) {
      if (pendingQueue && pendingQueue.length > 0) {
        _pending.set(sessionId, pendingQueue);
        session.pendingCommand = pendingQueue[0];
      } else {
        _pending.delete(sessionId);
        session.pendingCommand = undefined;
      }
      session.connected = false;
      session.waitingSince = undefined;
      return Promise.resolve(pending);
    }

    const previousWaiter = _waiters.get(sessionId);
    if (previousWaiter) {
      clearTimeout(previousWaiter.timer);
      previousWaiter.resolve(null);
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        _waiters.delete(sessionId);
        session.connected = false;
        session.waitingSince = undefined;
        session.lastSeenAt = Date.now();
        resolve(null); // timeout — client should re-poll
      }, timeoutMs);
      session.connected = true;
      session.waitingSince = Date.now();
      _waiters.set(sessionId, { resolve, timer });
    });
  },

  async snapshot(): Promise<SessionSnapshot[]> {
    pruneSessions();
    return Array.from(_sessions.values())
      .sort((a, b) => b.lastSeenAt - a.lastSeenAt)
      .slice(0, 25);
  },
};

// ------------------------------------------------------------------------------
// Store facade
// ------------------------------------------------------------------------------
function createCommandStore(): CommandStore {
  const { redisRestToken, redisRestUrl } = Config.srv;
  if (redisRestToken && redisRestUrl) {
    return new RedisCommandStore(redisRestUrl, redisRestToken);
  }
  return memoryCommandStore;
}

export const commandStore = createCommandStore();
