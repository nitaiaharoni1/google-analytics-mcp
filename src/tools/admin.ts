/**
 * Google Analytics Admin Tools
 * Tools for managing properties, accounts, and configuration
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Get account summaries (list of accounts and properties)
 */
export async function getAccountSummaries(): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const response = await admin.accountSummaries.list();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(
      `Error getting account summaries: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "AccountSummariesError",
              message: (error as Error).message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get property details
 */
export async function getPropertyDetails(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const response = await admin.properties.get({
      name: propertyName,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(`Error getting property details: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "PropertyDetailsError",
              message: (error as Error).message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

/**
 * Get custom dimensions and metrics for a property
 */
export async function getCustomDimensionsAndMetrics(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const [dimensionsResponse, metricsResponse] = await Promise.all([
      admin.properties.customDimensions.list({ parent: propertyName }),
      admin.properties.customMetrics.list({ parent: propertyName }),
    ]);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              customDimensions: dimensionsResponse.data.customDimensions || [],
              customMetrics: metricsResponse.data.customMetrics || [],
            },
            null,
            2
          ),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(
      `Error getting custom dimensions/metrics: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CustomDefinitionsError",
              message: (error as Error).message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

/**
 * List Google Ads links for a property
 */
export async function listGoogleAdsLinks(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const response = await admin.properties.googleAdsLinks.list({
      parent: propertyName,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(`Error listing Google Ads links: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GoogleAdsLinksError",
              message: (error as Error).message,
            },
            null,
            2
          ),
        },
      ],
      isError: true,
    };
  }
}

export const adminTools: MCPToolDefinition[] = [
  {
    name: "get_account_summaries",
    description:
      "Retrieves information about the user's Google Analytics accounts and properties. Returns a list of accounts with their associated properties.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: getAccountSummaries,
  },
  {
    name: "get_property_details",
    description:
      "Returns detailed information about a specific Google Analytics property.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: getPropertyDetails,
  },
  {
    name: "get_custom_dimensions_and_metrics",
    description:
      "Retrieves the custom dimensions and custom metrics configured for a specific property.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: getCustomDimensionsAndMetrics,
  },
  {
    name: "list_google_ads_links",
    description:
      "Returns a list of links between Google Analytics properties and Google Ads accounts.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: listGoogleAdsLinks,
  },
];

