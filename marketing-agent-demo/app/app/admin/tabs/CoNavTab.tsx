"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clipboard } from "lucide-react";
import { CUSTOM_FUNCTION_SCHEMA } from "../customFunctionSchema";
import { PROPERTY_STORIES, SECTIONS, TOP_ROUTES } from "../constants";

interface NavEntry {
  ts: number;
  cmd: NavCommand;
  ok: boolean;
  sessionId: string;
}

type NavCommand = { url?: string; section?: string };

// co-nav-tab -------------------------------------------------------------------

export function CoNavTab({ adminPassword }: { adminPassword: string }) {
  const [sessionId, setSessionId] = useState("");
  const [log, setLog] = useState<NavEntry[]>([]);
  const [customFunctionUrl, setCustomFunctionUrl] = useState(
    "https://ttai-marketing-agent-demo.vercel.app/api/agent-navigate",
  );

  useEffect(() => {
    fetch("/api/admin-config", {
      headers: { "x-admin-password": adminPassword },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { customFunctionUrl?: string }) => {
        if (data.customFunctionUrl) {
          setCustomFunctionUrl(data.customFunctionUrl);
        }
      })
      .catch(() => {});
  }, [adminPassword]);

  const push = useCallback(
    async (cmd: NavCommand) => {
      const targetSession = sessionId.trim().toUpperCase();
      if (!targetSession) return;

      const ok = await fetch(`/api/navigate-commands/${targetSession}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": adminPassword,
        },
        body: JSON.stringify(cmd),
      }).then((r) => r.ok);

      setLog((prev) =>
        [
          { ts: Date.now(), cmd, ok, sessionId: targetSession },
          ...prev,
        ].slice(0, 10)
      );
    },
    [adminPassword, sessionId],
  );

  return (
    <div className="mt-6 space-y-8">
      <CoNavSetup customFunctionUrl={customFunctionUrl} />
      <CoNavController
        sessionId={sessionId}
        onSessionIdChange={setSessionId}
        push={push}
      />
      <CommandLog entries={log} adminPassword={adminPassword} />
      <ClientImplementationNotes />
    </div>
  );
}

// setup ------------------------------------------------------------------------

function CoNavSetup({ customFunctionUrl }: { customFunctionUrl: string }) {
  const schema = JSON.stringify(CUSTOM_FUNCTION_SCHEMA, null, 2);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="admin-section-title mb-2">TTAI custom function</h2>
        <p className="font-body text-sm text-[#59615D] leading-relaxed max-w-3xl">
          Configure this in ToughTongue AI so the voice agent can push
          navigation events to the visitor browser. The schema below matches the
          current API: <code>session_code</code>{" "}
          is required, and each call must include either <code>url</code> or
          {" "}
          <code>section</code>.
        </p>
      </div>

      <div className="border border-[#C5A059] bg-[#FFFDF7] p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="font-mono text-xs font-semibold text-[#1A362D] bg-[#1A362D]/8 px-2 py-0.5">
              Endpoint URL
            </span>
            <code className="block mt-3 font-mono text-sm text-[#2C302E] break-all">
              {customFunctionUrl}
            </code>
          </div>
          <CopyButton label="Copy URL" value={customFunctionUrl} />
        </div>
      </div>

      <details className="admin-disclosure" open>
        <summary>Object schema for ToughTongue AI</summary>
        <div className="space-y-3">
          <div className="flex justify-end">
            <CopyButton label="Copy schema" value={schema} />
          </div>
          <pre className="font-mono text-xs text-[#59615D] bg-[#F5F3EE] px-4 py-3 overflow-x-auto">
            {schema}
          </pre>
        </div>
      </details>
    </section>
  );
}

// controller -------------------------------------------------------------------

function CoNavController({
  sessionId,
  onSessionIdChange,
  push,
}: {
  sessionId: string;
  onSessionIdChange: (v: string) => void;
  push: (cmd: NavCommand) => void;
}) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="admin-section-title mb-2">Co-Nav Controller</h2>
        <p className="font-body text-sm text-[#59615D] leading-relaxed">
          Fire synthetic events to test co-navigation.
        </p>
      </div>
      <SessionInput value={sessionId} onChange={onSessionIdChange} />
      <NavButtons
        label="Pages"
        items={TOP_ROUTES.map((r) => ({ label: r.label, cmd: { url: r.url } }))}
        push={push}
      />
      <NavButtons
        label="Sections"
        items={SECTIONS.map((s) => ({
          label: s.label,
          cmd: { section: s.section },
        }))}
        push={push}
      />
      <PropertyNavButtons push={push} />
    </section>
  );
}

function SessionInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3">
      <label className="admin-section-title">Session code</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        placeholder="e.g. ABCD"
        maxLength={4}
        className="border border-[#E5E0D5] px-3 py-2 font-mono text-sm bg-white focus:outline-none focus:border-[#1A362D] w-28"
      />
    </div>
  );
}

function NavButtons({
  label,
  items,
  push,
}: {
  label: string;
  items: { label: string; cmd: NavCommand }[];
  push: (cmd: NavCommand) => void;
}) {
  return (
    <div>
      <span className="admin-section-title mb-3">{label}</span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => push(item.cmd)}
            className="admin-control-button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PropertyNavButtons({ push }: { push: (cmd: NavCommand) => void }) {
  return (
    <div>
      <span className="admin-section-title mb-3">Property stories</span>
      {PROPERTY_STORIES.map((story) => (
        <div key={story.id} className="mb-4">
          <p className="font-body text-xs text-[#59615D] mb-2">{story.label}</p>
          <div className="flex flex-wrap gap-2">
            {story.scenes.map((s) => (
              <button
                key={s.n}
                onClick={() => push({ url: `/slides/${story.id}/${s.n}` })}
                className="admin-control-button"
              >
                {s.n}. {s.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// implementation-notes ---------------------------------------------------------

function ClientImplementationNotes() {
  return (
    <section className="space-y-3">
      <h2 className="admin-section-title mb-2">Implementation notes</h2>
      <details className="admin-disclosure">
        <summary>How the browser session is created</summary>
        <div>
          <code>useNavigationSession</code>{" "}
          generates a 4-character code, writes it into the visitor URL as{" "}
          <code>?session=ABCD</code>, and stores the active session in React
          state. If the page reloads with an existing session query param, the
          hook reconnects automatically.
        </div>
      </details>
      <details className="admin-disclosure">
        <summary>How the agent gets the session code</summary>
        <div>
          <code>NavAgentWidget</code> fetches <code>/website-nav.md</code>{" "}
          and injects both <code>t_website_map</code> and{" "}
          <code>t_session_code</code>{" "}
          into the ToughTongue AI iframe URL. The scenario instructions can then
          reference <code>{"{{ session_code }}"}</code>
          when calling the custom function.
        </div>
      </details>
      <details className="admin-disclosure">
        <summary>How commands reach the client</summary>
        <div>
          The visitor browser keeps a long-poll open at{" "}
          <code>/api/navigate-commands/:sessionId/poll</code>. When ToughTongue
          AI posts to{" "}
          <code>/api/agent-navigate</code>, the server validates the body,
          stores the command by session, and wakes the waiting poll. The client
          then calls <code>router.push</code> for URLs or{" "}
          <code>scrollIntoView</code> for anchors.
        </div>
      </details>
      <details className="admin-disclosure">
        <summary>Production scaling note</summary>
        <div>
          The demo uses an in-memory command store. That is fine for one warm
          serverless instance and local demos. For production traffic across
          multiple instances, replace it with Redis or another shared queue.
        </div>
      </details>
    </section>
  );
}

// command-log ------------------------------------------------------------------

function CommandLog({
  entries,
  adminPassword,
}: {
  entries: NavEntry[];
  adminPassword: string;
}) {
  if (entries.length === 0) return null;
  return (
    <section>
      <span className="admin-section-title mb-3">Command log</span>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.ts}
            className="flex flex-col gap-2 border border-[#E5E0D5] px-3 py-2 md:flex-row md:items-center md:justify-between"
          >
            <div className="flex items-center gap-3 font-mono text-xs text-[#59615D] min-w-0">
              {entry.ok
                ? (
                  <CheckCircle2
                    size={12}
                    className="text-emerald-500 shrink-0"
                  />
                )
                : <AlertCircle size={12} className="text-red-500 shrink-0" />}
              <span className="text-[#2C302E] break-all">
                {JSON.stringify(entry.cmd)}
              </span>
              <span className="text-[#59615D]/60 shrink-0">
                {new Date(entry.ts).toLocaleTimeString()}
              </span>
            </div>
            <CopyButton
              label="Copy curl"
              value={buildCurlCommand(entry, adminPassword)}
              compact
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// atoms ------------------------------------------------------------------------

function CopyButton({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={compact ? "admin-copy-button px-2 py-1" : "admin-copy-button"}
    >
      <Clipboard size={12} />
      {copied ? "Copied" : label}
    </button>
  );
}

function buildCurlCommand(entry: NavEntry, adminPassword: string): string {
  const body = JSON.stringify(entry.cmd);
  return [
    "curl",
    "-X POST",
    shellQuote(
      `${window.location.origin}/api/navigate-commands/${entry.sessionId}`,
    ),
    "-H 'Content-Type: application/json'",
    `-H ${shellQuote(`x-admin-password: ${adminPassword}`)}`,
    `--data-raw ${shellQuote(body)}`,
  ].join(" ");
}

function shellQuote(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`;
}
