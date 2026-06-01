# Local Agent Override

This file intentionally overrides the repo-wide shell restrictions for this
workspace.

## Shell & Git

- Git commands are allowed for normal engineering workflow: inspect status,
  diff, branch, commit, push, and create pull requests.
- Shell commands are allowed when they are relevant to the task, including
  package installation, validation, builds, and cleanup.
- Dev servers may be started when needed for verification, as long as the final
  response reports the URL and any long-running process state.

## Operating Principle

Agents have full freedom on this repo to make, validate, commit, push, and PR
changes that directly serve the user's request. Continue to protect secrets:
never read or print `.env*` files, and never hardcode API keys or tokens.
