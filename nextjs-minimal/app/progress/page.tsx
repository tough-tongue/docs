"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import {
  loadTestResult,
  loadCoachSessions,
  saveTestResult,
  type PersonalityTestResult,
  type CoachSession,
} from "@/lib/toughtongue";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageCircle,
  RefreshCw,
  Trophy,
  User,
} from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  const { loading: authLoading } = useAuth();
  const [testResult, setTestResult] = useState<PersonalityTestResult | null>(null);
  const [coachSessions, setCoachSessions] = useState<CoachSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const result = loadTestResult();
    if (result) {
      setTestResult(result);
    }

    const sessions = loadCoachSessions();
    setCoachSessions(sessions);

    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh test result if exists
      if (testResult?.sessionId) {
        const response = await fetch("/api/tough-tongue/sessions/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: testResult.sessionId }),
        });

        if (response.ok) {
          const analysisData = await response.json();
          const updatedResult: PersonalityTestResult = {
            ...testResult,
            analysisData,
          };
          saveTestResult(updatedResult);
          setTestResult(updatedResult);
        }
      }

      alert("Data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing data:", error);
      alert("Failed to refresh data. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const completedCoachSessions = coachSessions.filter((s) => s.completedAt).length;
  const totalCoachSessions = coachSessions.length;

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse">
          <div className="mx-auto h-8 w-64 bg-muted rounded mb-4"></div>
          <div className="mx-auto h-4 w-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Your Progress</h1>
          <p className="text-muted-foreground">Track your personality journey and coaching sessions</p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personality Test</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {testResult ? testResult.personalityType || "Completed" : "Not Taken"}
            </div>
            <p className="text-xs text-muted-foreground">
              {testResult
                ? `Completed ${new Date(testResult.completedAt).toLocaleDateString()}`
                : "Take the test to discover your type"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coach Sessions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCoachSessions}</div>
            <p className="text-xs text-muted-foreground">
              {completedCoachSessions} completed • {totalCoachSessions - completedCoachSessions} in
              progress
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievement</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {testResult && totalCoachSessions > 0 ? "Active" : "Getting Started"}
            </div>
            <p className="text-xs text-muted-foreground">
              {testResult && totalCoachSessions > 0
                ? "You're on your journey!"
                : "Complete the test and start coaching"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personality Test Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Personality Test</h2>

        {!testResult ? (
          <Card className="border-dashed border-border bg-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-foreground">Test Not Completed</CardTitle>
                    <CardDescription>
                      Take the MBTI personality test to discover your unique type
                    </CardDescription>
                  </div>
                </div>
                <Link href={ROUTES.PERSONALITY_TEST}>
                  <Button className="bg-teal-600 hover:bg-teal-700">Take Test</Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <Card className="border-green-500/30 bg-green-500/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  <div>
                    <CardTitle className="text-green-400">Test Completed</CardTitle>
                    <CardDescription className="text-green-300/80">
                      Your personality type:{" "}
                      <strong className="text-lg">{testResult.personalityType || "Unknown"}</strong>
                    </CardDescription>
                    <p className="text-sm text-green-300/60 mt-1">
                      <Clock className="inline h-3 w-3 mr-1" />
                      {new Date(testResult.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Link href={ROUTES.PERSONALITY_TEST}>
                  <Button variant="outline" size="sm">
                    Retake Test
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-green-400 hover:text-green-300">
                  View Full Analysis
                </summary>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-4 text-sm border border-border text-muted-foreground">
                  {JSON.stringify(testResult.analysisData, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Coach Sessions Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Coaching Sessions</h2>
          <Link href={ROUTES.PERSONALITY_COACH}>
            <Button variant="outline" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Start New Session
            </Button>
          </Link>
        </div>

        {coachSessions.length === 0 ? (
          <Card className="border-dashed border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-foreground">No Coaching Sessions Yet</CardTitle>
                  <CardDescription>
                    Start a conversation with your AI coach to get personalized insights
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <div className="space-y-4">
            {coachSessions.map((session, index) => (
              <Card key={session.sessionId} className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground">Session {coachSessions.length - index}</CardTitle>
                      <CardDescription>
                        Started: {new Date(session.startedAt).toLocaleString()}
                      </CardDescription>
                      {session.completedAt && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Completed: {new Date(session.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div>
                      {session.completedAt ? (
                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                          Completed
                        </span>
                      ) : (
                        <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
