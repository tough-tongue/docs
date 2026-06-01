# Voice AI Co-Navigation Demo

> Let your AI agent speak to visitors **and** drive their browser — navigating pages,
> scrolling to sections, and opening slides in real time during a live voice conversation.

This is a production-ready Next.js template that shows you exactly how to wire a
[ToughTongue AI](https://app.toughtongueai.com) voice agent to a marketing website
so it can navigate on behalf of the user.

**Live demo site:** The Camellias — a luxury real-estate marketing site where a voice
AI concierge guides prospects through residence types and amenities:
[`ttai-marketing-agent-demo.vercel.app`](https://ttai-marketing-agent-demo.vercel.app/).

---

## Use this template

```bash
# Clone just this directory (no full repo history)
npx degit tough-tongue/voice-ai-quickstart/marketing-agent-demo/app my-ai-site

cd my-ai-site
pnpm install
cp .env.example .env.local   # add your TOUGHTONGUE_API_TOKEN
pnpm dev
```

> **Need pnpm?** `npm install -g pnpm`

---

## How co-navigation works

```
1. Visitor opens the "Talk to Agent" widget
2. A 4-char session code is generated (e.g. ABCD) and written to ?session=ABCD
3. The TTAI iframe starts with the session code injected as a dynamic variable
4. The agent reads {{ session_code }} from its ai_instructions
5. When the agent wants to show the visitor something, it calls:
     POST /api/agent-navigate  { session_code: "ABCD", url: "/slides/wraparound-residence/1" }
6. Your server wakes the long-poll for session ABCD
7. The visitor's browser navigates instantly
```

No SDK. No WebSockets. One HTTP endpoint + a long-poll.

---

## Quick start

### Prerequisites

- Node 20+ and [pnpm](https://pnpm.io/)
- A [ToughTongue AI](https://app.toughtongueai.com) account

### 1. Install

```bash
pnpm install
cp .env.example .env.local
```

### 2. Set environment variables

| Variable | Required | Description |
|---|---|---|
| `TOUGHTONGUE_API_TOKEN` | ✅ | API token from the [Developer portal](https://app.toughtongueai.com/developer) |
| `NEXT_PUBLIC_APP_URL` | Prod | Canonical URL (used in sitemap + robots) |
| `NEXT_PUBLIC_IS_DEV` | Preview | Set `true` to block search crawlers on preview deployments |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Optional | Password for `/admin` dashboard (default: `changeme-in-prod`) |

### 3. Configure your TTAI scenario

In your ToughTongue AI scenario, add a **custom function**:

**Function name:** `navigate`

**Endpoint:** `https://your-domain.vercel.app/api/agent-navigate`

For the hosted Camellias demo, the full custom-function URL is:
`https://ttai-marketing-agent-demo.vercel.app/api/agent-navigate`.

**JSON schema:**
```json
{
  "type": "object",
  "properties": {
    "session_code": { "type": "string", "description": "Visitor's session code from {{ session_code }}" },
    "url":          { "type": "string", "description": "Relative URL to navigate to, e.g. /slides/wraparound-residence/1" },
    "section":      { "type": "string", "description": "CSS selector to scroll to, e.g. #highlights" }
  },
  "required": ["session_code"]
}
```

**Add to `ai_instructions`:**
```
Your session code is {{ session_code }}.
Site map: {{ website_map }}

To navigate the visitor's browser, call the navigate function with their
session_code plus either a url or a section selector.
```

The `{{ session_code }}` and `{{ website_map }}` placeholders are injected at
session start via the `t_session_code` and `t_website_map` iframe URL parameters.

### 4. Run locally

```bash
pnpm dev   # → http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel deploy
```

Set the environment variables in **Vercel Project Settings → Environment Variables**.

> **Long-poll note:** `vercel.json` sets `maxDuration: 30` on the poll route.
> Vercel **Pro** supports up to 300 s. **Hobby** plan caps at 10 s — the poll
> times out early but the client retries automatically (with ~10 s latency).
> For production scale, replace `lib/command-store.ts` with a Redis adapter.

---

## Adapting to your own site

1. **Replace scenario IDs** in `lib/ttai.ts`
2. **Update `public/website-nav.md`** — the agent reads this to understand your site's routes and anchors
3. **Replace `components/site/`** with your own marketing sections
4. **Update `app/admin/constants.ts`** — the section/route/slide map for manual testing
5. **Delete `app/slides/`** if you don't need the slide deck system

The co-navigation core is fully independent of the demo content:

| File | Keep as-is |
|---|---|
| `lib/command-store.ts` | ✅ in-memory store (swap for Redis at scale) |
| `hooks/useNavigationSession.ts` | ✅ session ID + long-poll loop |
| `components/widgets/NavAgentWidget.tsx` | ✅ floating TTAI iframe panel |
| `components/widgets/PersistentWidgets.tsx` | ✅ keeps iframe alive across routes |
| `app/api/agent-navigate/route.ts` | ✅ endpoint TTAI calls |
| `app/api/navigate-commands/[sessionId]/` | ✅ long-poll endpoints |

---

## Project structure

```
app/
├── app/
│   ├── layout.tsx                  Root — SessionProvider + PersistentWidgets
│   ├── page.tsx                    Landing page
│   ├── robots.ts                   Blocks crawlers when NEXT_PUBLIC_IS_DEV=true
│   ├── sitemap.ts                  Empty sitemap when NEXT_PUBLIC_IS_DEV=true
│   ├── slides/
│   │   ├── page.tsx                Slide deck index
│   │   └── [category]/[n]/         Full-screen slide viewer
│   ├── admin/
│   │   ├── page.tsx                Admin shell (login gate + tab switcher)
│   │   ├── constants.ts            Site map for manual nav buttons
│   │   └── tabs/                   AccountTab, SessionsTab, CoNavTab
│   └── api/
│       ├── agent-navigate/         ← TTAI calls this during a live session
│       ├── navigate-commands/      ← browser long-polls this
│       └── ttai/                   Server-side proxy (token never leaves server)
├── components/
│   ├── widgets/
│   │   ├── NavAgentWidget.tsx      Floating TTAI iframe panel
│   │   ├── MeetingBotWidget.tsx    Script-injected meeting bot
│   │   └── PersistentWidgets.tsx   Mounted above routes — keeps iframe alive
│   ├── site/                       Marketing sections (replace with your own)
│   └── slides/                     Slide renderer + layouts + viewer chrome
├── context/SessionContext.tsx      App-wide session state
├── data/slides/                    JSON slide data + TypeScript schema
├── hooks/
│   ├── useNavigationSession.ts     Core session ID + long-poll logic
│   ├── useSlideTouchNav.ts         Touch swipe for slide viewer
│   ├── useReveal.ts                Scroll-reveal (IntersectionObserver)
│   ├── useParallax.ts              Parallax effect on scroll
│   └── useSmoothScroll.ts          Lenis smooth scroll
├── lib/
│   ├── command-store.ts            In-memory command store
│   ├── config.ts                   Env-var loader (all process.env here)
│   ├── ttai.ts                     Scenario IDs, widget config, embed URL helper
│   └── utils.ts                    cn() Tailwind class merger
├── public/
│   ├── images/                     Site images
│   ├── website-nav.md              Agent's navigation guide for this site
│   └── website-map.md              Full route + anchor reference
├── .env.example                    Environment variable template
└── vercel.json                     maxDuration for the long-poll route
```

---

## Commands

```bash
pnpm dev      # dev server → http://localhost:3000
pnpm build    # production build
pnpm start    # serve production build
pnpm lint     # ESLint
```

---

## Production notes

| Topic | Note |
|---|---|
| **Scale** | `command-store.ts` uses in-memory maps — works within a single serverless warm instance. Add `ioredis` and swap the two maps for Redis pub/sub for multi-instance deploys. |
| **Admin auth** | `NEXT_PUBLIC_ADMIN_PASSWORD` is visible to the client bundle. Fine for demos; use NextAuth or a server action check for stricter security. |
| **API token** | `TOUGHTONGUE_API_TOKEN` is server-side only — never reaches the browser. |
| **Vercel plan** | `maxDuration: 30` requires Pro. Hobby caps at 10 s; the client retries so it degrades gracefully. |
| **SEO** | Set `NEXT_PUBLIC_IS_DEV=true` on preview/staging to block all crawlers automatically. |
