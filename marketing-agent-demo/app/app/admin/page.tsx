"use client";

import { useState } from "react";
import { Lock, LogOut, Wallet, Users, Compass, LayoutDashboard, AlertTriangle } from "lucide-react";
import { AppConfig } from "@/lib/config";
import { AccountTab } from "./tabs/AccountTab";
import { SessionsTab } from "./tabs/SessionsTab";
import { CoNavTab } from "./tabs/CoNavTab";
import { OverviewTab } from "./tabs/OverviewTab";

const AUTH_KEY = "admin-auth-v1";
const { password: PASSWORD, isDefaultPassword: IS_DEFAULT } = AppConfig.admin;

// login-gate -------------------------------------------------------------------

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm border border-[#E5E0D5] p-10 flex flex-col gap-5"
      >
        <Lock size={20} className="text-[#1A362D]" />
        <h1 className="font-serif-display text-[#1A362D] text-3xl">Admin</h1>
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="border border-[#E5E0D5] px-4 py-3 text-sm font-body bg-white focus:outline-none focus:border-[#1A362D]"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs">Incorrect password.</p>}
        <button type="submit" className="btn-hairline self-start">
          Enter
        </button>
        {IS_DEFAULT && (
          <div className="border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-body">
            <span className="font-semibold">Default password is active.</span> Set{" "}
            <code className="font-mono bg-amber-100 px-1">NEXT_PUBLIC_ADMIN_PASSWORD</code> in your
            environment to secure this page.
            <br />
            <span className="text-amber-600 mt-1 block">
              Current password: <code className="font-mono">{PASSWORD}</code>
            </span>
          </div>
        )}
      </form>
    </div>
  );
}

// default-password-banner ------------------------------------------------------

function DefaultPasswordBanner() {
  if (!IS_DEFAULT) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 md:px-12 py-2.5 flex items-center gap-3 text-xs text-amber-800 font-body">
      <AlertTriangle size={14} className="shrink-0 text-amber-500" />
      <span>
        <span className="font-semibold">Default password is active.</span> Set{" "}
        <code className="font-mono bg-amber-100 px-1">NEXT_PUBLIC_ADMIN_PASSWORD</code> in your
        Vercel environment variables before sharing this URL.
      </span>
    </div>
  );
}

// admin-page -------------------------------------------------------------------

const TABS = [
  { id: "overview", label: "Overview", Icon: LayoutDashboard },
  { id: "account", label: "TTAI Account", Icon: Wallet },
  { id: "sessions", label: "Sessions", Icon: Users },
  { id: "conav", label: "Co-Navigation", Icon: Compass },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [authed, setAuthed] = useState(
    () =>
      typeof window !== "undefined" &&
      sessionStorage.getItem(AUTH_KEY) === "1",
  );
  const [tab, setTab] = useState<TabId>("overview");

  if (!authed) return <LoginGate onLogin={() => setAuthed(true)} />;

  const logout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C302E]">
      <DefaultPasswordBanner />
      <header className="border-b border-[#E5E0D5] px-6 md:px-12 py-5 flex items-center justify-between">
        <h1 className="font-serif-display text-[#1A362D] text-2xl">Admin — The Camellias</h1>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[#59615D] hover:text-[#2C302E] transition-colors text-sm"
        >
          <LogOut size={14} /> Sign out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pb-32">
        <nav className="flex gap-6 border-b border-[#E5E0D5] mt-8 mb-2">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={[
                "flex items-center gap-2 pb-4 text-[13px] tracking-[0.18em] uppercase transition-colors",
                tab === id
                  ? "text-[#1A362D] border-b-2 border-[#1A362D] -mb-px"
                  : "text-[#59615D] hover:text-[#2C302E]",
              ].join(" ")}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        {tab === "overview" && <OverviewTab />}
        {tab === "account" && <AccountTab />}
        {tab === "sessions" && <SessionsTab />}
        {tab === "conav" && <CoNavTab />}
      </div>
    </div>
  );
}
