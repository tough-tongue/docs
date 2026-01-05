/**
 * Home Page
 *
 * Landing page for the Discover Your Personality application.
 * Showcases the MBTI assessment flow and provides entry points to the test and coach.
 *
 * Sections:
 * - Hero: Main value proposition and CTAs
 * - Features: 3-step process explanation
 * - MBTI Types: Interactive grid of 16 personality types with detail dialogs
 * - CTA: Final call to action
 * - Footer: Attribution and links
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES, MBTI_TYPES, MBTI_TYPE_DETAILS, type MBTIType } from "@/lib/constants";
import { AppConfig } from "@/lib/config";

/** Home page component with interactive MBTI type selection */
export default function Home() {
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null);

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <MBTITypesSection onSelectType={setSelectedType} />
      <CTASection />
      <Footer />
      <PersonalityTypeDialog type={selectedType} onClose={() => setSelectedType(null)} />
    </div>
  );
}

// =============================================================================
// Hero Section
// =============================================================================

function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center rounded-full bg-teal-500/20 px-4 py-1.5 text-sm font-medium text-teal-400">
          <span className="mr-2">🧠</span>
          MBTI Personality Assessment
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="text-gradient">{AppConfig.app.name}</span>
        </h1>

        <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
          Discover your unique MBTI personality type through AI-powered conversations. Take the
          comprehensive test and get personalized coaching.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href={ROUTES.TEST}>
            <Button size="lg" className="w-full sm:w-auto">
              Take Personality Test
            </Button>
          </Link>
          <Link href={ROUTES.COACH}>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Talk to Your Coach
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Takes approximately 10-15 minutes</p>
      </div>
    </section>
  );
}

// =============================================================================
// Features Section
// =============================================================================

function FeaturesSection() {
  const features = [
    {
      step: "1️⃣",
      title: "Take the Test",
      description: "Have a natural conversation with our AI to assess your personality traits.",
      bgColor: "bg-teal-500/20",
    },
    {
      step: "2️⃣",
      title: "Get Your Results",
      description: "Receive a comprehensive analysis of your personality type with insights.",
      bgColor: "bg-cyan-500/20",
    },
    {
      step: "3️⃣",
      title: "Talk to Your Coach",
      description: "Discuss your results with an AI coach for personalized guidance.",
      bgColor: "bg-emerald-500/20",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
          <p className="text-muted-foreground">
            A simple 3-step process to discover your personality type
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.step} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  step,
  title,
  description,
  bgColor,
}: {
  step: string;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${bgColor}`}>
          <span className="text-xl">{step}</span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

// =============================================================================
// MBTI Types Section
// =============================================================================

function MBTITypesSection({ onSelectType }: { onSelectType: (type: MBTIType) => void }) {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
            16 Personality Types
          </h2>
          <p className="text-muted-foreground">
            Based on the Myers-Briggs Type Indicator (MBTI) framework
          </p>
        </div>

        <div className="mb-8 rounded-xl overflow-hidden shadow-lg shadow-teal-500/10 border border-border">
          <Image
            src="/images/personality-types-cover.png"
            alt="16 MBTI Personality Types"
            width={1200}
            height={675}
            className="w-full h-auto"
            priority
          />
        </div>

        <p className="text-center text-muted-foreground mb-6 text-sm">
          Click on any personality type to learn more about its characteristics
        </p>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:gap-4">
          {MBTI_TYPES.map((type) => (
            <MBTITypeButton key={type} type={type} onClick={() => onSelectType(type)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MBTITypeButton({ type, onClick }: { type: MBTIType; onClick: () => void }) {
  const details = MBTI_TYPE_DETAILS[type];
  return (
    <button
      onClick={onClick}
      className="group rounded-lg border border-border bg-card p-3 text-center transition-all hover:border-teal-500/60 hover:bg-teal-500/10 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer"
    >
      <div className="text-2xl mb-1">{details.character}</div>
      <div className="text-base font-semibold text-foreground">{type}</div>
      <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-teal-400 transition-colors">
        {details.nickname}
      </div>
    </button>
  );
}

// =============================================================================
// CTA Section
// =============================================================================

function CTASection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-5xl rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 p-10 text-center">
        <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
          Ready to Discover Yourself?
        </h2>
        <p className="mb-6 text-teal-100/90">
          Start your journey to self-discovery with our AI-powered personality assessment
        </p>
        <Link href={ROUTES.TEST}>
          <Button size="lg" className="bg-white text-teal-700 hover:bg-gray-100 active:bg-gray-200">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
}

// =============================================================================
// Footer
// =============================================================================

function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p className="mb-2 text-sm">
          Built with{" "}
          <a
            href="https://www.toughtongueai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 hover:underline"
          >
            ToughTongue AI
          </a>
        </p>
        <p className="text-xs">
          <a
            href="https://docs.toughtongueai.com/developer/starters/nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-teal-400"
          >
            Template Documentation
          </a>
        </p>
      </div>
    </footer>
  );
}

// =============================================================================
// Personality Type Dialog
// =============================================================================

function PersonalityTypeDialog({ type, onClose }: { type: MBTIType | null; onClose: () => void }) {
  if (!type) return null;

  const details = MBTI_TYPE_DETAILS[type];

  return (
    <Dialog open={type !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-5xl">{details.character}</span>
            <div>
              <DialogTitle className="text-2xl text-foreground">
                {type} - {details.name}
              </DialogTitle>
              <p className="text-teal-400 font-semibold">{details.nickname}</p>
            </div>
          </div>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            {details.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <TraitsList traits={details.traits} />
          <StrengthsList strengths={details.strengths} />
          <DialogCTA />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TraitsList({ traits }: { traits: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-2">Key Traits</h4>
      <div className="flex flex-wrap gap-2">
        {traits.map((trait) => (
          <span key={trait} className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-sm">
            {trait}
          </span>
        ))}
      </div>
    </div>
  );
}

function StrengthsList({ strengths }: { strengths: string[] }) {
  return (
    <div>
      <h4 className="font-semibold text-foreground mb-2">Strengths</h4>
      <ul className="space-y-1">
        {strengths.map((strength) => (
          <li key={strength} className="flex items-center text-muted-foreground">
            <span className="mr-2 text-green-400">✓</span>
            {strength}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DialogCTA() {
  return (
    <div className="pt-4 border-t border-border">
      <p className="text-sm text-muted-foreground mb-3">Want to discover your personality type?</p>
      <Link href={ROUTES.TEST}>
        <Button className="w-full">Take the Personality Test</Button>
      </Link>
    </div>
  );
}
