# Voice AI Co-Navigation Demo

> Let your AI agent speak to visitors **and** drive their browser — navigating
> pages, scrolling to sections, and opening slides in real time during a live
> voice conversation.

This is a production-ready Next.js template that shows you exactly how to wire a
[ToughTongue AI](https://app.toughtongueai.com) voice agent to a marketing
website so it can navigate on behalf of the user.

**Live demo site:** The Camellias — a luxury real-estate marketing site where a
voice AI concierge guides prospects through residence types and amenities:
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

| Variable                   | Required | Scope       | Description                                                                                   |
| -------------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------- |
| `TOUGHTONGUE_API_TOKEN`    | ✅       | Server only | API token from the [Developer portal](https://app.toughtongueai.com/developer). Never expose. |
| `ADMIN_PASSWORD`           | Optional | Server only | Server-checked password for `/admin`. Defaults to `changeme-in-prod`; change before sharing.  |
| `NEXT_PUBLIC_APP_URL`      | Optional | Public      | Canonical public URL. If unset on Vercel, the app falls back to Vercel deployment URL vars.   |
| `NEXT_PUBLIC_IS_DEV`       | Preview  | Public      | Set `true` to block search crawlers on preview deployments.                                   |
| `UPSTASH_REDIS_REST_URL`   | Optional | Server only | Recommended on Vercel production: shared co-navigation command queue.                         |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Server only | Redis REST token for the shared queue. Never expose this in client code.                      |
| `TOUGHTONGUE_API_BASE`     | Optional | Server only | Override for the public ToughTongue API base URL. Rarely needed.                              |

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
  "description": "Navigate the visitor's browser. Use 'url' for page routes or 'section' for anchor scroll. Always include the session_code from your instructions.",
  "properties": {
    "session_code": {
      "type": "string",
      "description": "The visitor's 4-character session code. This is provided to the agent as {{ session_code }}. Include it exactly as provided.",
      "minLength": 4,
      "maxLength": 4,
      "pattern": "^[A-Z]{4}$"
    },
    "url": {
      "type": "string",
      "description": "React route path to navigate to. Examples: /, /slides, /slides/wraparound-residence/1, /slides/sky-penthouse/3, /slides/amenities/2",
      "pattern": "^/[^/]?.*$"
    },
    "section": {
      "type": "string",
      "description": "CSS anchor to scroll to on the landing page. Examples: #intro, #highlights, #sustainability, #masters, #consultation",
      "pattern": "^#[A-Za-z][A-Za-z0-9_-]*$"
    }
  },
  "required": ["session_code"],
  "anyOf": [{ "required": ["url"] }, { "required": ["section"] }],
  "additionalProperties": false
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
session start via the `t_session_code` and `t_website_map` iframe URL
parameters.

### 4. Run locally

```bash
pnpm dev   # → http://localhost:3000
```

### 5. Deploy to Vercel

```bash
vercel deploy
```

Set the environment variables in **Vercel Project Settings → Environment
Variables**.

> **Vercel note:** `vercel.json` sets `maxDuration: 30` on the poll route. The
> poll itself is short and the client retries automatically. For production
> co-navigation, add Upstash Redis from the Vercel Marketplace and set
> `UPSTASH_REDIS_REST_URL` plus `UPSTASH_REDIS_REST_TOKEN` so browser polls and
> agent commands can meet across serverless instances.

---

## Adapting to your own site

1. **Replace scenario IDs** in `lib/ttai.ts`
2. **Update `public/website-nav.md`** — the agent reads this to understand your
   site's routes and anchors
3. **Replace `components/site/`** with your own marketing sections
4. **Update `app/admin/constants.ts`** — the section/route/slide map for manual
   testing
5. **Delete `app/slides/`** if you don't need the property story system

The co-navigation core is fully independent of the demo content:

| File                                       | Keep as-is                                 |
| ------------------------------------------ | ------------------------------------------ |
| `lib/command-store.ts`                     | ✅ Redis when configured, memory otherwise |
| `hooks/useNavigationSession.ts`            | ✅ session ID + long-poll loop             |
| `components/widgets/NavAgentWidget.tsx`    | ✅ floating TTAI iframe panel              |
| `components/widgets/PersistentWidgets.tsx` | ✅ keeps iframe alive across routes        |
| `app/api/agent-navigate/route.ts`          | ✅ endpoint TTAI calls                     |
| `app/api/navigate-commands/[sessionId]/`   | ✅ long-poll endpoints                     |

### Co-navigation contract

Use this contract when you copy the feature into another app:

| Piece            | Responsibility                                                                  |
| ---------------- | ------------------------------------------------------------------------------- |
| Browser session  | Generate or restore a short session code and keep long-polling for commands.    |
| Agent context    | Inject `t_session_code` and `t_website_map` into the ToughTongue AI iframe URL. |
| Custom function  | Accept `{ session_code, url?, section? }` at `/api/agent-navigate`.             |
| Command delivery | Match commands by session code and wake the waiting browser poll.               |
| Client action    | Use route navigation for `url` and anchor scrolling for `section`.              |
| Admin testing    | Use `/admin` → Co-Navigation to copy schema, copy endpoint, and fire events.    |

Keep `/api/agent-navigate` public for the ToughTongue AI custom function, but
protect admin-only test routes and ToughTongue account routes with
`ADMIN_PASSWORD`.

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
│   │   ├── page.tsx                Properties index
│   │   └── [category]/[n]/         Full-screen slide viewer
│   ├── admin/
│   │   ├── page.tsx                Admin shell (login gate + tab switcher)
│   │   ├── constants.ts            Site map for manual nav buttons
│   │   └── tabs/                   AccountTab, SessionsTab, CoNavTab
│   └── api/
│       ├── admin-auth/             Password verification for `/admin`
│       ├── admin-config/           Protected resolved app/custom-function URL
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
│   ├── command-store.ts            Redis-or-memory command store
│   ├── config.ts                   Env-var loader (all process.env here)
│   ├── redis-command-store.ts      Upstash Redis REST adapter
│   ├── ttai.ts                     Scenario IDs, widget config, embed URL helper
│   └── utils.ts                    cn() Tailwind class merger
├── public/
│   ├── images/                     Site images
│   └── website-nav.md              Agent's route + anchor guide for this site
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

| Topic             | Note                                                                                                                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scale**         | Without Redis, `command-store.ts` uses process-local memory and only works when the POST and poll hit the same warm instance. Set the Upstash Redis REST vars on Vercel production. |
| **Runtime cache** | Do not use Vercel Runtime Cache for live co-navigation commands. It is regional, non-durable, and evictable; use Redis for the command queue.                                       |
| **Admin auth**    | `ADMIN_PASSWORD` is checked server-side. The admin UI stores the entered password locally and sends it as an `x-admin-password` header for admin API requests.                      |
| **API token**     | `TOUGHTONGUE_API_TOKEN` is server-side only — never reaches the browser.                                                                                                            |
| **Poll duration** | `maxDuration: 30` keeps each long-poll bounded. The client retries after timeout, so command delivery remains resilient.                                                            |
| **SEO**           | Set `NEXT_PUBLIC_IS_DEV=true` on preview/staging to block all crawlers automatically.                                                                                               |
