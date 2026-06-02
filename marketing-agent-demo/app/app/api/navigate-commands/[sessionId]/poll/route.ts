import { NextRequest, NextResponse } from "next/server";
import { commandStore } from "@/lib/command-store";
import { isValidSessionId, normalizeSessionId } from "@/lib/navigation-command";

// Keep below common proxy timeout edges. The client immediately re-polls.
export const maxDuration = 30;

interface Params {
  sessionId: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const { sessionId } = await params;
  const targetSession = normalizeSessionId(sessionId);
  if (!isValidSessionId(targetSession)) {
    return NextResponse.json(
      { ok: false, error: "sessionId must be 4 uppercase letters" },
      { status: 400 },
    );
  }

  const cmd = await commandStore.poll(targetSession);

  if (!cmd) {
    return NextResponse.json({ timeout: true });
  }
  return NextResponse.json(cmd);
}
