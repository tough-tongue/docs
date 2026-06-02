import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { Config } from "@/lib/config";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = requireAdmin(req);
  if (auth) return auth;

  return NextResponse.json({
    appUrl: Config.app_url,
    customFunctionUrl: `${Config.app_url}/api/agent-navigate`,
  });
}
