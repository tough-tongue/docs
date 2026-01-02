"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildPersonalityTestUrl,
  createIframeEventListener,
  loadTestResult,
  saveTestResult,
  clearTestResult,
  extractMBTIType,
  type PersonalityTestResult,
  type SessionAnalysis,
} from "@/lib/toughtongue";
import { CheckCircle2, Loader2 } from "lucide-react";

function PersonalityTestContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [testResult, setTestResult] = useState<PersonalityTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load existing test result on mount
  useEffect(() => {
    const result = loadTestResult();
    if (result) {
      setTestResult(result);
    }
    setIsLoading(false);
  }, []);

  // Set up iframe event listener
  useEffect(() => {
    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Session started:", event.data.session_id);
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
  }, []);

  const analyzeSession = async (sessionId: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/tough-tongue/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze session");
      }

      const analysisData: SessionAnalysis = await response.json();

      // Create and save result
      const result: PersonalityTestResult = {
        sessionId,
        analysisData,
        completedAt: new Date().toISOString(),
        personalityType: extractMBTIType(analysisData),
      };

      saveTestResult(result);
      setTestResult(result);
    } catch (error) {
      console.error("Error analyzing session:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    if (
      confirm("Are you sure you want to retake the test? This will replace your current results.")
    ) {
      clearTestResult();
      setTestResult(null);
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
      {testResult && (
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
              Completed on {new Date(testResult.completedAt).toLocaleDateString()}
              {testResult.personalityType && (
                <span className="ml-2 font-semibold">
                  • Your Type: {testResult.personalityType}
                </span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Analyzing Banner */}
      {isAnalyzing && (
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
      )}

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
      {testResult && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Detailed analysis from your personality assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-background p-4 text-sm text-muted-foreground border border-border">
              {JSON.stringify(testResult.analysisData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
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
