/**
 * Navigation command validation.
 *
 * Sections:
 * - Types
 * - Validators
 */

// ------------------------------------------------------------------------------
// Types
// ------------------------------------------------------------------------------
export interface NavigateCommand {
  url?: string;
  section?: string;
}

// ------------------------------------------------------------------------------
// Validators
// ------------------------------------------------------------------------------
export const SESSION_CODE_RE = /^[A-Z]{4}$/;

export function normalizeSessionId(value: string): string {
  return value.trim().toUpperCase();
}

export function isValidSessionId(value: string): boolean {
  return SESSION_CODE_RE.test(normalizeSessionId(value));
}

export function commandFromBody(
  body: Record<string, unknown>,
): NavigateCommand {
  const cmd: NavigateCommand = {};
  if (typeof body.url === "string" && body.url.trim()) {
    cmd.url = body.url.trim();
  }
  if (typeof body.section === "string" && body.section.trim()) {
    cmd.section = body.section.trim();
  }
  return cmd;
}

export function validateNavigateCommand(cmd: NavigateCommand): string | null {
  if (!cmd.url && !cmd.section) {
    return "Provide at least one of: url, section";
  }
  if (cmd.url && (!cmd.url.startsWith("/") || cmd.url.startsWith("//"))) {
    return "url must be an internal route path";
  }
  if (cmd.section && !/^#[A-Za-z][A-Za-z0-9_-]*$/.test(cmd.section)) {
    return "section must be a CSS anchor like #intro";
  }
  return null;
}
