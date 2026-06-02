/**
 * Central environment configuration.
 * All process.env reads live here. Import Config everywhere else.
 *
 * Sections:
 * - Helpers
 * - Config class
 * - Guard helpers
 */

const DEFAULT_PASSWORD = "changeme-in-prod";
const DEFAULT_APP_URL = "https://ttai-marketing-agent-demo.vercel.app";
const DEFAULT_TTAI_API_BASE = "https://app.toughtongueai.com/api/public";

function env(name: string): string {
  return process.env[name]?.trim() ?? "";
}

function withProtocol(hostOrUrl: string): string {
  if (!hostOrUrl) return "";
  if (/^https?:\/\//.test(hostOrUrl)) return hostOrUrl;
  return `https://${hostOrUrl}`;
}

function resolveAppUrl(): string {
  return withProtocol(
    env("NEXT_PUBLIC_APP_URL") ||
      env("VERCEL_PROJECT_PRODUCTION_URL") ||
      env("VERCEL_URL") ||
      DEFAULT_APP_URL,
  ).replace(/\/$/, "");
}

export class Config {
  static readonly app_name = "The Camellias";
  static readonly app_description =
    "Super-luxury residences on Golf Course Road, Gurugram — powered by an AI concierge that navigates the page with you.";

  static get app_url(): string {
    return resolveAppUrl();
  }

  static get is_dev(): boolean {
    return env("NEXT_PUBLIC_IS_DEV") === "true";
  }

  static get admin(): {
    isDefaultPassword: boolean;
  } {
    const password = Config.srv.adminPassword;
    return {
      isDefaultPassword: password === DEFAULT_PASSWORD,
    };
  }

  // Server-side values. Never import these into browser-only helpers.
  static get srv(): {
    adminPassword: string;
    redisRestToken: string;
    redisRestUrl: string;
    toughTongueApiToken: string;
    toughTongueApiBase: string;
  } {
    return {
      adminPassword: env("ADMIN_PASSWORD") || DEFAULT_PASSWORD,
      redisRestToken: env("UPSTASH_REDIS_REST_TOKEN") ||
        env("KV_REST_API_TOKEN"),
      redisRestUrl: env("UPSTASH_REDIS_REST_URL") || env("KV_REST_API_URL"),
      toughTongueApiToken: env("TOUGHTONGUE_API_TOKEN"),
      toughTongueApiBase: env("TOUGHTONGUE_API_BASE") || DEFAULT_TTAI_API_BASE,
    };
  }
}

export const isToughTongueConfigured = (): boolean =>
  Config.srv.toughTongueApiToken !== "";
