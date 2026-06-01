"use client";
import useReveal from "@/hooks/useReveal";
import useParallax from "@/hooks/useParallax";

const STRIPS = [
    {
        kicker: "Address",
        line1: "Everything",
        line2: "about the Golf Drive",
        line3: "spells super luxury.",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1600&q=80",
        alt: "Twilight golf course view",
    },
    {
        kicker: "Living",
        line1: "Life here",
        line2: "is designed",
        line3: "to exceed expectations.",
        image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80",
        alt: "Refined contemporary residence interior",
    },
    {
        kicker: "Landscape",
        line1: "Over 80 hectares",
        line2: "of curated",
        line3: "greenery.",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
        alt: "Vast manicured green landscape at dawn",
    },
];

const STAT_TILES = [
    { label: "Golf Courses", value: "Two" },
    { label: "The", value: "Sanctuary" },
    { label: "Views", value: "Breathtaking" },
    { label: "Address", value: "Golf Drive" },
];

const StatTile = ({ tile, index }) => {
    const ref = useReveal<HTMLDivElement>();
    return (
        <div
            ref={ref}
            className="reveal border-t border-[#E5E0D5] py-10 md:py-14 px-6 md:px-10 flex flex-col"
            style={{ transitionDelay: `${index * 80}ms` }}
            data-testid={`stat-tile-${index}`}
        >
            <span className="overline">{tile.label}</span>
            <span className="font-serif-display text-[#1A362D] text-3xl md:text-4xl mt-4 leading-tight">
                {tile.value}
            </span>
        </div>
    );
};

const Strip = ({ strip, index }) => {
    const imageRef = useReveal<HTMLDivElement>();
    const copyRef = useReveal<HTMLDivElement>();
    const parallaxRef = useParallax<HTMLDivElement>(0.22);
    const reverse = index % 2 === 1;

    return (
        <div
            data-testid={`highlight-strip-${index}`}
            className={`grid md:grid-cols-12 gap-0 items-stretch min-h-[80vh] ${
                reverse ? "" : ""
            }`}
        >
            <div
                ref={(el) => {
                    imageRef.current = el;
                    parallaxRef.current = el;
                }}
                className={`reveal relative overflow-hidden md:col-span-7 h-[60vh] md:h-auto ${
                    reverse ? "md:order-2" : ""
                }`}
            >
                <img
                    data-parallax-img
                    src={strip.image}
                    alt={strip.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover will-change-transform"
                    style={{ transform: "scale(1.15)" }}
                />
            </div>

            <div
                ref={copyRef}
                className={`reveal md:col-span-5 bg-[#FAF9F6] flex flex-col justify-center px-8 md:px-14 lg:px-20 py-20 ${
                    reverse ? "md:order-1" : ""
                }`}
            >
                <span className="overline mb-6">{strip.kicker}</span>
                <h3 className="font-serif-display text-[#1A362D] text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] tracking-tight">
                    <span className="block">{strip.line1}</span>
                    <span className="block">{strip.line2}</span>
                    <span className="block italic text-[#C5A059]">
                        {strip.line3}
                    </span>
                </h3>
                <span className="gold-divider mt-10" />
            </div>
        </div>
    );
};

export const Highlights = () => {
    return (
        <section
            id="highlights"
            data-testid="highlights-section"
            className="bg-[#FAF9F6]"
        >
            {/* Editorial stat row */}
            <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 py-24">
                <div className="grid md:grid-cols-4">
                    {STAT_TILES.map((tile, i) => (
                        <StatTile tile={tile} index={i} key={tile.label} />
                    ))}
                </div>
                <div className="border-t border-[#E5E0D5] mt-0" />
                <p
                    data-testid="highlights-byline"
                    className="font-serif-display italic text-center text-[#59615D] text-2xl md:text-3xl mt-16 tracking-tight"
                >
                    Golf Drive. Home to The Camellias.
                </p>
            </div>

            {STRIPS.map((s, i) => (
                <Strip strip={s} index={i} key={s.line1} />
            ))}
        </section>
    );
};

export default Highlights;
