"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { OUR_SCENARIOS } from "../constants";

interface CoNavSession {
  sessionId: string;
  connected: boolean;
  lastSeenAt: number;
  waitingSince?: number;
  pendingCommand?: Record<string, unknown>;
  recentCommands: {
    command: Record<string, unknown>;
    deliveredAt: number;
    source: "agent" | "admin";
  }[];
}

export function SessionsTab({ adminPassword }: { adminPassword: string }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [coNavRows, setCoNavRows] = useState<CoNavSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `/api/ttai/sessions?scenario_id=${OUR_SCENARIOS[0].id}&limit=25`,
        { headers: { "x-admin-password": adminPassword } },
      );
      const data = (await res.json()) as {
        sessions?: Record<string, unknown>[];
      };
      setRows(data.sessions ?? []);
      setLoading(false);
    })();
  }, [adminPassword]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const res = await fetch("/api/navigate-commands/sessions", {
        headers: { "x-admin-password": adminPassword },
      });
      const data = (await res.json()) as { sessions?: CoNavSession[] };
      if (active) setCoNavRows(data.sessions ?? []);
    };

    void load();
    const timer = window.setInterval(() => void load(), 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [adminPassword]);

  if (loading) {
    return <p className="text-[#59615D] font-body text-sm mt-8">Loading…</p>;
  }

  return (
    <div className="mt-6 space-y-5">
      <details className="admin-disclosure">
        <summary>How session data is loaded</summary>
        <div>
          This table reads recent sessions for the configured navigation-agent
          scenario through the local server route. Analytics links come from
          ToughTongue AI when the upstream session response includes them.
        </div>
      </details>
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body border-collapse">
          <thead>
            <tr className="border-b border-[#E5E0D5] text-left text-[#59615D]">
              <th className="py-3 pr-6 font-medium">Session</th>
              <th className="py-3 pr-6 font-medium">Status</th>
              <th className="py-3 pr-6 font-medium">Duration</th>
              <th className="py-3 font-medium">Analytics</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b border-[#E5E0D5]/50">
                <td className="py-3 pr-6 font-mono text-xs">
                  {String(r.id ?? "").slice(0, 12)}
                </td>
                <td className="py-3 pr-6">{String(r.status ?? "")}</td>
                <td className="py-3 pr-6">
                  {r.duration_seconds
                    ? `${Math.round(Number(r.duration_seconds))}s`
                    : "—"}
                </td>
                <td className="py-3">
                  {r.analytics_url
                    ? (
                      <a
                        href={String(r.analytics_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-[#1A362D] hover:underline"
                      >
                        View <ExternalLink size={12} />
                      </a>
                    )
                    : (
                      "—"
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && (
        <p className="text-[#59615D] text-sm mt-6">No sessions yet.</p>
      )}
      <CoNavSessions rows={coNavRows} />
    </div>
  );
}

function CoNavSessions({ rows }: { rows: CoNavSession[] }) {
  return (
    <section className="pt-4">
      <h2 className="admin-section-title mb-4">Co-nav browser sessions</h2>
      {rows.length === 0
        ? (
          <p className="text-[#59615D] text-sm">
            No active local co-navigation sessions in this server instance.
          </p>
        )
        : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.sessionId} className="border border-[#E5E0D5] p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <code className="font-mono text-sm text-[#1A362D]">
                    {row.sessionId}
                  </code>
                  <span
                    className={[
                      "text-[10px] uppercase tracking-[0.18em]",
                      row.connected ? "text-emerald-600" : "text-[#59615D]",
                    ].join(" ")}
                  >
                    {row.connected ? "Connected" : "Idle"}
                  </span>
                  {row.pendingCommand && (
                    <span className="text-[10px] uppercase tracking-[0.18em] text-amber-600">
                      Pending command
                    </span>
                  )}
                  <span className="text-xs text-[#59615D]/70">
                    Last seen {new Date(row.lastSeenAt).toLocaleTimeString()}
                  </span>
                </div>
                {row.recentCommands.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {row.recentCommands.slice(0, 3).map((entry) => (
                      <div
                        key={`${entry.deliveredAt}-${entry.source}`}
                        className="font-mono text-xs text-[#59615D] flex flex-wrap gap-2"
                      >
                        <span>{entry.source}</span>
                        <span>
                          {new Date(entry.deliveredAt).toLocaleTimeString()}
                        </span>
                        <span className="break-all">
                          {JSON.stringify(entry.command)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </section>
  );
}
