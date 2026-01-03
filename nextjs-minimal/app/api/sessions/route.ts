import { NextRequest, NextResponse } from "next/server";
import { listSessions, ToughTongueError } from "../ttai/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const scenario_id = searchParams.get("scenario_id") || undefined;
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const response = await listSessions({ scenario_id, limit });
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
