"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SCENARIOS,
  SCENARIO_URLS,
  STORAGE_KEYS,
  ROUTES,
  type PersonalityTestResult,
  type CoachSession,
} from "@/lib/constants";
import { AlertCircle, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PersonalityCoachPage() {
  const { user, loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<PersonalityTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [coachSessions, setCoachSessions] = useState<CoachSession[]>([]);

  useEffect(() => {
    // Load personality test result
    const storedResult = localStorage.getItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT);
    if (storedResult) {
      try {
        setTestResult(JSON.parse(storedResult));
      } catch (error) {
        console.error("Error loading test result:", error);
      }
    }

    // Load coach sessions history
    const storedSessions = localStorage.getItem(STORAGE_KEYS.COACH_SESSIONS);
    if (storedSessions) {
      try {
        setCoachSessions(JSON.parse(storedSessions));
      } catch (error) {
        console.error("Error loading coach sessions:", error);
      }
    }

    setIsLoading(false);

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://app.toughtongueai.com") return;

      const { type, data } = event.data;

      if (type === "onStart") {
        console.log("Coach session started:", data);
        setCurrentSessionId(data.session_id);

        // Add to sessions list
        const newSession: CoachSession = {
          sessionId: data.session_id,
          startedAt: new Date().toISOString(),
        };

        setCoachSessions((prev) => {
          const updated = [newSession, ...prev];
          localStorage.setItem(STORAGE_KEYS.COACH_SESSIONS, JSON.stringify(updated));
          return updated;
        });
      } else if (type === "onStop") {
        console.log("Coach session stopped:", data);

        // Update the session with completion time
        setCoachSessions((prev) => {
          const updated = prev.map((session) =>
            session.sessionId === data.session_id
              ? { ...session, completedAt: new Date().toISOString() }
              : session
          );
          localStorage.setItem(STORAGE_KEYS.COACH_SESSIONS, JSON.stringify(updated));
          return updated;
        });
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getIframeUrl = () => {
    let baseUrl = SCENARIO_URLS.PERSONALITY_COACH;

    // Add background
    baseUrl += "?bg=black";

    // Add user info if available
    if (user) {
      const userName = user.displayName || "";
      const userEmail = user.email || "";
      baseUrl += `&userName=${encodeURIComponent(userName)}&userEmail=${encodeURIComponent(
        userEmail
      )}`;
    }

    // Add personality type as dynamic variable if test was taken
    if (testResult?.personalityType) {
      baseUrl += `&personalityType=${encodeURIComponent(testResult.personalityType)}`;
    }

    return baseUrl;
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
        <h1 className="text-3xl font-bold mb-2">Personality Coach</h1>
        <p className="text-gray-600">
          Talk to your AI coach about personality insights, growth, and self-discovery
        </p>
      </div>

      {!testResult && (
        <Card className="mb-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <CardTitle className="text-yellow-900">Take the Personality Test First</CardTitle>
                  <CardDescription className="text-yellow-700 mt-1">
                    For a personalized coaching experience, we recommend taking the personality test
                    first. Your coach will be able to provide tailored insights based on your MBTI
                    type.
                  </CardDescription>
                </div>
              </div>
              <Link href={ROUTES.PERSONALITY_TEST}>
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Take Test
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {testResult && (
        <Card className="mb-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-purple-600" />
              <div>
                <CardTitle className="text-purple-900">Personalized Coaching Available</CardTitle>
                <CardDescription className="text-purple-700">
                  Your personality type: <strong>{testResult.personalityType}</strong> • Your coach
                  knows your type and can provide tailored guidance
                </CardDescription>
              </div>
            </div>
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

      {/* Coach Sessions History */}
      {coachSessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Coaching Sessions</CardTitle>
            <CardDescription>
              {coachSessions.length} session{coachSessions.length !== 1 ? "s" : ""} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {coachSessions.map((session, index) => (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">Session {coachSessions.length - index}</p>
                    <p className="text-sm text-gray-600">
                      Started: {new Date(session.startedAt).toLocaleString()}
                    </p>
                    {session.completedAt && (
                      <p className="text-sm text-gray-600">
                        Completed: {new Date(session.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {!session.completedAt && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      In Progress
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
