import { NextRequest, NextResponse } from "next/server";
import { analyzeSession, ToughTongueError, type AnalyzeSessionRequest } from "../../ttai/client";

export async function POST(request: NextRequest) {
  try {
    const body: AnalyzeSessionRequest = await request.json();

    if (!body.session_id) {
      return NextResponse.json({ error: "session_id is required" }, { status: 400 });
    }

    const analysis = await analyzeSession(body);
    return NextResponse.json(analysis);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
