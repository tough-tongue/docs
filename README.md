# ToughTongue AI Quickstarts

> Build apps with voice AI agents that can talk, listen, see context, use tools,
> analyze sessions, and guide users through real workflows.

---

## Start Here

This repo is the fastest path from “I want to build on ToughTongue AI” to a
working voice-agent app. It is intentionally split for two audiences:

| You are | Start with | Why |
|---|---|---|
| A vibe coder using Lovable, v0, Bolt, or Cursor | [`starter-prompts/`](starter-prompts/) | Prompt sequences that generate a complete app around ToughTongue AI |
| A frontend developer | [`nextjs-minimal/`](nextjs-minimal/) | A normal authenticated web app with iframe embed, events, session analysis, and API proxy |
| A Python developer | [`flask-minimal/`](flask-minimal/) | A tiny Flask backend plus no-build frontend embed |
| A product engineer building guided demos | [`marketing-agent-demo/`](marketing-agent-demo/) | A full co-navigation demo where the voice agent drives the page |
| A serious team managing agents as code | [`scenario-manager/`](scenario-manager/) | YAML scenario definitions synced to the ToughTongue AI API |

You can copy a starter, paste a prompt into an AI builder, or lift the integration
pieces into an existing app.

---

## Voice Agents Are Different

Voice agents are not regular text chatbots with a microphone bolted on. The user
is speaking in real time, the browser may be sending lifecycle events, and the
session produces artifacts after the call. Good integrations treat the voice
agent as a live system, not just a request/response API.

That changes the engineering shape:

- **Conversation is stateful.** A session starts, stops, may be terminated, and
  later needs transcript, scoring, extraction, or analytics.
- **Latency is product quality.** Users feel awkward pauses immediately. Keep
  browser flows simple and server calls predictable.
- **Context is injected before and during the call.** Use URL parameters like
  `t_company=Acme` for dynamic variables, and `postMessage` for live notes.
- **Secrets must stay server-side.** API tokens belong in routes/proxies, not in
  client code or generated frontends.
- **The agent can use tools.** ToughTongue AI scenarios can show cards, slides,
  diagrams, whiteboards, call custom functions, and navigate the user when you
  wire those tools into your app.
- **The outcome matters.** Most voice-agent apps need transcripts, rubric scores,
  extracted variables, report cards, or webhook-driven workflows after the call.

The quickstarts in this repo are built around those realities.

---

## AI-Readable Platform Docs

When using an AI coding tool, point it at the live ToughTongue AI docs files
instead of copying stale API snippets into your prompt:

