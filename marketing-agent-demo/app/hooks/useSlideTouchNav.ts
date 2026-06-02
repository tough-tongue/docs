"use client";

import { useRef } from "react";

/** Returns touch handlers that call onNext/onPrev on a horizontal swipe > 60px. */
export function useSlideTouchNav(onNext: () => void, onPrev: () => void) {
  const touchStart = useRef<number | null>(null);

  return {
    onTouchStart: (e: React.TouchEvent) => {
      touchStart.current = e.touches[0].clientX;
    },
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchStart.current == null) return;
      const dx = e.changedTouches[0].clientX - touchStart.current;
      if (Math.abs(dx) > 60) {
        if (dx < 0) onNext();
        else onPrev();
      }
      touchStart.current = null;
    },
  };
}
