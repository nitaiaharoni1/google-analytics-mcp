/**
 * Google Analytics Data Streams Tools
 * Tools for managing data streams (web, iOS, Android)
 */

import { ensureAnalyticsClients } from "../analytics";
import { logger } from "../utils/logger";
import { MCPToolDefinition, MCPResult } from "../types/mcp";

/**
 * List data streams for a property
 */
export async function listDataStreams(args: {
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

    const response = await admin.properties.dataStreams.list({
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
    logger.error(`Error listing data streams: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListDataStreamsError",
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
 * Get a specific data stream
 */
export async function getDataStream(args: {
  property_id: string | number;
  data_stream_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const streamName = `${propertyName}/dataStreams/${args.data_stream_id}`;

    const response = await admin.properties.dataStreams.get({
      name: streamName,
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
    logger.error(`Error getting data stream: ${(error as Error).message}`);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "GetDataStreamError",
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
 * List Measurement Protocol secrets for a data stream
 */
export async function listMeasurementProtocolSecrets(args: {
  property_id: string | number;
  data_stream_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const streamName = `${propertyName}/dataStreams/${args.data_stream_id}`;

    const response =
      await admin.properties.dataStreams.measurementProtocolSecrets.list({
        parent: streamName,
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
      `Error listing Measurement Protocol secrets: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "ListMeasurementProtocolSecretsError",
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
 * Create a Measurement Protocol secret
 */
export async function createMeasurementProtocolSecret(args: {
  property_id: string | number;
  data_stream_id: string;
  display_name: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const streamName = `${propertyName}/dataStreams/${args.data_stream_id}`;

    const response =
      await admin.properties.dataStreams.measurementProtocolSecrets.create({
        parent: streamName,
        requestBody: {
          displayName: args.display_name,
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
    logger.error(
      `Error creating Measurement Protocol secret: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "CreateMeasurementProtocolSecretError",
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
 * Delete a Measurement Protocol secret
 */
export async function deleteMeasurementProtocolSecret(args: {
  property_id: string | number;
  data_stream_id: string;
  secret_id: string;
}): Promise<MCPResult> {
  try {
    const { admin } = await ensureAnalyticsClients();

    const propertyName =
      typeof args.property_id === "number"
        ? `properties/${args.property_id}`
        : args.property_id.startsWith("properties/")
        ? args.property_id
        : `properties/${args.property_id}`;

    const secretName = `${propertyName}/dataStreams/${args.data_stream_id}/measurementProtocolSecrets/${args.secret_id}`;

    await admin.properties.dataStreams.measurementProtocolSecrets.delete({
      name: secretName,
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
      `Error deleting Measurement Protocol secret: ${(error as Error).message}`
    );
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              success: false,
              error: "DeleteMeasurementProtocolSecretError",
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

export const dataStreamTools: MCPToolDefinition[] = [
  {
    name: "list_data_streams",
    description:
      "Lists all data streams (web, iOS, Android) configured for a Google Analytics property.",
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
    handler: listDataStreams,
  },
  {
    name: "get_data_stream",
    description:
      "Retrieves details of a specific data stream by its ID. Data streams represent web, iOS, or Android app data collection.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        data_stream_id: {
          type: "string",
          description: "The ID of the data stream.",
        },
      },
      required: ["property_id", "data_stream_id"],
    },
    handler: getDataStream,
  },
  {
    name: "list_measurement_protocol_secrets",
    description:
      "Lists Measurement Protocol secrets for a data stream. These secrets are used to authenticate Measurement Protocol API requests.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        data_stream_id: {
          type: "string",
          description: "The ID of the data stream.",
        },
      },
      required: ["property_id", "data_stream_id"],
    },
    handler: listMeasurementProtocolSecrets,
  },
  {
    name: "create_measurement_protocol_secret",
    description:
      "Creates a new Measurement Protocol secret for a data stream. This secret can be used to authenticate Measurement Protocol API requests.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        data_stream_id: {
          type: "string",
          description: "The ID of the data stream.",
        },
        display_name: {
          type: "string",
          description: "Display name for the secret (e.g., 'Server-side API Secret').",
        },
      },
      required: ["property_id", "data_stream_id", "display_name"],
    },
    handler: createMeasurementProtocolSecret,
  },
  {
    name: "delete_measurement_protocol_secret",
    description: "Deletes a Measurement Protocol secret.",
    inputSchema: {
      type: "object",
      properties: {
        property_id: {
          type: "string",
          description: "The Google Analytics property ID.",
        },
        data_stream_id: {
          type: "string",
          description: "The ID of the data stream.",
        },
        secret_id: {
          type: "string",
          description: "The ID of the secret to delete.",
        },
      },
      required: ["property_id", "data_stream_id", "secret_id"],
    },
    handler: deleteMeasurementProtocolSecret,
  },
];

