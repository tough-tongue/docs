# ToughTongue AI — Scenario Authoring Reference

Authoring `scenario.yml` files using the boxman handbook system. Source-of-truth files (snapshots in this skill):

- `snapshots/boxman-claude.md` — workshop rules + communication style
- `snapshots/scenario-schema.yml` — auto-generated JSON schema (from `ScenarioEssence`)
- `snapshots/handbooks/*.md` — pattern handbooks; each starts with a TLDR. Read the TLDR before the full guide.

**Stale-content alarms** (cross-checked against `tough-tongue/ttai-claude-plans-and-skills/plans/ttai-system-design/03-scenario-skill-crosscheck.md`):

- `type: super_agent` → wrong. Schema rejects it. Use `type: super`.
- `rules/` directory → wrong. Handbooks live at `snapshots/handbooks/<X>Patterns.md`.
- 7 tools → wrong. There are 18; see `architecture-reference.md` §tools.
- `$fread@` → real and supported by `ScenarioParser._resolve_files()`.

## Authoring flow

1. **Pick the scenario type and its handbook.**
2. **Read the handbook's TLDR** (first ~50 lines) to decide whether you need the full body.
3. **Draft `scenario.yml`** using the handbook's structure + the field reference below.
4. **Run the validator** before saying you're done.
5. **Upload via Jarvis CLI** when validation passes.

## Communication style — read before editing for users

Per `snapshots/boxman-claude.md` (workshop CLAUDE.md):

- Describe WHAT you're improving — e.g. "Restructuring the conversation flow with clearer phase timing…"
- **Do not say** "Editing scenario.yml" or "Updating the ai_instructions field." Users do not think in files or YAML.
- **Do not** mention file paths like `agent-f5c913d4/scenario.yml` to the user.

## Type — the most-broken field

- Schema allows: `default · super · quiz · composite · coding · meet_assist`.
- **Boxman authoring rule**: only ever use `default` or `super`. Others are deprecated or internal.
- **`super_agent` is the legacy value and will fail validation. Never write it.**

## Model & provider matrix `[handbook FieldsReference]`

```yaml
ai_model_config:
  provider: "Galaxy"        # Galaxy | Ocean | Landmass
  model: "medium"
```

| Provider | Model | Use |
|---|---|---|
| Galaxy | medium | Default, best for emotional expression |
| Galaxy | medium-stable | Stable Galaxy (Vertex) |
| Galaxy | medium-nc | + noise cancellation |
| Galaxy | medium-stable-nc | Stable + noise cancellation |
| Ocean | medium-stable | OpenAI GPT Realtime — best for phone/artifacts |
| Landmass | medium | Complex interactions (beta); **required for `super`** |
| Landmass | cascade-01 | High reliability, lower latency tradeoff |
| Landmass | medium-stable | Ocean over robust transport |

Constraints:

- `type: super` **must** use `Landmass`.
- Never set `model: demo` or `model: super` — internal/reserved.
- `standby` is a sub-agent mode (see SuperAgentGuide handbook), not a top-level model.

## Other top-level enums

- `appearance.voice` ∈ `Aoede, Charon, Fenrir, Kore, Puck`.
- `appearance.language_code` is BCP-47 (e.g. `en-US`, `fr-FR`, `ja-JP`).
- For STT/TTS/LLM provider enums used in the public API surface (different shape from boxman schema), see `api-reference.md` §scenarios and `snapshots/llms-full.txt`.

## Special directives in the YAML

### `id: "$random"`

Generates a deterministic SHA256-derived ID from `dirname|parent_dirname|creator_id`. Re-running on the same path yields the same ID — safe for upserts.

### `$fread@<relative/path/to.md>`

Inline-load a long text field from a sibling file. Implemented in `ScenarioParser._resolve_files()` (`py/jarvis/commands/scenario/utils/parser.py:111`). Use this for `ai_instructions` ≥ 1000 words.

```yaml
ai_instructions: $fread@content/instructions.md
user_instructions: $fread@content/user_guide.md
rubrik: $fread@content/rubrik.md
```

The parser resolves relative to the scenario dir.

### `created_by`

Accepts either an email address or a 24-hex-char ObjectId.

## Multiline text fields — always use `|`

Use YAML literal block scalar `|` for: `ai_instructions`, `user_instructions`, `rubrik`, `user_friendly_description`, `pdf_context`.

```yaml
# CORRECT
ai_instructions: |
  ## Your Role
  You are a senior hiring manager…

  ## Approach
  - Start with a warm greeting
  - Ask open-ended questions

# WRONG — inline strings break on special chars
ai_instructions: '## Your Role\nYou are a senior hiring manager…'
```

Wrap at natural boundaries, ~100 chars max per line. Use `##` headings and `-` bullets.

## ai_instructions structure `[handbook ScenarioGuide]`

