"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore, type SessionDetails, type ReportCardItem } from "@/lib/store";
import { ROUTES } from "@/lib/constants";
import {
  FileText,
  Loader2,
  Download,
  AlertCircle,
  CheckCircle,
  Play,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Copy,
  User,
} from "lucide-react";
import Link from "next/link";

// Map topic keys to readable labels
const DIMENSION_LABELS: Record<string, { label: string; description: string }> = {
  extraversion_introversion: {
    label: "Energy Direction",
    description: "Where you focus your attention and get energy",
  },
  sensing_intuition: {
    label: "Information Processing",
    description: "How you prefer to take in information",
  },
  thinking_feeling: {
    label: "Decision Making",
    description: "How you prefer to make decisions",
  },
  judging_perceiving: {
    label: "Lifestyle Orientation",
    description: "How you prefer to organize your life",
  },
  personality_assessment: {
    label: "Your Personality Type",
    description: "Your overall MBTI type based on all dimensions",
  },
};

function ResultsContent() {
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Store
  const assessmentSessions = useAppStore((s) => s.assessmentSessions);
  const sessionDetails = useAppStore((s) => s.sessionDetails);
  const updateSessionDetails = useAppStore((s) => s.updateSessionDetails);

  const selectedSession = selectedSessionId ? sessionDetails[selectedSessionId] : null;

  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const fetchSession = async (sessionId: string) => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to fetch session");
      }

      const data = await response.json();

      updateSessionDetails(sessionId, {
        scenario_id: data.scenario_id,
        scenario_name: data.scenario_name,
        status: data.status,
        created_at: data.created_at,
        completed_at: data.completed_at,
        user_name: data.user_name,
        user_email: data.user_email,
        duration: data.duration,
        finalized_transcript: data.finalized_transcript || data.transcript_content,
        evaluation_results: data.evaluation_results,
        improvement_results: data.improvement_results,
      });
    } catch (err) {
      console.error("Error fetching session:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch session");
    } finally {
      setIsFetching(false);
    }
  };

  const analyzeSession = async (sessionId: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to analyze session");
      }

      // Re-fetch session to get updated evaluation
      await fetchSession(sessionId);
    } catch (err) {
      console.error("Error analyzing session:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze session");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString();
  };

  // Extract personality type and dimensions from report card
  const getPersonalityData = (reportCard?: ReportCardItem[]) => {
    if (!reportCard) return { type: null, dimensions: [] };

    const typeItem = reportCard.find((item) => item.topic === "personality_assessment");
    const dimensions = reportCard.filter((item) => item.topic !== "personality_assessment");

    return {
      type: typeItem?.score_str || null,
      typeNote: typeItem?.note || null,
      dimensions,
    };
  };

  // No sessions
  if (assessmentSessions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Results</h1>
          <p className="text-muted-foreground">View your personality assessment results</p>
        </div>

        <Card className="max-w-lg mx-auto bg-card border-border">
          <CardHeader className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>No Sessions Yet</CardTitle>
            <CardDescription>Take a personality test to see your results here</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href={ROUTES.TEST}>
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Play className="h-4 w-4 mr-2" />
                Take the Test
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Results</h1>
        <p className="text-muted-foreground">View your personality assessment results</p>
      </div>

      {/* Sessions Table */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <CardTitle>Sessions</CardTitle>
          <CardDescription>
            {assessmentSessions.length} session{assessmentSessions.length > 1 ? "s" : ""} recorded
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Session ID
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Created</th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Duration
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                    Analyzed
                  </th>
                  <th className="text-left py-2 px-2 text-muted-foreground font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {assessmentSessions.map((id) => {
                  const details = sessionDetails[id];
                  const isSelected = selectedSessionId === id;
                  const isAnalyzed = !!details?.evaluation_results;
                  return (
                    <tr
                      key={id}
                      className={`border-b border-border/50 cursor-pointer hover:bg-muted/50 ${
                        isSelected ? "bg-teal-500/10" : ""
                      }`}
                      onClick={() => setSelectedSessionId(id)}
                    >
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono break-all">{id}</code>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(id);
                            }}
                          >
                            {copiedId === id ? (
                              <CheckCircle className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {details?.created_at ? formatDate(details.created_at) : "-"}
                      </td>
                      <td className="py-2 px-2 text-muted-foreground">
                        {formatDuration(details?.duration)}
                      </td>
                      <td className="py-2 px-2">
                        {isAnalyzed ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <CheckCircle className="h-4 w-4" />
                            Yes
                          </span>
                        ) : (
                          <span className="text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="py-2 px-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSessionId(id);
                            fetchSession(id);
                          }}
                          disabled={isFetching}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Fetch
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error ? (
        <Card className="mb-6 border-red-500/30 bg-red-500/10">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription className="text-red-300/80">{error}</CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {/* Loading */}
      {isFetching ? (
        <Card className="mb-6 border-blue-500/30 bg-blue-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <CardTitle className="text-blue-400">Fetching Session...</CardTitle>
            </div>
          </CardHeader>
        </Card>
      ) : null}

      {/* Selected Session Details */}
      {selectedSessionId && selectedSession ? (
        <div className="space-y-6">
          {/* Session Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Session Details</CardTitle>
                  <CardDescription className="font-mono text-xs mt-1">
                    {selectedSessionId}
                  </CardDescription>
                </div>
                {!selectedSession.evaluation_results ? (
                  <Button
                    onClick={() => analyzeSession(selectedSessionId)}
                    disabled={isAnalyzing}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Analyze Session
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">User</p>
                  <p className="font-medium text-foreground">{selectedSession.user_name || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium text-foreground">
                    {formatDuration(selectedSession.duration)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground capitalize">
                    {selectedSession.status || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Completed</p>
                  <p className="font-medium text-foreground">
                    {selectedSession.completed_at
                      ? new Date(selectedSession.completed_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personality Assessment Results */}
          {selectedSession.evaluation_results?.report_card ? (
            <>
              {/* Personality Type Hero */}
              {(() => {
                const { type, typeNote, dimensions } = getPersonalityData(
                  selectedSession.evaluation_results?.report_card
                );
                return (
                  <>
                    {/* Main Personality Type Card */}
                    {type ? (
                      <Card className="bg-gradient-to-br from-teal-500/20 to-cyan-500/10 border-teal-500/30">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-teal-500/20 flex items-center justify-center">
                            <User className="h-10 w-10 text-teal-400" />
                          </div>
                          <CardTitle className="text-4xl font-bold text-teal-400">{type}</CardTitle>
                          <CardDescription className="text-lg mt-2">
                            Your Personality Type
                          </CardDescription>
                        </CardHeader>
                        {typeNote ? (
                          <CardContent>
                            <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                              {typeNote.split("\n")[0].replace(/^Based on the conversation, /, "")}
                            </p>
                          </CardContent>
                        ) : null}
                      </Card>
                    ) : null}

                    {/* Four Dimensions */}
                    {dimensions.length > 0 ? (
                      <Card className="bg-card border-border">
                        <CardHeader>
                          <CardTitle>Your Personality Dimensions</CardTitle>
                          <CardDescription>
                            How you scored across the four MBTI dimensions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid gap-4 md:grid-cols-2">
                            {dimensions.map((item) => {
                              const info = DIMENSION_LABELS[item.topic] || {
                                label: item.topic,
                                description: "",
                              };
                              return (
                                <div
                                  key={item.topic}
                                  className="p-4 rounded-lg bg-background border border-border"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <p className="text-sm text-muted-foreground">{info.label}</p>
                                      <p className="text-xl font-semibold text-teal-400">
                                        {item.score_str}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    {info.description}
                                  </p>
                                  <details className="mt-3">
                                    <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                      View details
                                    </summary>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                      {item.note}
                                    </p>
                                  </details>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ) : null}
                  </>
                );
              })()}
            </>
          ) : null}

          {/* Strengths & Areas for Growth */}
          {selectedSession.evaluation_results?.strengths ||
          selectedSession.evaluation_results?.weaknesses ? (
            <div className="grid gap-6 md:grid-cols-2">
              {selectedSession.evaluation_results.strengths ? (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="h-5 w-5" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedSession.evaluation_results.strengths
                        .replace(/####.*?\n/g, "")
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/- /g, "• ")
                        .trim()}
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              {selectedSession.evaluation_results.weaknesses ? (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-400">
                      <AlertCircle className="h-5 w-5" />
                      Areas for Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedSession.evaluation_results.weaknesses
                        .replace(/####.*?\n/g, "")
                        .replace(/\*\*(.*?)\*\*/g, "$1")
                        .replace(/- /g, "• ")
                        .trim()}
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          ) : null}

          {/* Transcript Accordion */}
          {selectedSession.finalized_transcript ? (
            <Card className="bg-card border-border">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setTranscriptOpen(!transcriptOpen)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {transcriptOpen ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    Conversation Transcript
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    Click to {transcriptOpen ? "collapse" : "expand"}
                  </span>
                </div>
              </CardHeader>
              {transcriptOpen ? (
                <CardContent>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {selectedSession.finalized_transcript.split("\n\n").map((line, i) => {
                      const isAI = line.includes("] AI:");
                      const isUser = line.includes("] User:");
                      if (!isAI && !isUser) return null;

                      // Extract timestamp and content
                      const match = line.match(/\[(.*?)\] (AI|User): (.*)/);
                      if (!match) return null;

                      const [, timestamp, role, content] = match;

                      return (
                        <div
                          key={i}
                          className={`p-3 rounded-lg text-sm ${
                            isAI
                              ? "bg-teal-500/10 border border-teal-500/20"
                              : "bg-background border border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-xs font-medium ${
                                isAI ? "text-teal-400" : "text-muted-foreground"
                              }`}
                            >
                              {role === "AI" ? "Dr. Sarah Chen" : "You"}
                            </span>
                            <span className="text-xs text-muted-foreground">{timestamp}</span>
                          </div>
                          <p className="text-foreground">{content}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              ) : null}
            </Card>
          ) : null}

          {/* Raw Data */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Raw Data</CardTitle>
            </CardHeader>
            <CardContent>
              <details>
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  View raw JSON
                </summary>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-background p-4 text-xs text-muted-foreground border border-border">
                  {JSON.stringify(selectedSession, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        </div>
      ) : selectedSessionId ? (
        <Card className="bg-card border-border">
          <CardHeader className="text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle>Session Not Loaded</CardTitle>
            <CardDescription>Click "Fetch" to load session details</CardDescription>
          </CardHeader>
        </Card>
      ) : null}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <AuthGuard
      title="Sign In to View Results"
      description="Sign in to view your personality test results"
    >
      <ResultsContent />
    </AuthGuard>
  );
}
