# ToughTongue AI — Architecture & Tool Catalog Reference

Product context that doesn't fit a single API or YAML domain: the 3 training formats, the dual-model agent stack, the 18-tool catalog. Use this when a developer asks "what is TTAI" or "what can agents actually do" — not when they're hitting a specific endpoint.

## 3 training formats

| Format | Mental model | When to use |
|---|---|---|
| **Scenario** | One-off role-play, single conversation | Interview practice, sales pitch demo, one specific drill |
| **Coach** | Persistent AI coach that remembers every session | Long-running development with a single user, adaptive |
| **Course** | Structured learning sequence weaving AI role-plays with expert-led sessions | Cohort training, certification flows |

The public API surface treats them all as `scenarios` with different config — there is no separate `/coaches` endpoint. The distinction shows up in:

- `memory.is_memory` (true for Coach-style cross-session recall)
- Presence of multi-stage flow (`type: super` with `stages[]`)
- UI configuration (Library shelves)

## Dual-model architecture

Every voice session runs **two models in parallel**:

- **Low-latency front model** — keeps speech natural; sub-second responses.
- **Reasoning model (background)** — powers tool calls, analysis, multi-step decisions, rich interactions.

This is invisible to the developer at the public API level; it's mentioned here so you understand why a single `ai_model_config.model` value can drive both behaviors.

## 3 pillars of agent design ("Context Engineering")

Not prompt engineering. Three things shape an agent's behavior:

1. **Prompt (`ai_instructions`)** — role, behavior, conversation structure.
2. **Tools** — the 18-tool catalog below + custom HTTP tools + MCP servers.
3. **Data & Memory** — uploaded docs (`pdf_context`), past-session memory (`memory.is_memory`), external data fetched via tools.

## 6 deployment channels

| Channel | How |
|---|---|
| Direct web | `app.toughtongueai.com/run/<scenario_id>` |
| iframe embed | `<iframe src=".../embed/<scenario_id>" allow="microphone">` |
| REST API | Full session lifecycle via `/api/public/` |
| Phone (outbound) | SIP trunk → `POST /api/public/v2/sip/call` |
| Phone (inbound) | Carrier points its SIP URI to LiveKit |
| Google Meet bot | Recall.ai → calendar auto-join or ad-hoc |

## The 18-tool catalog `[snapshot llms-full.txt L1200–L1243]`

Enable per scenario via `tools_config.tools.<key>.should_register = true`. **There are 18. If you only know 7, you're working from a stale catalog.**

| Tool | Key | What it does |
|---|---|---|
| Cards | `card` | Display info cards, frameworks, takeaways |
| MCQ | `mcq` | Multiple-choice quiz questions |
| Slide Generation | `slide_generation` | AI-generated slide decks with images |
| Google Slides | `google_slides` | Navigate an existing slide deck |
| Memory Search | `memory_search` | Recall info from past sessions (stateful agents) |
| Knowledge Base | `knowledge_base_search` | RAG over uploaded documents |
| Image Generation | `image_generation` | On-demand AI images |
| Mermaid Diagrams | `mermaid` | Flowcharts, sequence diagrams |
| Whiteboard | `whiteboard` | Interactive drawing canvas |
| Browser | `browser` | Cloud browser (navigate, click, fill forms) |
| Custom Function | `custom_function` | Call your HTTP endpoints (see `integrations-reference.md`) |
| Arcade Gmail | `arcade_gmail` | Send/read Gmail via Arcade.dev |
| Arcade Calendar | `arcade_calendar` | Create/read Google Calendar events |
| Emoji Reaction | `emoji_reaction` | Floating emoji reactions |
| PDF Upload | `pdf_upload` | Accept documents mid-session |
| Timer | `timer` | Countdown for exercises |
| Notepad | `notepad` | Shared notes during session |
| End Session | `end_session` | Programmatic session termination |

### Per-tool settings

Most tools take `tool_settings: null`. These don't:

| Tool | `tool_settings` shape |
|---|---|
| `end_session` | `{ "disconnectDelaySeconds": 5 }` |
| `google_slides` | `{ "embedUrl": "https://docs.google.com/.../pub?..." }` |
| `browser` | `{ "initialUrl": "https://...", "contextId": "ctx_..." }` |

`add_to_system_prompt: true` injects a tool-usage hint into the system prompt — useful when the agent needs explicit reminders to invoke a tool.

### Tool envelope

```json
"tools_config": {
  "tools": {
    "browser": {
      "should_register": true,
      "add_to_system_prompt": true,
      "tool_settings": {
        "initialUrl": "https://app.example.com",
        "contextId": "ctx_abc123"
      }
    },
    "end_session": {
      "should_register": true,
      "add_to_system_prompt": true,
      "tool_settings": { "disconnectDelaySeconds": 5 }
    }
  }
}
```

## Voice & language

- **Voices** ∈ `Aoede, Charon, Fenrir, Kore, Puck`. Set via `appearance.voice` on the scenario, or `?voice=` on the iframe URL.
- **Language**: `appearance.language_code` is BCP-47 (`en-US`, `fr-FR`, `es-ES`, `ja-JP`, `de-DE`, …). Override per session with `?accent=<BCP-47>` on the iframe URL.

## Conversation strategies

| Strategy | Behavior |
|---|---|
| Talkative | AI leads; keeps speaking even when user is silent |
| Quiz | Session ends → immediate analysis; no avatar shown |
| Conductor | Timed prompts at specific moments; auto-ends at set duration |

## Post-session pipeline

When `auto_analysis=true` (or you call `/sessions/analyze` / `/v2/sessions/{id}/post-process`):

1. LangGraph `eval_workflow` runs (`tough-tongue-ai/py/backend/routers/agentic/workflows/eval/`).
2. Stages: `start → prep → expert/mm (multimodal) → quiz`.
3. Optional multimodal pass uses audio + video frames.
4. Variable extraction matches `session_analysis.extraction_vars[]`.
5. Results write back to the session document in MongoDB.
6. Webhooks fire: `session.analyzed`, then `session.extracted` if extraction ran.
7. Admin email sent if `email_analysis=true`.

Developers see this via `GET /sessions/{id}` (`evaluation_results`, `extraction_results`, `improvement_results`).

## Sub-repos that show up in product copy

- `tough-tongue-ai/` — the monorepo (FastAPI backend, Next.js frontend, LiveKit agents).
- `tough-tongue/voice-ai-quickstart` — this repo. Public starter templates + this skill.
- `tough-tongue/ttai-claude-plans-and-skills` — design-doc + crosscheck repo (private; not user-facing).

## When NOT to use this reference

- REST CRUD or session details → `api-reference.md`
- iframe / SIP / meeting bot mechanics → `deploy-reference.md`
- Webhooks / custom HTTP tools / MCP → `integrations-reference.md`
- Boxman YAML authoring, $random / $fread@, handbook routing → `scenario-authoring-reference.md`
