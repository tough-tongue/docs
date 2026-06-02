"use client";

import { Radio, Globe, Webhook, Clock, Code2, KeyRound, BookOpen, ArrowRight } from "lucide-react";
import { AppConfig } from "@/lib/config";

// overview-tab -----------------------------------------------------------------

export function OverviewTab() {
  return (
    <div className="mt-8 space-y-10">
      <HowItWorksSection />
      <QuickReferenceSection />
      <EnvSection />
    </div>
  );
}

// how-it-works -----------------------------------------------------------------

const STEPS = [
  {
    Icon: Radio,
    title: "1. Visitor opens the widget",
    body: "The floating voice panel generates a 4-character session code (e.g. ABCD) and appends it to the iframe URL as ?session=ABCD. The agent reads it via the {{ session_code }} dynamic variable.",
  },
  {
    Icon: Globe,
    title: "2. Browser starts long-polling",
    body: "Your page calls GET /api/navigate-commands/:sessionId/poll. The request hangs open (up to 28 s) waiting for a command. When nothing arrives it retries automatically — zero latency overhead.",
  },
  {
    Icon: Webhook,
    title: "3. Agent calls your server",
    body: "When the agent wants to navigate, it calls the custom function you configured: POST /api/agent-navigate with { session_code, url } or { session_code, section }. Your server wakes the waiting poll.",
  },
  {
    Icon: Clock,
    title: "4. Browser navigates instantly",
    body: "The long-poll resolves with the command. The browser navigates to the URL or scrolls to the section — the agent and visitor are now looking at the same thing.",
  },
];

function HowItWorksSection() {
  return (
    <section>
      <h2 className="overline text-[#1A362D] mb-6">How co-navigation works</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STEPS.map(({ Icon, title, body }) => (
          <div key={title} className="border border-[#E5E0D5] p-6 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Icon size={16} className="text-[#1A362D] shrink-0" />
              <span className="font-body text-[13px] font-semibold tracking-wide text-[#1A362D]">
                {title}
              </span>
            </div>
            <p className="font-body text-sm text-[#59615D] leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// quick-reference --------------------------------------------------------------

const ENDPOINTS = [
  {
    method: "POST",
    path: "/api/agent-navigate",
    note: "TTAI calls this to drive the visitor's browser",
    example: `{ "session_code": "ABCD", "url": "/slides/wraparound-residence/1" }`,
  },
  {
    method: "POST",
    path: "/api/navigate-commands/:sessionId",
    note: "Push a command directly (used by the Co-Navigation tab above)",
    example: `{ "section": "#highlights" }`,
  },
  {
    method: "GET",
    path: "/api/navigate-commands/:sessionId/poll",
    note: "Long-poll — browser holds this open to receive commands",
    example: "Returns { url } or { section } when a command arrives",
  },
];

function QuickReferenceSection() {
  const customFunctionUrl = getCustomFunctionUrl();

  return (
    <section>
      <h2 className="overline text-[#1A362D] mb-6">API endpoints</h2>
      <div className="border border-[#C5A059] bg-[#FFFDF7] p-5 mb-3">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="font-mono text-xs font-semibold text-[#1A362D] bg-[#1A362D]/8 px-2 py-0.5">
            TTAI custom function URL
          </span>
          <code className="font-mono text-sm text-[#2C302E] break-all">
            {customFunctionUrl}
          </code>
        </div>
        <p className="mt-2 text-sm text-[#59615D] font-body">
          Paste this full URL into the ToughTongue AI custom function endpoint.
          The route path is <code className="font-mono text-xs">/api/agent-navigate</code>;
          the deployed app domain must come before it.
        </p>
      </div>
      <div className="space-y-3">
        {ENDPOINTS.map(({ method, path, note, example }) => (
          <div key={path} className="border border-[#E5E0D5] p-5">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="font-mono text-xs font-semibold text-[#1A362D] bg-[#1A362D]/8 px-2 py-0.5">
                {method}
              </span>
              <code className="font-mono text-sm text-[#2C302E]">{path}</code>
            </div>
            <p className="mt-2 text-sm text-[#59615D] font-body">{note}</p>
            <pre className="mt-3 font-mono text-xs text-[#59615D] bg-[#F5F3EE] px-4 py-3 overflow-x-auto">
              {example}
            </pre>
          </div>
        ))}
      </div>
      <a
        href="https://github.com/tough-tongue/voice-ai-quickstart/tree/main/marketing-agent-demo"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 mt-4 text-sm text-[#1A362D] hover:underline font-body"
      >
        <BookOpen size={14} />
        Full integration guide
        <ArrowRight size={12} />
      </a>
    </section>
  );
}

function getCustomFunctionUrl(): string {
  const base = AppConfig.app.url || "https://ttai-marketing-agent-demo.vercel.app";
  return `${base.replace(/\/$/, "")}/api/agent-navigate`;
}

// env-section ------------------------------------------------------------------

const ENV_VARS = [
  {
    name: "TOUGHTONGUE_API_TOKEN",
    required: true,
    note: "Server-side PAT — never use NEXT_PUBLIC_ prefix",
    where: "Vercel → Environment Variables",
  },
  {
    name: "NEXT_PUBLIC_ADMIN_PASSWORD",
    required: false,
    note: "Password for this admin panel. Defaults to changeme-in-prod.",
    where: "Vercel → Environment Variables",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    required: false,
    note: "Canonical URL — used in sitemap.xml and robots.txt",
    where: "Vercel → Environment Variables",
  },
  {
    name: "NEXT_PUBLIC_IS_DEV",
    required: false,
    note: 'Set "true" on preview deployments to block search crawlers',
    where: "Vercel → Environment Variables (Preview only)",
  },
];

function EnvSection() {
  return (
    <section>
      <h2 className="overline text-[#1A362D] mb-6">Environment variables</h2>
      <div className="border border-[#E5E0D5] divide-y divide-[#E5E0D5]">
        {ENV_VARS.map(({ name, required, note, where }) => (
          <div
            key={name}
            className="px-5 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
          >
            <div className="flex items-center gap-2 shrink-0">
              <KeyRound size={13} className="text-[#59615D]" />
              <code className="font-mono text-xs text-[#2C302E]">{name}</code>
              {required && (
                <span className="text-[10px] tracking-wider uppercase text-red-500 font-semibold">
                  required
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#59615D] font-body">{note}</p>
              <p className="text-xs text-[#59615D]/60 font-body mt-0.5">{where}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border border-[#E5E0D5] p-5 flex items-start gap-3">
        <Code2 size={14} className="text-[#59615D] shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-body text-[#2C302E] font-semibold mb-1">
            Copy from .env.example
          </p>
          <p className="text-sm text-[#59615D] font-body">
            The repo contains{" "}
            <code className="font-mono text-xs bg-[#F5F3EE] px-1">
              marketing-agent-demo/app/.env.example
            </code>{" "}
            with all variables documented. Copy it to{" "}
            <code className="font-mono text-xs bg-[#F5F3EE] px-1">.env.local</code> for local
            development.
          </p>
        </div>
      </div>
    </section>
  );
}
