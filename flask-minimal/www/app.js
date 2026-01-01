// Use preact with htm for JSX-like syntax without transpilation
const { h, render } = preact;
const { useState } = preactHooks;
const html = htm.bind(h);

// Import data from data.js
import { personalityTypes } from "/config.js";
// Import the AssessmentPage component
import { AssessmentPage } from "/assessment.js";

// Navbar Component
const Navbar = () => {
  return html`
    <nav class="navbar">
      <div class="container navbar-container">
        <div class="logo">PersonalityLens</div>
      </div>
    </nav>
  `;
};

// Personality Card Component
const PersonalityCard = ({ title, description, mbti }) => {
  return html`
    <div class="personality-card">
      <h3 class="personality-title">${title}</h3>
      <p class="personality-description">${description}</p>
      ${mbti && html`<p class="personality-mbti"><strong>MBTI:</strong> ${mbti}</p>`}
    </div>
  `;
};

// Main App Component
const App = () => {
  const [showAssessment, setShowAssessment] = useState(false);

  const startAssessment = () => {
    setShowAssessment(true);
  };

  const handleBackFromAssessment = () => {
    setShowAssessment(false);
  };

  if (showAssessment) {
    return html`<${AssessmentPage} onBack=${handleBackFromAssessment} />`;
  }

  return html`
    <${Navbar} />
    <main>
      <section class="personality-section">
        <div class="container">
          <h2 class="section-title">Personality Types</h2>
          <p class="section-subtitle">
            Explore different personality types and their characteristics. Understanding these types
            can help you better understand yourself and others.
          </p>
          <div class="personality-grid">
            ${personalityTypes.map(
              (type) => html`
                <${PersonalityCard}
                  title=${type.title}
                  description=${type.description}
                  mbti=${type.mbti}
                  key=${type.id}
                />
              `
            )}
          </div>
        </div>
      </section>

      <section class="personality-section">
        <div class="container">
          <h2 class="section-title">Discover Your Personality Type</h2>
          <p class="section-subtitle">
            Talk to our AI assistant to help identify your personality traits and learn more about
            yourself.
          </p>

          <button class="btn" onClick=${startAssessment}>Start Personality Assessment</button>
        </div>
      </section>
    </main>
  `;
};

// Render the app
render(html`<${App} />`, document.getElementById("app"));