```yaml
ai_instructions: |
  ## Your Role
  [Persona, background, expertise, communication style]

  ## Interview Approach - CRITICAL
  The frameworks are reference examples, NOT requirements.
  Evaluate on thinking process, not specific answers.

  ## Conversation Flow
  - Opening (2-3 min): [...]
  - Main (8-10 min):   [...]
  - Closing (2-3 min): [...]

  ## Behavioral Guidelines
  - [Specific interaction patterns]
  - [Tool usage instructions]
```

Principles: describe intent (not exact phrases), structure phases with timing, add a "Critical" flexibility section to prevent rigid testing, mark background context as "reveal only when asked."

## user_instructions formula

**Situation → Expect → Succeed → Tips → Encouragement.**

Include scenario overview, question types, success strategies with timing, prep checklist, common pitfalls ("What Kills the Deal" / "What Scores High").

## rubrik structure

```yaml
rubrik: |
  ## Evaluation Dimensions
  ### 1. Category Name (Weight%)
  - **Criterion**: Observable behavior
  - **Criterion**: Observable behavior

  ## Performance Levels
  ### Exceptional (90-100%)
  - [Behavioral indicators]
  ### Strong (75-89%)
  - [Behavioral indicators]
  ### Developing (60-74%)
  - [Behavioral indicators]
```

Rules: **4-6 categories with weights summing to 100%**. Specific observable criteria, not vague "good communication". Clear performance thresholds.

## tools_config — minimal example

```yaml
tools_config:
  tools:
    timer:       { should_register: true, add_to_system_prompt: true }
    whiteboard:  { should_register: true, add_to_system_prompt: false }
    card:        { should_register: true, add_to_system_prompt: true }
    end_session: { should_register: true, add_to_system_prompt: true }
```

- Always enable `end_session` for roleplays with termination rules.
- Full tool catalog (18 tools) + per-tool settings → `architecture-reference.md` §tools.

## mcp_server_ids

Catalog-only — see `integrations-reference.md` §mcp for the 3 valid IDs.

## Handbook routing — read the matching one before authoring

| Scenario intent | Read first |
|---|---|
| Sales / negotiation | `snapshots/handbooks/SalesPatterns.md` |
| Cold call (outbound caller) | `snapshots/handbooks/ColdCallPatterns.md` |
| Coaching / training | `snapshots/handbooks/CoachPatterns.md` |
| Super agent (multi-stage) | `snapshots/handbooks/SuperAgentGuide.md` |
| General writing best-practice | `snapshots/handbooks/ScenarioGuide.md` |
| Field lookup (types, enums, defaults) | `snapshots/handbooks/FieldsReference.md` |
| Example to copy from | `snapshots/handbooks/SampleScenario.md` |
| MCP setup | `snapshots/handbooks/MCPGuide.md` |
| Flash mode (single-file edit) | `snapshots/handbooks/FlashGuide.md` |

Each handbook starts with a TLDR — read it before the full body.

## Validation

The TypeScript validator (`py/jarvis/boxman/claude_box/repo-base/tools/validate.ts`) checks `scenario.yml` against `snapshots/scenario-schema.yml`. **Do not finish until validation passes.**

It catches:

- **Errors** (block merge): invalid enums, wrong types, malformed nested objects (`ai_model_config`, `tools_config`).
- **Warnings** (advisory): `description` field present (deprecated — use `user_friendly_description`); long single-line text field (>200 chars — use `|` block scalar).

Output:

```
✅ Valid (N fields: ...)
❌ Validation failed (N error(s))
  ⚠️  <warning>
```

## Upload (Jarvis CLI)

```bash
uv run jarvis scenario upload <category>/<slug> --yes
```

The Jarvis CLI lives in `tough-tongue-ai/py/jarvis/`. End users running this skill via `voice-ai-quickstart/scenario-manager/ttcli` use the Bash wrapper — same upsert semantics.

## Common improvements checklist

- Structure `ai_instructions` with `##` sections (Role / Approach / Flow / Guidelines).
- Add a "## Interview Approach - CRITICAL" flexibility section.
- Add explicit timing to phases (Opening 2-3 min, Main 8-10 min, Closing 2-3 min).
- Make rubric criteria observable with specific behavioral indicators.
- Add tool usage instructions (timer, whiteboard, card, end_session) where relevant.
- For sales/roleplay: add early-termination rules.
- For long instructions: split into a sibling file and use `$fread@`.

## When NOT to use this reference

- REST API for scenarios (POST `/scenarios` JSON body) → `api-reference.md` §scenarios
- iframe / SIP / meeting bot deployment → `deploy-reference.md`
- Outbound webhooks, custom HTTP tools, MCP catalog → `integrations-reference.md`
- Full tool catalog + per-tool settings + product format primer → `architecture-reference.md`
