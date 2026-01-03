"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants";
import { useAppStore, selectLatestAssessment, selectPersonalityType } from "@/lib/store";
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Store
  const latestAssessment = useAppStore(selectLatestAssessment);
  const personalityType = useAppStore(selectPersonalityType);
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const coachSessions = useAppStore((s) => s.coachSessions);
  const sessionDetails = useAppStore((s) => s.sessionDetails);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refresh latest assessment analysis if exists
      if (latestAssessment?.id) {
        const response = await fetch("/api/sessions/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: latestAssessment.id }),
        });

        if (response.ok) {
          const analysisData = await response.json();
          updateSessionDetails(latestAssessment.id, { analysisData });
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

  const completedCoachSessions = coachSessions.filter(
    (id) => sessionDetails[id]?.completedAt
  ).length;

  if (authLoading) {
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
          <p className="text-muted-foreground">
            Track your personality journey and coaching sessions
          </p>
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
              {personalityType || (assessmentSessions.length > 0 ? "Completed" : "Not Taken")}
            </div>
            <p className="text-xs text-muted-foreground">
              {assessmentSessions.length > 0
                ? `${assessmentSessions.length} assessment${
                    assessmentSessions.length > 1 ? "s" : ""
                  }`
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
            <div className="text-2xl font-bold text-foreground">{coachSessions.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedCoachSessions} completed • {coachSessions.length - completedCoachSessions}{" "}
              in progress
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
              {assessmentSessions.length > 0 && coachSessions.length > 0
                ? "Active"
                : "Getting Started"}
            </div>
            <p className="text-xs text-muted-foreground">
              {assessmentSessions.length > 0 && coachSessions.length > 0
                ? "You're on your journey!"
                : "Complete the test and start coaching"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Personality Test Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Personality Test</h2>

        {assessmentSessions.length === 0 ? (
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
                      <strong className="text-lg">{personalityType || "Analyzing..."}</strong>
                    </CardDescription>
                    {latestAssessment?.completedAt && (
                      <p className="text-sm text-green-300/60 mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        {new Date(latestAssessment.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <Link href={ROUTES.PERSONALITY_TEST}>
                  <Button variant="outline" size="sm">
                    Retake Test
                  </Button>
                </Link>
              </div>
            </CardHeader>
            {latestAssessment?.analysisData ? (
              <CardContent>
                <details className="mt-4">
                  <summary className="cursor-pointer font-medium text-green-400 hover:text-green-300">
                    View Full Analysis
                  </summary>
                  <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-4 text-sm border border-border text-muted-foreground">
                    {JSON.stringify(latestAssessment.analysisData, null, 2)}
                  </pre>
                </details>
              </CardContent>
            ) : null}
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
            {coachSessions.map((sessionId, index) => {
              const session = sessionDetails[sessionId];
              if (!session) return null;
              return (
                <Card key={sessionId} className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-foreground">
                          Session {coachSessions.length - index}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">{sessionId}</CardDescription>
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
