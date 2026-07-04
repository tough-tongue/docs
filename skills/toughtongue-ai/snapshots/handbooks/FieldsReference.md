<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/FieldsReference.md @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:23:07Z -->

# Scenario Fields Reference

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Looking up field names, types, defaults, or valid values.
The canonical reference for every ScenarioEssence field.

**Key facts:**

- Only `default` and `super` scenario types are supported
- Super agents require `Landmass` provider (see `SuperAgentGuide.md`)
- Default model is `Galaxy:medium`; standby is a sub-agent mode only
- Use `|` block scalar for all multiline text fields

<!-- END TLDR -------------------------------------------------------------- -->

Complete reference for all ScenarioEssence fields.

---

## Basic Fields

| Field                       | Type   | Description                                 |
| --------------------------- | ------ | ------------------------------------------- |
| `name`                      | string | Display title for scenario lists and search |
| `user_friendly_description` | string | Marketing copy for users (1-2 sentences)    |

> Use `ai_instructions` to define the AI's role and behavior instead.

---

## Main Fields

| Field               | Type   | Description                               |
| ------------------- | ------ | ----------------------------------------- |
| `type`              | enum   | `default` or `super` (others deprecated)  |
| `ai_instructions`   | string | Core system prompt (500-5000+ words)      |
| `user_instructions` | string | Pre-session user guide (300-1000+ words)  |
| `pdf_context`       | string | Cleaned content from uploaded documents   |
| `rubrik`            | string | Evaluation criteria and scoring framework |

### type Values

- `default` — Standard conversational scenarios (most common)
- `super` — Multi-stage with supervisor + sub-agents (see `SuperAgentGuide.md`)

> Other types (`quiz`, `coding`, `composite`) are deprecated or internal-only.
> Only use `default` or `super`.

---

## Configuration

### ai_model_config

```yaml
ai_model_config:
  provider: "Galaxy" # Ocean | Galaxy | Landmass
  model: "medium" # medium, medium-stable, medium-nc, medium-stable-nc, cascade-01
```

Valid provider/model combinations:

| Provider   | Model              | Description                                         |
| ---------- | ------------------ | --------------------------------------------------- |
| `Galaxy`   | `medium`           | Default — best for emotional expression             |
| `Galaxy`   | `medium-stable`    | Stable Galaxy (Vertex)                              |
| `Galaxy`   | `medium-nc`        | Galaxy with noise cancellation                      |
| `Galaxy`   | `medium-stable-nc` | Stable Galaxy with noise cancellation               |
| `Ocean`    | `medium-stable`    | OpenAI GPT Realtime — optimized for phone/artifacts |
| `Landmass` | `medium`           | Complex interactions (beta)                         |
| `Landmass` | `cascade-01`       | Highly reliable, lower latency tradeoff             |
| `Landmass` | `medium-stable`    | Ocean over robust transport                         |

> **Super agents** (`type: "super"`) must use `Landmass` provider — Galaxy and Ocean are not allowed.
> **Never use** `demo` or `super` models — these are internal/reserved and must not be set on scenarios.
> **Standby** is a sub-agent mode, not a top-level model — see `SuperAgentGuide.md`.

### strategy

```yaml
strategy:
  disable_transcription: false
  conductor:
    enabled: false
```

### appearance

```yaml
appearance:
  voice: "Aoede" # Aoede, Charon, Fenrir, Kore, Puck
  language_code: "en-US"
  avatar_url: null
```

---

## Super Agent Fields

Only relevant when `type: "super"`. See `SuperAgentGuide.md` for full guide.

### stages

```yaml
stages:
  - name: "My Supervisor"
    role: "Coordinator"
    goal: "Route to specialized sub-agents"
    instructions: |
      Coordinate sub-agents based on user needs.
    common_instructions: |
      Shared personality and handoff rules.
    flows:
      - name: sub_agent_one
        instructions: |
          What this sub-agent does and when to hand off.
        tool_ids: [card, timer]
```

