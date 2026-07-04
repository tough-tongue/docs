<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/SuperAgentGuide.md @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:23:07Z -->

# Super Agent Scenarios

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Creating or editing `type: "super"` scenarios with a supervisor
coordinating multiple sub-agents via handoff.

**Key facts:**

- Super agents **must use Landmass models** (enforced by UI and backend)
- One supervisor (stage) + multiple sub-agents (flows)
- Sub-agents inherit the supervisor's voice or run in standby (silent)
- Shared memo system passes context between handoffs
- Sub-agents can hand off to supervisor or directly to another sub-agent

<!-- END TLDR -------------------------------------------------------------- -->

---

## Architecture

```
Supervisor (stage) — Landmass voice model, coordinates sub-agents
├── Sub-Agent A (flow) — inherit (speaks) or standby (silent)
├── Sub-Agent B (flow) — inherit (speaks) or standby (silent)
└── Sub-Agent C (flow) — inherit (speaks) or standby (silent)
```

- The **supervisor** speaks to the user and routes to sub-agents
- Each **sub-agent** has its own instructions, tools, and model mode
- Sub-agents hand back to supervisor or directly to another sub-agent
- A shared **memo system** passes context between handoffs

---

## YAML Structure

```yaml
type: "super"
name: "Sales Pipeline Coach"
user_friendly_description: "Practice the full sales cycle with specialized AI agents."

ai_model_config:
  provider: "Landmass"
  model: "cascade-01"

stages:
  - name: "Sales Pipeline Coach"
    role: "Sales Pipeline Supervisor"
    goal: "Guide the user through a complete sales cycle"
    instructions: |
      You coordinate three sub-agents: discovery, demo, and closing.
      Start with discovery. Move to demo after needs are identified.
      Route to closing when the prospect is ready to discuss terms.
    common_instructions: |
      Always be professional and encouraging.
      When handing off, provide a detailed memo of what happened.
    flows:
      - name: discovery_call
        role: "Discovery Coach"
        goal: "Help user practice identifying prospect needs"
        instructions: |
          You are a discovery call coach. Help the user practice
          identifying prospect needs, pain points, and buying signals.
          Hand off to product_demo when key needs are uncovered.
        tool_ids: [card, timer]

      - name: product_demo
        instructions: |
          You are a product demo coach. Help the user practice
          presenting solutions that address the prospect's needs.
          Hand off to closing when the prospect shows buying intent.
        tool_ids: [whiteboard, card]

      - name: closing
        instructions: |
          You are a closing coach. Help the user practice
          handling final objections, negotiating, and asking for the deal.
        tool_ids: [card, end_session]
```

---

## Key Fields

### Stage (top-level container)

| Field                 | Required | Description                                 |
| --------------------- | -------- | ------------------------------------------- |
| `name`                | yes      | Stage name (use the scenario name)          |
| `role`                | yes      | Supervisor's role description               |
| `goal`                | yes      | Overall goal for the supervisor             |
| `instructions`        | yes      | How the supervisor should coordinate        |
| `common_instructions` | no       | Shared context injected into all sub-agents |
| `flows`               | yes      | List of sub-agent definitions               |

### Flow (each sub-agent)

| Field          | Required | Description                                           |
| -------------- | -------- | ----------------------------------------------------- |
| `name`         | yes      | Lowercase, hyphens/underscores only                   |
| `role`         | no       | Sub-agent's role (shown in LLM prompt)                |
| `goal`         | no       | Sub-agent's goal (shown in LLM prompt)                |
| `instructions` | yes      | What this sub-agent does and when to hand off         |
| `tool_ids`     | no       | Tools available to this sub-agent                     |
| `ai_model`     | no       | Omit to inherit voice, or set standby for silent mode |

### Flow `ai_model` modes

| Mode        | Config                                          | Behavior                           |
| ----------- | ----------------------------------------------- | ---------------------------------- |
| **inherit** | Omit `ai_model` (default)                       | Speaks with the supervisor's voice |
| **standby** | `ai_model: {provider: standby, model: standby}` | Silent — tool calls only           |

