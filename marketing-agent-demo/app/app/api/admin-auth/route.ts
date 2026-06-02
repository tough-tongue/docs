import { NextRequest, NextResponse } from "next/server";
import { Config } from "@/lib/config";
import { ADMIN_PASSWORD_HEADER } from "@/lib/admin-auth";

interface AdminAuthBody {
  password?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json().catch(() => ({}))) as AdminAuthBody;
  const password = body.password ?? req.headers.get(ADMIN_PASSWORD_HEADER) ??
    "";

  if (password !== Config.srv.adminPassword) {
    return NextResponse.json(
      { ok: false, error: "Invalid admin password" },
      { status: 401 },
    );
  }

  return NextResponse.json({
    ok: true,
    isDefaultPassword: Config.admin.isDefaultPassword,
  });
}
