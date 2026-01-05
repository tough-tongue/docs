/**
 * ToughTongue AI - Client-Side Utilities
 *
 * Client-side utilities for embedding ToughTongue AI scenarios
 * and handling iframe communication.
 */

import type {
  EmbedUrlOptions,
  IframeEventData,
  IframeStartEvent,
  IframeStopEvent,
  IframeTerminatedEvent,
  IframeSubmitEvent,
  SATResponse,
  SATEmbedOptions,
  CreateSATRequest,
} from "./types";
import { TOUGHTONGUE_ORIGIN, TOUGHTONGUE_EMBED_BASE, SCENARIOS } from "./constants";
import { FeatureFlags } from "@/lib/config";

// =============================================================================
// Embed URL Builder
// =============================================================================

/**
 * Builds an embed URL for a ToughTongue AI scenario
 */
export function buildEmbedUrl(options: EmbedUrlOptions): string {
  const {
    scenarioId,
    background,
    userName,
    userEmail,
    promptUserInfo,
    dynamicVariables,
    accessToken,
  } = options;

  const url = new URL(`${TOUGHTONGUE_EMBED_BASE}/${scenarioId}`);

  // Add SAT token if provided
  if (accessToken) {
    url.searchParams.set("scenarioAccessToken", accessToken);
  }

  if (background) {
    url.searchParams.set("bg", background);
  }
  if (userName) {
    url.searchParams.set("userName", userName);
  }
  if (userEmail) {
    url.searchParams.set("userEmail", userEmail);
  }
  if (promptUserInfo && !userName) {
    url.searchParams.set("promptUserInfo", "true");
  }
  if (dynamicVariables) {
    Object.entries(dynamicVariables).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  return url.toString();
}

// =============================================================================
// SAT (Scenario Access Token) Utilities
// =============================================================================

/**
 * Fetches a Scenario Access Token from the API
 * @param request - SAT request parameters
 * @returns Promise resolving to SATResponse
 */
export async function fetchSAT(request: CreateSATRequest): Promise<SATResponse> {
  const response = await fetch("/api/sat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Failed to create SAT" }));
    throw new Error(error.error || "Failed to create SAT");
  }

  return response.json();
}

/**
 * Checks if SAT mode is enabled via feature flags
 */
export function isSATEnabled(): boolean {
  return FeatureFlags.useSAT;
}

/**
 * Builds an embed URL with SAT support.
 * If a SAT response is provided, uses the pre-built iframe_src and appends
 * any additional parameters (userName, userEmail, etc.)
 *
 * @example
 * // With pre-fetched SAT (recommended - uses iframe_src directly)
 * const sat = await fetchSAT({ scenario_id: "abc123" });
 * const url = buildSATEmbedUrl({ scenarioId: "abc123", sat });
 *
 * // Without SAT (direct embed)
 * const url = buildSATEmbedUrl({ scenarioId: "abc123" });
 */
