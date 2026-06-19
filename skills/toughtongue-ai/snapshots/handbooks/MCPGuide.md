<!-- Pinned snapshot. Do not edit by hand. Regenerate with scripts/sync-sources.sh. -->
<!-- Source: tough-tongue-ai/py/jarvis/boxman/claude_box/repo-base/handbooks/MCPGuide.md @ 0c17abd29 (2026-06-19T09:08:28-07:00) -->
<!-- Pinned at: 2026-06-19T16:15:36Z -->

# MCP Integrations Guide

<!-- TLDR ------------------------------------------------------------------ -->

## TLDR

**When to use:** Setting up MCP (Model Context Protocol) tool servers on a scenario.

**Key facts:**

- MCP tools work on **Ocean** and **Landmass/LiveKit** sessions today
- IDs must be `catalog:<id>` — only use IDs from the catalog below
- Do NOT invent custom IDs — there is no `custom:` support yet
- No-auth servers work immediately; `headers`-auth servers need user API keys
- Setting `mcp_server_ids` on Galaxy is allowed (for future use) but tools won't execute there yet

<!-- END TLDR -------------------------------------------------------------- -->

## What is MCP?

MCP (Model Context Protocol) lets the AI call external tool servers during a
session — search docs, read repos, query APIs. The servers are registered on
the scenario; auth is resolved per-user at session start.

## Catalog — Available Servers

Only these curated servers are available. **Do not use any other IDs.**

| ID       | `mcp_server_ids` value | Auth    | Tools                                                 |
| -------- | ---------------------- | ------- | ----------------------------------------------------- |
| DeepWiki | `catalog:deepwiki`     | none    | read_wiki_structure, read_wiki_contents, ask_question |
| GitHub   | `catalog:github`       | headers | repos, issues, PRs, code search                       |
| Context7 | `catalog:context7`     | none    | resolve-library-id, query-docs                        |

## YAML Format

```yaml
mcp_server_ids:
  - "catalog:deepwiki"
  - "catalog:context7"
```

- Each entry is a string starting with `catalog:`
- Only use the exact IDs from the table above
- Order does not matter
- Set to `null` or omit entirely to disable MCP

## When to Attach MCP Servers

| Scenario type                                | Recommended servers                    |
| -------------------------------------------- | -------------------------------------- |
| Technical interviews (coding, system design) | `catalog:github`, `catalog:context7`   |
| Research / learning scenarios                | `catalog:deepwiki`, `catalog:context7` |
| General coaching / sales                     | Usually none needed                    |

## Model Compatibility

MCP tools execute server-side in the active realtime provider:

| Provider | MCP support |
| --- | --- |
| **Ocean** | Yes — OpenAI native MCP tools in `session.update` |
| **Landmass** | Yes — LiveKit worker `MCPToolset` tools |
| **Galaxy** | Not yet — planned |

If the user asks to add MCP servers on a Galaxy scenario, add them (they'll
persist) but mention that tools activate only after switching to Ocean or Landmass.

## Auth Modes

- **none** — Server is public, no secrets needed (DeepWiki, Context7)
- **headers** — Requires user-provided API keys stored in Settings → Account → API Keys

For `headers` servers (e.g. GitHub), users must store the required key
(`GITHUB_PERSONAL_ACCESS_TOKEN`) before starting a session. If missing,
the session will prompt them at connect time.

## Rules

1. **Never invent IDs** — only `catalog:deepwiki`, `catalog:github`, `catalog:context7`
2. **Never use `custom:` prefix** — not shipped yet
3. **Keep existing MCP servers** unless the user asks to remove them
4. **Don't change `mcp_server_ids` silently** — only when the user asks or the scenario clearly benefits
