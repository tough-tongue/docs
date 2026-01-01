"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Tough Tongue AI
            </Link>
          </div>
          <nav className="flex items-center justify-center space-x-6">
            <Link 
              href="/" 
              className={`hover:text-gray-600 ${pathname === "/" ? "font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link 
              href="/course" 
              className={`hover:text-gray-600 ${pathname === "/course" ? "font-semibold" : ""}`}
            >
              Course
            </Link>
            <Link 
              href="/analysis" 
              className={`hover:text-gray-600 ${pathname === "/analysis" ? "font-semibold" : ""}`}
            >
              Analysis
            </Link>
          </nav>
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/auth/signin">
                <Button size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
