---
name: toughtongue-ai
description: Build on ToughTongue AI — REST API, iframe embeds, SIP phone calls, Google Meet bots, outbound webhooks, custom HTTP tools, MCP integrations, and scenario YAML authoring (Scenario / Coach / Course formats). Use this when integrating ToughTongue AI into an app, embedding a TT widget, wiring session webhooks, or authoring scenarios.
when_to_use: User mentions ToughTongue AI / TTAI / app.toughtongueai.com / TOUGHTONGUE_API_TOKEN, is integrating voice agents, embedding a TT iframe, wiring session.* webhooks, scheduling SIP phone or Google Meet bots, authoring scenario.yml or rubrik fields, using $random / $fread@ directives, configuring custom HTTP tools, or asking about Scenario / Coach / Course product formats.
---

# Build on ToughTongue AI

ToughTongue AI (TTAI) is a voice-agent platform for high-stakes conversation practice — interviews, sales, coaching, negotiations. This skill guides developers integrating TTAI into their own apps.

**Source-of-truth files in this skill** (read them when needed; do not invent values):

- `snapshots/llms-full.txt` — public REST API + iframe + SIP + webhooks + integrations (~1500 lines)
- `snapshots/scenario-schema.md` — public Scenario resource: fields, types, sample JSON, notes
- `snapshots/session-schema.md` — public Session resource: lifecycle, results, report card
- `snapshots/handbooks/` — `ScenarioGuide`, `FieldsReference`, `SalesPatterns`, `ColdCallPatterns`, `CoachPatterns`, `SuperAgentGuide`, `MCPGuide`, `SampleScenario`, `FlashGuide`

Reference files in this skill expand on each domain; **load only the reference that matches the user's task** (see §Reference loading rules below).

---

## 1. What TTAI is

**3 training formats:**

| Format | Use |
|---|---|
| Scenario | One-off role-play targeting a single conversation |
| Coach | Persistent AI coach that remembers every session, adapts to style |
| Course | Structured learning weaving AI role-plays with expert-led sessions |

**Dual-model architecture** at runtime: low-latency front model keeps speech natural; a reasoning model in the background powers tool calls, analysis, and rich interactions.

**Deployment channels:**

1. Direct web — `app.toughtongueai.com/run/<scenario_id>`
2. iframe embed — `<iframe src=".../embed/<scenario_id>" allow="microphone">` (full); `/embed/basic/<id>` and `/embed/minimal/<id>` for the other styles
3. REST API — full session lifecycle via `/api/public/`
4. Phone outbound — SIP trunk → `POST /api/public/v2/sip/call`
5. Phone inbound — carrier points SIP URI to LiveKit
6. Google Meet bot — Recall.ai → calendar auto-join or ad-hoc

---

## 2. Quickstart decision tree

| User goal | Load reference | Clone template |
|---|---|---|
| Embed TT in my web app | `deploy-reference.md` | `nextjs-minimal/` or `marketing-agent-demo/` |
| Create / list / read scenarios via REST | `api-reference.md` | `nextjs-minimal/` |
| Author a scenario in YAML | `scenario-authoring-reference.md` + `snapshots/scenario-schema.md` + matching handbook | `scenario-manager/` |
| Read or shape Session results | `api-reference.md` §sessions + `snapshots/session-schema.md` | `nextjs-minimal/` |
| Wire outbound webhooks | `integrations-reference.md` §webhooks | `nextjs-minimal/` |
| Add a custom HTTP tool the agent calls | `integrations-reference.md` §custom-functions | `flask-minimal/` |
| Connect an MCP server | `integrations-reference.md` §mcp + `snapshots/handbooks/MCPGuide.md` | — |
| Schedule outbound phone calls | `deploy-reference.md` §sip | — |
| Schedule a Google Meet bot | `deploy-reference.md` §meeting-bots | — |
| Read session transcripts + scores | `api-reference.md` §sessions | `nextjs-minimal/` |
| Understand the 18-tool catalog or formats | `architecture-reference.md` | — |

---

## 3. Scenario authoring — quick rules

**These values are the most common source of stale-content bugs. Always cross-check against `snapshots/scenario-schema.md` (public Scenario resource) and the matching handbook.**

