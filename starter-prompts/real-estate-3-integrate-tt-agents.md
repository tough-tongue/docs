# Real Estate Marketing Site — Step 3: ToughTongue AI Voice Agent Integration

**Paste one (or all) of these sections** into the same project session after Step 2.
Each section is a standalone integration — pick the one(s) that fit your setup.
**Previous step:** `real-estate-2-remote-nav.md`

---

## Option A — "Talk to an Agent" phone CTA

Add a **phone call CTA** to the landing page so visitors can request an AI agent
to call them and walk them through the property.

### What to build

**1. CallCTA component (`src/components/site/CallCTA.tsx`)**

A section or sticky banner on the landing page:

```
┌─────────────────────────────────────────────────────┐
│  📞  +91 98765 43210   [Talk to an Agent →]         │
└─────────────────────────────────────────────────────┘
```

States:
- **Idle** — phone number displayed as `tel:` link + "Talk to an Agent" button
- **Form** — small inline form: name input + optional "What are you interested in?"
  dropdown (Apartments / Penthouses / Investment) → "Request Call" button
- **Pending** — "Connecting you…" spinner, disables button
- **Success** — "Our agent will call you shortly" confirmation
- **Error** — "Something went wrong. Please try again."

**2. API route (`/api/request-call` — server-side, keeps API key off the client)**

```typescript
// POST /api/request-call
// Body: { name: string; phone: string; interest?: string }

const res = await fetch("https://app.toughtongueai.com/api/public/v2/sip/call", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TTAI_API_KEY}`,
  },
  body: JSON.stringify({
    scenario_id: process.env.TTAI_SCENARIO_ID,
    sip_trunk_id: process.env.TTAI_SIP_TRUNK_ID,
    phone_number: body.phone,           // E.164 format: +919876543210
    user_name: body.name,
    dynamic_vars: {
      visitor_name: body.name,
      property_name: "The Camellias",
      interest: body.interest ?? "the property",
    },
  }),
});
// → { success: true, call_id: "...", session_id: null }
```

The AI scenario's `ai_instructions` should use `{{ visitor_name }}`, `{{ property_name }}`,
and `{{ interest }}` as placeholders — the values above are substituted at call time.

**Dynamic variables reference:**
`{{ variable_name }}` in ai_instructions → passed via `dynamic_vars` in the API call body.

**3. Environment variables — add to `.env.example`:**

```
TTAI_API_KEY=          # from app.toughtongueai.com/developer?tab=api-keys
TTAI_SCENARIO_ID=      # from app.toughtongueai.com/scenario-studio
TTAI_SIP_TRUNK_ID=     # from Settings → SIP Trunks (Twilio / Exotel / Telnyx etc.)
```

> **Note:** SIP trunk setup is one-time — the user creates it in their telephony
> provider (Twilio, Exotel, Telnyx) and registers it in ToughTongue AI Settings.
> Add a comment in the component pointing to:
> https://app.toughtongueai.com/docs/integrations/phone-integration

---

## Option B — Meeting bot widget

Add a widget so channel partners can drop a Google Meet link and have a ToughTongue AI
agent join the call automatically at the scheduled time.

### What to build

**1. MeetingBotWidget (`src/components/site/MeetingBotWidget.tsx`)**

A floating panel anchored to the bottom-right corner.

States:
- **Idle** — pill button: "Send AI to Meeting" (gold accent)
- **Form** — panel slides up:
  - Header: "Send AI Agent to Your Meeting"
  - Meeting URL input (Google Meet link)
  - Date + time picker for `scheduled_ts` (default: now + 5 min)
  - Bot display name input (default: "The Camellias Agent")
  - "Schedule Bot" button
- **Success** — confirmation card: bot name, meeting URL, scheduled time, `bot_id`

**2. API route (`/api/schedule-bot` — server-side)**

```typescript
// POST /api/schedule-bot
// Body: { meetingUrl: string; scheduledTs: string; botName?: string }