| File | Use it for |
|---|---|
| [`https://app.toughtongueai.com/llms.txt`](https://app.toughtongueai.com/llms.txt) | Short platform map: channels, docs, and core concepts |
| [`https://app.toughtongueai.com/llms-full.txt`](https://app.toughtongueai.com/llms-full.txt) | Full API reference with endpoints, schemas, and examples |

Those files are served by the production ToughTongue AI app and are the canonical
reference for builders and agents.

For a vibe-coding session, paste this first:

```text
Use ToughTongue AI as the voice-agent platform.
Read the live docs at:
- https://app.toughtongueai.com/llms.txt
- https://app.toughtongueai.com/llms-full.txt

Build from the app idea below, keep API tokens server-side, and use a
ToughTongue AI iframe embed for the voice session.
```

---

## What You Can Build

| Goal | Start here |
|---|---|
| Embed a voice agent in a web page | [`nextjs-minimal/`](nextjs-minimal/) or [`flask-minimal/`](flask-minimal/) |
| Listen for `onStart`, `onStop`, and `onSubmit` events | [`nextjs-minimal/components/TTAIIframe.tsx`](nextjs-minimal/components/TTAIIframe.tsx) |
| Fetch and analyze sessions after a call | [`nextjs-minimal/app/api/sessions/`](nextjs-minimal/app/api/sessions/) |
| Use private scenarios with Scenario Access Tokens | [`nextjs-minimal/app/api/sat/route.ts`](nextjs-minimal/app/api/sat/route.ts) |
| Let a voice agent navigate the visitor's browser | [`marketing-agent-demo/`](marketing-agent-demo/) |
| Version-control scenario definitions as YAML | [`scenario-manager/`](scenario-manager/) |
| Prompt an AI builder to scaffold a site | [`starter-prompts/`](starter-prompts/) |

---

## Active quickstarts

### [`starter-prompts/`](starter-prompts/) — for vibe coders

Prompt sequences for AI builders. Start here if you want Lovable, v0, Bolt, or
Cursor to generate the app around ToughTongue AI.

```bash
open starter-prompts/README.md
```

Use the canonical docs links above in the same builder session so the generated
app has the right embed URLs, API endpoints, and server-side token handling.

---

### [`nextjs-minimal/`](nextjs-minimal/) — serious web app starter

Production-oriented Next.js 16 app with Firebase Google auth, local guest mode,
protected routes, iframe embed, lifecycle events, session analysis, SAT support,
and server-side API routes.

```bash
npx degit tough-tongue/voice-ai-quickstart/nextjs-minimal my-app
cd my-app
pnpm install
cp .env.example .env.local   # set API key + Firebase config
pnpm dev
```

Use this when you want a normal application architecture and a clean place to
add user accounts, dashboards, persistence, and session analytics.

→ [Setup guide](nextjs-minimal/README.md)

---

### [`flask-minimal/`](flask-minimal/) — small Python starter

The lightest backend-backed integration: Flask proxies the ToughTongue AI API,
and a Preact frontend embeds the voice agent without a frontend build step.

```bash
npx degit tough-tongue/voice-ai-quickstart/flask-minimal my-app
cd my-app
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env
python app.py   # -> http://localhost:8008
```

Use this when you want to understand the moving pieces without a large web
framework.

→ [Setup guide](flask-minimal/README.md)

---

### [`marketing-agent-demo/`](marketing-agent-demo/) — co-navigation demo

**The flagship.** A full marketing site where a voice AI concierge navigates the
visitor's browser in real time during a live conversation — no SDK, no WebSockets.

```bash
npx degit tough-tongue/voice-ai-quickstart/marketing-agent-demo/app my-app
cd my-app && pnpm install
cp .env.example .env.local   # set TOUGHTONGUE_API_TOKEN
pnpm dev                     # → http://localhost:3000
```

What's included:

- Floating voice widget that persists across page navigations
- Long-poll endpoint the agent calls to drive the visitor's browser
- Full-screen slide deck system (`/slides`) navigable by the agent
- Admin panel to monitor sessions, edit scenario instructions, and test navigation
- SEO-safe: `robots.ts` blocks crawlers on preview/dev deployments automatically

**How it works in one sentence:** the agent calls `POST /api/agent-navigate` with
a session code + destination; the visitor's browser is already long-polling
`/api/navigate-commands/:sessionId/poll` and navigates the moment it receives
the command.

**Live demo:** [ttai-marketing-agent-demo.vercel.app](https://ttai-marketing-agent-demo.vercel.app)

→ [Full integration guide](marketing-agent-demo/README.md)

---

### [`scenario-manager/`](scenario-manager/) — scenario-as-code

Version-control your ToughTongue AI scenarios as YAML files. `ttcli` is a
Bash CLI (no dependencies beyond `curl` + `python3`) that pushes, pulls, and
diffs scenarios against the API.

```bash
export TTAI_PAT_TOKEN="your_api_key"
export PATH="$PATH:$(pwd)/scenario-manager"

ttcli list                               # show all your scenarios
ttcli push scenarios/cold-call.yml       # create or update
ttcli pull 69577496bd7c000fa3f4fc2a      # pull remote → local YAML
ttcli diff scenarios/cold-call.yml       # preview changes before push
```

Use this when agent behavior matters enough to review, diff, and deploy like
application code.

→ [ttcli docs](scenario-manager/README.md)

---

## Get your API key

1. Sign up at [app.toughtongueai.com](https://app.toughtongueai.com)
2. Open **Developer → API Keys**
3. Create a key — it looks like `ttai_pat_...`

Use the variable name expected by the example you are running:

| Example | Variable |
|---|---|
| `marketing-agent-demo/app` | `TOUGHTONGUE_API_TOKEN` |
| `nextjs-minimal` | `TOUGH_TONGUE_API_KEY` |
| `flask-minimal` | `TTAI_TOKEN` |
| `scenario-manager/ttcli` | `TTAI_PAT_TOKEN` |

---

## Production Checklist

- Keep API tokens server-side.
- Use SATs for private or single-use scenarios.
- Listen for lifecycle events and persist the session ID.
- Trigger or fetch analysis after `onStop`.
- Validate webhook/custom-function requests before letting an agent mutate your
  app state.
- Version important scenarios in YAML once prompts become product behavior.
- Use the live `llms.txt` files when prompting AI builders.

---

## Links

- **App + docs:** [app.toughtongueai.com](https://app.toughtongueai.com)
- **AI docs:** [`llms.txt`](https://app.toughtongueai.com/llms.txt) · [`llms-full.txt`](https://app.toughtongueai.com/llms-full.txt)
- **Discord:** [Join the community](https://discord.com/invite/NfTPT3HsSj)
- **Developer portal:** [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer/)

---

MIT License — see individual directories for details.
