# ToughTongue AI — Integrations Reference

Outbound webhooks, custom HTTP tools, and MCP server integrations. Source: `snapshots/llms-full.txt` + `snapshots/handbooks/MCPGuide.md`.

## Outbound webhooks `[snapshot llms-full.txt L1117–L1180]`

TTAI POSTs to a developer endpoint when session lifecycle events fire.

### Five events

| Event | Fires when | Typical handler action |
|---|---|---|
| `session.started` | Session created | Log start; update CRM |
| `session.completed` | Session ended | Fetch transcript |
| `session.analyzed` | Scores ready | Display results in your UI |
| `session.extracted` | Variables extracted | Push to database |
| `session.terminated` | Force-terminated (timeout/error) | Log failure |

**Scope**: Organisation sessions only. Personal sessions never fire webhooks.

### Setup

1. Build a POST endpoint that responds 2xx within 10 seconds.
2. In TTAI: Developer → Webhooks → Add → select events → Create.
3. Copy the signing secret (shown once — store it server-side).

### Payload shape

```json
{
  "event": "session.analyzed",
  "id": "evt_abc123",
  "ts": "2026-05-13T10:00:00.000Z",
  "data": {
    "session_id": "664a1f...",
    "org_id": "663e2a...",
    "scenario_id": "6621bc..."
  }
}
```

`data` carries IDs only. Fetch the full session via `GET /sessions/{session_id}` (see `api-reference.md` §sessions).

### Signature verification — Standard Webhooks

Every request carries three headers: `webhook-id`, `webhook-timestamp`, `webhook-signature`. TTAI uses the [Standard Webhooks](https://www.standardwebhooks.com/) signing scheme.

```python
# Python
from standardwebhooks import Webhook
wh = Webhook(SIGNING_SECRET)
wh.verify(request.body, dict(request.headers))
```

```javascript
// Node
import { Webhook } from "standardwebhooks";
const wh = new Webhook(SIGNING_SECRET);
wh.verify(rawBody, headers);
```

Reject if `webhook-timestamp` is older than 5 minutes (replay protection).

### Delivery behavior — critical

- **No retries**. A 5xx from your endpoint loses the event. Bound your handler to under 10 seconds and return 200 fast — process heavy work async.
- Use `id` to dedupe; events may arrive more than once during recovery edge-cases.
- Dashboard keeps a 7-day delivery log for inspection.

## Custom Functions (HTTP tools) `[snapshot llms-full.txt L1186–L1196]`

Agents can call your HTTP endpoints mid-conversation — same pattern as OpenAI function calling.

### Flow

1. In TTAI: define `name`, `description`, HTTP method, URL, headers, JSON Schema for params.
2. The AI decides when to invoke during conversation.
3. TTAI POSTs to your endpoint with AI-generated arguments matching the JSON Schema.
4. Your server responds with text or JSON (max **15,000 chars**).
5. AI speaks the response to the user.

### Use cases

- CRM lookup ("what did this customer order last?")
- Send transactional email or SMS
- Book an appointment via Cal.com / your calendar
- Update a database row
- Trigger a Zapier / Make webhook

### Tool config

Enable `custom_function` in `tools_config.tools.custom_function.should_register = true` plus the per-function definition (set via UI today). See `architecture-reference.md` §tools for the surrounding tool envelope.

## MCP integrations `[snapshot handbooks/MCPGuide.md]`

MCP (Model Context Protocol) lets agents call external tool servers — search docs, read repos, query APIs.

### Catalog — only these IDs are supported

| ID value (`mcp_server_ids` entry) | Auth | Tools |
|---|---|---|
| `catalog:deepwiki` | none | `read_wiki_structure`, `read_wiki_contents`, `ask_question` |
| `catalog:github` | headers (user API key) | repos, issues, PRs, code search |
| `catalog:context7` | none | `resolve-library-id`, `query-docs` |

### YAML shape

```yaml
mcp_server_ids:
  - "catalog:deepwiki"
  - "catalog:context7"
```

### Rules — strict

1. **Never invent IDs.** Only the 3 catalog entries above are valid.
2. **Never use the `custom:` prefix.** Custom MCP servers are not shipped yet.
3. Keep existing entries unless the user asks to remove them.
4. Don't change `mcp_server_ids` silently.

### Model compatibility

| Provider | MCP execution |
|---|---|
| Ocean | Yes — OpenAI native MCP tools in `session.update` |
| Landmass / LiveKit | Yes — `MCPToolset` in the LiveKit worker |
| Galaxy | Not yet — IDs persist but tools won't run; setting them is allowed for future readiness |

If a user attaches MCP servers to a Galaxy scenario, mention that the servers will activate only after switching to Ocean or Landmass.

### Auth modes

- **none** — public server, no secrets (DeepWiki, Context7).
- **headers** — needs a user-provided API key stored at Settings → Account → API Keys. GitHub requires `GITHUB_PERSONAL_ACCESS_TOKEN`. If missing, TTAI prompts the user at connect time.

### When to attach which server

| Scenario kind | Recommended |
|---|---|
| Technical interviews (coding, system design) | `catalog:github`, `catalog:context7` |
| Research / learning | `catalog:deepwiki`, `catalog:context7` |
| Coaching / sales | Usually none |

## When NOT to use this reference

- iframe events / SAT / SIP / browser-tool auth → `deploy-reference.md`
- REST endpoint shapes → `api-reference.md`
- Authoring `scenario.yml` end-to-end → `scenario-authoring-reference.md`
- The full 18-tool catalog and per-tool settings → `architecture-reference.md`
