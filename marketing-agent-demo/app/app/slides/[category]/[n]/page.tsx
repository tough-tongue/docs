"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";
import { getCategory } from "@/data/slides/registry";
import SlideRenderer from "@/components/slides/SlideRenderer";
import {
  ViewerTopBar,
  ViewerBottomBar,
  ViewerNotFound,
} from "@/components/slides/ViewerChrome";
import { useSlideTouchNav } from "@/hooks/useSlideTouchNav";

// slide-viewer-page ------------------------------------------------------------

export default function SlideViewerPage({
  params,
}: {
  params: { category: string; n: string };
}) {
  const router = useRouter();
  const { category, n } = params;
  const cat = getCategory(category);
  const order = Math.max(1, parseInt(n, 10) || 1);
  const routeCategory = cat?.meta.id ?? category;
  const slide = cat?.slides[order - 1];
  const total = cat?.slides.length ?? 0;

  const goTo = useCallback(
    (idx: number) =>
      router.push(
        `/slides/${routeCategory}/${Math.min(total, Math.max(1, idx))}`,
      ),
    [router, routeCategory, total],
  );
  const goNext = useCallback(
    () => { if (order < total) goTo(order + 1); },
    [order, total, goTo],
  );
  const goPrev = useCallback(
    () => { if (order > 1) goTo(order - 1); },
    [order, goTo],
  );
  const toIndex = useCallback(() => router.push("/slides"), [router]);

  useLockBodyScroll();
  useCanonicalSlideUrl({ category, order, routeCategory, router });
  useKeyboardNav({ cat, router, goNext, goPrev, goTo });
  usePreloadAdjacentSlides(cat, order);

  const phase = useSlideTransition(order, category);
  const { copied, copyLink } = useCopyLink();
  const touch = useSlideTouchNav(goNext, goPrev);

  if (!cat)
    return (
      <ViewerNotFound
        title="Category not found"
        hint={`No slide deck with id "${category}".`}
        onBack={toIndex}
      />
    );
  if (!slide)
    return (
      <ViewerNotFound
        title="Slide out of range"
        hint={`Slide ${order} does not exist in "${cat.meta.name}".`}
        onBack={toIndex}
      />
    );

  return (
    <div
      data-testid="slide-viewer"
      onTouchStart={touch.onTouchStart}
      onTouchEnd={touch.onTouchEnd}
      className="fixed inset-0 z-50 bg-[#0d100f] text-white select-none"
    >
      <ViewerTopBar catMeta={cat.meta} onBack={toIndex} onClose={toIndex} />

      <button
        onClick={copyLink}
        data-testid="viewer-copy-link"
        aria-label="Copy slide link"
        className="absolute top-24 right-6 md:right-10 z-30 flex items-center gap-2 px-3 py-2 border border-white/20 text-[12px] tracking-[0.26em] uppercase text-white/85 hover:bg-white hover:text-[#1A362D] hover:border-white transition-colors backdrop-blur-sm bg-black/20"
      >
        <Link2 size={12} />
        {copied ? "Copied" : "Share"}
      </button>

      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          phase === "in" ? "opacity-100" : "opacity-0"
        }`}
      >
        <SlideRenderer slide={slide} />
      </div>

      {order > 1 && (
        <button
          aria-label="Previous slide"
          data-testid="viewer-prev-zone"
          onClick={goPrev}
          className="absolute top-20 bottom-24 left-0 w-[12%] z-20 cursor-w-resize"
        />
      )}
      {order < total && (
        <button
          aria-label="Next slide"
          data-testid="viewer-next-zone"
          onClick={goNext}
          className="absolute top-20 bottom-24 right-0 w-[12%] z-20 cursor-e-resize"
        />
      )}

      <ViewerBottomBar
        slides={cat.slides}
        order={order}
        total={total}
        goTo={goTo}
        goPrev={goPrev}
        goNext={goNext}
      />
    </div>
  );
}

// hooks ------------------------------------------------------------------------

function useCanonicalSlideUrl({
  category,
  order,
  routeCategory,
  router,
}: {
  category: string;
  order: number;
  routeCategory: string;
  router: ReturnType<typeof useRouter>;
}) {
  useEffect(() => {
    if (category === routeCategory) return;
    router.replace(`/slides/${routeCategory}/${order}`);
  }, [category, order, routeCategory, router]);
}

function useLockBodyScroll() {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);
}

function useKeyboardNav({
  cat,
  router,
  goNext,
  goPrev,
  goTo,
}: {
  cat: ReturnType<typeof getCategory>;
  router: ReturnType<typeof useRouter>;
  goNext: () => void;
  goPrev: () => void;
  goTo: (n: number) => void;
}) {
  useEffect(() => {
    if (!cat) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") router.push("/slides");
      else if (e.key === "Home") goTo(1);
      else if (e.key === "End") goTo(cat.slides.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cat, router, goNext, goPrev, goTo]);
}

function usePreloadAdjacentSlides(
  cat: ReturnType<typeof getCategory>,
  order: number,
) {
  useEffect(() => {
    if (!cat) return;
    [cat.slides[order - 2], cat.slides[order]]
      .filter(Boolean)
      .forEach((s) => s.images?.forEach((img) => { new Image().src = img.src; }));
  }, [cat, order]);
}

function useSlideTransition(order: number, category: string) {
  const [phase, setPhase] = useState("in");
  useEffect(() => {
    let inFrame = 0;
    const outFrame = requestAnimationFrame(() => {
      setPhase("out");
      inFrame = requestAnimationFrame(() => setPhase("in"));
    });
    return () => {
      cancelAnimationFrame(outFrame);
      cancelAnimationFrame(inFrame);
    };
  }, [order, category]);
  return phase;
}

function useCopyLink() {
  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  }, []);
  return { copied, copyLink };
}
