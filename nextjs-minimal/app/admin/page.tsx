"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppConfig } from "@/lib/config";
import {
  SCENARIOS,
  STORAGE_KEYS,
  clearTestResult,
  clearCoachSessions,
  loadCoachSessions,
  loadTestResult,
  type CoachSession,
} from "@/lib/toughtongue";
import { AlertTriangle, Database, Lock, Settings, Users } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalTests: 0,
    totalSessions: 0,
    storageSize: 0,
  });

  useEffect(() => {
    if (isAuthenticated) {
      calculateStats();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput === AppConfig.admin.token) {
      setIsAuthenticated(true);
      setError("");
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      setError("Invalid admin token");
    }
  };

  const calculateStats = () => {
    let storageSize = 0;

    // Calculate storage size
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          storageSize += new Blob([value]).size;
        }
      }
    }

    // Load data using module functions
    const testResult = loadTestResult();
    const sessions = loadCoachSessions();

    setStats({
      totalTests: testResult ? 1 : 0,
      totalSessions: sessions.length,
      storageSize,
    });
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "⚠️ WARNING: This will delete ALL user data including personality test results and coach sessions. This action cannot be undone. Are you sure?"
      )
    ) {
      localStorage.clear();
      calculateStats();
      alert("All data has been cleared.");
    }
  };

  const handleClearTestData = () => {
    if (confirm("Are you sure you want to clear personality test data?")) {
      clearTestResult();
      calculateStats();
      alert("Personality test data cleared.");
    }
  };

  const handleClearCoachData = () => {
    if (confirm("Are you sure you want to clear all coach session data?")) {
      clearCoachSessions();
      calculateStats();
      alert("Coach session data cleared.");
    }
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      personalityTest: loadTestResult(),
      coachSessions: loadCoachSessions(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `admin-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Check session storage for existing auth
  useEffect(() => {
    const authenticated = sessionStorage.getItem("admin_authenticated");
    if (authenticated === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
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
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                Access Admin Dashboard
              </Button>
            </form>

            {AppConfig.admin.isUsingDefaultToken && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-400">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Default token is being used:{" "}
                  <code className="font-mono bg-yellow-500/20 px-1 rounded">
                    {AppConfig.admin.defaultToken}
                  </code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage app data and configuration</p>
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
      </div>

      {/* Security Warning */}
      {AppConfig.admin.isUsingDefaultToken && (
        <Card className="mb-8 border-red-500/30 bg-red-500/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div>
                <CardTitle className="text-red-400">Security Warning</CardTitle>
                <CardDescription className="text-red-300/80">
                  You are using the default admin token (
                  <code className="font-mono bg-red-500/20 px-1 rounded">
                    {AppConfig.admin.defaultToken}
                  </code>
                  ). Please set a custom{" "}
                  <code className="font-mono bg-red-500/20 px-1 rounded">ADMIN_TOKEN</code>{" "}
                  environment variable for production use.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personality Tests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">Tests completed</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coach Sessions</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(stats.storageSize / 1024).toFixed(2)} KB
            </div>
            <p className="text-xs text-muted-foreground">localStorage size</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>App configuration and scenario IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Personality Test Scenario</p>
              <code className="text-xs bg-background px-2 py-1 rounded block mt-1 border border-border text-foreground">
                {SCENARIOS.PERSONALITY_TEST}
              </code>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Personality Coach Scenario
              </p>
              <code className="text-xs bg-background px-2 py-1 rounded block mt-1 border border-border text-foreground">
                {SCENARIOS.PERSONALITY_COACH}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or clear user data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportData} variant="outline">
              Export All Data
            </Button>
            <Button
              onClick={handleClearTestData}
              variant="outline"
              className="text-orange-400 hover:text-orange-300"
            >
              Clear Test Data
            </Button>
            <Button
              onClick={handleClearCoachData}
              variant="outline"
              className="text-orange-400 hover:text-orange-300"
            >
              Clear Coach Data
            </Button>
            <Button onClick={handleClearAllData} variant="destructive">
              Clear All Data
            </Button>
          </div>

          <div className="mt-6 p-4 bg-background rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              <strong className="text-foreground">Note:</strong> This app uses browser localStorage
              for data persistence. Data is stored locally on each user's device and is not synced
              to a server.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
