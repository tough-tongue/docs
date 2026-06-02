"use client";
import useReveal from "@/hooks/useReveal";
import { Phone } from "lucide-react";

const CONSULTATION_PHONE = "+91 98100 00000";
const PRIYA_AVATAR =
  "https://images.unsplash.com/photo-1653379671484-26b15642fd54?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBJbmRpYW4lMjB3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdCUyMGJ1c2luZXNzfGVufDB8fHx8MTc3OTQ1NzM1Nnww&ixlib=rb-4.1.0&q=85";

export const BookConsultation = () => {
  const r = useReveal<HTMLDivElement>();
  return (
    <section
      id="consultation"
      data-testid="book-consultation-section"
      className="bg-[#FAF9F6] border-t border-[#E5E0D5] py-20 md:py-24"
    >
      <div
        ref={r}
        className="reveal max-w-[1480px] mx-auto px-6 md:px-12 lg:px-16"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">
          {/* Priya — avatar + name */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <img
                src={PRIYA_AVATAR}
                alt="Priya, Sales Consultant"
                data-testid="priya-avatar"
                className="w-20 h-20 rounded-full object-cover object-top border-2 border-[#C5A059]/40 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#FAF9F6]" />
            </div>
            <div className="text-center">
              <p
                className="font-serif-display text-[#1A362D] text-xl"
                data-testid="priya-name"
              >
                Priya
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#59615D] mt-0.5">
                Sales Consultant
              </p>
            </div>
          </div>

          {/* Copy */}
          <div className="flex-1">
            <span className="overline">Private Viewings</span>
            <h2
              data-testid="consultation-headline"
              className="font-serif-display text-[#1A362D] mt-4 text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.1] tracking-tight"
            >
              Begin with a private property briefing
            </h2>
            <p className="mt-4 text-[#59615D] font-body text-[15px] leading-[1.85] max-w-lg">
              Speak with a dedicated luxury consultant for a guided view of the
              residences, amenities and availability story before arranging a
              private walkthrough of the estate.
            </p>
          </div>

          {/* Phone CTA */}
          <div className="flex flex-col gap-3 shrink-0">
            <a
              href={`tel:${CONSULTATION_PHONE.replace(/\s/g, "")}`}
              data-testid="consultation-phone-link"
              className="group flex items-center gap-4 border border-[#1A362D] px-7 py-5 hover:bg-[#1A362D] transition-colors duration-300"
            >
              <span className="w-10 h-10 rounded-full border border-[#C5A059]/50 group-hover:border-[#C5A059] flex items-center justify-center transition-colors">
                <Phone size={15} className="text-[#C5A059]" />
              </span>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#59615D] group-hover:text-[#FAF9F6]/70 transition-colors">
                  Call now
                </p>
                <p
                  data-testid="consultation-phone-number"
                  className="font-mono text-[#1A362D] group-hover:text-[#FAF9F6] text-lg font-semibold tracking-wide transition-colors"
                >
                  {CONSULTATION_PHONE}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookConsultation;
