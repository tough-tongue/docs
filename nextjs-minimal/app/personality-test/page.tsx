"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SCENARIOS,
  SCENARIO_URLS,
  STORAGE_KEYS,
  type PersonalityTestResult,
} from "@/lib/constants";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function PersonalityTestPage() {
  const { user, loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<PersonalityTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Load existing test result from localStorage
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT);
    if (stored) {
      try {
        setTestResult(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading test result:", error);
      }
    }
    setIsLoading(false);

    // Listen for messages from the iframe
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== "https://app.toughtongueai.com") return;

      const { type, data } = event.data;

      if (type === "onStart") {
        console.log("Session started:", data);
        setSessionId(data.session_id);
      } else if (type === "onStop") {
        console.log("Session stopped:", data);
        const sessionId = data.session_id;
        if (sessionId) {
          setSessionId(sessionId);
          await analyzeSession(sessionId);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
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

      const analysisData = await response.json();

      // Save result to localStorage
      const result: PersonalityTestResult = {
        sessionId,
        analysisData,
        completedAt: new Date().toISOString(),
        personalityType: extractPersonalityType(analysisData),
      };

      localStorage.setItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT, JSON.stringify(result));
      localStorage.setItem(STORAGE_KEYS.PERSONALITY_TEST_SESSION_ID, sessionId);
      localStorage.setItem(STORAGE_KEYS.PERSONALITY_TEST_COMPLETED_AT, result.completedAt);

      setTestResult(result);
    } catch (error) {
      console.error("Error analyzing session:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractPersonalityType = (analysisData: any): PersonalityTestResult["personalityType"] => {
    // Try to extract MBTI type from analysis data
    // This is a placeholder - adjust based on actual API response structure
    const text = JSON.stringify(analysisData).toUpperCase();
    const mbtiPattern =
      /\b(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)\b/;
    const match = text.match(mbtiPattern);
    return match ? (match[1] as PersonalityTestResult["personalityType"]) : undefined;
  };

  const handleRetake = () => {
    if (
      confirm("Are you sure you want to retake the test? This will replace your current results.")
    ) {
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT);
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_COMPLETED_AT);
      setTestResult(null);
      setSessionId(null);
    }
  };

  const getIframeUrl = () => {
    if (!user) {
      return `${SCENARIO_URLS.PERSONALITY_TEST}?bg=black&promptUserInfo=true`;
    }

    const userName = user.displayName || "";
    const userEmail = user.email || "";

    return `${SCENARIO_URLS.PERSONALITY_TEST}?bg=black&userName=${encodeURIComponent(
      userName
    )}&userEmail=${encodeURIComponent(userEmail)}`;
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-600" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MBTI Personality Assessment</h1>
        <p className="text-gray-600">
          Take our comprehensive personality test to discover your MBTI type
        </p>
      </div>

      {testResult && (
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <CardTitle className="text-green-900">Test Completed!</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={handleRetake}>
                Retake Test
              </Button>
            </div>
            <CardDescription className="text-green-700">
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

      {isAnalyzing && (
        <Card className="mb-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <CardTitle className="text-blue-900">Analyzing Your Results...</CardTitle>
            </div>
            <CardDescription className="text-blue-700">
              Please wait while we process your personality assessment
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {!user && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <CardTitle className="text-yellow-900">Not Signed In</CardTitle>
            </div>
            <CardDescription className="text-yellow-700">
              You can take the test without signing in, but your results won't be saved to your
              account. Sign in to save your progress.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* ToughTongue AI Iframe */}
      <div className="mb-8">
        <iframe
          src={getIframeUrl()}
          width="100%"
          height="700px"
          frameBorder="0"
          allow="microphone; camera; display-capture"
          className="rounded-lg border shadow-lg"
        />
      </div>

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>Your Results</CardTitle>
            <CardDescription>Detailed analysis from your personality assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm">
              {JSON.stringify(testResult.analysisData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
