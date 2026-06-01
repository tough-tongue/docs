# Real Estate Marketing Site — Step 2: Remote Navigation & Slide Decks

**Paste this into:** the same project session after Step 1
**Previous step:** `real-estate-1-build-site.md`
**Next step:** `real-estate-3-integrate-tt-agents.md`

---

Extend the site with two features: a **full-screen slide deck viewer** for channel
partners, and a **remote navigation system** so a presenter can drive the visitor's
browser from a separate admin tab during a live walkthrough.

---

### Feature 1 — Slide Deck Viewer (`/slides`)

Full-screen, no-scroll presentation — like a PowerPoint slide, one at a time.

**Routes:**
- `/slides` — index listing all available decks
- `/slides/:category/:n` — single slide, full viewport, no scroll

**Slide schema (TypeScript):**

```typescript
export type SlideLayout = "hero" | "split" | "stat-grid" | "gallery-3" | "quote";

export interface Slide {
  id: string;
  layout: SlideLayout;
  category: string;       // e.g. "amenities"
  n: number;              // 1-indexed
  title: string;
  subtitle?: string;
  body?: string;
  image?: string;
  stats?: Array<{ label: string; value: string }>;
  images?: string[];      // gallery-3 only
  quote?: string;
  attribution?: string;
}
```

**Layouts:**
- `hero` — full-bleed image, title + subtitle overlaid bottom-left
- `split` — image left 60%, text right 40%
- `stat-grid` — 2×2 or 3×2 stat cards
- `gallery-3` — three images in a grid, title bar at top
- `quote` — large centered pull-quote, attribution below

**Navigation:** on-screen prev/next chevrons + keyboard `←/→`; `Escape` → `/slides`.

**Seed data:** two JSON files —
- `src/data/slides/amenities.json` — 5 slides: Pool, Spa, Club, Gardens, Concierge
- `src/data/slides/wraparound-residence.json` — 4 slides: Overview, Floor Plans, Finishes, Pricing

Register both in `src/data/slides/registry.ts`.

---

### Feature 2 — Remote Navigation System

**Backend (lightweight Express server, `server/index.ts`, port 4000):**

```
POST /navigate-commands/:sessionId
  Body: { url?: string; section?: string }
  → stores command in memory (one pending command per session max)
  → export a CommandStore interface so Map can be swapped for Redis/Mongo later

GET /navigate-commands/:sessionId/poll
  → long-poll: holds open up to 30 s; resolves immediately if a command is pending, then clears it
```

**Connect-session widget (bottom-left of page, `SessionWidget.tsx`):**

- **Disconnected:** "Connect Session" button
- **Connected:** 4-char CAPS session ID (e.g. `XKQP`), pulsing green dot, "Disconnect" link
- On connect: generate session ID, append `?session=XKQP` to URL bar, start long-polling
- On command received: `navigate()` for route changes; `scrollIntoView()` for section anchors

**Admin page (`/admin`):**

- Password-gated — hardcoded: `changeme-in-prod`
- Text input for session ID
- One button per route + section (auto-generated from a site map)
- Live log of last 10 dispatched commands

**Site map file:** generate `public/sitemap.md` listing every route, navbar anchor,
and slide deck/slide number — used by the admin to know what to dispatch.
