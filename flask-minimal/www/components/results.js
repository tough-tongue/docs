// Use preact with htm for JSX-like syntax without transpilation
const { h } = preact;
const html = htm.bind(h);

/**
 * Pure component to display assessment results
 * @param {Object} props - Component props
 * @param {Object} props.sessionData - Session data (id, timestamp, etc)
 * @param {Object} props.assessment - Assessment results data
 * @param {Function} props.onBackToAssessment - Callback when user wants to go back to assessment
 * @param {Function} props.onBackToHome - Callback when user wants to go back to home
 */
export const ResultsDisplay = ({ sessionData, assessment, onBackToAssessment, onBackToHome }) => {
  if (!assessment) {
    return html`<p class="empty-message">No assessment data available</p>`;
  }

  return html`
    <div class="container assessment-container">
      <h2 class="section-title">Your Assessment Results</h2>

      <div class="assessment-content">
        <h3>Session Summary</h3>
        <div class="summary-info">
          <p><strong>Session ID:</strong> ${sessionData.sessionId}</p>
          <p><strong>Completed:</strong> ${new Date(sessionData.timestamp).toLocaleString()}</p>
          ${assessment.evaluation?.overall_score &&
          html`<p><strong>Overall Score:</strong> ${assessment.evaluation.overall_score}</p>`}
        </div>

        ${assessment.evaluation &&
        html`
          <h3>Evaluation</h3>
          <div class="evaluation-container">
            ${assessment.evaluation.detailed_feedback &&
            html`
              <div class="feedback-section">
                <h4>Detailed Feedback</h4>
                <p>${assessment.evaluation.detailed_feedback}</p>
              </div>
            `}

            <div class="strengths-weaknesses">
              ${assessment.evaluation.strengths &&
              html`
                <div class="strengths">
                  <h4>Strengths</h4>
                  <p>${assessment.evaluation.strengths}</p>
                </div>
              `}
              ${assessment.evaluation.weaknesses &&
              html`
                <div class="weaknesses">
                  <h4>Areas for Improvement</h4>
                  <p>${assessment.evaluation.weaknesses}</p>
                </div>
              `}
            </div>
          </div>
        `}
        ${assessment.improvement &&
        html`
          <h3>Improvement Plan</h3>
          <div class="improvement-container">
            ${assessment.improvement.improvement_areas &&
            html`
              <div class="improvement-areas">
                <h4>Focus Areas</h4>
                <p>${assessment.improvement.improvement_areas}</p>
              </div>
            `}
            ${assessment.improvement.action_items &&
            html`
              <div class="action-items">
                <h4>Action Items</h4>
                <pre class="content-pre">${assessment.improvement.action_items}</pre>
              </div>
            `}
            ${assessment.improvement.resources &&
            html`
              <div class="resources">
                <h4>Recommended Resources</h4>
                <div class="markdown-content">
                  <pre class="content-pre">${assessment.improvement.resources}</pre>
                </div>
              </div>
            `}
          </div>
        `}
      </div>

      <div class="assessment-buttons">
        <button class="btn return-btn" onClick=${onBackToAssessment}>Back to Assessment</button>
        <button class="btn return-btn" onClick=${onBackToHome}>Return to Home</button>
      </div>
    </div>
  `;
};
