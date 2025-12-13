/**
 * Google Analytics Advanced Reporting Tools
 * Tools for pivot reports, funnel reports, batch operations, and compatibility checks
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Run a batch of reports
 */
export async function batchRunReports(args: {
  property_id: string;
  requests: Array<{
    date_ranges: Array<{ start_date: string; end_date: string; name?: string }>;
    dimensions?: string[];
    metrics: string[];
    dimension_filter?: unknown;
    metric_filter?: unknown;
    order_bys?: unknown[];
    limit?: number;
    offset?: number;
  }>;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const propertyName =
      args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const requests = args.requests.map((req) => ({
      dateRanges: req.date_ranges.map((dr) => ({
        startDate: dr.start_date,
        endDate: dr.end_date,
        name: dr.name,
      })),
      metrics: req.metrics.map((m) => ({ name: m })),
      dimensions:
        req.dimensions && req.dimensions.length > 0
          ? req.dimensions.map((d) => ({ name: d }))
          : undefined,
      dimensionFilter: req.dimension_filter,
      metricFilter: req.metric_filter,
      orderBys: req.order_bys,
      limit: req.limit,
      offset: req.offset,
    }));

    const response = await data.properties.batchRunReports({
      property: propertyName,
      requestBody: {
        requests,
      },
    } as any);

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
    logger.error(`Error running batch reports: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "BatchRunReportsError",
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
 * Run a pivot report
 */
export async function runPivotReport(args: {
  property_id: string;
  date_ranges: Array<{ start_date: string; end_date: string; name?: string }>;
  metrics: string[];
  pivots: Array<{
    field_names: string[];
    limit?: number;
    offset?: number;
    order_bys?: unknown[];
  }>;
  dimensions?: string[];
  dimension_filter?: unknown;
  metric_filter?: unknown;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const propertyName =
      args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const request: any = {
      dateRanges: args.date_ranges.map((dr) => ({
        startDate: dr.start_date,
        endDate: dr.end_date,
        name: dr.name,
      })),
      metrics: args.metrics.map((m) => ({ name: m })),
      pivots: args.pivots.map((pivot) => ({
        fieldNames: pivot.field_names,
        limit: pivot.limit,
        offset: pivot.offset,
        orderBys: pivot.order_bys,
      })),
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

    const response = await data.properties.runPivotReport({
      property: propertyName,
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
    logger.error(`Error running pivot report: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "PivotReportError",
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

// Note: runFunnelReport is not available in the current googleapis client
// It may require direct REST API calls or a newer client version

/**
 * Check dimension and metric compatibility
 */
export async function checkCompatibility(args: {
  property_id: string;
  dimensions?: string[];
  metrics?: string[];
  dimension_filter?: unknown;
  metric_filter?: unknown;
  compatibility_filter?: string;
}): Promise<MCPResult> {
  try {
    const { data } = await ensureAnalyticsClients();

    const propertyName =
      args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const request: any = {};

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((d) => ({ name: d }));
    }

    if (args.metrics && args.metrics.length > 0) {
      request.metrics = args.metrics.map((m) => ({ name: m }));
    }

    if (args.dimension_filter) {
      request.dimensionFilter = args.dimension_filter;
    }

    if (args.metric_filter) {
      request.metricFilter = args.metric_filter;
    }

    if (args.compatibility_filter) {
      request.compatibilityFilter = args.compatibility_filter;
    }

    const response = await data.properties.checkCompatibility({
      property: propertyName,
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
    logger.error(`Error checking compatibility: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CompatibilityCheckError",
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

export const advancedReportingTools: MCPToolDefinition[] = [
  {
    name: "batch_run_reports",
    description:
      "Runs multiple reports in a single batch request. More efficient than running reports individually.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        requests: {
          type: "array",
          description: "Array of report requests to run in batch",
          items: {
            type: "object",
            description: "Report request object",
            properties: {
              date_ranges: {
                type: "array",
                description: "Date ranges for the report",
                items: {
                  type: "object",
                  description: "Date range object",
                  properties: {
                    start_date: { type: "string", description: "Start date" },
                    end_date: { type: "string", description: "End date" },
                    name: { type: "string", description: "Optional name" },
                  },
                  required: ["start_date", "end_date"],
                },
              },
              dimensions: {
                type: "array",
                description: "Dimensions to include",
                items: { type: "string", description: "Dimension name" },
              },
              metrics: {
                type: "array",
                description: "Metrics to include (required)",
                items: { type: "string", description: "Metric name" },
              },
              dimension_filter: {
                type: "object",
                description: "Optional dimension filter",
              },
              metric_filter: {
                type: "object",
                description: "Optional metric filter",
              },
              order_bys: {
                type: "array",
                description: "Optional order by specifications",
                items: { type: "object", description: "Order by specification" },
              },
              limit: { type: "number", description: "Optional row limit" },
              offset: { type: "number", description: "Optional row offset" },
            },
            required: ["date_ranges", "metrics"],
          },
        },
      },
      required: ["property_id", "requests"],
    },
    handler: batchRunReports,
  },
  {
    name: "run_pivot_report",
    description:
      "Runs a pivot table report. Pivot reports allow you to reorganize and summarize data in a table format.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        date_ranges: {
          type: "array",
          description: "Date ranges for the report",
          items: {
            type: "object",
            description: "Date range object",
            properties: {
              start_date: { type: "string", description: "Start date" },
              end_date: { type: "string", description: "End date" },
              name: { type: "string", description: "Optional name" },
            },
            required: ["start_date", "end_date"],
          },
        },
        metrics: {
          type: "array",
          description: "Metrics to include",
          items: { type: "string", description: "Metric name" },
        },
        pivots: {
          type: "array",
          description: "Pivot configurations",
          items: {
            type: "object",
            properties: {
              field_names: {
                type: "array",
                description: "Field names to pivot on",
                items: { type: "string", description: "Field name" },
              },
              limit: { type: "number", description: "Optional limit" },
              offset: { type: "number", description: "Optional offset" },
              order_bys: {
                type: "array",
                description: "Optional order by specifications",
                items: { type: "object", description: "Order by specification" },
              },
            },
            required: ["field_names"],
          },
        },
        dimensions: {
          type: "array",
          description: "Optional dimensions",
          items: { type: "string", description: "Dimension name" },
        },
        dimension_filter: {
          type: "object",
          description: "Optional dimension filter",
        },
        metric_filter: {
          type: "object",
          description: "Optional metric filter",
        },
      },
      required: ["property_id", "date_ranges", "metrics", "pivots"],
    },
    handler: runPivotReport,
  },
// Note: run_funnel_report tool is commented out as the method is not available in the current googleapis client
  {
    name: "check_compatibility",
    description:
      "Checks the compatibility of dimensions and metrics before running a report. Helps validate report configurations.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        dimensions: {
          type: "array",
          description: "Dimensions to check",
          items: { type: "string", description: "Dimension name" },
        },
        metrics: {
          type: "array",
          description: "Metrics to check",
          items: { type: "string", description: "Metric name" },
        },
        dimension_filter: {
          type: "object",
          description: "Optional dimension filter",
        },
        metric_filter: {
          type: "object",
          description: "Optional metric filter",
        },
        compatibility_filter: {
          type: "string",
          description: "Optional compatibility filter type",
        },
      },
      required: ["property_id"],
    },
    handler: checkCompatibility,
  },
];

