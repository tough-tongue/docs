/**
 * POST /api/sat - Create Scenario Access Token
 *
 * Creates a short-lived access token for embedding private scenarios.
 * Tokens are valid for 1-24 hours.
 *
 * Request body:
 * - scenario_id: string (required) - The scenario to create a token for
 * - duration_hours: number (optional, default: 4) - Token validity (1-24 hours)
 * - email: string (optional) - User email for org context
 */

import { NextRequest, NextResponse } from "next/server";
import { createSAT, ToughTongueError } from "../ttai/client";

/**
 * Creates a Scenario Access Token (SAT) for embedding private scenarios.
 *
 * Note: This endpoint is intentionally not admin-protected since SAT tokens
 * are meant to be generated for end users. The API key still protects
 * the actual token generation on the ToughTongue side.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.scenario_id) {
      return NextResponse.json({ error: "scenario_id is required" }, { status: 400 });
    }

    const satResponse = await createSAT({
      scenario_id: body.scenario_id,
      duration_hours: body.duration_hours,
      email: body.email,
    });

    return NextResponse.json(satResponse);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
