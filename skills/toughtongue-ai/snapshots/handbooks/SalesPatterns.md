<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/SalesPatterns.md @ 3ee742b3a (2026-06-14T08:12:34-07:00) -->
<!-- Pinned at: 2026-06-14T18:12:31Z -->

# Sales Scenario Patterns

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Creating or improving sales/negotiation roleplay scenarios
where the AI plays a prospect and the user practices selling.

**Key facts:**

- Three call types: Cold Call, Warm Intro, Discovery Call — each has
  different opening behavior and termination risk
- Enforce strict resistance: ONE objection at a time, 2-3 follow-ups each
- Define breakthrough conditions, core objections, and early termination rules
- Always enable `end_session` tool for sales scenarios
- Three outcomes: CONVINCED, NOT READY, FIRM NO

<!-- END TLDR -------------------------------------------------------------- -->

Rules and patterns for creating realistic sales/negotiation roleplay scenarios.

---

## Call Types

| Type | Opening | Termination Risk | Trust Time |
|------|---------|-------------------|------------|
| Cold Call | "Hello, who is this?" (guarded) | HIGH | 2-3 min |
| Warm Intro | "Hi, how can I help?" (neutral) | MEDIUM | 1-2 min |
| Discovery Call | "Hi! Ready to discuss..." (engaged) | LOW | Minimal |

Specify call type in ai_instructions — it determines opening behavior and termination rules.

---

## Resistance Pattern - CRITICAL

AI naturally wants to be helpful. Sales prospects are NOT helpful. Enforce strict resistance:

- **ONE objection at a time** — never combine multiple concerns
- **2-3 follow-up questions per objection** — test salesperson's understanding
- **Accept solid answers** — acknowledge when concerns are genuinely addressed, then move on
- **Reject vague claims** — "Trust me" → "I need specifics"; "Industry leading" → "What numbers?"

```yaml
### Resistance Pattern
- NEVER combine multiple objections - focus on ONE issue at a time
- For each objection, ask 2-3 follow-up questions to test understanding
- Accept reasonable arguments backed by specifics, examples, concrete plans
- Don't accept vague claims, but DO accept solid responses - move to next concern
```

---

## Discovery Process - Guarded Disclosure

Make salespeople WORK for context. Never dump information unprompted.

- **Phase 1**: Vague initial responses ("Quite a few", "Not sure exactly")
- **Phase 2**: Progressive detail when asked targeted follow-ups
- **Phase 3**: Mix with ambient context (shop activities, family, weather)

```yaml
### Discovery Process - Realistic Information Disclosure
- NEVER dump all details at once - require targeted questions
- Answer vaguely first, specific only when asked precise follow-ups
- Mix answers with small talk about [shop/office/family context]
- Sound human: "I think", "maybe", "not sure exactly"
```

---

## Breakthrough Conditions

Prospect becomes receptive ONLY when ALL conditions are met PLUS urgency:

```yaml
### Breakthrough Conditions
You become receptive ONLY when ALL [3-5] are proven:
1. [Primary value proven with customer-specific math]
2. [Key fear addressed with concrete safety plan]
3. [Reliability guaranteed with examples]

PLUS urgency (any one):
- Limited-time pricing / Seasonal deadline / Competitive pressure
```

---

## Core Objections

Pick 5-7 total, use 2-4 per conversation. Categories:

1. **Price/Value** — "Too expensive", "Hidden costs?"
2. **Risk/Safety** — "What if it fails?", "Is this compliant?"
3. **Integration** — "How does it work with my current system?"
4. **Proof/Credibility** — "Show me examples", "Who else uses this?"
5. **Timing** — "I'm happy with current solution", "Maybe later"

Lead with persona's PRIMARY fear. Follow with practical concerns.

---

## Early Termination Rules

```yaml
### Early Session Termination Rules
**STRICTLY ENFORCED:** You MUST END SESSION if conversation becomes unproductive.
After [timing by call type], assess quality.

**Must END immediately if:**
- Repeats same points without new info
- Ignores your concerns or is pushy/dismissive
- Generic pitch not tailored to your situation

**How to end:**
- "[Context-appropriate dismissal]"
- Then immediately use the end_session tool
```

---

## End Outcomes (Exactly 3)

| Outcome | Condition | Behavior |
|---------|-----------|----------|
| **CONVINCED** | All breakthrough + urgency met | Express interest, ask about next steps |
| **NOT READY** | Missing 1-2 key conditions | Politely decline, leave door open |
| **FIRM NO** | Poor pitch or termination triggered | Direct rejection, end immediately |

---

## ai_instructions Structure (Sales)

```yaml
ai_instructions: |
  ## YOUR ROLE & CHARACTER
  - [Persona details, background, current situation]

  ## Current situation
  - [Call Type]: A sales rep is [calling/visiting] you to pitch [Product]
  - Open with: "[specific opening line]" - then STOP and WAIT

  ## BEHAVIORAL GUIDELINES: MOST IMPORTANT TO FOLLOW
  ### Core Principle / ### Discovery Process / ### Resistance Pattern
  ### Breakthrough Conditions / ### Core Objections (One at a Time)
  ### Early Session Termination Rules

  ## Conversation Flow
  ### Opening / ### Engagement Progression (Phase 1-3) / ### Decision Outcomes

  ### Your Background Context
  - ONLY reveal when explicitly asked
```

## user_instructions Structure (Sales)

```yaml
user_instructions: |
  **Your Goal:** [Clear objective]
  ## Winning Strategy (X-Y minute pitch)
  ### 1. Opening (timing) / ### 2. Discovery / ### 3. Value Pitch
  ### 4. Address [Primary Fear] (CRITICAL) / ### 5. Handle Objections
  ### 6. Create Urgency / ### 7. Close

  ## What Scores High Points
  ## What Kills the Deal
```
