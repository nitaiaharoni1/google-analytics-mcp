/**
 * Google Analytics API OAuth2 Scopes
 */

export const GOOGLE_ANALYTICS_SCOPES = [
  "https://www.googleapis.com/auth/analytics.readonly",
  "https://www.googleapis.com/auth/analytics.edit",
] as const;

export const GOOGLE_ANALYTICS_SCOPES_READONLY = [
  "https://www.googleapis.com/auth/analytics.readonly",
] as const;

export type GoogleAnalyticsScope = (typeof GOOGLE_ANALYTICS_SCOPES)[number];
