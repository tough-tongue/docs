/**
 * ToughTongue AI - Client-Side Module
 *
 * Client-side utilities for ToughTongue AI integrations.
 * For server-side API calls, use app/api/ttai/client.ts
 * For state management, use lib/store.ts
 *
 * @example
 * import { buildPersonalityTestUrl, createIframeEventListener, SCENARIOS } from '@/lib/ttai';
 *
 * // With SAT support (for private scenarios)
 * import { fetchSAT, buildSATEmbedUrl, getEmbedUrlWithSAT, isSATEnabled } from '@/lib/ttai';
 */

// Re-export constants
export { TOUGHTONGUE_ORIGIN, TOUGHTONGUE_EMBED_BASE, SCENARIOS, SCENARIO_URLS } from "./constants";

// Re-export client-side types
export type {
  // Iframe types
  IframeEvent,
  IframeEventType,
  IframeStartEvent,
  IframeStopEvent,
  IframeErrorEvent,
  IframeReadyEvent,
  // Embed types
  EmbedUrlOptions,
  // SAT types
  CreateSATRequest,
  SATResponse,
  SATEmbedOptions,
  // Response types (for consuming API responses)
  SessionAnalysis,
  SessionListItem,
  Balance,
} from "./types";

// Re-export client utilities
export {
  // URL builders
  buildEmbedUrl,
  buildPersonalityTestUrl,
  buildCoachUrl,
  // SAT utilities
  fetchSAT,
  isSATEnabled,
  buildSATEmbedUrl,
  getEmbedUrlWithSAT,
  // Event handling
  createIframeEventListener,
} from "./client";
