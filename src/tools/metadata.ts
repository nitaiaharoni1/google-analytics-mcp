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

/**
 * Run an audience export to get audience data
 */
export async function runAudienceExport(args: {
  property_id: string | number;
  audience_export_name: string;
  date_ranges?: Array<{ start_date: string; end_date: string; name?: string }>;
  dimensions?: string[];
  metrics?: string[];
  offset?: number;
  limit?: number;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const requestBody: any = {
      audience: args.audience_export_name,
    };

    if (args.date_ranges && args.date_ranges.length > 0) {
      requestBody.dateRanges = args.date_ranges.map((dr) => ({
        startDate: dr.start_date,
        endDate: dr.end_date,
        name: dr.name,
      }));
    }

    if (args.dimensions && args.dimensions.length > 0) {
      requestBody.dimensions = args.dimensions.map((d) => ({ name: d }));
    }

    if (args.metrics && args.metrics.length > 0) {
      requestBody.metrics = args.metrics.map((m) => ({ name: m }));
    }

    if (args.offset !== undefined) {
      requestBody.offset = args.offset;
    }

    if (args.limit !== undefined) {
      requestBody.limit = args.limit;
    }

    const response = await (data.properties as any).audienceExports.run({
      name: args.audience_export_name,
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
    logger.error(`Error running audience export: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "AudienceExportError",
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
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
      },
      required: ["property_id"],
    },
    handler: getMetadata,
  },
  {
    name: "run_audience_export",
    description:
      "Exports audience data for analysis. Allows querying specific audiences with dimensions and metrics.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        audience_export_name: {
          type: "string",
          description:
            "The name of the audience export (e.g., 'properties/123/audienceExports/456').",
        },
        date_ranges: {
          type: "array",
          description: "Optional date ranges for the export",
          items: {
            type: "object",
            description: "Date range object",
            properties: {
              start_date: { type: "string", description: "Start date in YYYY-MM-DD format" },
              end_date: { type: "string", description: "End date in YYYY-MM-DD format" },
              name: { type: "string", description: "Optional name for this date range" },
            },
            required: ["start_date", "end_date"],
          },
        },
        dimensions: {
          type: "array",
          description: "Optional dimensions to include",
          items: { type: "string", description: "Dimension name" },
        },
        metrics: {
          type: "array",
          description: "Optional metrics to include",
          items: { type: "string", description: "Metric name" },
        },
        offset: {
          type: "number",
          description: "Row offset for pagination",
        },
        limit: {
          type: "number",
          description: "Maximum number of rows to return",
        },
      },
      required: ["property_id", "audience_export_name"],
    },
    handler: runAudienceExport,
  },
];