> Sub-agents **inherit** the supervisor's voice by default (omit `ai_model`).
> Set `ai_model: {provider: standby, model: standby}` for silent tool-only workers.

| Stage Field           | Type   | Description                         |
| --------------------- | ------ | ----------------------------------- |
| `name`                | string | Stage name                          |
| `role`                | string | Supervisor role                     |
| `goal`                | string | Supervisor goal                     |
| `instructions`        | string | Routing instructions for supervisor |
| `common_instructions` | string | Shared context for all sub-agents   |
| `flows`               | list   | Sub-agent definitions               |

| Flow Field     | Type   | Description                                      |
| -------------- | ------ | ------------------------------------------------ |
| `name`         | string | Lowercase identifier (`a-z`, `0-9`, `-_`)        |
| `role`         | string | Sub-agent's role (shown in LLM prompt, optional) |
| `goal`         | string | Sub-agent's goal (shown in LLM prompt, optional) |
| `instructions` | string | Sub-agent behavior and handoff rules             |
| `tool_ids`     | list   | Available tools (e.g., `[card, timer]`)          |
| `ai_model`     | object | Omit to inherit voice; set `standby` for silent  |

---

## Advanced Settings

### memory

```yaml
memory:
  is_memory: true # Enable cross-session memory
```

### tools_config

Available tools: `timer`, `whiteboard`, `card`, `mcq`, `mermaid`, `pdf_upload`,
`memory_search`, `knowledge_base_search`, `end_session`, `notepad`, `google_slides`,
`image_generation`, `emoji_reaction`, `slide_generation`, `collect_data`, `cold_transfer`

```yaml
tools_config:
  tools:
    timer:
      should_register: true # Make available to AI
      add_to_system_prompt: true # Include in initial instructions
```

### session_analysis

```yaml
session_analysis:
  is_auto_analysis: false # Auto-generate analysis
  is_auto_submit: false # Auto-submit to admins
```

### mcp_server_ids

Attach external MCP tool servers to the scenario. See `MCPGuide.md` for full details.

```yaml
mcp_server_ids:
  - "catalog:deepwiki"
  - "catalog:context7"
```

**Allowed values (exhaustive list):**

| Value              | Server                                    | Auth    |
| ------------------ | ----------------------------------------- | ------- |
| `catalog:deepwiki` | DeepWiki — docs for public GitHub repos   | none    |
| `catalog:github`   | GitHub Copilot MCP — repos, issues, PRs   | headers |
| `catalog:context7` | Context7 — library docs and code examples | none    |

> **Only use values from this table.** Never invent IDs or use `custom:` prefix.
> MCP tools execute on Ocean and Landmass/LiveKit today. See `MCPGuide.md` for compatibility.

---

## Access Control

| Field               | Type   | Default   | Description                              |
| ------------------- | ------ | --------- | ---------------------------------------- |
| `is_public`         | bool   | true      | Visible in public listings               |
| `is_recording`      | bool   | false     | Auto-start recording                     |
| `analysis_access`   | enum   | "default" | Session report visibility: `default`, `always`, `never` |

---

## Monetization

```yaml
pricing:
  enabled: false
  amount: 0
  currency: "USD"
```

---

## Defaults

When creating scenarios, these are sensible defaults:

```yaml
type: "default"
is_public: true
is_recording: false
memory:
  is_memory: false
appearance:
  voice: "Aoede"
  language_code: "en-US"
ai_model_config:
  provider: "Galaxy"
  model: "medium"
```

## Important Guidelines

- Only populate fields that are relevant — use `null` for optional fields
- Only change access control and monetization when explicitly requested
- Default to public, free scenarios unless otherwise specified
- For sales scenarios, always enable `end_session` tool
- Avoid quoting exact phrases for AI to say — provide behavioral guidance instead
