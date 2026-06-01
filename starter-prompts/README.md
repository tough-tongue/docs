# Starter Prompts

Copy-paste prompts that generate fully working websites with
[ToughTongue AI](https://app.toughtongueai.com) voice agent integration —
paste directly into [Lovable](https://lovable.dev), [Bolt](https://bolt.new),
[v0](https://v0.dev), or Cursor Agent.

## The idea

Each prompt sequence builds a real, deployable website.
By the end you have a site where users can open a voice AI agent in a widget,
have a live conversation, and see a scored analysis of their session — all
powered by ToughTongue AI.

---

## Available prompts

The checked-in prompts currently focus on a multi-step real-estate marketing
site. Add new one-shot prompts here after their files are committed and tested.

---

## Multi-step sequences

Paste each step in order into the same project session. Each step builds on the last.

### Real estate marketing site

By Step 4 you have a luxury property microsite with a ToughTongue AI voice agent,
remote navigation, and an admin panel.

| Step | File                                   | What gets built                                                             |
| ---- | -------------------------------------- | --------------------------------------------------------------------------- |
| 1    | `real-estate-1-build-site.md`          | Landing page — navbar, hero, sections, footer                               |
| 2    | `real-estate-2-remote-nav.md`          | Slide decks + remote navigation + admin panel                               |
| 3    | `real-estate-3-integrate-tt-agents.md` | Voice agent integration — pick one or all: phone CTA · meeting bot · iframe |
| 4    | `real-estate-4-admin-panel.md`         | Sessions admin panel — scenarios list, last-7-days sessions, score cards    |

---

## How to use

**Multi-step sequence:**
1. Paste Step 1 into a new project — get the base site working.
2. Paste Step 2 in the same chat session — it layers on top.
3. Repeat for each subsequent step.
4. Set `VITE_TTAI_API_KEY` and `VITE_TTAI_SCENARIO_ID` before deploying the final step.

**Get your API key:** [app.toughtongueai.com/developer](https://app.toughtongueai.com/developer?tab=api-keys)
**Create a scenario:** [app.toughtongueai.com/scenario-studio](https://app.toughtongueai.com/scenario-studio)

---

## ToughTongue AI integration pattern

Every prompt that embeds a voice agent uses this same pattern:

```
Embed URL (basic style, recommended):
https://app.toughtongueai.com/embed/basic/<SCENARIO_ID>?background=black&userName=<NAME>

// postMessage event payload:
{ event: "onStop", sessionId: "...", timestamp: 1234567890 }
// Other events: onStart · onTerminated · onSubmit

// Session analysis:
POST https://app.toughtongueai.com/api/public/sessions/analyze
Authorization: Bearer <API_KEY>
{ "session_id": "<id>" }
→ { summary, evaluation: { score, feedback, strengths, improvements }, transcript }
```

Full API reference: [llms-full.txt](https://app.toughtongueai.com/llms-full.txt)

---

## Adding a new prompt

1. Create `<use-case>-<platform>.md` (single-shot) or `<use-case>-<N>-<step>.md` (sequence).
2. Follow the structure of an existing file — research/inspiration block first, then spec.
3. Test: paste into the target platform and verify the generated app works end-to-end.
4. Update the table above.

## Key Files

- `starter-prompts/README.md` — this file
- `llms.txt` — ToughTongue AI platform summary (sourced from `app.toughtongueai.com/llms.txt`)
- `llms-full.txt` — complete API reference, ~1400 lines
- `nextjs-minimal/lib/ttai/client.ts` — reference iframe event handling implementation
