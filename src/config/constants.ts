/**
 * Application Constants
 */

import { MCPServerConfig } from "../types/mcp";

// Read version from package.json
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
const packageVersion = require("../../package.json").version as string;

// Server configuration
export const SERVER_CONFIG: MCPServerConfig = {
  name: "google-analytics-mcp",
  version: packageVersion,
} as const;

// Google Analytics API limits
export const ANALYTICS_LIMITS = {
  MAX_DIMENSIONS_PER_REQUEST: 9,
  MAX_METRICS_PER_REQUEST: 10,
  MAX_REPORT_ROWS: 100000,
  MAX_BATCH_REQUESTS: 50,
  MAX_DATE_RANGES: 4,
} as const;

// Tool categories for Google Analytics operations
export const TOOL_CATEGORIES = {
  REPORTING: "Reporting & Data",
  ADMIN: "Admin & Configuration",
  DATA_FILTERS: "Data Filters",
} as const;
