import { NextResponse } from "next/server";
import { getBalance, ToughTongueError } from "../ttai/client";

export async function GET() {
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
