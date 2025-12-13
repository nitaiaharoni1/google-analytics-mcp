/**
 * Shared utility functions for Analytics MCP tools
 */

/**
 * Normalize property ID format
 * Accepts both number and string formats, returns standard "properties/NUMBER" format
 */
export function normalizePropertyId(
  propertyId: string | number
): string {
  if (typeof propertyId === "number") {
    return `properties/${propertyId}`;
  }
  if (propertyId.startsWith("properties/")) {
    return propertyId;
  }
  return `properties/${propertyId}`;
}

/**
 * Validate date range format
 * Accepts YYYY-MM-DD, 'today', 'yesterday', 'NdaysAgo' formats
 */
export function isValidDateRange(date: string): boolean {
  if (date === "today" || date === "yesterday") {
    return true;
  }
  if (date.endsWith("daysAgo")) {
    const num = parseInt(date.replace("daysAgo", ""));
    return !isNaN(num) && num >= 0;
  }
  // Check YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return false;
  }
  const parsed = new Date(date);
  return !isNaN(parsed.getTime());
}
