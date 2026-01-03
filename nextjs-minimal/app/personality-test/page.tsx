"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildPersonalityTestUrl,
  createIframeEventListener,
  extractMBTIType,
  SCENARIOS,
  type SessionAnalysis,
} from "@/lib/ttai";
import { useAppStore, selectLatestAssessment } from "@/lib/store";
import { CheckCircle2, Loader2 } from "lucide-react";

function PersonalityTestContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Store
  const latestAssessment = useAppStore(selectLatestAssessment);
  const addAssessmentSession = useAppStore((s) => s.addAssessmentSession);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Set up iframe event listener
  useEffect(() => {
    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Session started:", event.data.session_id);
        // Add session immediately when started
        addAssessmentSession(event.data.session_id, {
          scenarioId: SCENARIOS.PERSONALITY_TEST,
        });
      },
      onStop: async (event) => {
        console.log("Session stopped:", event.data.session_id);
        await analyzeSession(event.data.session_id);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [addAssessmentSession]);

  const analyzeSession = async (sessionId: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze session");
      }

      const analysisData: SessionAnalysis = await response.json();
      const personalityType = extractMBTIType(analysisData);

      // Update session details with analysis
      updateSessionDetails(sessionId, {
        completedAt: new Date().toISOString(),
        personalityType,
        analysisData,
      });
    } catch (error) {
      console.error("Error analyzing session:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    if (confirm("Are you sure you want to retake the test? This will start a new session.")) {
      // Just allow them to take the test again - sessions are accumulated
    }
  };

  const iframeUrl = buildPersonalityTestUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-teal-500" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">MBTI Personality Assessment</h1>
        <p className="text-muted-foreground">
          Take our comprehensive personality test to discover your MBTI type
        </p>
      </div>

      {/* Test Completed Banner */}
      {latestAssessment?.completedAt ? (
        <Card className="mb-8 border-green-500/30 bg-green-500/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <CardTitle className="text-green-400">Test Completed!</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={handleRetake}>
                Retake Test
              </Button>
            </div>
            <CardDescription className="text-green-300/80">
              Completed on {new Date(latestAssessment.completedAt).toLocaleDateString()}
              {latestAssessment.personalityType ? (
                <span className="ml-2 font-semibold">
                  • Your Type: {latestAssessment.personalityType}
                </span>
              ) : null}
              {assessmentSessions.length > 1 ? (
                <span className="ml-2">• {assessmentSessions.length} total sessions</span>
              ) : null}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {/* Analyzing Banner */}
      {isAnalyzing ? (
        <Card className="mb-8 border-blue-500/30 bg-blue-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <CardTitle className="text-blue-400">Analyzing Your Results...</CardTitle>
            </div>
            <CardDescription className="text-blue-300/80">
              Please wait while we process your personality assessment
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {/* ToughTongue AI Iframe */}
      <div className="mb-8">
        <iframe
          src={iframeUrl}
          width="100%"
          height="700px"
          frameBorder="0"
          allow="microphone; camera; display-capture"
          className="rounded-lg border border-border shadow-lg shadow-teal-500/5"
        />
      </div>

      {/* Results Card */}
      {latestAssessment?.analysisData ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Detailed analysis from your personality assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-background p-4 text-sm text-muted-foreground border border-border">
              {JSON.stringify(latestAssessment.analysisData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

export default function PersonalityTestPage() {
  return (
    <AuthGuard
      title="Sign In to Take the Test"
      description="Create an account to save your personality test results and track your progress"
    >
      <PersonalityTestContent />
    </AuthGuard>
  );
}
