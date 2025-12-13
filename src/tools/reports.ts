/**
 * Google Analytics Reporting Tools
 * Tools for querying Analytics data and generating reports
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Run a Google Analytics report
 */
export async function runReport(args: {
  property_id: string | number;
  date_ranges: Array<{ start_date: string; end_date: string; name?: string }>;
  dimensions?: string[];
  metrics: string[];
  dimension_filter?: unknown;
  metric_filter?: unknown;
  order_bys?: unknown[];
  limit?: number;
  offset?: number;
  currency_code?: string;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const request: any = {
      property: `properties/${args.property_id}`,
      dateRanges: args.date_ranges.map((dr) => ({
        startDate: dr.start_date,
        endDate: dr.end_date,
        name: dr.name,
      })),
      metrics: args.metrics.map((m) => ({ name: m })),
    };

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((d) => ({ name: d }));
    }

    if (args.dimension_filter) {
      request.dimensionFilter = args.dimension_filter;
    }

    if (args.metric_filter) {
      request.metricFilter = args.metric_filter;
    }

    if (args.order_bys && args.order_bys.length > 0) {
      request.orderBys = args.order_bys;
    }

    if (args.limit !== undefined) {
      request.limit = args.limit;
    }

    if (args.offset !== undefined) {
      request.offset = args.offset;
    }

    if (args.currency_code) {
      request.currencyCode = args.currency_code;
    }

    const response = await data.properties.runReport({
      property: `properties/${args.property_id}`,
      requestBody: request,
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
    logger.error(`Error running report: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ReportError",
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
 * Run a realtime Google Analytics report
 */
export async function runRealtimeReport(args: {
  property_id: string | number;
  dimensions?: string[];
  metrics: string[];
  dimension_filter?: unknown;
  metric_filter?: unknown;
  order_bys?: unknown[];
  limit?: number;
  offset?: number;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const request: any = {
      metrics: args.metrics.map((m) => ({ name: m })),
    };

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((d) => ({ name: d }));
    }

    if (args.dimension_filter) {
      request.dimensionFilter = args.dimension_filter;
    }

    if (args.metric_filter) {
      request.metricFilter = args.metric_filter;
    }

    if (args.order_bys && args.order_bys.length > 0) {
      request.orderBys = args.order_bys;
    }

    if (args.limit !== undefined) {
      request.limit = args.limit;
    }

    if (args.offset !== undefined) {
      request.offset = args.offset;
    }

    const response = await data.properties.runRealtimeReport({
      property: `properties/${args.property_id}`,
      requestBody: request,
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
    logger.error(`Error running realtime report: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "RealtimeReportError",
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

export const reportTools: MCPToolDefinition[] = [
  {
    name: "run_report",
    description:
      "Runs a Google Analytics Data API report. Returns aggregated data for the specified property, date range, dimensions, and metrics.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
        date_ranges: {
          type: "array",
          description: "Array of date ranges to include in the report",
          items: {
            type: "object",
            properties: {
              start_date: {
                type: "string",
                description:
                  "Start date in YYYY-MM-DD format or relative format like '7daysAgo', 'yesterday', 'today'",
              },
              end_date: {
                type: "string",
                description:
                  "End date in YYYY-MM-DD format or relative format like 'yesterday', 'today'",
              },
              name: {
                type: "string",
                description: "Optional name for this date range",
              },
            },
            required: ["start_date", "end_date"],
          },
        },
        dimensions: {
          type: "array",
          description: "Array of dimension names to include",
          items: { type: "string" },
        },
        metrics: {
          type: "array",
          description: "Array of metric names to include (required)",
          items: { type: "string" },
        },
        dimension_filter: {
          type: "object",
          description: "Optional filter expression for dimensions",
        },
        metric_filter: {
          type: "object",
          description: "Optional filter expression for metrics",
        },
        order_bys: {
          type: "array",
          description: "Optional array of order by specifications",
          items: { type: "object" },
        },
        limit: {
          type: "number",
          description: "Maximum number of rows to return (default: 10000)",
        },
        offset: {
          type: "number",
          description: "Row offset for pagination (default: 0)",
        },
        currency_code: {
          type: "string",
          description: "ISO 4217 currency code for currency values",
        },
      },
      required: ["property_id", "date_ranges", "metrics"],
    },
    handler: runReport,
  },
  {
    name: "run_realtime_report",
    description:
      "Runs a Google Analytics realtime report. Returns current data for active users, events, and other realtime metrics.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description:
            "The Google Analytics property ID. Can be a number or 'properties/NUMBER' format.",
        },
        dimensions: {
          type: "array",
          description: "Array of realtime dimension names to include",
          items: { type: "string" },
        },
        metrics: {
          type: "array",
          description: "Array of realtime metric names to include (required)",
          items: { type: "string" },
        },
        dimension_filter: {
          type: "object",
          description: "Optional filter expression for dimensions",
        },
        metric_filter: {
          type: "object",
          description: "Optional filter expression for metrics",
        },
        order_bys: {
          type: "array",
          description: "Optional array of order by specifications",
          items: { type: "object" },
        },
        limit: {
          type: "number",
          description: "Maximum number of rows to return (default: 10000)",
        },
        offset: {
          type: "number",
          description: "Row offset for pagination (default: 0)",
        },
      },
      required: ["property_id", "metrics"],
    },
    handler: runRealtimeReport,
  },
];

