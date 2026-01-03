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
  Trash2,
  Key,
} from "lucide-react";

// =============================================================================
// Admin Token Input Component
// =============================================================================

function AdminTokenInput({
  variant = "full",
  onTokenSet,
}: {
  variant?: "full" | "compact";
  onTokenSet?: () => void;
}) {
  const [input, setInput] = useState("");
  const adminToken = useAppStore((s) => s.adminToken);
  const setAdminToken = useAppStore((s) => s.setAdminToken);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      setAdminToken(input.trim());
      setInput("");
      onTokenSet?.();
    }
  };

  // Compact variant - just input + button inline
  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2">
        <Input
          type="password"
          placeholder={adminToken ? "Change token..." : "Enter token"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-40 h-8 text-sm"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button size="sm" onClick={() => handleSubmit()} disabled={!input.trim()}>
          <Key className="h-3 w-3 mr-1" />
          {adminToken ? "Update" : "Set"}
        </Button>
      </div>
    );
  }

  // Full variant - card with explanation
  return (
    <Card className="w-full max-w-md bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-teal-500/20 p-3">
            <Lock className="h-8 w-8 text-teal-400" />
          </div>
        </div>
        <CardTitle className="text-center text-foreground">Admin Access</CardTitle>
        <CardDescription className="text-center">
          Enter your admin token to access the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin token"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700"
            disabled={!input.trim()}
          >
            <Key className="h-4 w-4 mr-2" />
            Set Admin Token
          </Button>
        </form>
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            Token is stored locally and sent with admin API requests.
          </p>
        </div>
      </CardContent>
    </Card>
  );
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
  const adminToken = useAppStore((s) => s.adminToken);
  const clearAll = useAppStore((s) => s.clearAll);
  const appStore = useAppStore();

  const [stats, setStats] = useState<{
    balance: Balance | null;
    sessions: SessionListItem[];
    isLoadingBalance: boolean;
    isLoadingSessions: boolean;
    error: string | null;
  }>({
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

  // Scenario selector
  const [selectedScenario, setSelectedScenario] = useState<string>(SCENARIOS.PERSONALITY_TEST);

  // Store editor state
  const [storeJson, setStoreJson] = useState("");
  const [storeError, setStoreError] = useState<string | null>(null);
  const [storeSaved, setStoreSaved] = useState(false);

  const isAuthenticated = !!adminToken;

  // Initialize store JSON when authenticated (exclude sessionDetails - too noisy)
  useEffect(() => {
    if (isAuthenticated) {
      const {
        user,
        userPersonalityType,
        userPersonalityAssessment,
        userPersonalitySessionId,
        assessmentSessions,
        coachSessions,
      } = appStore;
      setStoreJson(
        JSON.stringify(
          {
            user,
            userPersonalityType,
            userPersonalityAssessment,
            userPersonalitySessionId,
            assessmentSessions,
            coachSessions,
          },
          null,
          2
        )
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

  // Fetch data
  const fetchBalance = useCallback(async () => {
    if (!adminToken) return;
    setStats((prev) => ({ ...prev, isLoadingBalance: true, error: null }));
    try {
      const response = await fetch("/api/balance", {
        headers: { "x-admin-token": adminToken },
      });
      if (!response.ok)
        throw new Error(response.status === 401 ? "Invalid token" : "Failed to fetch");
      const data = await response.json();
      if (typeof data.available_minutes === "number") {
        setStats((prev) => ({ ...prev, balance: data as Balance, isLoadingBalance: false }));
      }
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        balance: null,
        isLoadingBalance: false,
        error: err instanceof Error ? err.message : "Failed to load balance",
      }));
    }
  }, [adminToken]);

  const fetchSessions = useCallback(async () => {
    if (!adminToken) return;
    setStats((prev) => ({ ...prev, isLoadingSessions: true, error: null }));
    try {
      const response = await fetch(`/api/sessions?scenario_id=${selectedScenario}&limit=100`, {
        headers: { "x-admin-token": adminToken },
      });
      if (!response.ok)
        throw new Error(response.status === 401 ? "Invalid token" : "Failed to fetch");
      const data = await response.json();
      const recentSessions = (data.sessions || []).filter((s: SessionListItem) =>
        isWithinLast30Days(s.created_at)
      );
      setStats((prev) => ({ ...prev, sessions: recentSessions, isLoadingSessions: false }));
    } catch (err) {
      setStats((prev) => ({
        ...prev,
        isLoadingSessions: false,
        error: err instanceof Error ? err.message : "Failed to load sessions",
      }));
    }
  }, [adminToken, selectedScenario]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchSessions();
    }
  }, [isAuthenticated, fetchBalance, fetchSessions]);

  // Handle analysis
  const handleAnalyze = async () => {
    if (!selectedSession || !adminToken) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/sessions/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: selectedSession }),
      });
      if (!response.ok) throw new Error((await response.json()).error || "Analysis failed");
      setAnalysisResult(await response.json());
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
              Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_IS_DEV=true</code> to enable.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <AdminTokenInput variant="full" />
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor usage and manage sessions</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <AdminTokenInput variant="compact" />
          <Button variant="destructive" size="sm" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" />
            Clear State
          </Button>
        </div>
      </div>

      {/* Error Banner */}
      {stats.error ? (
        <Card className="mb-6 border-red-500/30 bg-red-500/10">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <p className="text-sm text-red-400">{stats.error}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
          ) : stats.balance ? (
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Sessions (Last 30 Days)</CardTitle>
              <CardDescription>View sessions for a specific scenario</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="h-9 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              >
                <option value={SCENARIOS.PERSONALITY_TEST}>Personality Test</option>
                <option value={SCENARIOS.PERSONALITY_COACH}>Personality Coach</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchSessions}
                disabled={stats.isLoadingSessions}
              >
                <RefreshCw className={`h-4 w-4 ${stats.isLoadingSessions ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {stats.isLoadingSessions ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading sessions...
            </div>
          ) : stats.sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No sessions found</div>
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
                      className={`border-b border-border/50 hover:bg-muted/30 cursor-pointer ${
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
                          <code className="font-mono text-xs">{session.id}</code>
                          <button
                            onClick={(e) => copyToClipboard(session.id, e)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {copiedId === session.id ? (
                              <Check className="h-3 w-3 text-green-400" />
                            ) : (
                              <Copy className="h-3 w-3 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        {session.user_name || session.user_email || "-"}
                      </td>
                      <td className="py-3 px-2">{formatDuration(session.duration)}</td>
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

          {stats.sessions.length > 0 ? (
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stats.sessions.length} session{stats.sessions.length !== 1 ? "s" : ""}
                {selectedSession ? <span className="text-teal-400 ml-2">• Selected</span> : null}
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={!selectedSession || isAnalyzing}
                className="bg-teal-600 hover:bg-teal-700"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isAnalyzing ? "Analyzing..." : "Run Analysis"}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResult || analysisError ? (
        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-400" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysisError ? (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400">{analysisError}</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">{analysisResult.summary}</p>
                <details>
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
      ) : null}

      {/* Local Store Editor */}
      <Card className="bg-card border-border">
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
              {storeSaved ? <Check className="h-4 w-4 mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              {storeSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {storeError ? (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{storeError}</p>
            </div>
          ) : null}
          <textarea
            value={storeJson}
            onChange={(e) => setStoreJson(e.target.value)}
            className="w-full h-60 font-mono text-xs p-4 bg-background border border-border rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-teal-500/50"
            spellCheck={false}
          />
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const {
                  user,
                  userPersonalityType,
                  userPersonalityAssessment,
                  userPersonalitySessionId,
                  assessmentSessions,
                  coachSessions,
                } = appStore;
                setStoreJson(
                  JSON.stringify(
                    {
                      user,
                      userPersonalityType,
                      userPersonalityAssessment,
                      userPersonalitySessionId,
                      assessmentSessions,
                      coachSessions,
                    },
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
