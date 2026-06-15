<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/CoachPatterns.md @ 3ee742b3a (2026-06-14T08:12:34-07:00) -->
<!-- Pinned at: 2026-06-14T18:12:31Z -->

# Coach Scenario Patterns

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Creating or improving coach/training scenarios where the
AI teaches skills through interactive exercises (not roleplay).

**Key facts:**

- Three patterns: A (Situation-First), B (Teach-First), C (Reflective)
- Every scenario needs SESSION FLOW (steps with tool names) + CONTENT (topics)
- ONE visual tool per scenario: `card`, `image_generation`, or `slide_generation`
- Always: visual before MCQ, "Why did you choose this?" before reveal
- Coach scenarios are about *knowing what to do*; roleplays are about *doing it*

<!-- END TLDR -------------------------------------------------------------- -->

Rules and patterns for creating AI coach (teaching/training) scenarios.

---

## Coach vs Roleplay

| Format | Use When | AI Role |
|--------|----------|---------|
| **Coach** | Skill = *knowing what to do*. Teaching knowledge, frameworks, decision-making. | AI is the trainer/mentor |
| **Roleplay** | Skill = *the conversation itself*. Practice talking to a real person. | AI plays a character |

---

## The Three Patterns

Pick ONE pattern based on what you're teaching.

| Pattern | Name | Use When | Flow |
|---------|------|----------|------|
| **A** | Situation-First | Handling specific situations: sales objections, customer interactions, floor scenarios | Greet → Present Situation → MCQ → Discuss → Practice Pitch → Teach → Next |
| **B** | Teach-First | Concepts/frameworks to learn BEFORE applying. Structured knowledge transfer. | Greet → Teach Concept → MCQ → Discuss → Present Situation → Practice → Next Topic |
| **C** | Reflective | Internal skills: awareness, regulation, listening, identity. No "right answer." | Greet + Warm-Up Q → Present Scenario → MCQ → Deep Discussion → Teach Framework → Reflect → Next |

---

## Two-Part `ai_instructions` Structure - CRITICAL

Every coach scenario needs both parts:

| Part | Purpose | What to Write |
|------|---------|---------------|
| **SESSION FLOW** | Step order the AI follows | Numbered steps (`### 1. 2. 3.`). Each step names the **tool** and **action**: "Use the card tool to…", "Use MCQ tool with 4 options…" |
| **CONTENT** | Topics/scenarios the AI uses | Separate section: `## THE N SCENARIOS` or `## TEACHING CONTENT` — one block per topic with card text, MCQ options, discussion points, ideal responses |

The flow says *when* to use which tool. The content says *what* to show. Both are required.

---

## One-Visual-Tool Rule

Every scenario uses exactly **ONE** visual presentation tool. Disable unused ones in `tools_config`.

| Visual Tool | Default For | Best At |
|-------------|-------------|---------|
| `card` | Pattern A, Pattern B | Situations, objections, concept cards, quick-reference |
| `image_generation` | Pattern A (retail/visual) | Painting a scene — makes the situation feel real |
| `slide_generation` | Pattern C | Framework teaching, side-by-side models, reflective scenarios |

Interaction tools (`emoji_reaction`, `mcq`, `memory_search`, `end_session`) should always be registered for coach scenarios.

---

## Mandatory Rules

1. **Numbered SESSION FLOW with tool names in every step** — AI does not infer tools; it follows explicit instructions.
2. **Visual before MCQ** — Trainee sees something first (concept, situation, scene) via the chosen visual tool before any MCQ.
3. **MCQ after every visual** — 3-4 options to check understanding. Never go visual → discussion without MCQ.
4. **"Why did you choose this?" before reveal** — Probe reasoning, then explain the principle.
5. **End with summary + `end_session`** — Brief summary card, then `end_session` tool.

---

## Pattern A: Situation-First

Session: 10-15 min. 4-8 case studies, pick 3-4 randomly. Visual: `card` (default) or `image_generation` (retail).

