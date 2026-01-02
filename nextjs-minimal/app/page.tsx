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

export default function Home() {
  const [selectedType, setSelectedType] = useState<MBTIType | null>(null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            <span className="mr-2">🧠</span>
            MBTI Personality Assessment
          </div>

          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 md:text-7xl">
            {AppConfig.app.name}
          </h1>

          <p className="mb-10 text-xl text-gray-600 md:text-2xl">
            Discover your unique MBTI personality type through AI-powered conversations. Take the
            comprehensive test and get personalized coaching to better understand yourself.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.PERSONALITY_TEST}>
              <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                Take Personality Test
              </Button>
            </Link>
            <Link href={ROUTES.PERSONALITY_COACH}>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Talk to Your Coach
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Takes approximately 10-15 minutes • Completely free
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
          <p className="text-lg text-gray-600">
            A simple 3-step process to discover your personality type
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <span className="text-2xl">1️⃣</span>
              </div>
              <CardTitle>Take the Test</CardTitle>
              <CardDescription>
                Have a natural conversation with our AI to assess your personality traits across all
                MBTI dimensions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                <span className="text-2xl">2️⃣</span>
              </div>
              <CardTitle>Get Your Results</CardTitle>
              <CardDescription>
                Receive a comprehensive analysis of your personality type with detailed insights and
                characteristics.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                <span className="text-2xl">3️⃣</span>
              </div>
              <CardTitle>Talk to Your Coach</CardTitle>
              <CardDescription>
                Discuss your results with an AI coach who understands your personality type and can
                provide personalized guidance.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* MBTI Types Overview */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              16 Personality Types
            </h2>
            <p className="text-lg text-gray-600">
              Based on the Myers-Briggs Type Indicator (MBTI) framework
            </p>
          </div>

          {/* Personality Types Image */}
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/personality-types-cover.png"
              alt="16 MBTI Personality Types"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>

          <p className="text-center text-gray-600 mb-6">
            Click on any personality type to learn more about its characteristics
          </p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {MBTI_TYPES.map((type) => {
              const details = MBTI_TYPE_DETAILS[type];
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className="group rounded-lg border-2 border-gray-200 bg-white p-4 text-center font-semibold text-gray-700 transition-all hover:border-purple-500 hover:shadow-md hover:scale-105 cursor-pointer"
                >
                  <div className="text-3xl mb-2">{details.character}</div>
                  <div className="text-lg">{type}</div>
                  <div className="text-xs text-gray-500 mt-1 group-hover:text-purple-600">
                    {details.nickname}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-4xl rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Discover Yourself?</h2>
          <p className="mb-8 text-lg text-purple-100">
            Start your journey to self-discovery with our AI-powered personality assessment
          </p>
          <Link href={ROUTES.PERSONALITY_TEST}>
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">
            Built with{" "}
            <a
              href="https://www.toughtongueai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:underline"
            >
              ToughTongue AI
            </a>
          </p>
          <p className="text-sm">
            <a
              href="https://docs.toughtongueai.com/developer/starters/nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-600"
            >
              Template Documentation
            </a>
          </p>
        </div>
      </footer>

      {/* Personality Type Details Dialog */}
      <Dialog open={selectedType !== null} onOpenChange={() => setSelectedType(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedType && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-5xl">{MBTI_TYPE_DETAILS[selectedType].character}</span>
                  <div>
                    <DialogTitle className="text-2xl">
                      {selectedType} - {MBTI_TYPE_DETAILS[selectedType].name}
                    </DialogTitle>
                    <p className="text-purple-600 font-semibold">
                      {MBTI_TYPE_DETAILS[selectedType].nickname}
                    </p>
                  </div>
                </div>
                <DialogDescription className="text-base text-gray-700 leading-relaxed">
                  {MBTI_TYPE_DETAILS[selectedType].description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Key Traits */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Traits</h4>
                  <div className="flex flex-wrap gap-2">
                    {MBTI_TYPE_DETAILS[selectedType].traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
                  <ul className="space-y-1">
                    {MBTI_TYPE_DETAILS[selectedType].strengths.map((strength) => (
                      <li key={strength} className="flex items-center text-gray-700">
                        <span className="mr-2 text-green-600">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to Action */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">
                    Want to discover your personality type?
                  </p>
                  <Link href={ROUTES.PERSONALITY_TEST}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                      Take the Personality Test
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
