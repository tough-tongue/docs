import { NextRequest, NextResponse } from "next/server";
import { commandStore } from "@/lib/command-store";
import { requireAdmin } from "@/lib/admin-auth";
import {
  commandFromBody,
  isValidSessionId,
  normalizeSessionId,
  validateNavigateCommand,
} from "@/lib/navigation-command";

interface Params {
  sessionId: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { sessionId } = await params;
  const targetSession = normalizeSessionId(sessionId);
  if (!isValidSessionId(targetSession)) {
    return NextResponse.json(
      { ok: false, error: "sessionId must be 4 uppercase letters" },
      { status: 400 },
    );
  }

  const body = (await req.json().catch(() => null)) as
    | Record<string, unknown>
    | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "JSON object body is required" },
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

  await commandStore.deliver(targetSession, cmd, "admin");
  return NextResponse.json({ ok: true });
}
