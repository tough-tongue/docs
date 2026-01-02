import { NextResponse } from "next/server";
import { getSession, ToughTongueError } from "@/lib/toughtongue";

type Context = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(req: Request, { params: paramsPromise }: Context) {
  try {
    const params = await paramsPromise;
    const { sessionId } = params;

    const data = await getSession(sessionId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error retrieving session:", error);

    if (error instanceof ToughTongueError) {
      return NextResponse.json(error.toApiError(), { status: error.status || 500 });
    }

    return NextResponse.json(
      { error: "An error occurred while retrieving session details" },
      { status: 500 }
    );
  }
}
