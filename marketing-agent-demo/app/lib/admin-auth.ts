/**
 * Lightweight admin request authentication.
 *
 * The admin UI stores the entered password locally and sends it as a request
 * header. This is intentionally simple for the demo; replace with a real auth
 * provider before exposing sensitive operations broadly.
 */

import { NextRequest, NextResponse } from "next/server";
import { Config } from "@/lib/config";

export const ADMIN_PASSWORD_HEADER = "x-admin-password";

export function isAdminRequest(req: NextRequest): boolean {
  return req.headers.get(ADMIN_PASSWORD_HEADER) === Config.srv.adminPassword;
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (isAdminRequest(req)) return null;
  return NextResponse.json(
    { ok: false, error: "Admin password required" },
    { status: 401 },
  );
}
