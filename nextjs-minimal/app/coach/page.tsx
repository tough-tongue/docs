"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCoachUrl, createIframeEventListener, SCENARIOS } from "@/lib/ttai";
import { useAppStore } from "@/lib/store";
import { AlertCircle, MessageCircle, Loader2, Play, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

function CoachContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showCoach, setShowCoach] = useState(false);

  // Store
  const userPersonalityType = useAppStore((s) => s.userPersonalityType);
  const userPersonalityAssessment = useAppStore((s) => s.userPersonalityAssessment);
  const addCoachSession = useAppStore((s) => s.addCoachSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const hasAssessment = !!userPersonalityAssessment;

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Set up iframe event listener
  useEffect(() => {
    if (!showCoach) return;

    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Coach session started:", event.data.session_id);
        addCoachSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_COACH,
          scenario_id: event.data.scenario_id,
          created_at: new Date().toISOString(),
          status: "active",
        });
      },
      onStop: (event) => {
        console.log("Coach session stopped:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "completed",
        });
      },
      onTerminated: (event) => {
        console.log("Coach session terminated:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "terminated",
        });
        setShowCoach(false);
      },
      onSubmit: (event) => {
        console.log("Coach session data submitted:", event.data.session_id);
        setShowCoach(false);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [showCoach, addCoachSession, updateSessionDetails]);

  const iframeUrl = buildCoachUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
    userPersonalityAssessment: userPersonalityAssessment || undefined,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-500" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // No assessment - prompt to select one
  if (!hasAssessment) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Personality Coach</h1>
          <p className="text-muted-foreground">
            Talk to your AI coach about personality insights and growth
          </p>
        </div>

        <Card className="max-w-lg w-full bg-card border-yellow-500/30">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
            <CardTitle className="text-yellow-400">Assessment Required</CardTitle>
            <CardDescription>
              To get personalized coaching, you need to complete a personality assessment first and
              mark it as your final result.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <p className="text-sm text-yellow-300/80">
                <strong>How it works:</strong>
                <br />
                1. Take the personality test on the Test page
                <br />
                2. View and analyze your results
                <br />
                3. Click "Mark as Final" on the session you want to use
                <br />
                4. Return here to start coaching
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={ROUTES.TEST} className="flex-1">
                <Button className="w-full bg-teal-600 hover:bg-teal-700">
                  <Play className="h-4 w-4 mr-2" />
                  Take Test
                </Button>
              </Link>
              <Link href={ROUTES.RESULTS} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Results
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show coach interface - when showing iframe, use full height layout
  if (showCoach) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Your Personality Coach</h1>
            <p className="text-muted-foreground text-sm">
              {userPersonalityType
                ? `Talk to your coach to explore how to leverage your ${userPersonalityType} personality`
                : "Talk to your AI coach about personality insights and growth"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowCoach(false)}>
            End Session
          </Button>
        </div>

        {/* Iframe - full remaining height */}
        <div className="flex-1 container mx-auto px-4 pb-4">
          <iframe
            src={iframeUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allow="microphone; camera; display-capture"
            className="rounded-lg border border-border shadow-lg shadow-teal-500/5"
          />
        </div>
      </div>
    );
  }

  // Landing - show profile and start button
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Your Personality Coach</h1>
        <p className="text-muted-foreground">
          {userPersonalityType
            ? `Talk to your coach to explore how to leverage your ${userPersonalityType} personality`
            : "Talk to your AI coach about personality insights and growth"}
        </p>
      </div>

      <Card className="mb-6 border-teal-500/30 bg-teal-500/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <CardTitle className="text-teal-400">Your Personality Profile</CardTitle>
          </div>
          <CardDescription className="text-teal-300/80">
            Your coach will use this to provide personalized guidance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground leading-relaxed">{userPersonalityAssessment}</p>
        </CardContent>
      </Card>

      <Card className="max-w-lg mx-auto bg-card border-border">
        <CardHeader className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-teal-400 mb-4" />
          <CardTitle>Ready to Start Coaching?</CardTitle>
          <CardDescription>
            Your AI coach knows your personality type and will provide tailored guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button
            onClick={() => setShowCoach(true)}
            size="lg"
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Coach Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CoachPage() {
  return (
    <AuthGuard title="Sign In for Coaching" description="Sign in to access personalized coaching">
      <CoachContent />
    </AuthGuard>
  );
}
