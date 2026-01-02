"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppConfig } from "@/lib/config";
import {
  STORAGE_KEYS,
  SCENARIOS,
  type PersonalityTestResult,
  type CoachSession,
} from "@/lib/constants";
import { AlertTriangle, CheckCircle2, Database, Key, Lock, Settings, Users } from "lucide-react";

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
    let totalTests = 0;
    let totalSessions = 0;
    let storageSize = 0;

    // Count localStorage items
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          storageSize += new Blob([value]).size;

          if (key === STORAGE_KEYS.PERSONALITY_TEST_RESULT) {
            totalTests = 1;
          }
          if (key === STORAGE_KEYS.COACH_SESSIONS) {
            try {
              const sessions = JSON.parse(value) as CoachSession[];
              totalSessions = sessions.length;
            } catch (e) {
              console.error("Error parsing coach sessions:", e);
            }
          }
        }
      }
    }

    setStats({ totalTests, totalSessions, storageSize });
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
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT);
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.PERSONALITY_TEST_COMPLETED_AT);
      calculateStats();
      alert("Personality test data cleared.");
    }
  };

  const handleClearCoachData = () => {
    if (confirm("Are you sure you want to clear all coach session data?")) {
      localStorage.removeItem(STORAGE_KEYS.COACH_SESSIONS);
      calculateStats();
      alert("Coach session data cleared.");
    }
  };

  const exportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      personalityTest: localStorage.getItem(STORAGE_KEYS.PERSONALITY_TEST_RESULT),
      coachSessions: localStorage.getItem(STORAGE_KEYS.COACH_SESSIONS),
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-gray-100 p-3">
                <Lock className="h-8 w-8 text-gray-600" />
              </div>
            </div>
            <CardTitle className="text-center">Admin Access</CardTitle>
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
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </div>
              <Button type="submit" className="w-full">
                Access Admin Dashboard
              </Button>
            </form>

            {AppConfig.admin.isUsingDefaultToken && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="inline h-4 w-4 mr-1" />
                  Default token is being used:{" "}
                  <code className="font-mono">{AppConfig.admin.defaultToken}</code>
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
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage app data and configuration</p>
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
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <CardTitle className="text-red-900">Security Warning</CardTitle>
                <CardDescription className="text-red-700">
                  You are using the default admin token (
                  <code className="font-mono">{AppConfig.admin.defaultToken}</code>). Please set a
                  custom <code className="font-mono">ADMIN_TOKEN</code> environment variable for
                  production use.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Personality Tests</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <p className="text-xs text-muted-foreground">Tests completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coach Sessions</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(stats.storageSize / 1024).toFixed(2)} KB</div>
            <p className="text-xs text-muted-foreground">localStorage size</p>
          </CardContent>
        </Card>
      </div>

      {/* Configuration */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>App configuration and scenario IDs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Personality Test Scenario</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                {SCENARIOS.PERSONALITY_TEST}
              </code>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Personality Coach Scenario</p>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded block mt-1">
                {SCENARIOS.PERSONALITY_COACH}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Export or clear user data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button onClick={exportData} variant="outline">
              Export All Data
            </Button>
            <Button onClick={handleClearTestData} variant="outline" className="text-orange-600">
              Clear Test Data
            </Button>
            <Button onClick={handleClearCoachData} variant="outline" className="text-orange-600">
              Clear Coach Data
            </Button>
            <Button onClick={handleClearAllData} variant="destructive">
              Clear All Data
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Note:</strong> This app uses browser localStorage for data persistence. Data
              is stored locally on each user's device and is not synced to a server.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
