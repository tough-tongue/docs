"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppConfig } from "@/lib/config";
import { SCENARIOS, type SessionListItem, type Balance, type SessionAnalysis } from "@/lib/ttai";
import { useAppStore, type AppState } from "@/lib/store";
import {
  AlertTriangle,
  Lock,
  ShieldOff,
  Wallet,
  RefreshCw,
  Play,
  Loader2,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  Database,
  Save,
} from "lucide-react";

// =============================================================================
// Types
// =============================================================================

interface AdminStats {
  balance: Balance | null;
  sessions: SessionListItem[];
  isLoadingBalance: boolean;
  isLoadingSessions: boolean;
  error: string | null;
}

// =============================================================================
// Helper Functions
// =============================================================================

function formatDuration(seconds?: number): string {
  if (seconds === undefined || seconds === null) return "-";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isWithinLast30Days(dateString: string): boolean {
  const date = new Date(dateString);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return date >= thirtyDaysAgo;
}

function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "text-green-400";
    case "active":
      return "text-blue-400";
    case "cancelled":
    case "terminated":
      return "text-red-400";
    default:
      return "text-muted-foreground";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    case "active":
      return <Play className="h-4 w-4 text-blue-400" />;
    case "cancelled":
    case "terminated":
      return <XCircle className="h-4 w-4 text-red-400" />;
    default:
      return null;
  }
}

