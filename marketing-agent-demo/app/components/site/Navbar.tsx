"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const ANCHOR_LINKS = [
  { label: "The Project", href: "#intro" },
  { label: "Highlights", href: "#highlights" },
  { label: "Sustainability", href: "#sustainability" },
  { label: "Grand Masters", href: "#masters" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF9F6]/85 backdrop-blur-md border-b border-[#E5E0D5]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 h-20 flex items-center justify-between">
        <a
          href="#top"
          data-testid="navbar-logo"
          className="flex flex-col leading-none"
        >
          <span
            className={`font-serif-display text-2xl tracking-tight ${
              scrolled ? "text-[#1A362D]" : "text-white"
            }`}
          >
            The Camellias
          </span>
          <span
            className={`text-[11px] tracking-[0.4em] mt-1 uppercase ${
              scrolled ? "text-[#59615D]" : "text-white/70"
            }`}
          >
            by DLF
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-10">
          {ANCHOR_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${
                l.label.toLowerCase().replace(/\s+/g, "-")
              }`}
              className={`text-[11px] uppercase tracking-[0.28em] font-medium transition-colors duration-300 ${
                scrolled
                  ? "text-[#2C302E] hover:text-[#1A362D]"
                  : "text-white/85 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/slides"
            data-testid="nav-link-properties"
            className={`text-[11px] uppercase tracking-[0.28em] font-medium transition-colors duration-300 ${
              scrolled
                ? "text-[#2C302E] hover:text-[#1A362D]"
                : "text-white/85 hover:text-white"
            }`}
          >
            Properties
          </Link>
        </nav>

        <button
          data-testid="navbar-menu-toggle"
          onClick={() => setOpen((o) => !o)}
          className={`lg:hidden p-2 ${
            scrolled ? "text-[#1A362D]" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div
          data-testid="navbar-mobile-menu"
          className="lg:hidden bg-[#FAF9F6] border-t border-[#E5E0D5]"
        >
          <div className="px-6 py-6 flex flex-col gap-5">
            {ANCHOR_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-link-${
                  l.label.toLowerCase().replace(/\s+/g, "-")
                }`}
                className="text-[13px] uppercase tracking-[0.24em] text-[#2C302E]"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/slides"
              onClick={() => setOpen(false)}
              data-testid="nav-mobile-link-properties"
              className="text-[13px] uppercase tracking-[0.24em] text-[#2C302E]"
            >
              Properties
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
