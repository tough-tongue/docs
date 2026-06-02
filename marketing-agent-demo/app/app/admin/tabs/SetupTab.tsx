"use client";

import { ArrowRight, BookOpen, Code2, KeyRound } from "lucide-react";

// setup-tab --------------------------------------------------------------------

export function SetupTab() {
  return (
    <div className="mt-8 space-y-8">
      <SetupSummary />
      <EnvSection />
    </div>
  );
}

function SetupSummary() {
  return (
    <section>
      <h2 className="admin-section-title mb-4">Setup checklist</h2>
      <div className="border border-[#E5E0D5] p-5">
        <p className="font-body text-sm leading-relaxed text-[#59615D]">
          Configure environment variables first, then move to the Co-Navigation
          tab to copy the ToughTongue AI custom function URL and schema. The
          Co-Navigation tab owns browser-control setup because that is where the
          controller, event log, and client implementation notes now live.
        </p>
      </div>
      <details className="admin-disclosure mt-3">
        <summary>What belongs on this page</summary>
        <div>
          This tab should stay boring: credentials, deployment settings, and
          links to the source guide. Anything about firing navigation events or
          configuring the agent function belongs under Co-Navigation.
        </div>
      </details>
    </section>
  );
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
    name: "ADMIN_PASSWORD",
    required: false,
    note:
      "Server-checked password for this admin panel. Defaults to changeme-in-prod.",
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
  {
    name: "UPSTASH_REDIS_REST_URL",
    required: false,
    note: "Shared co-navigation command queue for Vercel production",
    where: "Vercel Marketplace → Upstash Redis",
  },
  {
    name: "UPSTASH_REDIS_REST_TOKEN",
    required: false,
    note: "Server-side Redis REST token. Never expose this in client code.",
    where: "Vercel Marketplace → Upstash Redis",
  },
];

function EnvSection() {
  return (
    <section>
      <h2 className="admin-section-title mb-6">Environment variables</h2>
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
              <p className="text-xs text-[#59615D]/60 font-body mt-0.5">
                {where}
              </p>
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
            <code className="font-mono text-xs bg-[#F5F3EE] px-1">
              .env.local
            </code>{" "}
            for local development.
          </p>
        </div>
      </div>
      <details className="admin-disclosure mt-3">
        <summary>Deployment notes</summary>
        <div>
          Set <code>NEXT_PUBLIC_APP_URL</code>{" "}
          to the deployed Vercel URL used by visitors, or leave it unset on
          Vercel and the app will fall back to Vercel&apos;s deployment URL
          variables. The Co-Navigation tab uses the resolved URL when showing
          the full custom function endpoint for ToughTongue AI. For production
          co-navigation on Vercel, add Upstash Redis and set both Redis REST
          variables so browser polls and agent commands can meet across
          serverless instances.
        </div>
      </details>
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
