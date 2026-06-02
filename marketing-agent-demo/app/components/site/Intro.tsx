"use client";
import useReveal from "@/hooks/useReveal";

export const Intro = () => {
  const r1 = useReveal<HTMLDivElement>();
  const r2 = useReveal<HTMLDivElement>();
  const r3 = useReveal<HTMLDivElement>();

  return (
    <section
      id="intro"
      data-testid="intro-section"
      className="bg-[#FAF9F6] py-28 md:py-40"
    >
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 lg:px-16">
        <div ref={r1} className="reveal text-center mb-16">
          <span className="overline">The Inspiration</span>
          <span className="gold-divider ml-4 mb-1" />
        </div>

        <h2
          ref={r2}
          data-testid="intro-headline"
          className="reveal font-serif-display text-[#1A362D] text-center text-[clamp(1.85rem,3.6vw,3.4rem)] leading-[1.15] tracking-tight max-w-5xl mx-auto"
        >
          The Camellias is composed for those who expect scale to feel private:
          golf-front residences, gardened arrival courts, and service that moves
          quietly around the life inside.
        </h2>

        <div
          ref={r3}
          className="reveal mt-20 grid md:grid-cols-2 gap-14 md:gap-20 max-w-5xl mx-auto"
        >
          <p
            className="text-[#2C302E] font-body text-[15px] md:text-base leading-[1.9] tracking-wide"
            data-testid="intro-paragraph-1"
          >
            Architecture, landscape and hospitality are held in one calibrated
            rhythm. The towers rise from a green estate, framing long views
            across the Golf Drive while keeping the arrival, lobby and residence
            sequence deeply personal.
          </p>
          <p
            className="text-[#59615D] font-body text-[15px] md:text-base leading-[1.9] tracking-wide"
            data-testid="intro-paragraph-2"
          >
            Following The Aralias and The Magnolias, The Camellias marks
            DLF&rsquo;s most considered expression of super-luxury living:
            larger homes, richer amenities, stronger privacy, and a hospitality
            layer designed for repeat daily use.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Intro;
