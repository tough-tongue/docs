import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { ttaiError, ttaiGet } from "../client";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAdmin(req);
  if (auth) return auth;

  const { searchParams } = req.nextUrl;
  const params: Record<string, string> = {
    limit: searchParams.get("limit") || "25",
  };
  const scenarioId = searchParams.get("scenario_id");
  if (scenarioId) params.scenario_id = scenarioId;

  try {
    const data = await ttaiGet("/sessions", params);
    return NextResponse.json(data);
  } catch (err) {
    return ttaiError(err);
  }
}
