/**
 * Google Analytics Conversion Events Tools
 * Tools for managing conversion events (formerly goals)
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * List conversion events for a property
 */
export async function listConversionEvents(args: {
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

    const response = await admin.properties.conversionEvents.list({
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
    logger.error(`Error listing conversion events: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListConversionEventsError",
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
 * Get a specific conversion event
 */
export async function getConversionEvent(args: {
  property_id: string | number;
  conversion_event_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const eventName = `${propertyName}/conversionEvents/${args.conversion_event_id}`;

    const response = await admin.properties.conversionEvents.get({
      name: eventName,
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
    logger.error(`Error getting conversion event: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetConversionEventError",
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
 * Create a conversion event
 */
export async function createConversionEvent(args: {
  property_id: string | number;
  event_name: string;
  counting_method?: "ONE_PER_EVENT" | "ONE_PER_SESSION";
  event_creation_parameter?: string;
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
      eventName: args.event_name,
    };

    if (args.counting_method) {
      requestBody.countingMethod = args.counting_method;
    }

    if (args.event_creation_parameter) {
      requestBody.eventCreationParameter = args.event_creation_parameter;
    }

    const response = await admin.properties.conversionEvents.create({
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
    logger.error(
      `Error creating conversion event: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateConversionEventError",
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
 * Delete a conversion event
 */
export async function deleteConversionEvent(args: {
  property_id: string | number;
  conversion_event_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const eventName = `${propertyName}/conversionEvents/${args.conversion_event_id}`;

    await admin.properties.conversionEvents.delete({
      name: eventName,
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
    logger.error(
      `Error deleting conversion event: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "DeleteConversionEventError",
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

export const conversionEventTools: MCPToolDefinition[] = [
  {
    name: "list_conversion_events",
    description:
      "Lists all conversion events configured for a Google Analytics property. Conversion events are key actions you want to track (e.g., purchases, sign-ups).",
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
    handler: listConversionEvents,
  },
  {
    name: "get_conversion_event",
    description: "Retrieves details of a specific conversion event.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        conversion_event_id: {
          type: "string",
          description: "The ID of the conversion event.",
        },
      },
      required: ["property_id", "conversion_event_id"],
    },
    handler: getConversionEvent,
  },
  {
    name: "create_conversion_event",
    description:
      "Creates a new conversion event. Conversion events track important user actions like purchases, sign-ups, or other key conversions.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        event_name: {
          type: "string",
          description:
            "The name of the event to mark as a conversion (e.g., 'purchase', 'sign_up').",
        },
        counting_method: {
          type: "string",
          enum: ["ONE_PER_EVENT", "ONE_PER_SESSION"],
          description:
            "How to count conversions. ONE_PER_EVENT: count each event. ONE_PER_SESSION: count once per session.",
        },
        event_creation_parameter: {
          type: "string",
          description:
            "Optional parameter name that must be present for the event to be counted as a conversion.",
        },
      },
      required: ["property_id", "event_name"],
    },
    handler: createConversionEvent,
  },
  {
    name: "delete_conversion_event",
    description: "Deletes a conversion event.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        conversion_event_id: {
          type: "string",
          description: "The ID of the conversion event to delete.",
        },
      },
      required: ["property_id", "conversion_event_id"],
    },
    handler: deleteConversionEvent,
  },
];





