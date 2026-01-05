/**
 * Central configuration file for all environment variables
 * This is the single source of truth for loading process.env values
 */

const DEFAULT_ADMIN_TOKEN = "TTAI-STARTER-ADMIN-TOKEN";

/**
 * Feature Flags
 * Control optional features at build/runtime
 */
export const FeatureFlags = {
  /**
   * Enable SAT (Scenario Access Token) mode for embedding scenarios.
   * When enabled, embed URLs will be generated using short-lived access tokens
   * instead of direct scenario URLs. This is required for private scenarios.
   *
   * Set NEXT_PUBLIC_USE_SAT=true to enable.
   */
  useSAT: process.env.NEXT_PUBLIC_USE_SAT === "true",

  /**
   * Default SAT token duration in hours (1-24).
   * Only used when useSAT is enabled.
   */
  satDurationHours: parseInt(process.env.SAT_DURATION_HOURS || "4", 10),
} as const;

/**
 * Application Configuration
 * Centralized config object with nested structure
 */
export const AppConfig = {
  app: {
    name: "Personality Lab",
    shortName: "Personality Lab",
    description: "Discover your MBTI personality type through AI-powered conversations",
    isDev: process.env.NEXT_PUBLIC_IS_DEV === "true",
  },

  toughTongue: {
    apiKey: process.env.TOUGH_TONGUE_API_KEY || "",
  },

  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  },

  admin: {
    token: process.env.ADMIN_TOKEN || DEFAULT_ADMIN_TOKEN,
    defaultToken: DEFAULT_ADMIN_TOKEN,
  },

  features: FeatureFlags,
} as const;

// Validation helper (not exported)
const isConfigValid = (config: Record<string, string>): boolean => {
  return Object.values(config).every((value) => value && value !== "");
};

// Validation functions
export const isFirebaseConfigured = (): boolean => {
  return isConfigValid(AppConfig.firebase);
};

export const isToughTongueConfigured = (): boolean => {
  return AppConfig.toughTongue.apiKey !== "";
};
