import { NextRequest, NextResponse } from "next/server";
import { getBalance, ToughTongueError } from "../ttai/client";
import { verifyAdminToken, unauthorizedResponse } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!verifyAdminToken(request)) return unauthorizedResponse();

  try {
    const balance = await getBalance();
    return NextResponse.json(balance);
  } catch (error) {
    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
