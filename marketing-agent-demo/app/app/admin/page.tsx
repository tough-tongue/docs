"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Compass,
  LayoutDashboard,
  Lock,
  LogOut,
  Users,
  Wallet,
} from "lucide-react";
import { AccountTab } from "./tabs/AccountTab";
import { SessionsTab } from "./tabs/SessionsTab";
import { CoNavTab } from "./tabs/CoNavTab";
import { SetupTab } from "./tabs/SetupTab";

const AUTH_KEY = "admin-password-v1";

// login-gate -------------------------------------------------------------------

function LoginGate({
  onLogin,
}: {
  onLogin: (password: string, isDefaultPassword: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: value }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Incorrect password.");
      setValue("");
      return;
    }

    const data = (await res.json()) as { isDefaultPassword?: boolean };
    localStorage.setItem(AUTH_KEY, value);
    onLogin(value, Boolean(data.isDefaultPassword));
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
            setError("");
          }}
          placeholder="Password"
          className="border border-[#E5E0D5] px-4 py-3 text-sm font-body bg-white focus:outline-none focus:border-[#1A362D]"
          autoFocus
        />
        {error && <p className="text-red-500 text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-hairline self-start disabled:opacity-40"
        >
          {loading ? "Checking..." : "Enter"}
        </button>
      </form>
    </div>
  );
}

// default-password-banner ------------------------------------------------------

function DefaultPasswordBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 md:px-12 py-2.5 flex items-center gap-3 text-xs text-amber-800 font-body">
      <AlertTriangle size={14} className="shrink-0 text-amber-500" />
      <span>
        <span className="font-semibold">Default password is active.</span> Set
        {" "}
        <code className="font-mono bg-amber-100 px-1">ADMIN_PASSWORD</code>{" "}
        in your Vercel environment variables before sharing this URL.
      </span>
    </div>
  );
}

// admin-page -------------------------------------------------------------------

const TABS = [
  { id: "setup", label: "Setup", Icon: LayoutDashboard },
  { id: "account", label: "TTAI Account", Icon: Wallet },
  { id: "sessions", label: "Sessions", Icon: Users },
  { id: "conav", label: "Co-Navigation", Icon: Compass },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminPage() {
  const [adminPassword, setAdminPassword] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(AUTH_KEY) ?? "" : ""
  );
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);
  const [tab, setTab] = useState<TabId>("setup");

  useEffect(() => {
    if (!adminPassword) return;

    let active = true;
    fetch("/api/admin-auth", {
      method: "POST",
      headers: { "x-admin-password": adminPassword },
    }).then(async (res) => {
      if (!active) return;
      if (!res.ok) {
        localStorage.removeItem(AUTH_KEY);
        setAdminPassword("");
        setIsDefaultPassword(false);
        return;
      }

      const data = (await res.json()) as { isDefaultPassword?: boolean };
      setIsDefaultPassword(Boolean(data.isDefaultPassword));
    });

    return () => {
      active = false;
    };
  }, [adminPassword]);

  if (!adminPassword) {
    return (
      <LoginGate
        onLogin={(password, isDefault) => {
          setAdminPassword(password);
          setIsDefaultPassword(isDefault);
        }}
      />
    );
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAdminPassword("");
    setIsDefaultPassword(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2C302E]">
      <DefaultPasswordBanner visible={isDefaultPassword} />
      <header className="border-b border-[#E5E0D5] px-6 md:px-12 py-5 flex items-center justify-between">
        <h1 className="font-serif-display text-[#1A362D] text-2xl">
          Admin — The Camellias
        </h1>
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

        {tab === "setup" && <SetupTab />}
        {tab === "account" && <AccountTab adminPassword={adminPassword} />}
        {tab === "sessions" && <SessionsTab adminPassword={adminPassword} />}
        {tab === "conav" && <CoNavTab adminPassword={adminPassword} />}
      </div>
    </div>
  );
}
