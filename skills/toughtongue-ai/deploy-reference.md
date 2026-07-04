# ToughTongue AI — Deployment Reference

Iframe embeds, SAT, dynamic vars, iframe events, SIP/phone, meeting bots, browser tool. Full payloads + curl examples in `snapshots/llms-full.txt` at the line ranges below.

## Iframe embed — three styles `[snapshot L889–L908]`

| Style | URL | Height | Use when |
|---|---|---|---|
| Full | `/embed/SCENARIO_ID` | 800px | Complete experience: recording + analysis surfaced inside |
| Basic | `/embed/basic/SCENARIO_ID` | 600px | Standard interactive avatar (recommended default) |
| Minimal | `/embed/minimal/SCENARIO_ID` | 300px | Compact preview / landing-page CTA |

```html
<iframe
  src="https://app.toughtongueai.com/embed/basic/SCENARIO_ID"
  width="100%" height="600px" frameborder="0"
  allow="microphone">
</iframe>
```

`allow="microphone"` is **required**. No other sandbox flags needed.

## SAT (Scenario Access Token) — private scenarios `[snapshot L910–L928]`

For non-public scenarios, mint a SAT server-side, append as query param.

```
/embed/SCENARIO_ID?scenarioAccessToken=YOUR_TOKEN
```

- Query param name is `scenarioAccessToken` — **not** `accessToken`, **not** `token`.
- SAT lifetime: 1 hour. Mint a new one per user session.
- Mint endpoint: `POST /api/public/scenario-access-token` body `{"scenario_id": "..."}` — see `api-reference.md` §access-tokens.

## User identification `[snapshot L931–L938]`

Skip the in-iframe name/email dialog:

```
?userName=John%20Doe&userEmail=john@example.com
```

URL-encode the values. Pairs cleanly with SAT for known users.

## Customization query params `[snapshot L941–L956]`

| Param | Purpose |
|---|---|
| `name` | Custom conversation title |
| `color` | Accent color (e.g. `violet-500`) |
| `background` | Background color |
| `showPulse` | Toggle pulse animation |
| `hidePoweredBy` | Hide ToughTongue branding |
| `maxDuration` | Auto-end after N seconds |
| `voice` | Override AI voice (`Aoede`, `Charon`, `Fenrir`, `Kore`, `Puck`) |
| `accent` | Override TTS accent (BCP-47, e.g. `en-GB`) |
| `avatarUrl` | Custom avatar image |
| `avatarId` | Default avatar 1-5 |
| `restoreSession` | Resume an existing session by id |

## Dynamic variables — `t_` prefix `[snapshot L959–L989]`

`ai_instructions` can contain `{{ variable_name }}` placeholders. In the iframe URL pass them as `t_<variable_name>=<value>`:

```
?t_company_name=Acme%20Corp&t_role=SRE&t_tech_stack=Kubernetes
```

Rules:

- Prefix every variable with `t_`.
- The name after `t_` must match the placeholder name in `ai_instructions` exactly.
- URL-encode the value.
- Works with all three embed styles.

Same `{{ var }}` placeholders are filled via `dynamic_vars` body field when called via SIP (see §sip below).

## Iframe events — four events `[snapshot L1007–L1038]`

```javascript
window.addEventListener("message", (event) => {
  const { event: name, sessionId } = event.data || {};
  switch (name) {
    case "onStart":      /* session begins */; break;
    case "onStop":       /* session ends, fetch transcript */; break;
    case "onTerminated": /* force-terminated (timeout/error) */; break;
    case "onSubmit":     /* post-session submit complete, results ready */; break;
  }
});
```

Payload: `{ event, sessionId, timestamp }`. **`onTerminated` is distinct from `onStop`** — represents force-termination rather than a clean end.

## Sending data INTO the iframe `[snapshot L1042–L1061]`

Push evaluator notes into the live session:

```javascript
iframe.contentWindow.postMessage({
  type: "session_notes",
  notes: [{ text: "Strong opening", timestamp: Date.now(), source: "evaluator" }]
}, "*");
```

## SIP / phone (outbound) `[snapshot L683–L823]`

`POST /api/public/v2/sip/call`

