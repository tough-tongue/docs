import { NextResponse } from "next/server";
import { analyzeSession, ToughTongueError, type AnalyzeSessionRequest } from "@/lib/toughtongue";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    if (!body.session_id) {
      return NextResponse.json(
        { error: "session_id is required" },
        { status: 400 }
      );
    }

    const request: AnalyzeSessionRequest = {
      session_id: body.session_id,
    };

    const data = await analyzeSession(request);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error analyzing session:", error);

    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }

    return NextResponse.json(
      { error: "An error occurred while analyzing the session" },
      { status: 500 }
    );
  }
}
