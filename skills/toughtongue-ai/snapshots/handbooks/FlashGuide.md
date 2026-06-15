<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/FlashGuide.md @ 3ee742b3a (2026-06-14T08:12:34-07:00) -->
<!-- Pinned at: 2026-06-14T18:12:31Z -->

# Flash Mode Guide

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Quick, targeted edits to existing scenarios. Read this
instead of the full ScenarioGuide when doing flash-mode edits.

**Key facts:**

- Preserve all existing fields — only change what's requested
- `ai_instructions` must have `##` sections and be 500+ words minimum
- Always validate YAML after editing
- Write messages as a consultant, not a file editor

<!-- END TLDR -------------------------------------------------------------- -->

Compact but complete rules for quick scenario edits.

---

## Golden Rules

1. **Preserve all existing fields** — never null out or remove fields that already have values
2. **Only change what's requested** — don't restructure unrelated sections
3. **Keep ai_instructions structured** — always use `##` section headings
4. **Always use `|` block scalar** for multiline text fields
5. **Validate after every edit** — don't finish until validation passes

---

## Required Fields (Never Leave Empty)

| Field                       | Minimum Requirement                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `name`                      | Descriptive title — not generic ("Sales Coach" bad, "Enterprise SaaS Cold Call Coach" good) |
| `type`                      | `default` or `super` only (others are deprecated)                                           |
| `ai_instructions`           | Structured with `##` sections, 500+ words minimum (see below)                               |
| `user_instructions`         | Pre-session guidance: situation, expectations, tips. 300+ words                             |
| `user_friendly_description` | 1-2 sentence marketing copy — what the user gets from this                                  |
| `rubrik`                    | 4-6 evaluation dimensions with weights summing to 100%                                      |
| `tools_config`              | Enable `end_session` for roleplays, `timer` for timed sessions                              |

---

## Writing ai_instructions

This is the most important field. Even for flash edits, ensure these standards.

### Length Guide

| Scenario Complexity  | Target Length   | Sections                                                      |
| -------------------- | --------------- | ------------------------------------------------------------- |
| Simple coaching      | 500-1000 words  | Role, Flow, Guidelines                                        |
| Interview/assessment | 1000-2500 words | Role, Approach, Flow, Guidelines, Evaluation                  |
| Sales roleplay       | 1500-3000 words | Role, Resistance, Breakthrough, Objections, Flow, Termination |
| Complex multi-phase  | 2500-5000 words | All above + phase-specific instructions                       |

### Minimum Structure (Always Present)

```yaml
ai_instructions: |
  ## Your Role
  You are [specific persona] with [background/expertise].
  Your communication style is [warm/direct/casual/authoritative].
  [1-3 sentences of character depth]

  ## Conversation Flow
  - Opening (2-3 min): [how to start, first question/greeting]
  - Main Phase (8-10 min): [key activities, topics to cover]
  - Closing (2-3 min): [wrap-up approach, final takeaways]

  ## Behavioral Guidelines
  - [Specific interaction pattern — e.g. "Ask one follow-up before moving on"]
  - [Response style — e.g. "Use analogies from the user's industry"]
  - [What to avoid — e.g. "Don't give direct answers, guide discovery"]
```

### What Makes Good vs Bad Instructions

| Good                                                            | Bad                                    |
| --------------------------------------------------------------- | -------------------------------------- |
| "Ask 1-2 follow-up questions before moving topics"              | "Engage deeply with the user"          |
| "You're a 15-year veteran CFO at a mid-size SaaS company"       | "You're an experienced finance person" |
| "Opening (2 min): Greet warmly, ask about their preparation"    | "Start the conversation"               |
| "If they mention X, probe with: how did that impact Y?"         | "Be responsive to their answers"       |
| "Use the card tool to note 3 key strengths during conversation" | "Use tools when appropriate"           |

### Sales Scenarios — Extra Required Sections

```yaml
  ## Resistance Pattern
  - Present ONE objection at a time
  - Give 2-3 follow-ups per objection before moving on
  - Accept solid answers backed by specifics

  ## Core Objections (One at a Time)
  1. [Primary Fear]: "[Realistic quote]"
  2. [Cost/Value]: "[Realistic quote]"
  3. [Proof/Trust]: "[Realistic quote]"

  ## Early Session Termination Rules
  END the call if the seller:
  - Repeats the same point 3+ times without new information
  - Ignores stated concerns
  - Becomes pushy or aggressive
  Say: "[In-character dismissal]" → use end_session tool
```

---

## Writing user_instructions

Follow: **Situation → Expect → Succeed → Tips → Encouragement**

```yaml
user_instructions: |
  You're preparing for [situation] with [role].

  **What you'll practice:**
  - [Skill 1]
  - [Skill 2]

  **How to succeed:**
  1. Opening (2 min): [approach]
  2. Main (8 min): [key actions]
  3. Close (2 min): [wrap-up]

  **Tips:** [2-3 specific strategies]
  **Avoid:** [2-3 common pitfalls]
```

---

## YAML Quick Reference

```yaml
# CORRECT — block scalar for ALL text fields
ai_instructions: |
  ## Your Role
  You are a professional coach...

# WRONG — inline strings break on special characters
ai_instructions: "## Your Role\nYou are..."

# CORRECT — blank lines between sections
rubrik: |
  ## Evaluation Dimensions

  ### 1. Communication (30%)
  - Clear articulation of ideas

# WRONG — no blank lines, wall of text
rubrik: |
  ## Evaluation Dimensions
  ### 1. Communication (30%)
  - Clear articulation of ideas
  ### 2. Problem Solving (30%)
```

---

## Common Flash Mistakes

| Mistake                                             | Fix                                               |
| --------------------------------------------------- | ------------------------------------------------- |
| Nulling out `rubrik` when editing `ai_instructions` | Only touch the field you're changing              |
| Writing ai_instructions as a single paragraph       | Use `##` sections, `-` bullets, line breaks       |
| Vague instructions ("be helpful", "engage well")    | Be specific with actions, timing, examples        |
| Forgetting `end_session` tool for roleplays         | Check tools_config when adding termination rules  |
| Using inline strings for long text                  | Always use `\|` block scalar                      |
| Generic name like "Sales Training"                  | Make it specific: "B2B SaaS Discovery Call Coach" |
| ai_instructions under 300 words                     | Even simple scenarios need 500+ words minimum     |

---

## Communication Style

Messages are shown to users. Write as a consultant, not a file editor:

- **DO**: "Updated the coaching approach to focus more on active listening..."
- **DON'T**: "Modified the ai_instructions field in scenario.yml..."
