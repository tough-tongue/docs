"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buildPersonalityTestUrl, createIframeEventListener, SCENARIOS } from "@/lib/ttai";
import { useAppStore } from "@/lib/store";
import { ROUTES } from "@/lib/constants";
import { CheckCircle2, Play, Brain, ArrowRight } from "lucide-react";
import Link from "next/link";

function TestContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [showTest, setShowTest] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [lastSessionId, setLastSessionId] = useState<string | null>(null);

  // Store
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const addAssessmentSession = useAppStore((s) => s.addAssessmentSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const hasExistingSessions = assessmentSessions.length > 0;

  // Set up iframe event listener
  useEffect(() => {
    if (!showTest) return;

    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Session started:", event.data.session_id);
        addAssessmentSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_TEST,
          scenario_id: event.data.scenario_id,
          created_at: new Date().toISOString(),
          status: "active",
        });
        setLastSessionId(event.data.session_id);
      },
      onStop: (event) => {
        console.log("Session stopped:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "completed",
        });
        setShowTest(false);
        setTestCompleted(true);
        setLastSessionId(event.data.session_id);
      },
      onTerminated: (event) => {
        console.log("Session terminated:", event.data.session_id);
        updateSessionDetails(event.data.session_id, {
          completed_at: new Date().toISOString(),
          duration: event.data.duration_seconds,
          status: "terminated",
        });
        setShowTest(false);
        setTestCompleted(true);
        setLastSessionId(event.data.session_id);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [showTest, addAssessmentSession, updateSessionDetails]);

  const iframeUrl = buildPersonalityTestUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
  });

  // Test completed - show success and link to results
  if (testCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto bg-card border-green-500/30">
          <CardHeader className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-400 mb-4" />
            <CardTitle className="text-2xl text-green-400">Test Completed!</CardTitle>
            <CardDescription className="text-green-300/80">
              Your session has been recorded. View your results to see your personality type.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href={ROUTES.RESULTS}>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                View Results
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => {
                setTestCompleted(false);
                setShowTest(true);
              }}
            >
              Take Another Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the test iframe
  if (showTest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">MBTI Personality Assessment</h1>
            <p className="text-muted-foreground">Complete the assessment to discover your type</p>
          </div>
          <Button variant="outline" onClick={() => setShowTest(false)}>
            Cancel
          </Button>
        </div>

        <iframe
          src={iframeUrl}
          width="100%"
          height="700px"
          frameBorder="0"
          allow="microphone; camera; display-capture"
          className="rounded-lg border border-border shadow-lg shadow-teal-500/5"
        />
      </div>
    );
  }

  // Landing - prompt to start test
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">MBTI Personality Assessment</h1>
        <p className="text-muted-foreground">
          Take our AI-powered personality test to discover your MBTI type
        </p>
      </div>

      <Card className="max-w-lg mx-auto bg-card border-border">
        <CardHeader className="text-center">
          <Brain className="mx-auto h-12 w-12 text-teal-400 mb-4" />
          <CardTitle className="text-xl">
            {hasExistingSessions
              ? "Take Another Assessment"
              : "Ready to Discover Your Personality?"}
          </CardTitle>
          <CardDescription>
            {hasExistingSessions
              ? `You have ${assessmentSessions.length} previous session${
                  assessmentSessions.length > 1 ? "s" : ""
                }. Start a new assessment or view your results.`
              : "Have a conversation with our AI to uncover your unique personality type"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={() => setShowTest(true)}
            size="lg"
            className="w-full bg-teal-600 hover:bg-teal-700"
          >
            <Play className="h-5 w-5 mr-2" />
            {hasExistingSessions ? "Start New Test" : "Start Assessment"}
          </Button>
          {hasExistingSessions ? (
            <Link href={ROUTES.RESULTS}>
              <Button variant="outline" className="w-full">
                View Results
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TestPage() {
  return (
    <AuthGuard
      title="Sign In to Take the Test"
      description="Create an account to save your personality test results"
    >
      <TestContent />
    </AuthGuard>
  );
}
