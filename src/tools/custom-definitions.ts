/**
 * Google Analytics Custom Definitions Tools
 * Tools for creating, updating, and deleting custom dimensions and metrics
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * Create a custom dimension
 */
export async function createCustomDimension(args: {
  property_id: string | number;
  parameter_name: string;
  display_name: string;
  description?: string;
  scope: "EVENT" | "USER";
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const requestBody: any = {
      parameterName: args.parameter_name,
      displayName: args.display_name,
      scope: args.scope,
    };

    if (args.description) {
      requestBody.description = args.description;
    }

    const response = await admin.properties.customDimensions.create({
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
    logger.error(`Error creating custom dimension: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateCustomDimensionError",
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
 * Update a custom dimension
 */
export async function updateCustomDimension(args: {
  property_id: string | number;
  custom_dimension_id: string;
  display_name?: string;
  description?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const dimensionName = `${propertyName}/customDimensions/${args.custom_dimension_id}`;

    // Get existing dimension first
    const existingResponse = await admin.properties.customDimensions.get({
      name: dimensionName,
    });

    const existingDimension = existingResponse.data;

    if (!existingDimension) {
      throw new Error(`Custom dimension not found: ${dimensionName}`);
    }

    const updateMask: string[] = [];

    if (args.display_name !== undefined) {
      existingDimension.displayName = args.display_name;
      updateMask.push("display_name");
    }

    if (args.description !== undefined) {
      existingDimension.description = args.description;
      updateMask.push("description");
    }

    if (updateMask.length === 0) {
      throw new Error("No fields provided for update");
    }

    const response = await admin.properties.customDimensions.patch({
      name: dimensionName,
      updateMask: updateMask.join(","),
      requestBody: existingDimension,
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
    logger.error(`Error updating custom dimension: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "UpdateCustomDimensionError",
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
 * Archive a custom dimension
 */
export async function archiveCustomDimension(args: {
  property_id: string | number;
  custom_dimension_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const dimensionName = `${propertyName}/customDimensions/${args.custom_dimension_id}`;

    const response = await admin.properties.customDimensions.archive({
      name: dimensionName,
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
    logger.error(`Error archiving custom dimension: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ArchiveCustomDimensionError",
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
 * Create a custom metric
 */
export async function createCustomMetric(args: {
  property_id: string | number;
  parameter_name: string;
  display_name: string;
  description?: string;
  measurement_unit?: "STANDARD" | "CURRENCY" | "FEET" | "METERS" | "KILOMETERS" | "MILES";
  scope: "EVENT" | "USER";
  restricted_metric_type?: string[];
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const requestBody: any = {
      parameterName: args.parameter_name,
      displayName: args.display_name,
      scope: args.scope,
    };

    if (args.description) {
      requestBody.description = args.description;
    }

    if (args.measurement_unit) {
      requestBody.measurementUnit = args.measurement_unit;
    }

    if (args.restricted_metric_type && args.restricted_metric_type.length > 0) {
      requestBody.restrictedMetricType = args.restricted_metric_type;
    }

    const response = await admin.properties.customMetrics.create({
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
    logger.error(`Error creating custom metric: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateCustomMetricError",
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
 * Update a custom metric
 */
export async function updateCustomMetric(args: {
  property_id: string | number;
  custom_metric_id: string;
  display_name?: string;
  description?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const metricName = `${propertyName}/customMetrics/${args.custom_metric_id}`;

    // Get existing metric first
    const existingResponse = await admin.properties.customMetrics.get({
      name: metricName,
    });

    const existingMetric = existingResponse.data;

    if (!existingMetric) {
      throw new Error(`Custom metric not found: ${metricName}`);
    }

    const updateMask: string[] = [];

    if (args.display_name !== undefined) {
      existingMetric.displayName = args.display_name;
      updateMask.push("display_name");
    }

    if (args.description !== undefined) {
      existingMetric.description = args.description;
      updateMask.push("description");
    }

    if (updateMask.length === 0) {
      throw new Error("No fields provided for update");
    }

    const response = await admin.properties.customMetrics.patch({
      name: metricName,
      updateMask: updateMask.join(","),
      requestBody: existingMetric,
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
    logger.error(`Error updating custom metric: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "UpdateCustomMetricError",
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
 * Archive a custom metric
 */
export async function archiveCustomMetric(args: {
  property_id: string | number;
  custom_metric_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const metricName = `${propertyName}/customMetrics/${args.custom_metric_id}`;

    const response = await admin.properties.customMetrics.archive({
      name: metricName,
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
    logger.error(`Error archiving custom metric: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ArchiveCustomMetricError",
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

export const customDefinitionTools: MCPToolDefinition[] = [
  {
    name: "create_custom_dimension",
    description:
      "Creates a new custom dimension for a property. Custom dimensions allow you to track additional data points beyond standard dimensions.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        parameter_name: {
          type: "string",
          description:
            "The parameter name used in events (e.g., 'user_type', 'subscription_tier').",
        },
        display_name: {
          type: "string",
          description: "Display name for the dimension (e.g., 'User Type').",
        },
        description: {
          type: "string",
          description: "Optional description of the dimension.",
        },
        scope: {
          type: "string",
          enum: ["EVENT", "USER"],
          description:
            "Scope of the dimension. EVENT: varies per event. USER: constant per user.",
        },
      },
      required: ["property_id", "parameter_name", "display_name", "scope"],
    },
    handler: createCustomDimension,
  },
  {
    name: "update_custom_dimension",
    description: "Updates an existing custom dimension.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        custom_dimension_id: {
          type: "string",
          description: "The ID of the custom dimension to update.",
        },
        display_name: {
          type: "string",
          description: "Optional new display name.",
        },
        description: {
          type: "string",
          description: "Optional new description.",
        },
      },
      required: ["property_id", "custom_dimension_id"],
    },
    handler: updateCustomDimension,
  },
  {
    name: "archive_custom_dimension",
    description: "Archives (soft deletes) a custom dimension.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        custom_dimension_id: {
          type: "string",
          description: "The ID of the custom dimension to archive.",
        },
      },
      required: ["property_id", "custom_dimension_id"],
    },
    handler: archiveCustomDimension,
  },
  {
    name: "create_custom_metric",
    description:
      "Creates a new custom metric for a property. Custom metrics allow you to track additional measurements beyond standard metrics.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        parameter_name: {
          type: "string",
          description:
            "The parameter name used in events (e.g., 'revenue', 'items_purchased').",
        },
        display_name: {
          type: "string",
          description: "Display name for the metric (e.g., 'Revenue').",
        },
        description: {
          type: "string",
          description: "Optional description of the metric.",
        },
        measurement_unit: {
          type: "string",
          enum: ["STANDARD", "CURRENCY", "FEET", "METERS", "KILOMETERS", "MILES"],
          description: "Unit of measurement for the metric.",
        },
        scope: {
          type: "string",
          enum: ["EVENT", "USER"],
          description:
            "Scope of the metric. EVENT: varies per event. USER: constant per user.",
        },
        restricted_metric_type: {
          type: "array",
          items: { type: "string" },
          description: "Optional restricted metric types.",
        },
      },
      required: ["property_id", "parameter_name", "display_name", "scope"],
    },
    handler: createCustomMetric,
  },
  {
    name: "update_custom_metric",
    description: "Updates an existing custom metric.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        custom_metric_id: {
          type: "string",
          description: "The ID of the custom metric to update.",
        },
        display_name: {
          type: "string",
          description: "Optional new display name.",
        },
        description: {
          type: "string",
          description: "Optional new description.",
        },
      },
      required: ["property_id", "custom_metric_id"],
    },
    handler: updateCustomMetric,
  },
  {
    name: "archive_custom_metric",
    description: "Archives (soft deletes) a custom metric.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        custom_metric_id: {
          type: "string",
          description: "The ID of the custom metric to archive.",
        },
      },
      required: ["property_id", "custom_metric_id"],
    },
    handler: archiveCustomMetric,
  },
];

