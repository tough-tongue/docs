import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ttaiError, ttaiGet, ttaiPost } from "../../client";

interface Params {
  scenarioId: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const auth = requireAdmin(_req);
  if (auth) return auth;

  const { scenarioId } = await params;
  try {
    const data = await ttaiGet(`/scenarios/${scenarioId}`);
    return NextResponse.json(data);
  } catch (err) {
    return ttaiError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> },
): Promise<NextResponse> {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { scenarioId } = await params;
  const { ai_instructions } = (await req.json()) as {
    ai_instructions: string;
  };

  if (typeof ai_instructions !== "string" || !ai_instructions.trim()) {
    return NextResponse.json(
      { error: "ai_instructions is required" },
      { status: 400 },
    );
  }

  try {
    // TTAI partial update: POST /scenarios with id + fields to change
    const data = await ttaiPost("/scenarios", {
      id: scenarioId,
      ai_instructions,
    });
    return NextResponse.json(data);
  } catch (err) {
    return ttaiError(err);
  }
}