const res = await fetch("https://app.toughtongueai.com/api/public/v2/meeting-bots", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.TTAI_API_KEY}`,
  },
  body: JSON.stringify({
    scenario_id: process.env.TTAI_SCENARIO_ID,
    meeting_url: body.meetingUrl,
    meeting_provider: "google-meet",           // google-meet | zoom | teams
    scheduled_ts: body.scheduledTs ?? null,    // null = join immediately
    bot_name: body.botName ?? "The Camellias Agent",
  }),
});
// → { success: true, bots: [{ bot_id: "...", session_id: "..." }] }
```

**3. Environment variables — add to `.env.example`:**

```
TTAI_API_KEY=       # shared with Option A
TTAI_SCENARIO_ID=   # shared with Option A
```

> **Limitations note** (add as a tooltip in the UI):
> "Currently supports Google Meet. Zoom and Teams coming soon.
> Works best in quiet environments with one speaker at a time."

---

## Option C — Embedded iframe pitch trainer

Add a **floating iframe widget** so property agents can practice their sales pitch
with a simulated buyer — without leaving the site.

### What to build

**1. PitchTrainerWidget (`src/components/site/PitchTrainerWidget.tsx`)**

Floating panel, bottom-right, above any other widgets.

States:
- **Idle** — pill button: "Practice Your Pitch 🎙" (gold accent)
- **Expanded** — 480×640 px panel:
  - Header: "Pitch Trainer — The Camellias"
  - Sub-header: "Practice presenting this property to a simulated buyer"
  - Name input (pre-fills `userName` in the embed URL)
  - "Start Session" → shows iframe; "End Session" → shows scorecard
- **Scorecard** — score badge (0–100), 3 strengths (green), 3 improvements (amber),
  "Practice Again" button

**2. Iframe embed**

```typescript
// Use /embed/basic/ — recommended style (600px height, standard avatar)
// Dynamic vars: t_<variable_name> query params → {{ variable_name }} in ai_instructions
const src = [
  `https://app.toughtongueai.com/embed/basic/${import.meta.env.VITE_TTAI_SCENARIO_ID}`,
  `?background=black`,
  `&userName=${encodeURIComponent(userName)}`,
  `&t_property_name=The%20Camellias`,
  `&t_agent_name=${encodeURIComponent(userName)}`,
].join("");

// <iframe src={src} width="100%" height="600px" allow="microphone" frameborder="0" />
```

**Embed styles for reference:**
- `/embed/basic/SCENARIO_ID` — 600px, standard avatar (recommended)
- `/embed/SCENARIO_ID` — 800px, full experience with recording + analysis
- `/embed/minimal/SCENARIO_ID` — 300px, compact preview

**Dynamic variables for iframe:** pass `t_<variable_name>=<value>` as URL query params.
These substitute `{{ variable_name }}` in the scenario's `ai_instructions`.

**3. postMessage event handling:**

```typescript
// Payload: { event: "onStop", sessionId: "abc123", timestamp: 1705312800000 }
// Other events: onStart, onTerminated, onSubmit
window.addEventListener("message", (e) => {
  if (e.origin !== "https://app.toughtongueai.com") return;
  const { event: name, sessionId } = e.data || {};
  if (name === "onStop" && sessionId) fetchScorecard(sessionId);
});
```

**4. Scorecard fetch**

```typescript
const res = await fetch("https://app.toughtongueai.com/api/public/sessions/analyze", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TTAI_API_KEY}`,
  },
  body: JSON.stringify({ session_id: sessionId }),
});
// → { summary, evaluation: { score, feedback, strengths, improvements }, transcript }
```

**5. Environment variables — add to `.env.example`:**

```
VITE_TTAI_SCENARIO_ID=   # from app.toughtongueai.com/scenario-studio
VITE_TTAI_API_KEY=       # from app.toughtongueai.com/developer?tab=api-keys
```

---

## ToughTongue AI Platform Reference

Use the live AI-readable docs instead of copying API reference text into this
prompt:

- https://app.toughtongueai.com/llms.txt
- https://app.toughtongueai.com/llms-full.txt

Those files are the canonical ToughTongue AI platform reference for builder
agents and should stay fresher than checked-in snippets.