export function buildSATEmbedUrl(options: SATEmbedOptions): string {
  const { sat, ...embedOptions } = options;

  // If SAT is provided, use the pre-built iframe_src as base
  if (sat?.iframe_src) {
    const url = new URL(sat.iframe_src);

    // Add additional parameters
    const { background, userName, userEmail, promptUserInfo, dynamicVariables } = embedOptions;

    if (background) {
      url.searchParams.set("bg", background);
    }
    if (userName) {
      url.searchParams.set("userName", userName);
    }
    if (userEmail) {
      url.searchParams.set("userEmail", userEmail);
    }
    if (promptUserInfo && !userName) {
      url.searchParams.set("promptUserInfo", "true");
    }
    if (dynamicVariables) {
      Object.entries(dynamicVariables).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  // Fallback: build URL manually with access_token
  return buildEmbedUrl({
    ...embedOptions,
    accessToken: sat?.access_token,
  });
}

/**
 * Helper to get an embed URL with automatic SAT handling.
 * Fetches SAT if SAT mode is enabled, otherwise returns direct URL.
 *
 * @example
 * const url = await getEmbedUrlWithSAT({ scenarioId: "abc123", userName: "John" });
 */
export async function getEmbedUrlWithSAT(options: SATEmbedOptions): Promise<string> {
  // If SAT mode is not enabled, return direct embed URL
  if (!isSATEnabled()) {
    return buildEmbedUrl(options);
  }

  // If SAT is already provided, use it
  if (options.sat) {
    return buildSATEmbedUrl(options);
  }

  // Fetch SAT and build URL
  const sat = await fetchSAT({ scenario_id: options.scenarioId });
  return buildSATEmbedUrl({ ...options, sat });
}

/**
 * Builds embed URL for personality test scenario
 */
export function buildPersonalityTestUrl(options: {
  userName?: string;
  userEmail?: string;
}): string {
  return buildEmbedUrl({
    scenarioId: SCENARIOS.PERSONALITY_TEST,
    background: "black",
    userName: options.userName,
    userEmail: options.userEmail,
    promptUserInfo: !options.userName,
  });
}

/**
 * Builds embed URL for personality coach scenario
 */
export function buildCoachUrl(options: {
  userName?: string;
  userEmail?: string;
  userPersonalityAssessment?: string;
}): string {
  return buildEmbedUrl({
    scenarioId: SCENARIOS.PERSONALITY_COACH,
    background: "black",
    userName: options.userName,
    userEmail: options.userEmail,
    dynamicVariables: options.userPersonalityAssessment
      ? { t_user_personality_assessment: options.userPersonalityAssessment }
      : undefined,
  });
}

// =============================================================================
// Iframe Event Handler
// =============================================================================

type EventCallback<T> = (event: T) => void;

interface IframeEventHandlers {
  /** Called when a session begins (agent is connected) */
  onStart?: EventCallback<IframeStartEvent>;
  /** Called when a session ends normally */
  onStop?: EventCallback<IframeStopEvent>;
  /** Called when a session is terminated (e.g., max duration reached) */
  onTerminated?: EventCallback<IframeTerminatedEvent>;
  /** Called when post-session data submission is completed */
  onSubmit?: EventCallback<IframeSubmitEvent>;
  /** Called on errors */
  onError?: (error: { code: string; message: string }) => void;
  /** Called when the iframe is ready */
  onReady?: (scenarioId: string) => void;
}

/**
 * Normalizes different event payload formats from ToughTongue iframe
 *
 * The API can send events in different formats:
 * - Format A: { event: 'onStart', sessionId: '...', timestamp: 123 }
 * - Format B: { type: 'onStart', data: { session_id: '...', ... } }
 */
function normalizeEventPayload(rawData: Record<string, unknown>): {
  eventType: string;
  data: IframeEventData;
} | null {
  // Format A: { event: 'onStart', sessionId: '...', timestamp: 123 }
  if (rawData.event && typeof rawData.event === "string") {
    return {
      eventType: rawData.event,
      data: {
        session_id: (rawData.sessionId as string) || (rawData.session_id as string) || "",
        scenario_id: rawData.scenarioId as string | undefined,
        duration_seconds: rawData.duration_seconds as number | undefined,
        timestamp: typeof rawData.timestamp === "number" ? rawData.timestamp : Date.now(),
      },
    };
  }

  // Format B: { type: 'onStart', data: { session_id: '...', ... } }
  if (rawData.type && typeof rawData.type === "string") {
    const nestedData = (rawData.data as Record<string, unknown>) || {};
    return {
      eventType: rawData.type,
      data: {
        session_id: (nestedData.session_id as string) || "",
        scenario_id: nestedData.scenario_id as string | undefined,
        duration_seconds: nestedData.duration_seconds as number | undefined,
        timestamp:
          typeof nestedData.timestamp === "number"
            ? nestedData.timestamp
            : typeof nestedData.timestamp === "string"
            ? new Date(nestedData.timestamp).getTime()
            : Date.now(),
      },
    };
  }

  return null;
}

/**
 * Creates a message event listener for ToughTongue iframe events
 *
 * Events emitted:
 * - onStart: When a session begins (agent is connected)
 * - onStop: When a session ends (agent is disconnected)
 * - onTerminated: When session is terminated (e.g., max duration)
 * - onSubmit: When post-session data submission is completed
 *
 * @returns Cleanup function to remove the listener
 */
export function createIframeEventListener(handlers: IframeEventHandlers): () => void {
  const handleMessage = (event: MessageEvent) => {
    // Only accept messages from ToughTongue origin
    if (event.origin !== TOUGHTONGUE_ORIGIN) return;

    const rawData = event.data as Record<string, unknown>;
    if (!rawData || typeof rawData !== "object") return;

    // Handle error events separately (they have a different structure)
    if (rawData.type === "onError" || rawData.event === "onError") {
      const errorData =
        (rawData.data as { code: string; message: string }) ||
        ({ code: "unknown", message: String(rawData.message || "Unknown error") } as {
          code: string;
          message: string;
        });
      handlers.onError?.(errorData);
      return;
    }

    // Handle ready events
    if (rawData.type === "onReady" || rawData.event === "onReady") {
      const scenarioId =
        (rawData.data as { scenario_id?: string })?.scenario_id ||
        (rawData.scenarioId as string) ||
        "";
      handlers.onReady?.(scenarioId);
      return;
    }

    // Normalize the event payload
    const normalized = normalizeEventPayload(rawData);
    if (!normalized) return;

    const { eventType, data } = normalized;

    switch (eventType) {
      case "onStart":
        handlers.onStart?.({ type: "onStart", data });
        break;
      case "onStop":
        handlers.onStop?.({ type: "onStop", data });
        break;
      case "onTerminated":
        handlers.onTerminated?.({ type: "onTerminated", data });
        break;
      case "onSubmit":
        handlers.onSubmit?.({ type: "onSubmit", data });
        break;
    }
  };

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}
