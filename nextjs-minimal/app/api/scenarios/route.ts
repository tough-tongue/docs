import { NextRequest, NextResponse } from "next/server";
import { createScenario, ToughTongueError, type CreateScenarioRequest } from "../ttai/client";

export async function POST(request: NextRequest) {
  try {
    const body: CreateScenarioRequest = await request.json();

    if (!body.name || !body.description || !body.ai_instructions) {
      return NextResponse.json(
        { error: "name, description, and ai_instructions are required" },
        { status: 400 }
      );
    }

    const scenario = await createScenario(body);
    return NextResponse.json(scenario);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
