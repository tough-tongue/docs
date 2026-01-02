"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { ROUTES } from "@/lib/constants";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="text-xl font-bold">
              {AppConfig.app.name}
            </Link>
          </div>
          <nav className="flex items-center justify-center space-x-6">
            <Link
              href={ROUTES.HOME}
              className={`hover:text-gray-600 ${pathname === ROUTES.HOME ? "font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href={ROUTES.PERSONALITY_TEST}
              className={`hover:text-gray-600 ${
                pathname === ROUTES.PERSONALITY_TEST ? "font-semibold" : ""
              }`}
            >
              Take Test
            </Link>
            <Link
              href={ROUTES.PERSONALITY_COACH}
              className={`hover:text-gray-600 ${
                pathname === ROUTES.PERSONALITY_COACH ? "font-semibold" : ""
              }`}
            >
              Coach
            </Link>
            <Link
              href={ROUTES.PROGRESS}
              className={`hover:text-gray-600 ${
                pathname === ROUTES.PROGRESS ? "font-semibold" : ""
              }`}
            >
              Progress
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
