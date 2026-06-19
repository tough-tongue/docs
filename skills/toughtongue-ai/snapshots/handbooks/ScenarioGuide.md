<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/ScenarioGuide.md @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:15:36Z -->

# Scenario Creation Guide

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Creating or substantially improving any scenario. The
primary reference for writing `ai_instructions`, `user_instructions`,
`rubrik`, and `tools_config`.

**Key facts:**

- `ai_instructions` is the most critical field — structure with `##` sections
- Follow `Situation → Expect → Succeed → Tips` for `user_instructions`
- Rubrik needs 4-6 categories with weights summing to 100%
- See `SalesPatterns.md`, `CoachPatterns.md`, `SuperAgentGuide.md` for type-specific guidance

<!-- END TLDR -------------------------------------------------------------- -->

Best practices for ToughTongue AI conversation scenarios.

---

## Core Fields

| Field                       | Purpose                     | Length             |
| --------------------------- | --------------------------- | ------------------ |
| `name`                      | Display title for discovery | Short, descriptive |
| `user_friendly_description` | Marketing copy for users    | 1-2 sentences      |
| `ai_instructions`           | Complete AI behavior guide  | 500-5000+ words    |
| `user_instructions`         | Pre-session user guidance   | 300-1000+ words    |
| `rubrik`                    | Evaluation criteria         | Structured rubric  |

---

## Writing ai_instructions

The most critical field. Structure it clearly:

```yaml
ai_instructions: |
  ## Your Role
  [Detailed persona with background, expertise, communication style]

  ## Interview Approach - CRITICAL
  The frameworks provided are reference examples only, NOT requirements.
  Evaluate on thinking process, not specific answers.

  ## Conversation Flow
  - Opening (2-3 min): [approach]
  - Main Phase (8-10 min): [key activities]
  - Closing (2-3 min): [wrap-up]

  ## Behavioral Guidelines
  - [Specific interaction patterns]
  - [Response style and tone]
  - [Tool usage instructions]
```

### Key Principles

1. **Be Specific**: "Ask follow-up questions about impact" not "engage deeply"
2. **Avoid Scripts**: Don't quote exact phrases — describe intent instead
3. **Progressive Flow**: Structure phases with clear transitions and timing
4. **Tool Integration**: Specify when/how to use timer, whiteboard, cards
5. **Flexibility Section**: Add `## Interview Approach - CRITICAL` — prevents rigid testing
6. **Background Context**: Include character details but mark as "reveal only when asked"

### Scenario-Type Patterns

**Coaching** — guide, don't test. Open-ended discovery of user needs.
**Assessment** — structured evaluation with specific criteria per dimension.
**Roleplay** — realistic persona with resistance patterns and termination rules.
**Sales** — see `SalesPatterns.md` for detailed guidance.
**Super Agent** — multi-sub-agent with supervisor routing. See `SuperAgentGuide.md`.

---

## Writing user_instructions

Follow this formula: **Situation → Expect → Succeed → Tips → Encouragement**

Include:

- Scenario overview and goals
- Question types they'll encounter
- Success strategies and frameworks (with timing breakdown)
- Preparation checklist
- Common pitfalls to avoid ("What Kills the Deal" / "What Scores High")

```yaml
user_instructions: |
  You're preparing for [situation] with an expert [role].

  **What you'll learn:**
  - [Benefit 1]
  - [Benefit 2]

  **How to succeed:**
  ### 1. Opening (2 min): [approach]
  ### 2. Main (8 min): [key actions]
  ### 3. Close (2 min): [wrap-up]

  **Tips:** [specific strategies]
  **Avoid:** [common pitfalls]
```

---

## Writing rubrik

Structure evaluation criteria with weights and observable behaviors:

```yaml
rubrik: |
  ## Evaluation Dimensions

  ### 1. Category Name (Weight%)
  - **Criterion**: Observable behavior description
  - **Criterion**: Observable behavior description

  ## Performance Levels

  ### Exceptional (90-100%)
  - [Specific behavioral indicators]

  ### Strong (75-89%)
  - [Specific behavioral indicators]

  ### Developing (60-74%)
  - [Specific behavioral indicators]
```

Requirements:

- 4-6 evaluation categories with weights summing to 100%
- Specific, observable criteria (not vague "good communication")
- Clear performance thresholds with behavioral indicators

---

## Tools Configuration

```yaml
tools_config:
  tools:
    timer: { should_register: true, add_to_system_prompt: true }
    whiteboard: { should_register: true, add_to_system_prompt: false }
    card: { should_register: true, add_to_system_prompt: true }
    end_session: { should_register: true, add_to_system_prompt: true }
```

- **timer**: For timed sessions (interviews, pitches)
- **whiteboard**: For visual scenarios (architecture, diagrams)
- **card**: For noting key points during conversation
- **end_session**: ALWAYS enable for roleplays with termination rules

---

## Guiding Values

- **Empower** users to show their best
- **Guide** without prescribing specific answers
- **Evaluate** thinking process over correctness
- **Create** realistic, relevant situations

When in doubt: flexibility, clarity, kindness.
