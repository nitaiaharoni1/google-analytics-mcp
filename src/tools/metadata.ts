/**
 * Google Analytics Metadata Tools
 * Tools for discovering available dimensions, metrics, and API capabilities
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Get metadata for available dimensions and metrics
 * This is crucial for discovering what dimensions/metrics can be used in reports
 */
export async function getMetadata(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const response = await data.properties.getMetadata({
      name: `${propertyName}/metadata`,
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
    logger.error(`Error getting metadata: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "MetadataError",
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

export const metadataTools: MCPToolDefinition[] = [
  {
    name: "get_metadata",
    description:
      "Retrieves metadata about available dimensions and metrics for a Google Analytics property. This is essential for discovering what dimensions and metrics can be used in reports. Returns dimensions, metrics, and their compatibility information.",
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
    handler: getMetadata,
  },
];

