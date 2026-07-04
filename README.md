# ToughTongue AI Quickstarts

> Build apps with voice AI agents that can talk, listen, see context, use tools,
> analyze sessions, and guide users through real workflows.

---

## Live Demos

Start with the flagship demo first. It shows the full co-navigation loop: a
ToughTongue AI voice concierge embedded in a luxury real-estate site, able to
open property stories and guide the visitor through the page.

| Demo                                          | Link                                                                                    | Shows                                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Main demo — The Camellias voice concierge** | [`ttai-marketing-agent-demo.vercel.app`](https://ttai-marketing-agent-demo.vercel.app/) | Voice widget, session code, agent-triggered navigation, property stories, admin test panel |
| Marketing co-navigation template              | [`marketing-agent-demo/`](marketing-agent-demo/)                                        | Source for the live demo; copy this for guided sales or product tours                      |
| Next.js minimal starter                       | [`nextjs-minimal/`](nextjs-minimal/)                                                    | Authenticated app starter with iframe embed, lifecycle events, API proxy, SAT support      |
| Flask minimal starter                         | [`flask-minimal/`](flask-minimal/)                                                      | Small Python backend plus no-build frontend embed                                          |
| Builder prompts                               | [`starter-prompts/`](starter-prompts/)                                                  | Prompt sequences for Lovable, v0, Bolt, Cursor, and other AI builders                      |

---

## Start Here

This repo is the fastest path from “I want to build on ToughTongue AI” to a
working voice-agent app. It is organized around common builder profiles:

| You are                                         | Start with                                       | Why                                                                                       |
| ----------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| A vibe coder using Lovable, v0, Bolt, or Cursor | [`starter-prompts/`](starter-prompts/)           | Prompt sequences that generate a complete app around ToughTongue AI                       |
| A frontend developer                            | [`nextjs-minimal/`](nextjs-minimal/)             | A normal authenticated web app with iframe embed, events, session analysis, and API proxy |
| A Python developer                              | [`flask-minimal/`](flask-minimal/)               | A tiny Flask backend plus no-build frontend embed                                         |
| A product engineer building guided demos        | [`marketing-agent-demo/`](marketing-agent-demo/) | A full co-navigation demo where the voice agent drives the page                           |
| A serious team managing agents as code          | [`scenario-manager/`](scenario-manager/)         | YAML scenario definitions synced to the ToughTongue AI API                                |

You can copy a starter, paste a prompt into an AI builder, or lift the
integration pieces into an existing app.

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
- **The outcome matters.** Most voice-agent apps need transcripts, rubric
  scores, extracted variables, report cards, or webhook-driven workflows after
  the call.

The quickstarts in this repo are built around those realities.

---

## AI-Readable Platform Docs

When using an AI coding tool, point it at the live ToughTongue AI docs files
instead of copying stale API snippets into your prompt:

| File                                                                                         | Use it for                                               |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| [`https://app.toughtongueai.com/llms.txt`](https://app.toughtongueai.com/llms.txt)           | Short platform map: channels, docs, and core concepts    |
| [`https://app.toughtongueai.com/llms-full.txt`](https://app.toughtongueai.com/llms-full.txt) | Full API reference with endpoints, schemas, and examples |

Those files are served by the production ToughTongue AI app and are the
canonical reference for builders and agents.

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

| Goal                                                  | Start here                                                                             |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Embed a voice agent in a web page                     | [`nextjs-minimal/`](nextjs-minimal/) or [`flask-minimal/`](flask-minimal/)             |
| Listen for `onStart`, `onStop`, and `onSubmit` events | [`nextjs-minimal/components/TTAIIframe.tsx`](nextjs-minimal/components/TTAIIframe.tsx) |
| Fetch and analyze sessions after a call               | [`nextjs-minimal/app/api/sessions/`](nextjs-minimal/app/api/sessions/)                 |
| Use private scenarios with Scenario Access Tokens     | [`nextjs-minimal/app/api/sat/route.ts`](nextjs-minimal/app/api/sat/route.ts)           |
| Let a voice agent navigate the visitor's browser      | [`marketing-agent-demo/`](marketing-agent-demo/)                                       |
| Version-control scenario definitions as YAML          | [`scenario-manager/`](scenario-manager/)                                               |
| Prompt an AI builder to scaffold a site               | [`starter-prompts/`](starter-prompts/)                                                 |

---

## Co-Navigation Pattern

The marketing demo defines a reusable pattern for voice agents that need to
control a web experience during the call:

1. The browser creates a short session code and long-polls your server.
2. The ToughTongue AI iframe receives that session code as a dynamic variable.
3. The scenario calls your custom function with
   `{ session_code, url?,
   section? }`.
4. Your server delivers the command to the matching browser session.
5. The client performs `router.push(...)` or `scrollIntoView(...)`.

This is intentionally simple HTTP infrastructure. It works without WebSockets,
keeps the ToughTongue API token server-side, and gives builders a standard
surface to copy into product tours, real-estate demos, onboarding assistants,
support flows, and guided sales pages.

Start from [`marketing-agent-demo/`](marketing-agent-demo/) if you want the full
implementation, copyable custom-function schema, admin test controller, and
production notes.

---

## Active quickstarts

### [`starter-prompts/`](starter-prompts/) — for vibe coders

Prompt sequences for AI builders. Start here if you want Lovable, v0, Bolt, or
Cursor to generate the app around ToughTongue AI.

Read [`starter-prompts/README.md`](starter-prompts/README.md), choose the prompt
that matches your app idea, and paste it into your builder.

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
visitor's browser in real time during a live conversation — no SDK, no
WebSockets.

```bash
npx degit tough-tongue/voice-ai-quickstart/marketing-agent-demo/app my-app
cd my-app && pnpm install
cp .env.example .env.local   # set TOUGHTONGUE_API_TOKEN
pnpm dev                     # → http://localhost:3000
```

What's included:

- Floating voice widget that persists across page navigations
- Long-poll endpoint the agent calls to drive the visitor's browser
- Full-screen property story system (`/slides`) navigable by the agent
- Admin panel to monitor sessions, edit scenario instructions, and test
  navigation
- SEO-safe: `robots.ts` blocks crawlers on preview/dev deployments automatically

**How it works in one sentence:** the agent calls `POST /api/agent-navigate`
with a session code + destination; the visitor's browser is already long-polling
`/api/navigate-commands/:sessionId/poll` and navigates the moment it receives
the command.

**Main demo:**
[ttai-marketing-agent-demo.vercel.app](https://ttai-marketing-agent-demo.vercel.app/)

→ [Full integration guide](marketing-agent-demo/README.md)

---

### [`scenario-manager/`](scenario-manager/) — scenario-as-code

Version-control your ToughTongue AI scenarios as YAML files. `ttcli` is a Bash
CLI (no dependencies beyond `curl` + `python3`) that pushes, pulls, and diffs
scenarios against the API.

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

| Example                    | Variable                |
| -------------------------- | ----------------------- |
| `marketing-agent-demo/app` | `TOUGHTONGUE_API_TOKEN` |
| `nextjs-minimal`           | `TOUGH_TONGUE_API_KEY`  |
| `flask-minimal`            | `TTAI_TOKEN`            |
| `scenario-manager/ttcli`   | `TTAI_PAT_TOKEN`        |

---

## Use with Claude Code (or any agent runtime)

This repo ships a Claude Code plugin — `toughtongue-ai` — that turns Claude into
a ToughTongue AI integration expert. It covers the REST API, iframe embeds,
SIP / phone calls, Google Meet bots, outbound webhooks, custom HTTP tools, MCP
integrations, and scenario YAML authoring.

The skill lives at [`skills/toughtongue-ai/`](skills/toughtongue-ai/) and pulls
from a pinned snapshot of the live ToughTongue AI docs — regenerated by
[`skills/toughtongue-ai/scripts/sync-sources.sh`](skills/toughtongue-ai/scripts/sync-sources.sh)
on each release.

### Install as a Claude Code plugin

```text
/plugin marketplace add tough-tongue/voice-ai-quickstart
/plugin install toughtongue-ai@voice-ai-quickstart
```

Then ask Claude things like:

- "Embed a TT scenario in my Next.js app with dynamic variables"
- "Wire `session.analyzed` webhooks and verify the signature"
- "Author a sales objection-handling `scenario.yml` with a rubrik"

### Install via [skills.sh](https://www.skills.sh)

```bash
npx skills add tough-tongue/voice-ai-quickstart
```

skills.sh is the open agent-skills directory — same skill, indexed for use with
Cursor, GitHub Copilot, Gemini, Cline, VS Code, and more.

### Local development install

```text
/plugin marketplace add /path/to/voice-ai-quickstart
/plugin install toughtongue-ai
```

---

## Production Checklist

- Keep API tokens server-side.
- Use SATs for private or single-use scenarios.
- Listen for lifecycle events and persist the session ID.
- Trigger or fetch analysis after `onStop`.
- Validate webhook/custom-function requests before letting an agent mutate your
  app state.
- Use shared storage such as Upstash Redis for live co-navigation command
  delivery on serverless hosts; process memory is only a local-demo fallback.
- Version important scenarios in YAML once prompts become product behavior.
- Use the live `llms.txt` files when prompting AI builders.

---

## Links

- **App + docs:** [app.toughtongueai.com](https://app.toughtongueai.com)
- **AI docs:** [`llms.txt`](https://app.toughtongueai.com/llms.txt) ·
  [`llms-full.txt`](https://app.toughtongueai.com/llms-full.txt)
- **Discord:** [Join the community](https://discord.com/invite/NfTPT3HsSj)
- **Developer portal:**
  [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer/)

---

MIT License — see individual directories for details.
