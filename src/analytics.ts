/**
 * Google Analytics API Client Manager
 * Manages Google Analytics API clients and provides utility functions
 */

import dotenv from "dotenv";
import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { getOAuth2Client, ensureValidToken } from "./auth";
import { analyticsdata_v1beta, analyticsadmin_v1beta, analyticsadmin_v1alpha } from "googleapis";
import { logger } from "./utils/logger";
import { GOOGLE_ANALYTICS_SCOPES } from "./auth/scopes";

// Load environment variables
dotenv.config();

let analyticsDataClient: analyticsdata_v1beta.Analyticsdata | null = null;
let analyticsAdminClient: analyticsadmin_v1beta.Analyticsadmin | null = null;
let analyticsAdminAlphaClient: analyticsadmin_v1alpha.Analyticsadmin | null = null;
let authMethod: "oauth2" | "adc" = "oauth2";
let currentAuthClient: any = null; // Store the authenticated client for REST API calls

/**
 * Initialize Google Analytics API clients
 * Supports both OAuth2 and Application Default Credentials (ADC)
 */
export async function initializeAnalyticsClients(): Promise<void> {
  try {
    let auth: any = null;

    // Try OAuth2 first if credentials are available
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (clientId && clientSecret) {
      try {
        logger.info("🔐 Attempting OAuth2 authentication...");
        await ensureValidToken();
        auth = getOAuth2Client();
        authMethod = "oauth2";
        currentAuthClient = auth; // Store auth client for REST API calls
        logger.success("✅ Using OAuth2 authentication");
      } catch (oauthError) {
        logger.warn(
          `⚠️  OAuth2 authentication failed: ${(oauthError as Error).message}`
        );
        logger.info("🔄 Falling back to Application Default Credentials...");
      }
    }

    // Fall back to Application Default Credentials (ADC)
    if (!auth) {
      try {
        logger.info("🔐 Attempting Application Default Credentials (ADC)...");
        logger.info(
          "💡 ADC checks: GOOGLE_APPLICATION_CREDENTIALS, gcloud auth, metadata service"
        );

        const googleAuth = new GoogleAuth({
          scopes: [...GOOGLE_ANALYTICS_SCOPES],
        });

        auth = await googleAuth.getClient();
        authMethod = "adc";
        currentAuthClient = auth; // Store auth client for REST API calls

        const projectId = await googleAuth.getProjectId().catch(() => null);
        if (projectId) {
          logger.success(
            `✅ Using Application Default Credentials for project: ${projectId}`
          );
        } else {
          logger.success("✅ Using Application Default Credentials");
        }
      } catch (adcError) {
        logger.error(
          `❌ Application Default Credentials failed: ${(adcError as Error).message}`
        );
        throw new Error(
          "All authentication methods failed. Please configure either:\n" +
            "1. OAuth2: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then run 'mcp-google-analytics auth'\n" +
            "2. ADC: Run 'gcloud auth application-default login --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/analytics.edit'"
        );
      }
    }

    // Create Analytics Data API client
    analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth,
    });

    // Create Analytics Admin API client
    analyticsAdminClient = google.analyticsadmin({
      version: "v1beta",
      auth,
    });

    // Create Analytics Admin API alpha client (for data filters)
    analyticsAdminAlphaClient = google.analyticsadmin({
      version: "v1alpha",
      auth,
    });

    logger.success("✅ Google Analytics API clients initialized");
  } catch (error) {
    logger.error(
      `❌ Google Analytics API initialization failed: ${(error as Error).message}`
    );
    throw error;
  }
}

export function getAnalyticsDataClient(): analyticsdata_v1beta.Analyticsdata {
  if (!analyticsDataClient) {
    throw new Error(
      "Analytics Data client not initialized. Call initializeAnalyticsClients() first."
    );
  }
  return analyticsDataClient;
}

export function getAnalyticsAdminClient(): analyticsadmin_v1beta.Analyticsadmin {
  if (!analyticsAdminClient) {
    throw new Error(
      "Analytics Admin client not initialized. Call initializeAnalyticsClients() first."
    );
  }
  return analyticsAdminClient;
}

export function getAnalyticsAdminAlphaClient(): analyticsadmin_v1alpha.Analyticsadmin {
  if (!analyticsAdminAlphaClient) {
    throw new Error(
      "Analytics Admin Alpha client not initialized. Call initializeAnalyticsClients() first."
    );
  }
  return analyticsAdminAlphaClient;
}

export function isAnalyticsClientsInitialized(): boolean {
  return (
    analyticsDataClient !== null &&
    analyticsAdminClient !== null &&
    analyticsAdminAlphaClient !== null
  );
}

export async function ensureAnalyticsClients(): Promise<{
  data: analyticsdata_v1beta.Analyticsdata;
  admin: analyticsadmin_v1beta.Analyticsadmin;
  adminAlpha: analyticsadmin_v1alpha.Analyticsadmin;
}> {
  if (!isAnalyticsClientsInitialized()) {
    await initializeAnalyticsClients();
  } else {
    if (authMethod === "oauth2") {
      await ensureValidToken();
    }
  }
  return {
    data: getAnalyticsDataClient(),
    admin: getAnalyticsAdminClient(),
    adminAlpha: getAnalyticsAdminAlphaClient(),
  };
}

export function __resetForTesting(): void {
  analyticsDataClient = null;
  analyticsAdminClient = null;
  analyticsAdminAlphaClient = null;
  currentAuthClient = null;
}

/**
 * Get authenticated HTTP client for REST API calls
 * Used for APIs not available in googleapis client (e.g., data filters)
 */
export async function getAuthenticatedHttpClient(): Promise<any> {
  // Ensure clients are initialized to get auth
  if (!isAnalyticsClientsInitialized()) {
    await initializeAnalyticsClients();
  }
  
  if (!currentAuthClient) {
    throw new Error("Authentication client not available");
  }
  
  return currentAuthClient;
}

