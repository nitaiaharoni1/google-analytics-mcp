/**
 * Google Analytics Integrations Tools
 * Tools for managing integrations: Firebase, BigQuery, AdSense, etc.
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Helper to construct property name
 */
function getPropertyName(property_id: string | number): string {
  return typeof property_id === "number"
    ? `properties/${property_id}`
    : property_id.startsWith("properties/")
    ? property_id
    : `properties/${property_id}`;
}

// ==================== Firebase Links ====================

/**
 * List Firebase links for a property
 */
export async function listFirebaseLinks(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const response = await admin.properties.firebaseLinks.list({
      parent: parent,
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
    logger.error(`Error listing Firebase links: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListFirebaseLinksError",
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
 * Get a specific Firebase link
 * Note: Firebase links API doesn't have a direct get method,
 * so we list and filter by name
 */
export async function getFirebaseLink(args: {
  property_id: string | number;
  firebase_link_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/firebaseLinks/${args.firebase_link_id}`;

    // List all Firebase links and find the one matching the ID
    const listResponse = await admin.properties.firebaseLinks.list({
      parent: propertyName,
    });

    const firebaseLinks = listResponse.data.firebaseLinks || [];
    const firebaseLink = firebaseLinks.find(
      (link: any) => link.name === name
    );

    if (!firebaseLink) {
      throw new Error(`Firebase link not found: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(firebaseLink, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(`Error getting Firebase link: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetFirebaseLinkError",
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
 * Create a Firebase link
 */
export async function createFirebaseLink(args: {
  property_id: string | number;
  project_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const response = await admin.properties.firebaseLinks.create({
      parent: parent,
      requestBody: {
        project: args.project_id,
      },
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
    logger.error(`Error creating Firebase link: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateFirebaseLinkError",
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
 * Delete a Firebase link
 */
export async function deleteFirebaseLink(args: {
  property_id: string | number;
  firebase_link_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/firebaseLinks/${args.firebase_link_id}`;

    await admin.properties.firebaseLinks.delete({
      name: name,
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
    logger.error(`Error deleting Firebase link: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "DeleteFirebaseLinkError",
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

// ==================== BigQuery Links ====================

/**
 * List BigQuery links for a property
 */
export async function listBigQueryLinks(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const response = await adminAlpha.properties.bigQueryLinks.list({
      parent: parent,
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
    logger.error(`Error listing BigQuery links: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListBigQueryLinksError",
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
 * Get a specific BigQuery link
 */
export async function getBigQueryLink(args: {
  property_id: string | number;
  bigquery_link_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/bigQueryLinks/${args.bigquery_link_id}`;

    const response = await adminAlpha.properties.bigQueryLinks.get({
      name: name,
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
    logger.error(`Error getting BigQuery link: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetBigQueryLinkError",
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

// ==================== AdSense Links ====================

/**
 * List AdSense links for a property
 */
export async function listAdSenseLinks(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const response = await adminAlpha.properties.adSenseLinks.list({
      parent: parent,
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
    logger.error(`Error listing AdSense links: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListAdSenseLinksError",
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
 * Get a specific AdSense link
 */
export async function getAdSenseLink(args: {
  property_id: string | number;
  adsense_link_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/adSenseLinks/${args.adsense_link_id}`;

    const response = await adminAlpha.properties.adSenseLinks.get({
      name: name,
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
    logger.error(`Error getting AdSense link: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetAdSenseLinkError",
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

export const integrationTools: MCPToolDefinition[] = [
  // Firebase Links
  {
    name: "list_firebase_links",
    description:
      "Lists all Firebase links for a Google Analytics property. Firebase links connect Analytics properties to Firebase projects.",
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
    handler: listFirebaseLinks,
  },
  {
    name: "get_firebase_link",
    description: "Retrieves the details of a specific Firebase link.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        firebase_link_id: {
          type: "string",
          description: "The ID of the Firebase link.",
        },
      },
      required: ["property_id", "firebase_link_id"],
    },
    handler: getFirebaseLink,
  },
  {
    name: "create_firebase_link",
    description:
      "Creates a new Firebase link connecting a Google Analytics property to a Firebase project.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        project_id: {
          type: "string",
          description: "The Firebase project ID to link.",
        },
      },
      required: ["property_id", "project_id"],
    },
    handler: createFirebaseLink,
  },
  {
    name: "delete_firebase_link",
    description: "Deletes a Firebase link.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        firebase_link_id: {
          type: "string",
          description: "The ID of the Firebase link to delete.",
        },
      },
      required: ["property_id", "firebase_link_id"],
    },
    handler: deleteFirebaseLink,
  },
  // BigQuery Links
  {
    name: "list_bigquery_links",
    description:
      "Lists all BigQuery links for a Google Analytics property. BigQuery links enable exporting Analytics data to BigQuery.",
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
    handler: listBigQueryLinks,
  },
  {
    name: "get_bigquery_link",
    description: "Retrieves the details of a specific BigQuery link.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        bigquery_link_id: {
          type: "string",
          description: "The ID of the BigQuery link.",
        },
      },
      required: ["property_id", "bigquery_link_id"],
    },
    handler: getBigQueryLink,
  },
  // AdSense Links
  {
    name: "list_adsense_links",
    description:
      "Lists all AdSense links for a Google Analytics property. AdSense links connect Analytics properties to AdSense accounts.",
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
    handler: listAdSenseLinks,
  },
  {
    name: "get_adsense_link",
    description: "Retrieves the details of a specific AdSense link.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        adsense_link_id: {
          type: "string",
          description: "The ID of the AdSense link.",
        },
      },
      required: ["property_id", "adsense_link_id"],
    },
    handler: getAdSenseLink,
  },
];

