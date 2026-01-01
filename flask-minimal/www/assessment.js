// Use preact with htm for JSX-like syntax without transpilation
const { h } = preact;
const { useState, useEffect } = preactHooks;
const html = htm.bind(h);

// Import configuration
import { apiConfig, toughTongueConfig } from "/config.js";
// Import components
import { ResultsDisplay } from "/components/results.js";

/**
 * Analyze a session by sending a POST request to the analyze endpoint
 * @param {string} sessionId - The session ID to analyze
 * @returns {Promise<Object>} - The analysis results or error object
 */
const analyzeSession = async (sessionId) => {
  try {
    const response = await fetch(apiConfig.endpoints.analyze, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error: ${response.status}`, errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error || "Unknown error"}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error analyzing session:", error);
    return {
      error: true,
      message: error.message || "Failed to analyze session. Please try again.",
    };
  }
};

// Build the iframe URL with customization options
const buildIframeUrl = () => {
  // Use the minimal embed URL format
  let baseUrl = `${toughTongueConfig.baseUrl}/embed/${toughTongueConfig.scenarioId}`;

  // Add customization parameters
  const params = new URLSearchParams();

  // Add custom styling options
  params.append("name", toughTongueConfig.defaultStyles.name);
  params.append("color", toughTongueConfig.defaultStyles.color);
  params.append("bg", toughTongueConfig.defaultStyles.background || "black");

  // Enable features as per the example
  params.append("pulse", "true");
  params.append("transcribe", "true");

  return `${baseUrl}?${params.toString()}`;
};

// Assessment Page Component
export const AssessmentPage = ({ onBack }) => {
  const [sessionData, setSessionData] = useState(null);
  const [sessionIdInput, setSessionIdInput] = useState("");
  const [showAssessmentResults, setShowAssessmentResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [error, setError] = useState(null);

  // Listen for messages from the iframe
  useEffect(() => {
    const handleMessage = async (event) => {
      const data = event.data;

      if (data && data.event) {
        console.log("Received event:", data);

        switch (data.event) {
          case "onStart":
            console.log("Session started:", data);
            // Store the session ID
            setSessionData({
              sessionId: data.sessionId,
              status: "started",
              timestamp: data.timestamp,
            });
            setSessionIdInput(data.sessionId);
            break;

          case "onStop":
            console.log("Session stopped:", data);
            // Update session status but keep iframe visible
            const sessionId = data.sessionId || (sessionData && sessionData.sessionId);

            setSessionData((prevData) => ({
              ...prevData,
              status: "completed",
              timestamp: data.timestamp,
            }));
            break;
        }
      }
    };

    window.addEventListener("message", handleMessage);

    // Clean up event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [sessionData]);

  // Function to view assessment results
  const viewAssessmentResults = async () => {
    const sessionIdToAnalyze = sessionIdInput.trim();

    if (!sessionIdToAnalyze) {
      alert("Please enter a valid session ID.");
      return;
    }

    setLoading(true);

    try {
      // Update session data if needed
      if (!sessionData || sessionData.sessionId !== sessionIdToAnalyze) {
        setSessionData({
          sessionId: sessionIdToAnalyze,
          status: "external",
          timestamp: new Date().toISOString(),
        });
      }

      // Fetch assessment data
      const data = await analyzeSession(sessionIdToAnalyze);

      if (data.error) {
        throw new Error(data.message || "Failed to fetch assessment");
      }

      setAssessment(data);
      setError(null);
      setShowAssessmentResults(true);
    } catch (err) {
      console.error("Error fetching assessment:", err);
      setError(err.message);
      setAssessment(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle session ID input change
  const handleSessionIdChange = (e) => {
    setSessionIdInput(e.target.value);
  };

  // Session ID input and assessment button UI
  const SessionControls = () => html`
    <div class="session-controls">
      <div class="session-id-box">
        <label for="session-id-input">Session ID:</label>
        <input
          id="session-id-input"
          type="text"
          value=${sessionIdInput}
          onChange=${handleSessionIdChange}
          placeholder="Enter session ID"
          class="session-id-input"
        />
      </div>

      <div>
        <button class="btn back-button" onClick=${onBack}>Back to Main Page</button>
        <button class="btn" onClick=${viewAssessmentResults}>Get Assessment Results</button>
      </div>
    </div>
  `;

  // Show assessment results view
  if (showAssessmentResults) {
    if (loading) {
      return html`
        <div class="container assessment-page">
          <${SessionControls} />

          <div class="assessment-loading">
            <h2>Loading your assessment...</h2>
            <div class="loading-spinner"></div>
          </div>
        </div>
      `;
    }

    if (error) {
      return html`
        <div class="container assessment-page">
          <${SessionControls} />

          <div class="assessment-error">
            <h2>Error loading assessment</h2>
            <p>${error}</p>
            <button class="btn" onClick=${() => setShowAssessmentResults(false)}>Try Again</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="container assessment-page">
        <${SessionControls} />

        <${ResultsDisplay}
          sessionData=${sessionData}
          assessment=${assessment}
          onBackToAssessment=${() => setShowAssessmentResults(false)}
          onBackToHome=${onBack}
        />
      </div>
    `;
  }

  // Show iframe view
  return html`
    <div class="container assessment-page">
      <div class="iframe-container active">
        <iframe
          src=${buildIframeUrl()}
          width="100%"
          height="100%"
          frameborder="0"
          allow="microphone"
        ></iframe>
      </div>

      <${SessionControls} />
    </div>
  `;
};
