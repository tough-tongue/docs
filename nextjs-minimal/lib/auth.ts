/**
 * Auth utilities for admin API routes
 */

import { NextRequest, NextResponse } from "next/server";
import { AppConfig } from "./config";

/**
 * Verifies admin token from Authorization header
 */
export function verifyAdminToken(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  return authHeader.slice(7) === AppConfig.admin.token;
}

/**
 * Returns 401 response for unauthorized requests
 */
export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
