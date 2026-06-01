# Real Estate Marketing Site — Step 4: Agent Sessions Admin Panel

**Paste this into:** the same project session after Step 3
**Previous step:** `real-estate-3-integrate-tt-agents.md`

---

Add a **password-protected admin panel at `/agent-admin`** that uses a ToughTongue AI
PAT (Personal Access Token) to fetch all your scenarios and their sessions from the
last 7 days, and displays them in a clean, readable dashboard.

---

### What to build

**1. Route: `/agent-admin`**

Password-gated — same pattern as `/admin`:
- `useState` boolean `isAuthed`, hardcoded password `changeme-in-prod`
- After login: full dashboard view

**2. Dashboard layout (two-panel)**

```
┌─────────────────────┬──────────────────────────────────────────┐
│  Scenarios          │  Sessions (last 7 days)                  │
│  ─────────────      │  ──────────────────────                  │
│  ● Customer Support │  John Doe        26 Feb   7.4/10  ✓      │
│  ● Property Pitch   │  Jane Smith      25 Feb   8.1/10  ✓      │
│  ● ...              │  Alex Kumar      24 Feb    —      ⏳     │
└─────────────────────┴──────────────────────────────────────────┘
```

- Left panel: list of all scenarios (fetched from API)
- Right panel: sessions for the selected scenario, filtered to the last 7 days
- Clicking a session row expands an inline detail card (transcript summary, scores,
  extraction results, improvement areas)

---

### Data fetching

**A. Fetch all scenarios**

```typescript
// GET /api/public/scenarios
const res = await fetch("https://app.toughtongueai.com/api/public/scenarios", {
  headers: { Authorization: `Bearer ${PAT}` },
});
// → { scenarios: [{ id, name, description, created_at, ... }] }
```

**B. Fetch sessions for a scenario (last 7 days)**

```typescript
const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10); // "YYYY-MM-DD"

// GET /api/public/v2/sessions — enriched, includes scores + report card
const res = await fetch(
  `https://app.toughtongueai.com/api/public/v2/sessions` +
  `?scenario_id=${scenarioId}&$gte_created_at=${from}`,
  { headers: { Authorization: `Bearer ${PAT}` } },
);
// → { sessions: [{ id, user_name, user_email, created_at, status,
//     duration_minutes, evaluation_score, report_card[], extraction_results,
//     analytics_url, ... }] }
```

**C. Fetch full session details (on row expand)**

```typescript
// GET /api/public/sessions/{session_id}
const res = await fetch(
  `https://app.toughtongueai.com/api/public/sessions/${sessionId}`,
  { headers: { Authorization: `Bearer ${PAT}` } },
);
// → { id, user_name, transcript_url, evaluation_results: { final_score,
//     overall_score, strengths, weaknesses, detailed_feedback, report_card[] },
//     extraction_results, improvement_results: { action_items, resources } }
```

---

### Session list row

Each row shows:

| Field    | Source                                            |
| -------- | ------------------------------------------------- |
| Name     | `user_name`                                       |
| Date     | `created_at` formatted as "DD Mon"                |
| Score    | `evaluation_score` → "7.4 / 10" or "—" if null    |
| Status   | `status` → ✓ completed · ⏳ in_progress · ✗ failed |
| Duration | `duration_minutes` → "3 min"                      |

---

### Expanded session detail card

Shown inline below the row when clicked. Sections:

**Score breakdown** — render `evaluation_results.report_card[]` as a horizontal bar chart
or simple progress bars:
```
Communication    ████████░░  7.5 / 10
Problem Solving  ████████░░  8.0 / 10
```

**Strengths / Weaknesses** — two columns, plain text from
`evaluation_results.strengths` and `evaluation_results.weaknesses`.

**Extraction results** — key-value list from `extraction_results` object
(e.g. `deal_closed: false`, `objections_raised: [...]`).
Skip if the object is empty or null.

**Action items** — `improvement_results.action_items` as a bulleted list.

**Transcript link** — if `transcript_url` is present, a small "View transcript ↗"
link that opens in a new tab.

---

### Loading & error states

- Scenarios list: skeleton shimmer while loading
- Sessions panel: show "Select a scenario" placeholder before first selection
- Empty state: "No sessions in the last 7 days" if array is empty
- Error state: show the HTTP status + message; add a Retry button

---

### Environment variables — add to `.env.example`

```
VITE_TTAI_PAT=   # Personal Access Token — from app.toughtongueai.com/developer?tab=api-keys
```

> The PAT is the same format as the API key used in earlier steps. Use a separate
> token for the admin panel so it can be revoked independently.
> **Never expose this token in a public-facing page** — the `/agent-admin` route
> must always be password-gated before any API calls are made.

---

## ToughTongue AI Platform Reference

Use the live AI-readable docs instead of copying API reference text into this
prompt:

- https://app.toughtongueai.com/llms.txt
- https://app.toughtongueai.com/llms-full.txt

Those files are the canonical ToughTongue AI platform reference for builder
agents and should stay fresher than checked-in snippets.