- `type:` — schema accepts `default · super · quiz · composite · coding · meet_assist`, but the handbook authoring guidance says **only use `default` or `super` in practice**; others are deprecated or internal. **Never write `super_agent`** — that is the legacy value and will fail validation.
- `llm_provider:` ∈ `google · google_vertex · openai · cerebras`
- `tts_provider:` ∈ `cartesia · openai · elevenlabs`
- `stt_provider:` ∈ `deepgram · cartesia`
- Use `id: "$random"` for SHA256-derived stable IDs (deterministic from `dirname|parent_dirname|creator_id`).
- Use `$fread@path/to/file.md` inside a string field to load long content from a sibling file. Implemented in `ScenarioParser._resolve_files()`.
- **18 agent tools** available (see `architecture-reference.md` §tools or `snapshots/llms-full.txt`).
- Multiline text fields (`ai_instructions`, `user_instructions`, `rubrik`, `user_friendly_description`, `pdf_context`) must use YAML literal block scalar `|` — never inline quoted strings.
- Pick the handbook that matches the scenario intent (sales / cold call / coach / super agent) and read its TLDR before authoring.

---

## 4. API surface map

Base URL: `https://app.toughtongueai.com/api/public`. Auth header: `Authorization: Bearer <TOUGHTONGUE_API_TOKEN>`. Token never goes in the browser — always server-side.

| Topic | Endpoint(s) | Reference anchor |
|---|---|---|
| Scenarios | `POST/GET /scenarios`, `GET /scenarios/{id}`, `GET /scenarios/featured` | `api-reference.md` §scenarios |
| Sessions | `GET /sessions`, `GET /v2/sessions`, `GET /sessions/{id}` | `api-reference.md` §sessions |
| Analysis | `POST /sessions/analyze`, `POST /v2/sessions/{id}/post-process`, `POST /v2/sessions/batch-post-process` | `api-reference.md` §analysis |
| Access tokens (SAT) | `POST /scenario-access-token` (1-hour) | `api-reference.md` §access-tokens |
| Commerce | `GET /purchases`, `GET /subscriptions`, `GET /balance` | `api-reference.md` §commerce |
| Analytics | `GET /v2/analytics` | `api-reference.md` §analytics |
| Meeting bots | `POST/GET /v2/meeting-bots`, `DELETE /v2/meeting-bots/{id}` | `deploy-reference.md` §meeting-bots |
| SIP / phone | `POST /v2/sip/call`, `POST /v2/sip/batch` | `deploy-reference.md` §sip |
| Browser-tool auth | `POST /v2/scenarios/browser/authenticate` | `deploy-reference.md` §browser-tool |

---

## 5. Deploy surface map

| Channel | Use when | Reference anchor |
|---|---|---|
| iframe (full / basic / minimal) | Embed scenario in a web page | `deploy-reference.md` §iframe |
| Iframe + SAT | Gate access per user (1-hour token) | `deploy-reference.md` §sat |
| Iframe events (postMessage) | React to onStart / onStop / onSubmit | `deploy-reference.md` §iframe-events |
| Dynamic variables `{{ var }}` | Personalize per session | `deploy-reference.md` §dynamic-vars |
| Outbound SIP | Place calls to a phone number | `deploy-reference.md` §sip |
| Inbound SIP | Receive calls into an agent | `deploy-reference.md` §sip-inbound |
| Google Meet bot | Join + transcribe a calendar meeting | `deploy-reference.md` §meeting-bots |
| Browser-tool agent | Voice agent co-navigates the host UI | `deploy-reference.md` §browser-tool |

---

## 6. Outbound webhooks — five events, no retries

TTAI POSTs to a developer-provided URL when these events fire. All five are org-scoped and **never retried** — handle idempotency at the receiver.

- `session.started`
- `session.completed`
- `session.analyzed`
- `session.extracted`
- `session.terminated`

Signature verification, payload shape, setup → `integrations-reference.md` §webhooks.

---

## 7. Auth & secrets

- Bearer token env var: `TOUGHTONGUE_API_TOKEN` (server-side only). Mint at `https://app.toughtongueai.com/developer`.
- Public scenarios: no token in iframe URL — anyone with the link can use.
- Private scenarios: mint a **Scenario Access Token (SAT)** server-side via `POST /scenario-access-token`. SAT lifetime is 1 hour. Pass as `?scenarioAccessToken=<SAT>` in the iframe URL (not `?token=` — that name will be ignored).
- Passcode-gated scenarios: set `passcode` on the scenario; users must enter it.
- Webhook signature: verify HMAC on the signature header before processing (`integrations-reference.md` §signature).
- Never put `TOUGHTONGUE_API_TOKEN` in client-side bundles. The Next.js / Flask / marketing-agent templates all proxy through a server route.

