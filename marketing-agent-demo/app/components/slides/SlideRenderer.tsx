"use client";

import type { Slide } from "@/data/slides/schema";
import HeroLayout from "./layouts/HeroLayout";
import SplitLayout from "./layouts/SplitLayout";
import MosaicLayout from "./layouts/MosaicLayout";
import SpecsheetLayout from "./layouts/SpecsheetLayout";
import FullbleedLayout from "./layouts/FullbleedLayout";

const LAYOUTS = {
  hero: HeroLayout,
  split: SplitLayout,
  mosaic: MosaicLayout,
  specsheet: SpecsheetLayout,
  fullbleed: FullbleedLayout,
};

export default function SlideRenderer({ slide }: { slide: Slide }) {
  const Layout = LAYOUTS[slide.layout] ?? HeroLayout;
  return (
    <div
      className="w-full h-full"
      data-testid={`slide-${slide.id}`}
      data-slide-layout={slide.layout}
    >
      <Layout slide={slide} />
    </div>
  );
}
