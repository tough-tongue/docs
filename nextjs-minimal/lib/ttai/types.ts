/**
 * ToughTongue AI - Type Definitions
 *
 * Types for ToughTongue AI API responses and iframe events.
 */

// =============================================================================
// Session Types (API Responses)
// =============================================================================

export interface SessionListItem {
  id: string;
  scenario_id: string;
  scenario_name?: string;
  user_name?: string;
  user_email?: string;
  duration?: number;
  status: "active" | "completed" | "cancelled" | "terminated";
  created_at: string;
  completed_at?: string;
}

export interface SessionAnalysis {
  session_id: string;
  summary: string;
  evaluation: {
    score?: number;
    feedback?: string;
    strengths?: string[];
    improvements?: string[];
  };
  transcript?: Array<{
    role: "user" | "ai";
    content: string;
    timestamp: string;
  }>;
  metadata?: Record<string, unknown>;
}

// =============================================================================
// Balance Types
// =============================================================================

export interface Balance {
  available_minutes: number;
  last_updated: string;
}

// =============================================================================
// Iframe Event Types
// =============================================================================

export type IframeEventType =
  | "onStart"
  | "onStop"
  | "onTerminated"
  | "onSubmit"
  | "onError"
  | "onReady";

/**
 * Normalized iframe event data after parsing
 */
export interface IframeEventData {
  session_id: string;
  scenario_id?: string;
  duration_seconds?: number;
  timestamp: number;
}

export interface IframeStartEvent {
  type: "onStart";
  data: IframeEventData;
}

export interface IframeStopEvent {
  type: "onStop";
  data: IframeEventData;
}

export interface IframeTerminatedEvent {
  type: "onTerminated";
  data: IframeEventData;
}

export interface IframeSubmitEvent {
  type: "onSubmit";
  data: IframeEventData;
}

export interface IframeErrorEvent {
  type: "onError";
  data: {
    code: string;
    message: string;
  };
}

export interface IframeReadyEvent {
  type: "onReady";
  data: {
    scenario_id: string;
  };
}

export type IframeEvent =
  | IframeStartEvent
  | IframeStopEvent
  | IframeTerminatedEvent
  | IframeSubmitEvent
  | IframeErrorEvent
  | IframeReadyEvent;

// =============================================================================
// Embed URL Builder Types
// =============================================================================

export interface EmbedUrlOptions {
  scenarioId: string;
  background?: "black" | "white" | "transparent";
  userName?: string;
  userEmail?: string;
  promptUserInfo?: boolean;
  dynamicVariables?: Record<string, string>;
  /** SAT token for authenticated access (required for private scenarios) */
  accessToken?: string;
}

// =============================================================================
// SAT (Scenario Access Token) Types
// =============================================================================

/**
 * Request to create a Scenario Access Token
 */
export interface CreateSATRequest {
  scenario_id: string;
  /** Token validity duration in hours (1-24, default: 4) */
  duration_hours?: number;
  /** Optional user email for org context */
  email?: string;
}

/**
 * Response from creating a Scenario Access Token
 */
export interface SATResponse {
  access_token: string;
  expires_at: string;
  /** Pre-built iframe src URL with the access token included */
  iframe_src: string;
}

/**
 * Options for building an embed URL with SAT support
 */
export interface SATEmbedOptions extends Omit<EmbedUrlOptions, "accessToken"> {
  /** Pre-fetched SAT token. If not provided and useSAT is enabled, caller must fetch it */
  sat?: SATResponse;
}
