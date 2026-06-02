import { NextRequest, NextResponse } from "next/server";
import { commandStore } from "@/lib/command-store";
import {
  commandFromBody,
  isValidSessionId,
  normalizeSessionId,
  validateNavigateCommand,
} from "@/lib/navigation-command";

const ALLOWED_KEYS = new Set(["session_code", "url", "section"]);

/**
 * Called by the ToughTongue AI custom function during a live session.
 * The agent knows `session_code` from {{ session_code }} in ai_instructions,
 * which is injected via the `t_session_code` iframe URL parameter.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json().catch(() => null)) as
    | Record<
      string,
      unknown
    >
    | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "JSON object body is required" },
      { status: 400 },
    );
  }

  const unknownKeys = Object.keys(body).filter((key) => !ALLOWED_KEYS.has(key));
  if (unknownKeys.length > 0) {
    return NextResponse.json(
      { ok: false, error: `Unsupported fields: ${unknownKeys.join(", ")}` },
      { status: 400 },
    );
  }

  const cmd = commandFromBody(body);
  const commandError = validateNavigateCommand(cmd);
  if (commandError) {
    return NextResponse.json({ ok: false, error: commandError }, {
      status: 400,
    });
  }

  const sessionCode = body.session_code;
  if (typeof sessionCode !== "string" || !sessionCode.trim()) {
    return NextResponse.json(
      { ok: false, error: "session_code is required" },
      { status: 400 },
    );
  }

  const sessionId = normalizeSessionId(sessionCode);
  if (!isValidSessionId(sessionId)) {
    return NextResponse.json(
      { ok: false, error: "session_code must be 4 uppercase letters" },
      { status: 400 },
    );
  }

  await commandStore.deliver(sessionId, cmd);

  return NextResponse.json({ ok: true, session: sessionId, dispatched: cmd });
}
