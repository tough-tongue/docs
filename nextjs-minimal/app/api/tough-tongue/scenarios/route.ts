import { NextResponse } from "next/server";
import { createScenario, ToughTongueError, type CreateScenarioRequest } from "@/lib/toughtongue";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.description || !body.ai_instructions) {
      return NextResponse.json(
        { error: "name, description, and ai_instructions are required" },
        { status: 400 }
      );
    }

    const request: CreateScenarioRequest = {
      name: body.name,
      description: body.description,
      ai_instructions: body.ai_instructions,
      user_friendly_description: body.user_friendly_description || undefined,
    };

    const data = await createScenario(request);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating scenario:", error);

    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }

    return NextResponse.json(
      { error: "An error occurred while creating the scenario" },
      { status: 500 }
    );
  }
}