---

## 8. Existing example apps in this repo

The plugin's parent repo `voice-ai-quickstart` ships these templates. Reference them by **absolute URL** (do not assume the user has cloned the repo):

- `nextjs-minimal/` — Next.js + Firebase + auth, full session lifecycle: <https://github.com/tough-tongue/voice-ai-quickstart/tree/main/nextjs-minimal>
- `marketing-agent-demo/` — Voice agent that co-navigates the host UI, `/admin` panel, slide system: <https://github.com/tough-tongue/voice-ai-quickstart/tree/main/marketing-agent-demo>
- `flask-minimal/` — Python + Preact minimal integration: <https://github.com/tough-tongue/voice-ai-quickstart/tree/main/flask-minimal>
- `scenario-manager/` — Bash `ttcli` for YAML-driven scenario version control: <https://github.com/tough-tongue/voice-ai-quickstart/tree/main/scenario-manager>
- `starter-prompts/` — Copy-paste prompts for v0 / Lovable / Bolt: <https://github.com/tough-tongue/voice-ai-quickstart/tree/main/starter-prompts>

API key env-var names by template: `TOUGH_TONGUE_API_KEY` (nextjs-minimal), `TOUGHTONGUE_API_TOKEN` (marketing-agent-demo), `TTAI_TOKEN` (flask-minimal). All three name the same thing.

---

## 9. Reference loading rules — progressive disclosure

**Load only the reference file that matches the user's current question. Do not preload all of them.**

| User asks about | Load |
|---|---|
| REST endpoints, scenarios CRUD, sessions, analytics, commerce | `api-reference.md` |
| Iframe, SAT, dynamic vars, SIP, meeting bots, browser tool, secure access | `deploy-reference.md` |
| Webhooks, custom HTTP tools, MCP | `integrations-reference.md` |
| `scenario.yml`, ai_instructions, rubrik, `$fread@`, `$random`, handbook patterns | `scenario-authoring-reference.md` |
| Product formats, full 18-tool catalog, dual-model architecture, deployment overview | `architecture-reference.md` |

If the user's question spans two domains, load both — but read snapshots lazily (only the specific section, not the whole file).

---

## 10. Pitfalls

- **Terminology**: ToughTongue AI is **one word** ("ToughTongue"), not "Tough Tongue AI" or "TT AI" in user-facing copy.
- **Stale enum**: do not write `type: super_agent`. The schema rejects it; the value is `super`.
- **Tool count**: there are **18** tools, not 7. If you only know `end_session / card / mcq / google_slides / image_generation / emoji_reaction / browser`, you're working from a stale catalog. Read `architecture-reference.md` §tools.
- **Handbook paths**: handbooks live at `snapshots/handbooks/` in this skill (mirrored from `py/jarvis/boxman/claude_box/repo-base/handbooks/`). Older docs may reference `scenario-data/rules/` — that path no longer exists.
- **Token in client**: never expose `TOUGHTONGUE_API_TOKEN` to the browser. Proxy through a server route.
- **Iframe sandbox**: must include `allow="microphone"`. Other sandbox flags depend on the embed style.
- **Webhook idempotency**: there are no retries. If your handler fails, the event is lost — return 2xx fast and process async.
- **Validation before upload**: cross-check `scenario.yml` against the field reference in `snapshots/scenario-schema.md` before uploading via the Jarvis CLI (`uv run jarvis scenario upload`). Schema errors block; style hints are warnings.

---

## Maintainer notes

- This skill's reference content is derived from pinned snapshots of `tough-tongue-ai`. Each snapshot file's header carries its source commit SHA. Regenerate with `scripts/sync-sources.sh` after each upstream release (`bun` required for resource-schema extraction).
- Cross-checked against `tough-tongue/ttai-claude-plans-and-skills/plans/ttai-system-design/03-scenario-skill-crosscheck.md` (May 2026). That doc enumerates the stale values the older gist-based scenario-writer skill produced.
- Code in this repo: MIT. Content in `snapshots/` and reference files: © ToughTongue AI.
