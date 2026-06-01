# voice-ai-quickstart

> Starter templates and production demos for building apps where a voice AI agent
> can **see and control** what a user is looking at — in real time.
>
> Powered by [ToughTongue AI](https://toughtongueai.com).

---

## What is this?

ToughTongue AI is a voice agent platform for high-stakes conversation practice
(interviews, sales, coaching, negotiations). This repo is a practical quickstart
hub for adding a ToughTongue AI voice agent to your own app.

The examples show how to:

- **Talk** to your visitor via a floating voice widget
- **Navigate** the visitor's browser to any page or section on command
- **Show** slides, product pages, or any URL during the conversation
- **Analyze** the session and display a debrief after the call

You bring the website. The agent brings the intelligence.

---

## Choose a starting point

| Goal | Start here |
|---|---|
| Add real-time agent-driven browser navigation | [`marketing-agent-demo/`](marketing-agent-demo/) |
| Build an authenticated Next.js app with session analysis | [`nextjs-minimal/`](nextjs-minimal/) |
| Add a small Python backend proxy around an iframe embed | [`flask-minimal/`](flask-minimal/) |
| Version-control scenario definitions as YAML | [`scenario-manager/`](scenario-manager/) |
| Prompt an AI builder to scaffold a site | [`starter-prompts/`](starter-prompts/) |

---

## Active quickstarts

### [marketing-agent-demo/](marketing-agent-demo/) — Voice AI co-navigation

**The flagship.** A full marketing site where a voice AI concierge navigates the
visitor's browser in real time during a live conversation — no SDK, no WebSockets.

```bash
npx degit tough-tongue/voice-ai-quickstart/marketing-agent-demo/app my-app
cd my-app && pnpm install
cp .env.example .env.local   # set TOUGHTONGUE_API_TOKEN
pnpm dev                     # → http://localhost:3000
```

**What's included:**
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

### [nextjs-minimal/](nextjs-minimal/) — Next.js + Firebase starter

Production-ready Next.js 16 app with Firebase auth, protected routes, and an
embedded TTAI conversation widget. The fastest path from zero to a live
authenticated ToughTongue AI integration.

```bash
npx degit tough-tongue/voice-ai-quickstart/nextjs-minimal my-app
cd my-app && pnpm install
cp .env.example .env.local   # set API key + Firebase config
pnpm dev
```

**Includes:** Firebase email/Google auth · protected routes · iframe embed ·
session analysis · API token proxy · Tailwind + shadcn/ui

**Live demo:** [nextjs-ttai-starter-demo.vercel.app](https://nextjs-ttai-starter-demo.vercel.app)

→ [Setup guide](nextjs-minimal/README.md)

---

### [flask-minimal/](flask-minimal/) — Python / Flask starter

The lightest possible integration — a Flask server that proxies the TTAI API
and a Preact frontend with no build tooling. Good for prototyping or embedding
into an existing Python project.

```bash
npx degit tough-tongue/voice-ai-quickstart/flask-minimal my-app
cd my-app
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.sample .env
python app.py   # → http://localhost:8008
```

---

### [starter-prompts/](starter-prompts/) — AI builder prompts

Copy-paste prompts for [Lovable](https://lovable.dev), [v0](https://v0.dev),
and [Bolt](https://bolt.new) that generate a complete ToughTongue AI app through
small, ordered prompt sequences.

| Sequence | Files | App |
|---|---|---|
| Real estate marketing site | `real-estate-1-build-site.md` → `real-estate-4-admin-panel.md` | Luxury property microsite with voice agent, remote navigation, and admin tooling |

→ [Prompt index + usage](starter-prompts/README.md)

---

### [scenario-manager/](scenario-manager/) — YAML-driven scenario CLI

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

→ [ttcli docs + CI/CD guide](scenario-manager/README.md)

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

## Support

- **Docs:** [docs.toughtongueai.com](https://docs.toughtongueai.com)
- **Discord:** [Join the community](https://discord.com/invite/NfTPT3HsSj)
- **Developer portal:** [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer/)

---

MIT License — see individual directories for details.