// =============================================================================
// Main Component
// =============================================================================

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const [stats, setStats] = useState<AdminStats>({
    balance: null,
    sessions: [],
    isLoadingBalance: false,
    isLoadingSessions: false,
    error: null,
  });

  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SessionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Store editor state
  const appStore = useAppStore();
  const [storeJson, setStoreJson] = useState("");
  const [storeError, setStoreError] = useState<string | null>(null);
  const [storeSaved, setStoreSaved] = useState(false);

  // Initialize store JSON when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const { user, assessmentSessions, coachSessions, sessionDetails } = appStore;
      setStoreJson(
        JSON.stringify({ user, assessmentSessions, coachSessions, sessionDetails }, null, 2)
      );
    }
  }, [isAuthenticated, appStore]);

  const handleSaveStore = () => {
    try {
      const parsed = JSON.parse(storeJson) as Partial<AppState>;
      appStore.setRawState(parsed);
      setStoreError(null);
      setStoreSaved(true);
      setTimeout(() => setStoreSaved(false), 2000);
    } catch (err) {
      setStoreError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const copyToClipboard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Check session storage for existing auth
  useEffect(() => {
    const authenticated = sessionStorage.getItem("admin_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  const fetchBalance = useCallback(async () => {
    setStats((prev) => ({ ...prev, isLoadingBalance: true, error: null }));
    try {
      const response = await fetch("/api/balance");
      if (!response.ok) throw new Error("Failed to fetch balance");
      const data = await response.json();
      // Validate response structure
      if (typeof data.available_minutes === "number") {
        setStats((prev) => ({ ...prev, balance: data as Balance, isLoadingBalance: false }));
      } else {
        throw new Error("Invalid balance response");
      }
    } catch {
      setStats((prev) => ({
        ...prev,
        balance: null,
        isLoadingBalance: false,
        error: "Failed to load balance",
      }));
    }
  }, []);

  const fetchSessions = useCallback(async () => {
    setStats((prev) => ({ ...prev, isLoadingSessions: true, error: null }));
    try {
      const response = await fetch(
        `/api/sessions?scenario_id=${SCENARIOS.PERSONALITY_TEST}&limit=100`
      );
      if (!response.ok) throw new Error("Failed to fetch sessions");
      const data = await response.json();

      // Filter to last 30 days
      const recentSessions = (data.sessions || []).filter((s: SessionListItem) =>
        isWithinLast30Days(s.created_at)
      );

      setStats((prev) => ({
        ...prev,
        sessions: recentSessions,
        isLoadingSessions: false,
      }));
    } catch {
      setStats((prev) => ({
        ...prev,
        isLoadingSessions: false,
        error: "Failed to load sessions",
      }));
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchSessions();
    }
  }, [isAuthenticated, fetchBalance, fetchSessions]);

  // Handle analysis
  const handleAnalyze = async () => {
    if (!selectedSession) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedSession }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Analysis failed");
      }

      const result: SessionAnalysis = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Admin page disabled in production
  if (!AppConfig.app.isDev) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-red-500/20 p-3">
                <ShieldOff className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-center text-foreground">Admin Disabled</CardTitle>
            <CardDescription className="text-center">
              The admin panel is disabled in production mode. Set{" "}
              <code className="bg-muted px-1 rounded">NEXT_PUBLIC_IS_DEV=true</code> to enable it.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Login form
  if (!isAuthenticated) {
    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (tokenInput === AppConfig.admin.token) {
        setIsAuthenticated(true);
        setLoginError("");
        sessionStorage.setItem("admin_authenticated", "true");
      } else {
        setLoginError("Invalid admin token");
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-teal-500/20 p-3">
                <Lock className="h-8 w-8 text-teal-400" />
              </div>
            </div>
            <CardTitle className="text-center text-foreground">Admin Access</CardTitle>
            <CardDescription className="text-center">
              Enter the admin token to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="Enter admin token"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full"
                />
                {loginError && <p className="text-sm text-destructive mt-2">{loginError}</p>}
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                Access Admin Dashboard
              </Button>
            </form>

            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-sm text-yellow-400">
                <AlertTriangle className="inline h-4 w-4 mr-1" />
                Dev mode enabled. Default token:{" "}
                <code className="font-mono bg-yellow-500/20 px-1 rounded">
                  {AppConfig.admin.defaultToken}
                </code>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor usage and manage sessions</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            sessionStorage.removeItem("admin_authenticated");
            setIsAuthenticated(false);
          }}
        >
          Logout
        </Button>
      </div>

      {/* Dev Mode Banner */}
      <Card className="mb-6 border-yellow-500/30 bg-yellow-500/10">
        <CardContent className="py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
            <p className="text-sm text-yellow-400">
              Development mode active. Disable{" "}
              <code className="font-mono bg-yellow-500/20 px-1 rounded">NEXT_PUBLIC_IS_DEV</code> in
              production.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Balance Card */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-teal-400" />
              <CardTitle className="text-lg">Available Minutes</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalance}
              disabled={stats.isLoadingBalance}
            >
              <RefreshCw className={`h-4 w-4 ${stats.isLoadingBalance ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.isLoadingBalance ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : stats.balance && typeof stats.balance.available_minutes === "number" ? (
            <div className="text-3xl font-bold text-foreground">
              {stats.balance.available_minutes.toFixed(1)}{" "}
              <span className="text-lg font-normal text-muted-foreground">minutes</span>
            </div>
          ) : (
            <p className="text-muted-foreground">Unable to load balance</p>
          )}
        </CardContent>
      </Card>

      {/* Sessions Table */}
      <Card className="mb-6 bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Sessions (Last 30 Days)</CardTitle>
              <CardDescription>
                Personality test sessions • Scenario: {SCENARIOS.PERSONALITY_TEST}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchSessions}
              disabled={stats.isLoadingSessions}
            >
              <RefreshCw className={`h-4 w-4 ${stats.isLoadingSessions ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {stats.isLoadingSessions ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading sessions...
            </div>
          ) : stats.sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No sessions found in the last 30 days
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Select
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Session ID
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      <Clock className="h-4 w-4 inline mr-1" />
                      Duration
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.sessions.map((session) => (
                    <tr
                      key={session.id}
                      className={`border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors ${
                        selectedSession === session.id ? "bg-teal-500/10" : ""
                      }`}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <td className="py-3 px-2">
                        <input
                          type="radio"
                          name="session"
                          checked={selectedSession === session.id}
                          onChange={() => setSelectedSession(session.id)}
                          className="accent-teal-500"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-xs text-foreground">{session.id}</code>
                          <button
                            onClick={(e) => copyToClipboard(session.id, e)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            title="Copy session ID"
                          >
                            {copiedId === session.id ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-foreground">
                        {session.user_name || session.user_email || (
                          <span className="text-muted-foreground">Anonymous</span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-foreground">
                        {formatDuration(session.duration)}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`flex items-center gap-1 ${getStatusColor(session.status)}`}
                        >
                          {getStatusIcon(session.status)}
                          {session.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {formatDate(session.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Action Bar */}
          {stats.sessions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stats.sessions.length} session{stats.sessions.length !== 1 ? "s" : ""} •{" "}
                {selectedSession ? (
                  <span className="text-teal-400">Selected</span>
                ) : (
                  "Select a session to analyze"
                )}
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedSession || isAnalyzing}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {(analysisResult || analysisError) && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-400" />
              Analysis Results
            </CardTitle>
            {analysisResult && (
              <CardDescription>Session: {analysisResult.session_id}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {analysisError ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{analysisError}</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                {/* Summary */}
                <div>
                  <h4 className="font-medium text-foreground mb-2">Summary</h4>
                  <p className="text-muted-foreground">{analysisResult.summary}</p>
                </div>

                {/* Evaluation */}
                {analysisResult.evaluation && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisResult.evaluation.score !== undefined && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold text-foreground">
                          {analysisResult.evaluation.score}
                        </p>
                      </div>
                    )}
                    {analysisResult.evaluation.feedback && (
                      <div className="p-3 bg-muted/30 rounded-lg">
                        <p className="text-sm text-muted-foreground">Feedback</p>
                        <p className="text-foreground">{analysisResult.evaluation.feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths & Improvements */}
                {(analysisResult.evaluation?.strengths ||
                  analysisResult.evaluation?.improvements) && (
                  <div className="grid md:grid-cols-2 gap-4">
                    {analysisResult.evaluation?.strengths && (
                      <div>
                        <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {analysisResult.evaluation.strengths.map((s, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.evaluation?.improvements && (
                      <div>
                        <h4 className="font-medium text-orange-400 mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {analysisResult.evaluation.improvements.map((s, i) => (
                            <li
                              key={i}
                              className="text-sm text-muted-foreground flex items-start gap-2"
                            >
                              <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Raw JSON */}
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    View raw JSON
                  </summary>
                  <pre className="mt-2 p-4 bg-background rounded-lg border border-border text-xs overflow-x-auto">
                    {JSON.stringify(analysisResult, null, 2)}
                  </pre>
                </details>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Local Store Editor */}
      <Card className="mt-6 bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-teal-400" />
              <CardTitle>Local Store Editor</CardTitle>
            </div>
            <Button
              onClick={handleSaveStore}
              disabled={storeSaved}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
            >
              {storeSaved ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
          <CardDescription>
            Edit the local Zustand store directly. Changes persist to localStorage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {storeError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{storeError}</p>
            </div>
          )}
          <textarea
            value={storeJson}
            onChange={(e) => setStoreJson(e.target.value)}
            className="w-full h-80 font-mono text-xs p-4 bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            spellCheck={false}
          />
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Keys: <code className="bg-muted px-1 rounded">user</code>,{" "}
              <code className="bg-muted px-1 rounded">assessmentSessions</code>,{" "}
              <code className="bg-muted px-1 rounded">coachSessions</code>,{" "}
              <code className="bg-muted px-1 rounded">sessionDetails</code>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const { user, assessmentSessions, coachSessions, sessionDetails } = appStore;
                setStoreJson(
                  JSON.stringify(
                    { user, assessmentSessions, coachSessions, sessionDetails },
                    null,
                    2
                  )
                );
                setStoreError(null);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
