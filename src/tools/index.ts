/**
 * MCP Tools Registry - combines all tool modules
 */

import { reportTools } from "./reports";
import { adminTools } from "./admin";
import { dataFilterTools } from "./data-filters";
import { logger } from "../utils/logger";
import {
  MCPToolDefinition,
  MCPResult,
  MCPErrorResponse,
  MCPToolArgs,
} from "../types/mcp";

// Interface for MCP tool call request
interface MCPToolCallRequest {
  params: {
    name: string;
    arguments: MCPToolArgs;
  };
}

/**
 * Create a standardized error result with suggestions
 */
export function createErrorResult(
  message: string,
  options?: {
    error?: string;
    suggestion?: string;
    provided?: unknown;
    expected?: unknown;
    validRange?: [number, number];
    validOptions?: string[];
  }
): MCPResult {
  const errorResponse: MCPErrorResponse = {
    success: false,
    error: options?.error || "Error",
    message,
  };

  if (options?.suggestion) {
    errorResponse.suggestion = options.suggestion;
  }
  if (options?.provided !== undefined) {
    errorResponse.provided = options.provided;
  }
  if (options?.expected !== undefined) {
    errorResponse.expected = options.expected;
  }
  if (options?.validRange) {
    errorResponse.validRange = options.validRange;
  }
  if (options?.validOptions) {
    errorResponse.validOptions = options.validOptions;
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(errorResponse, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Create a validation error with helpful suggestions
 */
export function createValidationError(
  paramName: string,
  provided: unknown,
  expected: string,
  suggestion?: string
): MCPResult {
  return createErrorResult(
    `Invalid value for '${paramName}': ${JSON.stringify(provided)}. ${expected}`,
    {
      error: "ValidationError",
      suggestion:
        suggestion || `Please provide a valid value for '${paramName}'`,
      provided,
      expected,
    }
  );
}

/**
 * Get all tool definitions
 */
export function getToolDefinitions(): MCPToolDefinition[] {
  return [...reportTools, ...adminTools, ...dataFilterTools];
}

/**
 * Handle a tool call request
 */
export async function handleToolCall(
  request: MCPToolCallRequest
): Promise<MCPResult> {
  const { name, arguments: args } = request.params;

  // Find the tool definition
  const allTools = getToolDefinitions();
  const tool = allTools.find((t) => t.name === name);

  if (!tool) {
    logger.error(`Unknown tool: ${name}`);
    return createErrorResult(`Unknown tool: ${name}`, {
      error: "UnknownTool",
      suggestion: `Available tools: ${allTools.map((t) => t.name).join(", ")}`,
    });
  }

  try {
    logger.info(`Calling tool: ${name}`);
    const result = await tool.handler(args as MCPToolArgs);
    logger.success(`Tool ${name} completed successfully`);
    return result;
  } catch (error) {
    logger.error(`Tool ${name} failed: ${(error as Error).message}`);
    return createErrorResult(
      `Tool execution failed: ${(error as Error).message}`,
      {
        error: "ToolExecutionError",
        suggestion: "Check the tool parameters and try again",
      }
    );
  }
}
