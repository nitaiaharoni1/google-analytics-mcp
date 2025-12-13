#!/usr/bin/env node

/**
 * Google Analytics MCP Server
 * Main entry point for the MCP server
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getToolDefinitions, handleToolCall } from "./src/tools/index.js";
import { SERVER_CONFIG } from "./src/config/constants.js";
import { handleCliCommands } from "./src/cli.js";
import { logger } from "./src/utils/logger.js";
import { MCPToolArgs } from "./src/types/mcp.js";

// Interface for MCP tool call request (matches handleToolCall signature)
interface MCPToolCallRequest {
  params: {
    name: string;
    arguments: MCPToolArgs;
  };
}

// Handle CLI commands FIRST, before any server initialization
const args = process.argv.slice(2);

// Check if this is a CLI command invocation
handleCliCommands(args)
  .then(async (handled) => {
    if (handled) {
      // CLI command was executed, exit gracefully
      process.exit(0);
    } else {
      // No CLI command, start the MCP server
      await main();
    }
  })
  .catch((error) => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });

// Initialize MCP server
const server = new Server(
  {
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

// Handle list tools request
server.setRequestHandler(ListToolsRequestSchema, () => {
  return { tools: getToolDefinitions() };
});

// Handle list prompts request
server.setRequestHandler(ListPromptsRequestSchema, () => {
  return {
    prompts: [],
  };
});

// Handle get prompt request
server.setRequestHandler(GetPromptRequestSchema, (request) => {
  throw new Error(`Unknown prompt: ${request.params.name}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  // Convert MCP SDK request to our internal format
  const toolCallRequest: MCPToolCallRequest = {
    params: {
      name: request.params.name,
      arguments: request.params.arguments || {},
    },
  };
  const result = await handleToolCall(toolCallRequest);

  // Ensure we return the correct MCP SDK format
  return {
    content: result.content,
    isError: result.isError || false,
  };
});

// Main server function
async function main(): Promise<void> {
  try {
    // Check for authentication methods
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const hasOAuthCredentials = !!(clientId && clientSecret);
    const hasADC = !!(
      process.env.GOOGLE_APPLICATION_CREDENTIALS ||
      process.env.GCLOUD_PROJECT ||
      process.env.GOOGLE_CLOUD_PROJECT
    );

    if (!hasOAuthCredentials && !hasADC) {
      logger.warn(
        "⚠️  No authentication method configured. The server will start but tools may fail."
      );
      logger.info("💡 Authentication options:");
      logger.info("   1. OAuth2: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET");
      logger.info(
        "   2. ADC: Run 'gcloud auth application-default login --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/analytics.edit'"
      );
      logger.info(
        "   3. ADC: Set GOOGLE_APPLICATION_CREDENTIALS to service account JSON path"
      );
    } else if (hasOAuthCredentials) {
      logger.info("✅ OAuth2 credentials detected");
      logger.info('💡 Run "mcp-google-analytics auth" if you need to authenticate');
    } else if (hasADC) {
      logger.info("✅ Application Default Credentials (ADC) detected");
      logger.info("💡 Using gcloud auth or GOOGLE_APPLICATION_CREDENTIALS");
    }

    // Note: We don't initialize the Analytics clients here anymore
    // They will be initialized lazily when the first tool is called
    // This allows the server to start even without authentication
    logger.info("🔌 Google Analytics MCP Server starting...");
    logger.info("💡 Authentication will be checked when tools are used");

    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("🚀 Google Analytics MCP Server started successfully");
  } catch (error) {
    const errorMsg = (error as Error).message;
    logger.error(`❌ Server startup failed: ${errorMsg}`);

    // Provide specific guidance based on error type
    if (errorMsg.includes("CLIENT_ID") || errorMsg.includes("CLIENT_SECRET")) {
      logger.info("🔍 Troubleshooting suggestions:");
      logger.info("   1. Get OAuth2 credentials from Google Cloud Console");
      logger.info(
        "   2. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables"
      );
      logger.info(
        "   3. Ensure redirect URI is set to http://localhost:3000/oauth2callback"
      );
      logger.info("   4. Or use ADC: Run 'gcloud auth application-default login'");
    }

    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", () => {
  logger.info("🛑 Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("🛑 Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});