```json
{
  "scenario_id": "...",
  "sip_trunk_id": "...",
  "phone_number": "+14155551234",
  "user_name": "John Doe",
  "user_email": "john@example.com",
  "scheduled_ts": "2026-06-20T17:00:00Z",
  "dynamic_vars": {
    "patient_name": "John Doe",
    "appointment_type": "checkup",
    "date": "June 20"
  }
}
```

- `phone_number` must be E.164.
- Omit `scheduled_ts` for immediate dial.
- `dynamic_vars` replaces `{{ var }}` in `ai_instructions`.
- Returns `{success, call_id, session_id, message}`. `session_id` is `null` until the call connects.

**Batch**: `POST /v2/sip/batch` with `entries[{phone_number, user_name, dynamic_vars}]`. Processed every 5 minutes; concurrency limited by the trunk's `max_concurrency`. Track with `GET /v2/sip/calls?batch_id=...`.

**List**: `GET /v2/sip/calls` filters: `status` ∈ `pending, scheduled, in_call_recording, call_ended, failed`; `scenario_id`, `batch_id`, `from_date`, `to_date`, `page`, `limit`.

**Delete**: `DELETE /v2/sip/calls/{call_id}` — only `pending` or `scheduled` calls can be deleted.

**SIP setup** (`[snapshot L1095–L1114]`):

1. Create SIP trunk at your provider (Twilio, Plivo, Exotel, Telnyx, Vonage).
2. Get Termination URI, SIP Username, SIP Password.
3. Assign a phone number to the trunk.
4. In TTAI: Scenario → Phone Call → SIP Configuration → Save.

## SIP — inbound

Carrier points its SIP URI to LiveKit. The scenario picks up on incoming calls; sessions appear like any other.

## Meeting bots (Google Meet today) `[snapshot L619–L686, L1067–L1083]`

`POST /api/public/v2/meeting-bots`

```json
{
  "scenario_id": "...",
  "meeting_url": "https://meet.google.com/abc-defg-hij",
  "meeting_provider": "google-meet",
  "scheduled_ts": "2026-06-20T17:00:00Z",
  "bot_name": "AI Assistant"
}
```

- Multi-URL: separate URLs with newlines to schedule multiple bots at once.
- Returns `{success, bots: [{bot_id, session_id}]}`.
- Supported: Google Meet (Zoom + Teams roadmap).
- Best in quiet rooms with one speaker at a time.

**Setup modes** (in-product):

- **Custom**: provide meeting URL + scheduled time.
- **Calendar**: grant calendar access, optionally filter by keyword (e.g. "interview").

**List**: `GET /v2/meeting-bots?status&from_date`. **Delete**: `DELETE /v2/meeting-bots/{bot_id}`.

## Browser tool — pre-authentication `[snapshot L992–L1003, L1246–L1257]`

Scenarios using the `browser` tool can pre-auth a cloud browser so users don't have to log in mid-conversation.

`POST /api/public/v2/scenarios/browser/authenticate`

```json
{ "scenario_id": "...", "initial_url": "https://app.example.com/login" }
```

Response returns `embed_url`. Open it, log in to your app, click **Save & Close**. The resulting `contextId` is persisted in the scenario's `tools_config.tools.browser.tool_settings.contextId` and reused for every future session.

## Conversation strategies `[snapshot L1261–L1268]`

| Strategy | Behavior |
|---|---|
| Talkative | AI leads; continues even when user is silent |
| Quiz | Session ends → immediate analysis; no avatar |
| Conductor | Timed prompts at specific moments; auto-ends at set duration |

## Secure access patterns `[snapshot L1476–L1496]`

- **Public link**: `is_public=true`, no token needed.
- **SAT-gated**: `is_public=false` + per-user SAT via `?scenarioAccessToken=`.
- **Passcode**: set `passcode` on the scenario — users must type it in.
- **Time window**: `starts_at` / `ends_at` datetime fields control when the scenario is accessible.

Mix and match: a private scenario with SAT + passcode + time window is supported.

## When NOT to use this reference

- REST CRUD on scenarios/sessions → `api-reference.md`
- Webhook event payloads + signature verification → `integrations-reference.md`
- Custom HTTP tools the agent calls into your backend → `integrations-reference.md` §custom-functions
- Authoring `scenario.yml` → `scenario-authoring-reference.md`
