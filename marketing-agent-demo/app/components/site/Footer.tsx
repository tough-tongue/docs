"use client";
import Link from "next/link";
import { useSession } from "@/context/SessionContext";
import { Unplug } from "lucide-react";

// ── Dev section (session + widget toggle) ────────────────────────────────────

function DevSection() {
    const { sessionId, connect, disconnect, widgetMode, setWidgetMode } = useSession();
    return (
        <div
            data-testid="footer-dev-section"
            className="mt-8 pt-6 border-t border-white/10"
        >
            <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-white/25">dev</span>
            <div className="mt-3 flex flex-wrap items-center gap-x-8 gap-y-3 text-white/55">
                {/* Session connect */}
                {!sessionId ? (
                    <button
                        data-testid="footer-session-connect-btn"
                        onClick={() => connect()}
                        className="font-mono text-[11px] hover:text-white/80 transition-colors underline underline-offset-2"
                    >
                        connect session
                    </button>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </span>
                        <span
                            data-testid="footer-session-id"
                            className="font-mono text-[11px] tracking-widest text-white/75"
                        >
                            {sessionId}
                        </span>
                        <button
                            data-testid="footer-session-disconnect-btn"
                            onClick={disconnect}
                            aria-label="Disconnect session"
                            className="text-white/35 hover:text-red-400 transition-colors"
                        >
                            <Unplug size={11} />
                        </button>
                    </div>
                )}

                {/* Widget toggle */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-white/25">widget:</span>
                    <button
                        data-testid="footer-widget-toggle-nav"
                        onClick={() => setWidgetMode("nav-agent")}
                        className={`transition-colors ${widgetMode === "nav-agent" ? "text-[#C5A059]" : "hover:text-white/70"}`}
                    >
                        nav-agent
                    </button>
                    <span className="text-white/20">/</span>
                    <button
                        data-testid="footer-widget-toggle-meet"
                        onClick={() => setWidgetMode("google-meet-agent")}
                        className={`transition-colors ${widgetMode === "google-meet-agent" ? "text-[#C5A059]" : "hover:text-white/70"}`}
                    >
                        google-meet-agent
                    </button>
                </div>

                {/* Admin link */}
                <div className="flex items-center gap-2 font-mono text-[11px] text-white/25">
                    <Link
                        href="/admin"
                        data-testid="footer-admin-link"
                        className="underline underline-offset-2 hover:text-white/60 transition-colors"
                    >
                        /admin
                    </Link>
                    <span>·</span>
                    <span
                        data-testid="footer-admin-password"
                        className="select-all"
                        title="Admin password"
                    >
                        pw: {process.env.REACT_APP_ADMIN_PASSWORD || "changeme-in-prod"}
                    </span>
                </div>
            </div>
        </div>
    );
}

// ── Footer ───────────────────────────────────────────────────────────────────

const EXPLORE_LINKS = [
    { l: "The Project", h: "#intro" },
    { l: "Highlights", h: "#highlights" },
    { l: "Grand Masters", h: "#masters" },
    { l: "Sustainability", h: "#sustainability" },
];

export const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer data-testid="site-footer" className="bg-[#1A362D] text-[#FAF9F6]">
            <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-24">
                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Branding */}
                    <div className="lg:col-span-5">
                        <h3 className="font-serif-display text-4xl md:text-5xl leading-none">
                            The Camellias
                        </h3>
                        <span className="text-[12px] tracking-[0.4em] uppercase opacity-70 mt-3 inline-block">
                            by DLF
                        </span>
                        <p className="mt-8 font-body text-sm leading-[1.95] opacity-80 max-w-md">
                            Super-luxury residences set within DLF&rsquo;s iconic Golf Drive — the latest
                            chapter following The Aralias and The Magnolias.
                        </p>
                    </div>

                    {/* Explore */}
                    <div className="lg:col-span-3">
                        <span className="overline" style={{ color: "#C5A059" }}>Explore</span>
                        <ul className="mt-6 space-y-3 font-body text-sm">
                            {EXPLORE_LINKS.map((i) => (
                                <li key={i.h}>
                                    <a
                                        href={i.h}
                                        data-testid={`footer-link-${i.l.toLowerCase().replace(/\s+/g, "-")}`}
                                        className="opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-colors"
                                    >
                                        {i.l}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <Link
                                    href="/slides"
                                    data-testid="footer-link-sales-decks"
                                    className="opacity-80 hover:opacity-100 hover:text-[#C5A059] transition-colors"
                                >
                                    Sales Decks
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Address */}
                    <div className="lg:col-span-4">
                        <span className="overline" style={{ color: "#C5A059" }}>Address</span>
                        <p className="mt-6 font-body text-sm leading-[1.95] opacity-80">
                            DLF 5, Golf Course Road
                            <br />
                            Gurugram, Haryana — 122002
                            <br />
                            India
                        </p>
                    </div>
                </div>

                {/* Dev section */}
                <DevSection />

                {/* Copyright bar */}
                <div className="mt-10 pt-8 border-t border-white/15 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-[13px] tracking-[0.18em] uppercase opacity-70">
                        &copy; {year} DLF Limited &middot; All Rights Reserved
                    </p>
                    <div className="flex gap-8 text-[13px] tracking-[0.18em] uppercase opacity-70">
                        <a href="#" data-testid="footer-privacy" className="hover:opacity-100 hover:text-[#C5A059] transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" data-testid="footer-terms" className="hover:opacity-100 hover:text-[#C5A059] transition-colors">
                            Terms of Use
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
