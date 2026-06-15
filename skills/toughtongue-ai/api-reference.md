# ToughTongue AI — REST API Reference

For full payloads + curl examples, read `snapshots/llms-full.txt` at the line ranges given below. Do not invent endpoint shapes — quote them from the snapshot.

## Conventions

- **Base URL**: `https://app.toughtongueai.com/api/public`
- **Auth**: `Authorization: Bearer <TOUGHTONGUE_API_TOKEN>` on every request. Token from `https://app.toughtongueai.com/developer`. Server-side only.
- **Content**: JSON in / JSON out. Dates are ISO 8601.
- **Pagination**: `page` (1-based) + `limit` query params.
- **IDs**: 24-char hex MongoDB ObjectId.
- **Errors**: `{"detail": "<message>"}` with the HTTP status code.

## Scenarios `[snapshot L101–L342]`

A scenario defines an AI agent's behavior — prompt, rubric, tools, appearance, analysis config.

| Method | Path | Notes |
|---|---|---|
| POST | `/scenarios` | Create. Omit `id`. |
| POST | `/scenarios` | Update — include `id`. Only fields you send are touched. |
| GET | `/scenarios` | List your scenarios (excludes `ai_instructions`, `tools_config`, `memory` — use Get for full details). |
| GET | `/scenarios/{id}` | Full resource. |
| GET | `/featured-scenarios` | Public library highlights. **Note**: this path is `featured-scenarios`, not `/scenarios/featured`. |

**Field groups** (full table at `snapshots/llms-full.txt:237–342`):

- Core: `id`, `name`, `description`, `ai_instructions`, `user_friendly_description`, `rubrik`, `pdf_context`
- Access & recording: `is_public`, `passcode`, `is_recording`, `analysis_access` (`default`/`always`/`never`), `user_metadata`
- Appearance: `appearance.voice` ∈ `Aoede, Charon, Fenrir, Kore, Puck`; `language_code` is BCP-47
- AI model: `ai_model_config.provider` ∈ `Ocean, Galaxy`; `model` ∈ `medium, medium-stable, medium-nc, medium-stable-nc`
- Memory: `memory.is_memory` toggles cross-session recall
- Session analysis: `is_auto_analysis`, `enable_extraction`, `extraction_vars[{name, description, type}]` (types: `text, number, boolean, list, date`), `multimodal_analysis`, `admin_email`, `email_analysis`, `email_transcript`
- Tools: see `architecture-reference.md` §tools for the full 18-tool catalog + per-tool settings
- Pricing: `pricing.enabled`, `pricing.configs[{amount, currency, billing_interval, is_default}]`

**Dynamic variables** in `ai_instructions`: write `{{ variable_name }}`. Pass values via iframe `?t_<name>=<value>` query params, SIP `dynamic_vars` body field, or scenario defaults. See `deploy-reference.md` §dynamic-vars.

## Sessions `[snapshot L344–L451]`

Every conversation creates a session. Sessions carry transcripts, scores, extracted vars.

| Method | Path | Notes |
|---|---|---|
| GET | `/sessions?scenario_id&user_email&from_date&to_date` | List (v1) — `scenario_id` required. |
| GET | `/v2/sessions` | Enriched list — adds `duration_minutes`, `evaluation_score`, `report_card[]`, `extraction_results`, `analytics_url`, `page_meta`. Supports `$gte_created_at`, `$lt_created_at`, `meta_*`. |
| GET | `/sessions/{id}` | Full session: `status`, `transcript_url` (S3), `evaluation_results.{overall_score, final_score, strengths, weaknesses, detailed_feedback, report_card[]}`, `extraction_results`, `improvement_results`. |

## Analysis & post-processing `[snapshot L453–L498]`

| Method | Path | Notes |
|---|---|---|
| POST | `/sessions/analyze` | Trigger eval on a completed session (legacy). Body: `{"session_id": "..."}` |
| POST | `/v2/sessions/{id}/post-process` | Successor to `/analyze`. Body: `{"run_analysis": bool, "run_extraction": bool}`. Returns `{"ok": true}` immediately — poll session details for results. Re-runs overwrite. |
| POST | `/v2/sessions/batch-post-process` | Body: `{"session_ids": ["..."], "run_analysis": bool, "run_extraction": bool}`. |

Extraction needs `extraction_vars` configured on the scenario.

## Scenario Access Tokens (SAT) `[snapshot L503–L523]`

Short-lived 1-hour tokens for private scenario iframes.

| Method | Path | Notes |
|---|---|---|
| POST | `/scenario-access-token` | Body: `{"scenario_id": "..."}`. Returns `{"access_token": "<jwt>", "expires_at": "<iso>"}`. Use as `?token=<SAT>` in iframe URL. |

Mint server-side (never client). Stick to one SAT per user session — rotation is the user's job after expiry.

## Commerce `[snapshot L527–L615]`

| Method | Path | Notes |
|---|---|---|
| GET | `/purchases` | One-time purchases. Optional `?user_email=`. |
| GET | `/subscriptions` | Recurring subscriptions with `current_period_start/end`, `cancel_at_period_end`. |
| GET | `/balance` | `{"available_minutes": 4109.7, "last_updated": "..."}` |

## Analytics `[snapshot L829–L887]`

| Method | Path | Notes |
|---|---|---|
| GET | `/v2/analytics?is_org&start_date&end_date` | Unified usage analytics. `is_org=true` for org-wide; `false` (default) for your own. |

## What's NOT in the public API

- Admin / org / billing dashboards — internal only.
- LiveKit room internals — handled inside iframe / SIP integration; not directly callable.
- Streamlit / Marimo admin UIs — internal tooling.
- The Jarvis CLI internals — see `scenario-manager/` example for the public surface.

## When NOT to use this reference

- For iframe / SIP / meeting bots / browser-tool auth → `deploy-reference.md`.
- For webhooks / custom HTTP tools / MCP → `integrations-reference.md`.
- For scenario YAML authoring (boxman handbooks, `$random`, `$fread@`) → `scenario-authoring-reference.md`.