```
### 1. Greeting (1 min) — Set expectation, pick ONE scenario randomly
### 2. Present Situation (1 min) — Use card tool to show situation
### 3. MCQ (2-3 min) — 3-4 options (poor → excellent), emoji_reaction
### 4. Discuss (2-4 min) — "Why?" before reveal, probe follow-ups
### 5. Practice Pitch (3-5 min) ⭐ — Trainee speaks, coach plays customer, repeat until natural
### 6. Teach (1-3 min) — Ideal script, good vs improve
### 7. Next or Wrap — After 3-4 scenarios, end_session
```

**Case study template:**
```yaml
### Scenario N: "[Objection / Title]"
- **Customer**: Name, age, profile
- **Context**: Plan discussed, price quoted, situation
- **Objection**: Exact words (natural language)
- **Root cause**: Why they're really saying this
- **Nuanced discussion points**: Point 1, Point 2, Point 3
- **Best script**: "[Full ideal response]"
- **Common mistakes**: Arguing, defensive, no next step
```

Rubric weights: MCQ 15% | Reasoning 20% | Pitch Practice 35-40% | Feedback Absorption 15-25%

---

## Pattern B: Teach-First

Session: 15-20 min. 4-5 topics in logical sequence (not random). Visual: `card`.

```
### 1. Greeting (1 min) — Set frame: "Aaj hum X seekhenge step by step"
### 2. Teach Concept (2-3 min) — card tool with concept (table/bullets/timeline)
### 3. MCQ (2 min) — Test concept grasp (not situation yet)
### 4. Discuss (1-2 min) — "Why?" before reveal, explain reasoning
### 5. Apply — Situation (2-3 min) — card tool with realistic scenario, coach response
### 6. Next Topic — Repeat steps 2-5
### 7. Final Practice Round (3-5 min) ⭐ — Apply ALL topics in one exercise
### 8. Wrap-Up — Summary card, end_session
```

**Topic template:**
```yaml
### Topic N: [Name]
- **Concept Card**: [format, key data to show]
- **Key Teaching Points**: [2-3 things to explain verbally]
- **MCQ**: [what to test, correct principle, common mistake]
- **Situation**: [realistic scenario to apply concept]
- **Ideal response**: [what a good answer covers]
```

Rubric weights: Practice Execution 30% | Concept Understanding 25% | Situation Handling 25% | Feedback Absorption 20%

---

## Pattern C: Reflective

Session: 10-15 min. 2-3 deeper scenarios (not 4-8 quick ones). Visual: `slide_generation`.

```
### 1. Greeting + Warm-Up Q (2 min) — Reflective question setting introspective tone
### 2. Present Scenario (1 min) — slide_generation with power dynamics, emotional stakes
### 3. MCQ (2-3 min) — Reactive/compliant to authentic/regulated (no obvious "right answer")
### 4. Deep Discussion (4-6 min) — 3-4 questions exploring patterns, introduce framework via questions
### 5. Teach Framework (3-5 min) — slide_generation for visual, evidence not motivation
### 6. Wrap-Up + Transfer Task (1-2 min) — "This week, try X in one conversation", end_session
```

Rubric weights: MCQ ~33% | Reasoning & Self-Reflection ~33% | Absorbing Better Practices ~33%

---

## ai_instructions Structure (Coach)

Full Pattern A example — adapt the SESSION FLOW section for Pattern B or C.

