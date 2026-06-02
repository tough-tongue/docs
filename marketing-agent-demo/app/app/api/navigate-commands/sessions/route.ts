import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { commandStore } from "@/lib/command-store";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAdmin(req);
  if (auth) return auth;

  return NextResponse.json({ sessions: await commandStore.snapshot() });
}