> Most sub-agents should **inherit** (omit `ai_model`).
> Use standby only for background workers that should never speak.
>
> Setting `ai_model` to a real model (e.g. `Ocean:medium-stable`) is
> informational only — the sub-agent still shares the supervisor's session.

### Flow naming rules

- Lowercase letters, numbers, hyphens (`-`), underscores (`_`) only
- Good: `discovery_call`, `product-demo`, `objection_handling`
- Bad: `Discovery Call`, `ProductDemo`, `phase 1`

---

## Supervisor Model — CRITICAL

Super agents **must use a Landmass model**. This is enforced by the UI
(`AIModelSelector`) and backend validation.

```yaml
ai_model_config:
  provider: "Landmass"
  model: "cascade-01" # or "medium" or "medium-stable"
```

Available Landmass models for supervisors:

| Model           | Description                           |
| --------------- | ------------------------------------- |
| `cascade-01`    | Highly reliable, separate STT/LLM/TTS |
| `medium`        | Complex interactions (beta)           |
| `medium-stable` | Ocean provider over robust transport  |

> **Never** use Galaxy, Ocean, or standby as the supervisor model.

---

## Standby Sub-Agents

```yaml
flows:
  - name: data_fetcher
    instructions: |
      Fetch the requested data using tools and hand off with results.
    tool_ids: [notepad]
    ai_model:
      provider: "standby"
      model: "standby"
```

Standby sub-agents never speak — TTS output is silenced. They execute
tool calls, then hand off with a detailed memo.

---

## Handoff & Memos

Sub-agents automatically have a `handoff` tool. Don't list it in `tool_ids`.

**Handoff directions:**

- Sub-agent → supervisor (default): `handoff(memo_content="...")`
- Sub-agent → another sub-agent: `handoff(memo_content="...", target_flow="other_agent")`

**Writing good handoff instructions:**

```yaml
instructions: |
  After 3-4 questions, hand off to the supervisor with a memo
  summarizing strengths, areas to probe, and recommended next phase.
```

Memos are plain text — never JSON. They carry context between agents.

---

## Writing Instructions

### Supervisor — focus on routing logic

```yaml
instructions: |
  Coordinate three phases of a mock interview.
  Start with behavioral_interview.
  After 3-4 questions, switch to case_study.
  End with feedback_session to review performance.
```

### Sub-agent — focus on task and handoff trigger

```yaml
instructions: |
  You are a behavioral interview coach. Ask STAR-format questions.
  After 3-4 questions (~8 min), hand off with a memo summarizing
  the candidate's strengths and areas to probe further.
```

### Common instructions — shared personality

```yaml
common_instructions: |
  Be warm and encouraging, but give honest feedback.
  When handing off, tell the user what's coming next.
  Never make abrupt transitions — finish your thought first.
```

---

## Tools

Each sub-agent gets only the tools in its `tool_ids`:

| Tool ID       | Use Case                        |
| ------------- | ------------------------------- |
| `timer`       | Timed phases                    |
| `card`        | Key observations during session |
| `whiteboard`  | Visual diagrams / frameworks    |
| `end_session` | Terminate when complete         |
| `notepad`     | Notes and summaries             |

The `handoff` tool is automatic — never list it.

---

## Common Patterns

| Pattern       | Description                                            |
| ------------- | ------------------------------------------------------ |
| Sequential    | A → B → C. Each completes, then hands to next.         |
| Hub-and-Spoke | Supervisor routes to any sub-agent based on need.      |
| Expert Panel  | Specialized experts the supervisor routes to on topic. |

---

## Checklist

- [ ] `type: "super"` is set
- [ ] `ai_model_config` uses **Landmass** (e.g. `Landmass:cascade-01`)
- [ ] Exactly one stage with `name`, `role`, `goal`, `instructions`
- [ ] At least 2 flows with lowercase `name` and clear `instructions`
- [ ] Sub-agents omit `ai_model` to inherit, or set standby for silent workers
- [ ] Each flow specifies when to hand off
- [ ] `common_instructions` defines shared personality and handoff etiquette
- [ ] `ai_instructions` and `user_instructions` are left empty (supervisor uses stage)
- [ ] `rubrik` still works — evaluation applies to the whole session