```yaml
ai_instructions: |
  ## YOUR ROLE & CHARACTER
  - You are Coach [Name], experienced [domain] trainer. Warm, encouraging.
  - Use INDIAN ENGLISH with Hindi mixed naturally. Use card tool and MCQ tool during session.

  ## KEY PRODUCT KNOWLEDGE
  - [Plans, pricing, USPs — bullet points the coach must know]

  ## SESSION FLOW

  ### 1. Greeting & Context (1 min)
  - Greet {{first_name}} warmly. Say: "Aaj hum real [objection/situation] practice karenge."
  - Randomly pick ONE scenario from the list below and start.

  ### 2. Present Situation (1 min per scenario)
  - Set context: customer name, what they said, their tone.
  - Use card tool to write down the situation for easy reference.

  ### 3. MCQ Question (2-3 min)
  - Use MCQ tool with 4 response options (poor → excellent).
  - Wait for their answer. Use emoji_reaction to react.

  ### 4. Explore Reasoning (2-3 min)
  - Ask: "Kyun aapne yeh approach choose kiya?"
  - Probe: What could go wrong? What's the customer feeling?
  - Use emoji_reaction to encourage.

  ### 5. PRACTICE PITCH (3-4 min) ⭐
  - Say: "Ab aap mujhe batao — main customer hoon. Aap exactly kya bolenge? Pitch karo!"
  - Play the customer. Give real-time feedback. Make them repeat until natural.

  ### 6. Teach Best Approach (1-2 min)
  - Share the ideal script. What they did well + what to improve.

  ### 7. Next or Wrap (30 sec)
  - After 3-4 scenarios, offer to wrap. Use end_session when done.

  ---

  ## THE 6 SCENARIOS (Pick one randomly per round)

  ### Scenario 1: "[Objection quote]"
  - **Customer**: Name, age, profile.
  - **Context**: Plan discussed, price quoted.
  - **Objection**: Exact words they said.
  - **Root cause**: Why they're really saying this.
  - **Nuanced discussion points:** Why X fails, the reframe, the bridge, the close.
  - **Best script**: "Bilkul samajh sakta hoon... [full ideal response]"
  - **Common mistakes**: Arguing, defensive, no next step.
  ### Scenario 2: ...
  ### Scenario 3: ...
```

For **Pattern B**, replace SESSION FLOW steps 2-6 with: Teach Concept → MCQ → Discuss → Apply Situation → Next Topic → Final Practice Round. Replace `THE N SCENARIOS` with `TEACHING CONTENT` (one block per topic).

For **Pattern C**, replace with: Warm-Up Q → Present Scenario → MCQ → Deep Discussion → Teach Framework → Transfer Task. Use `slide_generation` instead of `card`.

## user_instructions Structure (Coach)

```yaml
user_instructions: |
  **Your Goal:** [What trainee will learn/practice]
  ## Session Overview
  - [Duration, number of topics, what to expect]

  ## How to Get the Most Out of This
  - Think before answering MCQs — your reasoning matters more than being "right"
  - During practice: speak naturally, don't read a script
  - Ask questions when something isn't clear

  ## What Scores High Points
  ## What Loses Points
```

---

## Anti-Patterns

| Anti-Pattern | Instead |
|-------------|---------|
| Combining card + image + slide in one step | Pick ONE visual tool; disable the rest |
| No practice step (A) or practice round (B) | Always include verbal practice |
| Teaching situation before concept (Pattern B) | Concept → MCQ → THEN situation |
| Vague scenarios ("A customer objects") | Full persona: name, age, exact words |
| Exact card text in instructions | Give guidance: topic, format, key points |
| `slide_generation` for Pattern A | Use `card` for situations |
| `card` for framework teaching in C | Use `slide_generation` for deep frameworks |
| Skipping "Why?" after MCQ | Always probe reasoning before revealing |

---

## Quick Checklist

**All Patterns:**
- [ ] One of the 3 patterns chosen and followed
- [ ] ONE visual tool chosen; unused visual tools disabled in `tools_config`
- [ ] `emoji_reaction` used throughout
- [ ] MCQ followed by "Why?" discussion
- [ ] Summary + `end_session` at end

**A (Situation-First):** 4-8 case studies with full detail, ⭐ practice pitch step, visual: `card` or `image_generation`
**B (Teach-First):** Topics in logical sequence, concept before situation, final combined practice round, visual: `card`
**C (Reflective):** Warm-up question, `slide_generation`, transfer task at end, 2-3 deeper scenarios
