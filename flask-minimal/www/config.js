// Personality types data
export const personalityTypes = [
  {
    id: 1,
    title: "The Analyst",
    description:
      "Logical, analytical, and detail-oriented. These individuals excel at problem-solving and critical thinking.",
    mbti: "INTJ, INTP, ENTJ, ENTP (NT types)",
  },
  {
    id: 2,
    title: "The Diplomat",
    description:
      "Empathetic, cooperative, and harmony-seeking. These individuals prioritize relationships and emotional connections.",
    mbti: "INFJ, INFP, ENFJ, ENFP (NF types)",
  },
  {
    id: 3,
    title: "The Sentinel",
    description:
      "Organized, practical, and responsible. These individuals value security, stability, and clear rules.",
    mbti: "ISTJ, ISFJ, ESTJ, ESFJ (SJ types)",
  },
  {
    id: 4,
    title: "The Explorer",
    description:
      "Spontaneous, flexible, and adventurous. These individuals seek variety, excitement, and hands-on experiences.",
    mbti: "ISTP, ISFP, ESTP, ESFP (SP types)",
  },
];

// Base API URL is always relative since we're serving from the same Flask app
const API_BASE_URL = "/api";

// ToughTongueAI configuration
export const toughTongueConfig = {
  baseUrl: "https://app.toughtongueai.com",

  // Scenario and authentication
  scenarioId: "680d16f136e4c33b7d517892",

  // Default styling options
  defaultStyles: {
    name: "Personality Assessment",
    color: "indigo-500",
    background: "white",
  },
};

// Backend API configuration
export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    analyze: `${API_BASE_URL}/analyze`,
  },
};
