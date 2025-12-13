/**
 * Google Analytics Audiences Tools
 * Tools for managing audiences (user segments)
 * Note: Uses Admin API v1alpha
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * List audiences for a property
 */
export async function listAudiences(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const response = await adminAlpha.properties.audiences.list({
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
    logger.error(`Error listing audiences: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListAudiencesError",
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
 * Get a specific audience
 */
export async function getAudience(args: {
  property_id: string | number;
  audience_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const audienceName = `${propertyName}/audiences/${args.audience_id}`;

    const response = await adminAlpha.properties.audiences.get({
      name: audienceName,
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
    logger.error(`Error getting audience: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetAudienceError",
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
 * Create an audience
 * Note: Audience creation requires complex filter expressions
 * This is a simplified version - full implementation would need more complex filter handling
 */
export async function createAudience(args: {
  property_id: string | number;
  display_name: string;
  description?: string;
  membership_duration_days?: number;
  // Note: Filter expression is complex and would need proper typing
  // For now, accepting as unknown to allow flexibility
  filter_expression?: unknown;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const requestBody: any = {
      displayName: args.display_name,
    };

    if (args.description) {
      requestBody.description = args.description;
    }

    if (args.membership_duration_days !== undefined) {
      requestBody.membershipDurationDays = args.membership_duration_days;
    }

    if (args.filter_expression) {
      requestBody.filterClauses = [
        {
          filterExpression: args.filter_expression,
        },
      ];
    }

    const response = await adminAlpha.properties.audiences.create({
      parent: propertyName,
      requestBody,
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
    logger.error(`Error creating audience: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateAudienceError",
              message: (error as Error).message,
              suggestion:
                "Audience creation requires complex filter expressions. See Google Analytics API documentation for filter expression format.",
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
 * Archive an audience (soft delete)
 */
export async function archiveAudience(args: {
  property_id: string | number;
  audience_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const audienceName = `${propertyName}/audiences/${args.audience_id}`;

    const response = await adminAlpha.properties.audiences.archive({
      name: audienceName,
      requestBody: {},
    });

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(response.data || { success: true }, null, 2),
        },
      ],
      isError: false,
    };
  } catch (error) {
    logger.error(`Error archiving audience: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ArchiveAudienceError",
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

export const audienceTools: MCPToolDefinition[] = [
  {
    name: "list_audiences",
    description:
      "Lists all audiences configured for a Google Analytics property. Audiences are user segments that can be used for analysis and targeting.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
      },
      required: ["property_id"],
    },
    handler: listAudiences,
  },
  {
    name: "get_audience",
    description: "Retrieves details of a specific audience.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        audience_id: {
          type: "string",
          description: "The ID of the audience.",
        },
      },
      required: ["property_id", "audience_id"],
    },
    handler: getAudience,
  },
  {
    name: "create_audience",
    description:
      "Creates a new audience. Audiences are user segments based on filter expressions. Note: Filter expressions are complex - see Google Analytics API documentation for format.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        display_name: {
          type: "string",
          description: "Display name for the audience (e.g., 'High Value Customers').",
        },
        description: {
          type: "string",
          description: "Optional description of the audience.",
        },
        membership_duration_days: {
          type: "number",
          description:
            "Number of days a user remains in the audience (default: 540).",
        },
        filter_expression: {
          type: "object",
          description:
            "Filter expression defining the audience. See Google Analytics API documentation for format.",
        },
      },
      required: ["property_id", "display_name"],
    },
    handler: createAudience,
  },
  {
    name: "archive_audience",
    description:
      "Archives (soft deletes) an audience. Archived audiences are no longer active but remain in the system.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        audience_id: {
          type: "string",
          description: "The ID of the audience to archive.",
        },
      },
      required: ["property_id", "audience_id"],
    },
    handler: archiveAudience,
  },
];

