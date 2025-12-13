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
 * List all accounts
 */
export async function listAccounts(): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const response = await admin.accounts.list();

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
    logger.error(`Error listing accounts: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListAccountsError",
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
 * Get account details
 */
export async function getAccount(args: {
  account_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const accountName =
      args.account_id.startsWith("accounts/")
        ? args.account_id
        : `accounts/${args.account_id}`;

    const response = await admin.accounts.get({
      name: accountName,
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
    logger.error(`Error getting account: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetAccountError",
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
 * List all properties
 */
export async function listProperties(args?: {
  account_id?: string;
  filter?: string;
  page_size?: number;
  page_token?: string;
  show_deleted?: boolean;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    // If no filter is provided, use accountSummaries.list() which doesn't require a filter
    // and returns all accounts with their properties
    if (!args?.account_id && !args?.filter) {
      const response = await admin.accountSummaries.list({
        pageSize: args?.page_size,
        pageToken: args?.page_token,
      });

      // Extract properties from account summaries
      const properties: any[] = [];
      if (response.data.accountSummaries) {
        for (const account of response.data.accountSummaries) {
          if (account.propertySummaries) {
            properties.push(...account.propertySummaries);
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                properties: properties,
                nextPageToken: response.data.nextPageToken,
              },
              null,
              2
            ),
          },
        ],
        isError: false,
      };
    }

    // If filter is provided, use properties.list() with the filter
    const requestParams: any = {};

    if (args?.account_id) {
      requestParams.filter = `parent:accounts/${args.account_id}`;
    } else if (args?.filter) {
      requestParams.filter = args.filter;
    }

    if (args?.page_size) {
      requestParams.pageSize = args.page_size;
    }

    if (args?.page_token) {
      requestParams.pageToken = args.page_token;
    }

    if (args?.show_deleted !== undefined) {
      requestParams.showDeleted = args.show_deleted;
    }

    const response = await admin.properties.list(requestParams);

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
    logger.error(`Error listing properties: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListPropertiesError",
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

// Note: These methods are not available in the current googleapis client
// They may require direct REST API calls or a newer client version
// getAttributionSettings, getDataRetentionSettings, getGoogleSignalsSettings, getPropertyQuotasSnapshot

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
 * Create a new property
 */
export async function createProperty(args: {
  display_name: string;
  time_zone: string;
  currency_code: string;
  account_id?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const requestBody: any = {
      displayName: args.display_name,
      timeZone: args.time_zone,
      currencyCode: args.currency_code,
    };

    if (args.account_id) {
      const accountName =
        args.account_id.startsWith("accounts/")
          ? args.account_id
          : `accounts/${args.account_id}`;
      requestBody.parent = accountName;
    }

    const response = await admin.properties.create({
      requestBody: requestBody,
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
    logger.error(`Error creating property: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreatePropertyError",
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
 * Update an existing property
 */
export async function updateProperty(args: {
  property_id: string | number;
  display_name?: string;
  time_zone?: string;
  currency_code?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const updateMask: string[] = [];
    const requestBody: any = { name: propertyName };

    if (args.display_name !== undefined) {
      requestBody.displayName = args.display_name;
      updateMask.push("display_name");
    }
    if (args.time_zone !== undefined) {
      requestBody.timeZone = args.time_zone;
      updateMask.push("time_zone");
    }
    if (args.currency_code !== undefined) {
      requestBody.currencyCode = args.currency_code;
      updateMask.push("currency_code");
    }

    if (updateMask.length === 0) {
      throw new Error("No fields provided for update.");
    }

    const response = await admin.properties.patch({
      name: propertyName,
      updateMask: updateMask.join(","),
      requestBody: requestBody,
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
    logger.error(`Error updating property: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "UpdatePropertyError",
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
 * Delete a property
 */
export async function deleteProperty(args: {
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

    await admin.properties.delete({
      name: propertyName,
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ success: true }, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(`Error deleting property: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "DeletePropertyError",
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
    name: "list_accounts",
    description:
      "Lists all Google Analytics accounts that the user has access to.",
    inputSchema: {
      type: "object",
      properties: {},
    },
    handler: listAccounts,
  },
  {
    name: "get_account",
    description:
      "Retrieves detailed information about a specific Google Analytics account.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description:
            "The Google Analytics account ID. Can be a number or 'accounts/NUMBER' format.",
        },
      },
      required: ["account_id"],
    },
    handler: getAccount,
  },
  {
    name: "list_properties",
    description:
      "Lists all Google Analytics properties. Can be filtered by account ID.",
    inputSchema: {
      type: "object",
      properties: {
        account_id: {
          type: "string",
          description:
            "Optional. Filter properties by account ID (e.g., 'accounts/123456789').",
        },
        filter: {
          type: "string",
          description:
            "Optional. Filter expression for properties (e.g., 'parent:accounts/123456789').",
        },
        page_size: {
          type: "number",
          description: "Optional. Maximum number of properties to return.",
        },
        page_token: {
          type: "string",
          description: "Optional. Token for pagination.",
        },
        show_deleted: {
          type: "boolean",
          description: "Optional. Include deleted properties in results.",
        },
      },
    },
    handler: listProperties,
  },
  {
    name: "get_property_details",
    description:
      "Returns detailed information about a specific Google Analytics property.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
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
          type: "string",
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: getCustomDimensionsAndMetrics,
  },
  {
    name: "create_property",
    description: "Creates a new Google Analytics property.",
    inputSchema: {
      type: "object",
      properties: {
        display_name: {
          type: "string",
          description: "The human-readable display name for the property.",
        },
        time_zone: {
          type: "string",
          description:
            "The property's time zone. Format as a [IANA Time Zone](https://www.iana.org/time-zones) identifier (e.g., 'America/Los_Angeles').",
        },
        currency_code: {
          type: "string",
          description:
            "The currency code for the property. Format as an [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code (e.g., 'USD', 'EUR').",
        },
        account_id: {
          type: "string",
          description:
            "Optional. The Google Analytics account ID under which to create the property. If not provided, the property will be created under a default account if available.",
        },
      },
      required: ["display_name", "time_zone", "currency_code"],
    },
    handler: createProperty,
  },
  {
    name: "update_property",
    description: "Updates an existing Google Analytics property.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID to update.",
        },
        display_name: {
          type: "string",
          description:
            "Optional. The new human-readable display name for the property.",
        },
        time_zone: {
          type: "string",
          description:
            "Optional. The new property's time zone. Format as a [IANA Time Zone](https://www.iana.org/time-zones) identifier.",
        },
        currency_code: {
          type: "string",
          description:
            "Optional. The new currency code for the property. Format as an [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217) currency code.",
        },
      },
      required: ["property_id"],
    },
    handler: updateProperty,
  },
  {
    name: "delete_property",
    description:
      "Deletes a Google Analytics property. This is a soft delete and the property can be recovered.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID to delete.",
        },
      },
      required: ["property_id"],
    },
    handler: deleteProperty,
  },
  {
    name: "list_google_ads_links",
    description:
      "Returns a list of links between Google Analytics properties and Google Ads accounts.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: listGoogleAdsLinks,
  },
];

