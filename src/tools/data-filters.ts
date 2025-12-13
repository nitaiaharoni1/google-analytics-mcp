/**
 * Google Analytics Data Filters Tools
 * Tools for managing data filters (internal traffic, developer traffic, etc.)
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

function parseFilterState(
  filterStateStr: string
): "FILTER_STATE_UNSPECIFIED" | "ACTIVE" | "INACTIVE" | "TESTING" {
  const upper = filterStateStr.toUpperCase();
  if (upper === "ACTIVE" || upper === "INACTIVE" || upper === "TESTING") {
    return upper as "ACTIVE" | "INACTIVE" | "TESTING";
  }
  throw new Error(
    `Invalid filter_state: ${filterStateStr}. Supported states: TESTING, ACTIVE, INACTIVE`
  );
}

/**
 * List data filters for a property
 */
export async function listDataFilters(args: {
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

    const response = await adminAlpha.properties.dataFilters.list({
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
    logger.error(`Error listing data filters: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListDataFiltersError",
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
 * Get a specific data filter
 */
export async function getDataFilter(args: {
  property_id: string | number;
  data_filter_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const filterName = `${propertyName}/dataFilters/${args.data_filter_id}`;

    const response = await adminAlpha.properties.dataFilters.get({
      name: filterName,
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
    logger.error(`Error getting data filter: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetDataFilterError",
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
 * Create a new data filter
 */
export async function createDataFilter(args: {
  property_id: string | number;
  filter_name: string;
  filter_type: "INTERNAL_TRAFFIC" | "DEVELOPER_TRAFFIC";
  filter_state: string;
  parameter_name?: string;
  parameter_value?: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const filterState = parseFilterState(args.filter_state);

    const dataFilter: any = {
      displayName: args.filter_name,
      filterState: filterState,
    };

    if (args.filter_type === "INTERNAL_TRAFFIC") {
      if (!args.parameter_value) {
        throw new Error(
          "parameter_value is required for INTERNAL_TRAFFIC filters"
        );
      }
      dataFilter.internalTrafficFilter = {
        trafficType: args.parameter_value,
      };
    } else if (args.filter_type === "DEVELOPER_TRAFFIC") {
      dataFilter.developerDataFilter = {};
    } else {
      throw new Error(
        `Unsupported filter_type: ${args.filter_type}. Supported types: INTERNAL_TRAFFIC, DEVELOPER_TRAFFIC`
      );
    }

    const response = await adminAlpha.properties.dataFilters.create({
      parent: propertyName,
      requestBody: dataFilter,
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
    logger.error(`Error creating data filter: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateDataFilterError",
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
 * Update an existing data filter
 */
export async function updateDataFilter(args: {
  property_id: string | number;
  data_filter_id: string;
  filter_name?: string;
  filter_state?: string;
  parameter_value?: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const filterName = `${propertyName}/dataFilters/${args.data_filter_id}`;

    // Get existing filter first
    const existingResponse = await adminAlpha.properties.dataFilters.get({
      name: filterName,
    });

    const existingFilter = existingResponse.data;

    if (!existingFilter) {
      throw new Error(`Data filter not found: ${filterName}`);
    }

    const updateMask: string[] = [];

    if (args.filter_name !== undefined) {
      existingFilter.displayName = args.filter_name;
      updateMask.push("display_name");
    }

    if (args.filter_state !== undefined) {
      existingFilter.filterState = parseFilterState(args.filter_state);
      updateMask.push("filter_state");
    }

    if (args.parameter_value !== undefined) {
      if (existingFilter.internalTrafficFilter) {
        existingFilter.internalTrafficFilter.trafficType = args.parameter_value;
        updateMask.push("internal_traffic_filter.traffic_type");
      } else {
        throw new Error(
          "parameter_value can only be updated for INTERNAL_TRAFFIC filters"
        );
      }
    }

    if (updateMask.length === 0) {
      throw new Error("No fields provided for update");
    }

    const response = await adminAlpha.properties.dataFilters.patch({
      name: filterName,
      updateMask: updateMask.join(","),
      requestBody: existingFilter,
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
    logger.error(`Error updating data filter: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "UpdateDataFilterError",
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
 * Delete a data filter
 */
export async function deleteDataFilter(args: {
  property_id: string | number;
  data_filter_id: string;
}): Promise<MCPResult> {
  try {
    const { adminAlpha } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const filterName = `${propertyName}/dataFilters/${args.data_filter_id}`;

    await adminAlpha.properties.dataFilters.delete({
      name: filterName,
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
    logger.error(`Error deleting data filter: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "DeleteDataFilterError",
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

export const dataFilterTools: MCPToolDefinition[] = [
  {
    name: "list_data_filters",
    description:
      "Lists all data filters configured for a Google Analytics property. Data filters can exclude internal traffic, developer traffic, or other traffic based on custom parameters.",
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
    handler: listDataFilters,
  },
  {
    name: "get_data_filter",
    description:
      "Retrieves the details of a specific data filter by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        data_filter_id: {
          type: "string",
          description: "The ID of the data filter (e.g., '12345').",
        },
      },
      required: ["property_id", "data_filter_id"],
    },
    handler: getDataFilter,
  },
  {
    name: "create_data_filter",
    description:
      "Creates a new data filter for a Google Analytics property. Data filters can exclude internal traffic, developer traffic, or other traffic based on custom parameters.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        filter_name: {
          type: "string",
          description:
            "Display name for the filter (e.g., 'Exclude Playwright Automation').",
        },
        filter_type: {
          type: "string",
          enum: ["INTERNAL_TRAFFIC", "DEVELOPER_TRAFFIC"],
          description:
            "Type of filter. INTERNAL_TRAFFIC filters based on a custom parameter. DEVELOPER_TRAFFIC filters developer traffic.",
        },
        filter_state: {
          type: "string",
          enum: ["TESTING", "ACTIVE", "INACTIVE"],
          description:
            "Initial state of the filter. TESTING: evaluated but data is marked, not excluded. ACTIVE: matching data is excluded. INACTIVE: not evaluated.",
        },
        parameter_name: {
          type: "string",
          description:
            "For INTERNAL_TRAFFIC, the parameter name to check (e.g., 'traffic_type').",
        },
        parameter_value: {
          type: "string",
          description:
            "For INTERNAL_TRAFFIC, the parameter value to match (e.g., 'internal', 'automation', 'playwright').",
        },
      },
      required: ["property_id", "filter_name", "filter_type", "filter_state"],
    },
    handler: createDataFilter,
  },
  {
    name: "update_data_filter",
    description: "Updates an existing data filter.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        data_filter_id: {
          type: "string",
          description: "The ID of the data filter to update.",
        },
        filter_name: {
          type: "string",
          description: "Optional new display name for the filter.",
        },
        filter_state: {
          type: "string",
          enum: ["TESTING", "ACTIVE", "INACTIVE"],
          description: "Optional new state for the filter.",
        },
        parameter_value: {
          type: "string",
          description:
            "Optional new parameter value for INTERNAL_TRAFFIC filters.",
        },
      },
      required: ["property_id", "data_filter_id"],
    },
    handler: updateDataFilter,
  },
  {
    name: "delete_data_filter",
    description: "Deletes a data filter.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: ["string", "number"],
          description: "The Google Analytics property ID.",
        },
        data_filter_id: {
          type: "string",
          description: "The ID of the data filter to delete.",
        },
      },
      required: ["property_id", "data_filter_id"],
    },
    handler: deleteDataFilter,
  },
];

