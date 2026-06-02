"use client";

import { ArrowLeft, ArrowRight, LayoutGrid, X } from "lucide-react";
import type { Category, Slide } from "@/data/slides/schema";

// viewer-top-bar ---------------------------------------------------------------

export function ViewerTopBar({
  catMeta,
  onBack,
  onClose,
}: {
  catMeta: Category;
  onBack: () => void;
  onClose: () => void;
}) {
  return (
    <header
      data-testid="viewer-topbar"
      className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-10 h-20 bg-gradient-to-b from-black/55 to-transparent"
    >
      <div className="flex items-baseline gap-5">
        <button
          onClick={onBack}
          data-testid="viewer-back-to-index"
          className="flex items-center gap-2 text-[13px] tracking-[0.24em] uppercase opacity-85 hover:opacity-100 transition-opacity"
        >
          <LayoutGrid size={14} />
          All Properties
        </button>
        <span className="hidden md:inline text-white/30">/</span>
        <span
          className="hidden md:inline font-serif-display text-lg italic text-[#C5A059]"
          data-testid="viewer-category-name"
        >
          {catMeta.name}
        </span>
      </div>
      <button
        onClick={onClose}
        data-testid="viewer-close"
        className="w-10 h-10 flex items-center justify-center border border-white/25 hover:border-white hover:bg-white/10 transition-colors"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </header>
  );
}

// viewer-bottom-bar ------------------------------------------------------------

export function ViewerBottomBar({
  slides,
  order,
  total,
  goTo,
  goPrev,
  goNext,
}: {
  slides: Slide[];
  order: number;
  total: number;
  goTo: (n: number) => void;
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <footer
      data-testid="viewer-bottombar"
      className="absolute bottom-0 inset-x-0 z-30 px-6 md:px-10 pb-6 pt-12 bg-gradient-to-t from-black/65 to-transparent"
    >
      <div className="flex items-end justify-between gap-6">
        <SlideCounter order={order} total={total} />
        <SlideDots slides={slides} order={order} goTo={goTo} />
        <SlideArrows
          order={order}
          total={total}
          goPrev={goPrev}
          goNext={goNext}
        />
      </div>
      <p className="mt-3 text-[12px] tracking-[0.3em] uppercase text-white/45">
        ← → keys · swipe · Esc to exit
      </p>
    </footer>
  );
}

// viewer-not-found -------------------------------------------------------------

export function ViewerNotFound({
  title,
  hint,
  onBack,
}: {
  title: string;
  hint: string;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col items-center justify-center text-center px-8">
      <span className="overline">404</span>
      <h2 className="font-serif-display text-[#1A362D] text-5xl mt-4">
        {title}
      </h2>
      <p className="mt-4 text-[#59615D] max-w-md">{hint}</p>
      <button
        onClick={onBack}
        data-testid="notfound-back"
        className="btn-hairline mt-10"
      >
        Back to all properties
      </button>
    </div>
  );
}

// private atoms ----------------------------------------------------------------

function SlideCounter({ order, total }: { order: number; total: number }) {
  return (
    <div className="flex items-baseline gap-4">
      <span
        data-testid="viewer-counter"
        className="font-serif-display text-3xl md:text-4xl text-[#C5A059]"
      >
        {String(order).padStart(2, "0")}
      </span>
      <span className="text-white/40 text-sm">/</span>
      <span className="text-white/65 text-sm tracking-[0.22em]">
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

function SlideDots({
  slides,
  order,
  goTo,
}: {
  slides: Slide[];
  order: number;
  goTo: (n: number) => void;
}) {
  return (
    <div className="hidden md:flex flex-1 mx-10 gap-1.5 items-center">
      {slides.map((s) => (
        <button
          key={s.id}
          data-testid={`viewer-dot-${s.order}`}
          onClick={() => goTo(s.order)}
          aria-label={`Go to slide ${s.order}`}
          className={`h-[2px] flex-1 transition-all duration-500 ${
            s.order === order
              ? "bg-[#C5A059]"
              : s.order < order
              ? "bg-white/55"
              : "bg-white/15 hover:bg-white/35"
          }`}
        />
      ))}
    </div>
  );
}

function SlideArrows({
  order,
  total,
  goPrev,
  goNext,
}: {
  order: number;
  total: number;
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        data-testid="viewer-prev"
        onClick={goPrev}
        disabled={order === 1}
        aria-label="Previous"
        className="w-11 h-11 border border-white/35 flex items-center justify-center hover:bg-white hover:text-[#1A362D] transition-colors disabled:opacity-25 disabled:pointer-events-none"
      >
        <ArrowLeft size={16} />
      </button>
      <button
        data-testid="viewer-next"
        onClick={goNext}
        disabled={order === total}
        aria-label="Next"
        className="w-11 h-11 border border-white/35 flex items-center justify-center hover:bg-white hover:text-[#1A362D] transition-colors disabled:opacity-25 disabled:pointer-events-none"
      >
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
