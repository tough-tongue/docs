import { useState, useEffect } from "react";

export default function useSessionManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Session state (using local state instead of Zustand)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<unknown>(null);
  const [sessionDetails, setSessionDetails] = useState<unknown>(null);
  const [sessionAnalysis, setSessionAnalysis] = useState<unknown>(null);

  // Function to fetch session details when button is clicked
  const fetchSessionDetails = async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tough-tongue/sessions/${sessionId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch session details");
      }

      setSessionDetails(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      console.error("Error fetching session details:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to analyze the session when button is clicked
  const analyzeSession = async () => {
    if (!sessionId) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/tough-tongue/sessions/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze session");
      }

      setSessionAnalysis(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred";
      console.error("Error analyzing session:", err);
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Listen for iframe events
  useEffect(() => {
    const handleIframeEvents = (event: MessageEvent) => {
      const data = event.data;

      if (data && data.event) {
        console.log("Received event:", data);

        switch (data.event) {
          case "onStart":
            console.log("Session started:", data);
            break;

          case "onStop":
            console.log("Session stopped:", data);
            setSessionId(data.sessionId);
            setSessionData(data);
            break;
        }
      }
    };

    window.addEventListener("message", handleIframeEvents);

    return () => {
      window.removeEventListener("message", handleIframeEvents);
    };
  }, []);

  return {
    isLoading,
    isAnalyzing,
    error,
    analysisError,
    sessionId,
    sessionData,
    sessionDetails,
    sessionAnalysis,
    fetchSessionDetails,
    analyzeSession,
  };
}
