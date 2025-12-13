/**
 * Google Analytics Key Events Tools
 * Tools for managing key events (formerly conversion events in GA4)
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

/**
 * List key events for a property
 */
export async function listKeyEvents(args: {
  property_id: string | number;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const response = await admin.properties.keyEvents.list({
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
    logger.error(`Error listing key events: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListKeyEventsError",
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
 * Get a specific key event
 */
export async function getKeyEvent(args: {
  property_id: string | number;
  key_event_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/keyEvents/${args.key_event_id}`;

    const response = await admin.properties.keyEvents.get({
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
    logger.error(`Error getting key event: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetKeyEventError",
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
 * Create a new key event
 */
export async function createKeyEvent(args: {
  property_id: string | number;
  event_name: string;
  counting_method?: "ONCE_PER_EVENT" | "ONCE_PER_SESSION";
  description?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const parent = getPropertyName(args.property_id);

    const requestBody: any = {
      eventName: args.event_name,
    };

    if (args.counting_method) {
      requestBody.countingMethod = args.counting_method;
    }

    if (args.description) {
      requestBody.description = args.description;
    }

    const response = await admin.properties.keyEvents.create({
      parent: parent,
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
    logger.error(`Error creating key event: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateKeyEventError",
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
 * Update a key event
 */
export async function updateKeyEvent(args: {
  property_id: string | number;
  key_event_id: string;
  counting_method?: "ONCE_PER_EVENT" | "ONCE_PER_SESSION";
  description?: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/keyEvents/${args.key_event_id}`;

    // Get existing key event first
    const existingResponse = await admin.properties.keyEvents.get({
      name: name,
    });

    const existingKeyEvent = existingResponse.data;

    if (!existingKeyEvent) {
      throw new Error(`Key event not found: ${name}`);
    }

    const updateMask: string[] = [];
    const requestBody: any = { name: name };

    if (args.counting_method !== undefined) {
      requestBody.countingMethod = args.counting_method;
      updateMask.push("counting_method");
    }

    if (args.description !== undefined) {
      requestBody.description = args.description;
      updateMask.push("description");
    }

    if (updateMask.length === 0) {
      throw new Error("No fields provided for update");
    }

    const response = await admin.properties.keyEvents.patch({
      name: name,
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
    logger.error(`Error updating key event: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "UpdateKeyEventError",
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
 * Archive a key event
 * Note: Key events API uses delete method, not archive
 */
export async function archiveKeyEvent(args: {
  property_id: string | number;
  key_event_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();
    const propertyName = getPropertyName(args.property_id);
    const name = `${propertyName}/keyEvents/${args.key_event_id}`;

    // Key events API uses delete, not archive
    await admin.properties.keyEvents.delete({
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
    logger.error(`Error archiving key event: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ArchiveKeyEventError",
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

export const keyEventTools: MCPToolDefinition[] = [
  {
    name: "list_key_events",
    description:
      "Lists all key events for a Google Analytics property. Key events are important user actions that you want to track.",
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
    handler: listKeyEvents,
  },
  {
    name: "get_key_event",
    description: "Retrieves the details of a specific key event.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        key_event_id: {
          type: "string",
          description: "The ID of the key event.",
        },
      },
      required: ["property_id", "key_event_id"],
    },
    handler: getKeyEvent,
  },
  {
    name: "create_key_event",
    description: "Creates a new key event for a Google Analytics property.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        event_name: {
          type: "string",
          description: "The name of the event to mark as a key event.",
        },
        counting_method: {
          type: "string",
          enum: ["ONCE_PER_EVENT", "ONCE_PER_SESSION"],
          description:
            "How to count the key event. ONCE_PER_EVENT: count each event. ONCE_PER_SESSION: count once per session.",
        },
        description: {
          type: "string",
          description: "Optional description of the key event.",
        },
      },
      required: ["property_id", "event_name"],
    },
    handler: createKeyEvent,
  },
  {
    name: "update_key_event",
    description: "Updates an existing key event.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        key_event_id: {
          type: "string",
          description: "The ID of the key event to update.",
        },
        counting_method: {
          type: "string",
          enum: ["ONCE_PER_EVENT", "ONCE_PER_SESSION"],
          description: "Optional new counting method.",
        },
        description: {
          type: "string",
          description: "Optional new description.",
        },
      },
      required: ["property_id", "key_event_id"],
    },
    handler: updateKeyEvent,
  },
  {
    name: "archive_key_event",
    description: "Archives a key event.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        key_event_id: {
          type: "string",
          description: "The ID of the key event to archive.",
        },
      },
      required: ["property_id", "key_event_id"],
    },
    handler: archiveKeyEvent,
  },
];

