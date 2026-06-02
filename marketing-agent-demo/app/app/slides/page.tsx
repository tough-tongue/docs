import Link from "next/link";
import { ArrowUpRight, Home } from "lucide-react";
import { CATEGORY_LIST, SLIDE_CATEGORIES } from "@/data/slides/registry";

export default function SlidesIndexPage() {
  return (
    <main
      data-testid="slides-index"
      className="min-h-screen bg-[#FAF9F6] text-[#2C302E]"
    >
      <header className="border-b border-[#E5E0D5]">
        <div className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 py-6 flex items-center justify-between">
          <Link
            href="/"
            data-testid="slides-index-home"
            className="flex items-center gap-2 text-[13px] tracking-[0.24em] uppercase text-[#1A362D] hover:opacity-70"
          >
            <Home size={14} />
            The Camellias
          </Link>
          <span className="text-[13px] tracking-[0.24em] uppercase text-[#59615D]">
            Properties
          </span>
        </div>
      </header>

      <section className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-12">
        <span className="overline">Private Collection</span>
        <h1 className="font-serif-display text-[#1A362D] text-[clamp(2.6rem,5.5vw,5rem)] leading-[1.02] tracking-tight mt-4 max-w-4xl">
          Properties, presented for a private walkthrough.
        </h1>
        <p className="mt-8 max-w-2xl text-[#59615D] font-body text-base leading-[1.95]">
          Each property story is built for a live, high-touch conversation:
          full-screen imagery, crisp specifications, and a pace that lets the
          concierge move from residence to lifestyle without breaking the
          moment. Use the arrow keys to guide a client through; press{" "}
          <kbd>Esc</kbd> to return to the collection.
        </p>
      </section>

      <section className="max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16 pb-32">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {CATEGORY_LIST.map((c) => {
            const file = SLIDE_CATEGORIES[c.id];
            return (
              <Link
                key={c.id}
                href={`/slides/${c.id}/1`}
                data-testid={`category-card-${c.id}`}
                className="group block border border-[#E5E0D5] bg-white hover:border-[#1A362D] transition-colors duration-500"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-[#1A362D]">
                  <img
                    src={c.cover}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="absolute bottom-5 left-6 right-6 text-white">
                    <span className="text-[12px] tracking-[0.3em] uppercase text-[#C5A059]">
                      {file.slides.length} Scenes
                    </span>
                    <h2 className="font-serif-display text-3xl md:text-4xl mt-2 leading-tight">
                      {c.name}
                    </h2>
                  </div>
                </div>

                <div className="p-7 md:p-9">
                  <p className="font-serif-display italic text-[#C5A059] text-lg md:text-xl leading-snug">
                    {c.tagline}
                  </p>
                  <p className="mt-5 font-body text-[14.5px] leading-[1.9] text-[#2C302E]">
                    {c.description}
                  </p>
                  <div className="mt-7 pt-6 border-t border-[#E5E0D5]">
                    <span className="overline">Use when</span>
                    <p className="mt-3 font-body text-[13.5px] leading-[1.85] text-[#59615D]">
                      {c.useWhen}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-[13px] uppercase tracking-[0.26em] text-[#1A362D]">
                    <span>Open property</span>
                    <ArrowUpRight
                      size={16}
                      className="text-[#C5A059] transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
