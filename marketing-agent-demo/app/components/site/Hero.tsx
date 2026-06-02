"use client";
import { ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative h-screen w-full overflow-hidden bg-[#0d100f]"
    >
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/33217714/pexels-photo-33217714.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1300&w=1900"
          alt="The Camellias — luxury residence at golden hour"
          className="w-full h-full object-cover kenburns"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/55" />
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-end px-6 text-center pb-[18vh]">
        <h1
          className="font-serif-display text-white text-[clamp(3rem,8vw,7.5rem)] leading-[0.95] tracking-tight"
          data-testid="hero-title"
        >
          The Camellias
        </h1>
        <span className="gold-divider mt-8" />
        <p
          className="mt-8 max-w-2xl text-white/85 font-body text-sm md:text-base tracking-[0.18em] uppercase"
          data-testid="hero-tagline"
        >
          Private golf-front residences on DLF Golf Drive, Gurugram
        </p>
      </div>

      <a
        href="#intro"
        data-testid="hero-scroll-indicator"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-[12px] tracking-[0.28em] uppercase">
          Scroll
        </span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
};

export default Hero;
