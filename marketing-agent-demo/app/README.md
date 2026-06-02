# ToughTongue AI — Marketing Site Co-Navigation Demo

> **Give your website a voice.** An AI agent that can speak to your visitor,
> understand where they are, and navigate their browser to the right page or
> section — in real time.

Live example: The Camellias — a luxury real-estate marketing site where a voice
AI concierge guides prospects through residence types and amenities without them
ever touching the keyboard:
[`ttai-marketing-agent-demo.vercel.app`](https://ttai-marketing-agent-demo.vercel.app/).

---

## What is co-navigation?

Co-navigation is a technique where a ToughTongue AI agent (running as an
embedded iframe on your page) can call a **custom function** that pushes a
navigation command to your frontend.

```
Visitor opens widget → agent starts voice session
Agent decides to show the visitor a slide deck
Agent calls  POST /api/agent-navigate  { session_code: "ABCD", url: "/slides/wraparound-residence/1" }
Your server wakes the long-poll for session ABCD
Visitor's browser navigates to /slides/wraparound-residence/1
```

No SDK. No WebSockets. Just one HTTP endpoint and a long-poll.

---

## Quick start

### Prerequisites

- Node 20+ and [pnpm](https://pnpm.io/)
- A [ToughTongue AI](https://app.toughtongueai.com/) account with a scenario
  configured to use the `navigate` custom function (see §3 below)

### 1. Clone & install

```bash
cd marketing-agent-demo/app
pnpm install
```

### 2. Configure env vars

```bash
cp .env.example .env.local
# Edit .env.local — at minimum set TOUGHTONGUE_API_TOKEN
```

| Variable                     | Required  | Description                                                                         |
| ---------------------------- | --------- | ----------------------------------------------------------------------------------- |
| `TOUGHTONGUE_API_TOKEN`      | ✅        | Your API token from the [Developer portal](https://app.toughtongueai.com/developer) |
| `NEXT_PUBLIC_APP_URL`        | Prod only | Canonical URL (used in sitemap + robots)                                            |
| `NEXT_PUBLIC_IS_DEV`         | Optional  | Set `true` to block search crawlers on preview deployments                          |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Optional  | Password for the `/admin` dashboard                                                 |

### 3. Configure your TTAI scenario

In your ToughTongue AI scenario, add a **custom function** with this schema:

Set the custom-function endpoint to your deployed app plus
`/api/agent-navigate`.

For the hosted Camellias demo, the full URL is:
`https://ttai-marketing-agent-demo.vercel.app/api/agent-navigate`.

```json
{
  "name": "navigate",
  "description": "Navigate the visitor's browser to a URL or scroll to a section",
  "parameters": {
    "type": "object",
    "properties": {
      "session_code": {
        "type": "string",
        "description": "The visitor's 4-char session code (from {{ session_code }} in your instructions)"
      },
      "url": {
        "type": "string",
        "description": "Relative URL to navigate to, e.g. /slides/wraparound-residence/1"
      },
      "section": {
        "type": "string",
        "description": "CSS selector to scroll to, e.g. #highlights"
      }
    },
    "required": ["session_code"]
  },
  "endpoint": "https://your-domain.vercel.app/api/agent-navigate"
}
```

Then add to your `ai_instructions`:

```
Your session code is {{ session_code }}.
The full site map is: {{ website_map }}

When you want to show the visitor something, call the navigate function with
their session_code and either a url or a section.
```

The `{{ session_code }}` and `{{ website_map }}` placeholders are injected at
session start via the `t_session_code` and `t_website_map` iframe URL parameters
(see `NavAgentWidget.tsx`).

### 4. Run locally

```bash
pnpm dev
# → http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel deploy
```

Set the environment variables in **Vercel Project Settings → Environment
Variables**.

> **Long-poll note:** `vercel.json` sets `maxDuration: 30` on the poll route.
> This works on **Vercel Pro** (300 s max). On the **Hobby** plan the limit is
> 10 s — the poll will time out early but still work (client retries
> automatically). For production at scale, swap the in-memory `commandStore` for
> a Redis adapter.

---

## How it works

### Architecture overview

```
Browser
  └── NavAgentWidget (React)
        ├── embeds TTAI iframe with ?t_session_code=XXXX&t_website_map=...
        └── long-polls GET /api/navigate-commands/[XXXX]/poll

Vercel Serverless
  ├── GET  /api/navigate-commands/[id]/poll   ← waits up to 29 s for a command
  ├── POST /api/navigate-commands/[id]        ← store a command directly
  ├── POST /api/agent-navigate                ← called by the TTAI AI custom function
  └── GET/PATCH /api/ttai/*                   ← server-side proxy (API token never leaves server)

ToughTongue AI
  └── Agent calls POST /api/agent-navigate → {session_code, url?, section?}
        → commandStore.deliver(sessionId, cmd)
        → wakes the pending long-poll
        → browser navigates
```

### Key files

| File                                           | Purpose                                                 |
| ---------------------------------------------- | ------------------------------------------------------- |
| `lib/config.ts`                                | Central env-var loader                                  |
| `lib/ttai.ts`                                  | Scenario IDs, widget configs, embed URL helper          |
| `lib/command-store.ts`                         | In-memory command store (swap for Redis in production)  |
| `app/api/agent-navigate/route.ts`              | **The endpoint your TTAI scenario calls**               |
| `app/api/navigate-commands/[id]/poll/route.ts` | Long-poll — browser waits here                          |
| `hooks/useNavigationSession.ts`                | Session ID generation + poll loop + router integration  |
| `context/SessionContext.tsx`                   | React context wrapping the session hook                 |
| `components/widgets/NavAgentWidget.tsx`        | Floating TTAI iframe widget                             |
| `components/widgets/PersistentWidgets.tsx`     | Mounted above route tree — keeps iframe alive           |
| `public/website-nav.md`                        | Navigation guide injected into the agent's instructions |

### The session ID

The 4-char session code (e.g. `ABCD`) links three things:

1. The visitor's browser (long-polling `/api/navigate-commands/ABCD/poll`)
2. The TTAI agent (received `{{ session_code }}` → `ABCD` in its instructions)
3. The command store (delivers the command to the waiting poll)

It's written to the URL as `?session=ABCD` so it survives page reloads and is
visible to the agent via `window.location.search`.

### Adapting this to your own site

1. **Update scenario IDs** in `lib/ttai.ts`
2. **Update `public/website-nav.md`** with your site's routes and anchors
3. **Update the slide data** in `data/slides/` (or delete the `/slides` route
   entirely)
4. **Replace the marketing components** in `components/site/` with your own
   sections
5. **Update `SECTIONS`, `TOP_ROUTES`, `DECKS`** in `app/admin/constants.ts` to
   match your site map

The co-navigation core (`lib/command-store.ts`, `hooks/useNavigationSession.ts`,
`components/widgets/NavAgentWidget.tsx`, and the three API routes) is completely
independent of the marketing content — copy it into any React/Next.js app.

---

## Project structure

```
app/
├── app/
│   ├── layout.tsx              Root layout — SessionProvider + PersistentWidgets
│   ├── page.tsx                Landing page (marketing site)
│   ├── robots.ts               robots.txt — blocks crawlers when isDev=true
│   ├── sitemap.ts              sitemap.xml — empty when isDev=true
│   ├── slides/
│   │   ├── page.tsx            Slide deck index
│   │   └── [category]/[n]/     Full-screen slide viewer
│   ├── admin/page.tsx          Password-gated ops dashboard
│   └── api/
│       ├── agent-navigate/     ← TTAI calls this
│       ├── navigate-commands/  ← browser long-polls this
│       └── ttai/               Server-side proxy (balance, scenarios, sessions)
├── components/
│   ├── widgets/
│   │   ├── NavAgentWidget.tsx  Floating TTAI iframe panel
│   │   ├── MeetingBotWidget.tsx Script-injected meeting bot
│   │   └── PersistentWidgets.tsx Mounted above routes
│   ├── site/                   Marketing page sections
│   └── slides/                 Slide renderer + layouts
├── context/SessionContext.tsx  App-wide session state
├── data/slides/                JSON slide data + TypeScript schema
├── hooks/
│   ├── useNavigationSession.ts Core long-poll + session logic
│   ├── useReveal.ts            Scroll-reveal (IntersectionObserver)
│   ├── useParallax.ts          Parallax on scroll
│   └── useSmoothScroll.ts      Lenis smooth scroll
├── lib/
│   ├── command-store.ts        In-memory command store
│   ├── config.ts               Env-var loader
│   ├── ttai.ts                 TTAI scenario config + helpers
│   └── utils.ts                cn() utility
├── public/
│   ├── images/                 Site images
│   ├── website-nav.md          Agent navigation guide
│   └── website-map.md          Full route + anchor reference
├── .env.example                Environment variable template
└── vercel.json                 maxDuration config for long-poll route
```

---

## Commands

```bash
pnpm dev          # local dev server → http://localhost:3000
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # ESLint
```

---

## Production considerations

| Topic                  | Note                                                                                                                                                                                                                         |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Long-poll at scale** | The in-memory `commandStore` only works within a single serverless instance. Add Redis (`ioredis`) and replace the two maps in `lib/command-store.ts` with `SET`/`GET`/`DEL` + Redis pub/sub for multi-instance deployments. |
| **Admin security**     | `NEXT_PUBLIC_ADMIN_PASSWORD` is exposed to the client. For stronger auth, move the password check to a server action or add NextAuth.                                                                                        |
| **API token**          | `TOUGHTONGUE_API_TOKEN` is server-side only and never reaches the browser.                                                                                                                                                   |
| **Vercel plan**        | `maxDuration: 30` requires Vercel Pro. Hobby caps at 10 s — the poll times out but the client retries, so it degrades gracefully (with 3–10 s command latency).                                                              |
