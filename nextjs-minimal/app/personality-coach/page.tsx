"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  buildCoachUrl,
  createIframeEventListener,
  loadTestResult,
  loadCoachSessions,
  addCoachSession,
  updateCoachSession,
  type PersonalityTestResult,
  type CoachSession,
} from "@/lib/toughtongue";
import { AlertCircle, MessageCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function PersonalityCoachContent() {
  const { getUserName, getUserEmail } = useAuth();
  const [testResult, setTestResult] = useState<PersonalityTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [coachSessions, setCoachSessions] = useState<CoachSession[]>([]);

  // Load data on mount
  useEffect(() => {
    const result = loadTestResult();
    if (result) {
      setTestResult(result);
    }
    const sessions = loadCoachSessions();
    setCoachSessions(sessions);
    setIsLoading(false);
  }, []);

  // Set up iframe event listener
  useEffect(() => {
    const cleanup = createIframeEventListener({
      onStart: (event) => {
        console.log("Coach session started:", event.data.session_id);

        const newSession: CoachSession = {
          sessionId: event.data.session_id,
          startedAt: new Date().toISOString(),
          personalityType: testResult?.personalityType,
        };

        const updated = addCoachSession(newSession);
        setCoachSessions(updated);
      },
      onStop: (event) => {
        console.log("Coach session stopped:", event.data.session_id);

        const updated = updateCoachSession(event.data.session_id, {
          completedAt: new Date().toISOString(),
        });
        setCoachSessions(updated);
      },
      onError: (error) => {
        console.error("Iframe error:", error);
      },
    });

    return cleanup;
  }, [testResult?.personalityType]);

  const iframeUrl = buildCoachUrl({
    userName: getUserName(),
    userEmail: getUserEmail(),
    personalityType: testResult?.personalityType,
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
        <h1 className="text-3xl font-bold mb-2 text-foreground">Personality Coach</h1>
        <p className="text-muted-foreground">
          Talk to your AI coach about personality insights, growth, and self-discovery
        </p>
      </div>

      {/* No Test Result Warning */}
      {!testResult && (
        <Card className="mb-8 border-yellow-500/30 bg-yellow-500/10">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div>
                  <CardTitle className="text-yellow-400">Take the Personality Test First</CardTitle>
                  <CardDescription className="text-yellow-300/80 mt-1">
                    For a personalized coaching experience, we recommend taking the personality test
                    first. Your coach will provide tailored insights based on your MBTI type.
                  </CardDescription>
                </div>
              </div>
              <Link href="/personality-test">
                <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                  Take Test
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Personalized Coaching Banner */}
      {testResult && (
        <Card className="mb-8 border-teal-500/30 bg-teal-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-teal-400" />
              <div>
                <CardTitle className="text-teal-400">Personalized Coaching Available</CardTitle>
                <CardDescription className="text-teal-300/80">
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
          src={iframeUrl}
          width="100%"
          height="700px"
          frameBorder="0"
          allow="microphone; camera; display-capture"
          className="rounded-lg border border-border shadow-lg shadow-teal-500/5"
        />
      </div>

      {/* Coach Sessions History */}
      {coachSessions.length > 0 && (
        <Card className="bg-card border-border">
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
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      Session {coachSessions.length - index}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Started: {new Date(session.startedAt).toLocaleString()}
                    </p>
                    {session.completedAt && (
                      <p className="text-sm text-muted-foreground">
                        Completed: {new Date(session.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  {!session.completedAt && (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
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

export default function PersonalityCoachPage() {
  return (
    <AuthGuard
      title="Sign In for Coaching"
      description="Create an account to track your coaching sessions and get personalized guidance"
    >
      <PersonalityCoachContent />
    </AuthGuard>
  );
}
