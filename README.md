# Google Analytics MCP Server

[![npm version](https://img.shields.io/npm/v/mcp-google-analytics)](https://www.npmjs.com/package/mcp-google-analytics)
[![npm downloads](https://img.shields.io/npm/dm/mcp-google-analytics)](https://www.npmjs.com/package/mcp-google-analytics)

A Model Context Protocol (MCP) server that provides AI assistants with direct access to Google Analytics APIs. This server enables natural language interactions to query reports, manage properties, configure data filters, and analyze website performance.

## 🚀 Quick Install

### NPX (Recommended - No Installation Required)

```bash
# Authenticate with Google
npx mcp-google-analytics auth

# Check authentication status
npx mcp-google-analytics status

# Setup Claude Desktop configuration
npx mcp-google-analytics init
```

### Global Installation

```bash
# Install globally for repeated use
npm install -g mcp-google-analytics

# Authenticate with Google
mcp-google-analytics auth

# Check status
mcp-google-analytics status

# Setup Claude Desktop
mcp-google-analytics init
```

Restart Claude Desktop after setup.

**✨ New:** Use with NPX - no installation required! Just run `npx mcp-google-analytics` directly.

## ✨ Features

### 📊 **Reporting Tools**

- **`run_report`** - Query historical Analytics data with custom dimensions, metrics, date ranges, and filters
- **`run_realtime_report`** - Get real-time Analytics data for active users, events, and current activity

### 🛠️ **Admin Tools**

- **`get_account_summaries`** - List all Google Analytics accounts and properties
- **`get_property_details`** - Get detailed information about a specific property
- **`get_custom_dimensions_and_metrics`** - Retrieve custom dimensions and metrics for a property
- **`list_google_ads_links`** - List links between Analytics properties and Google Ads accounts

### 🔍 **Data Filter Management**

- **`list_data_filters`** - List all data filters for a property
- **`get_data_filter`** - Get details of a specific data filter
- **`create_data_filter`** - Create new data filters (internal traffic, developer traffic)
- **`update_data_filter`** - Update existing data filters
- **`delete_data_filter`** - Delete data filters

## 🔑 Authentication

The server supports two authentication methods:

### Method 1: OAuth2 (Recommended for Personal Use)

1. Get OAuth2 credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Set environment variables:
   ```bash
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   ```
3. Run authentication:
   ```bash
   npx mcp-google-analytics auth
   ```

### Method 2: Application Default Credentials (ADC)

1. Run gcloud authentication:
   ```bash
   gcloud auth application-default login \
     --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/analytics.edit
   ```
2. Set quota project:
   ```bash
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   ```
3. Set environment variable (optional):
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/credentials.json"
   ```

## 📖 Usage Examples

### Query Analytics Reports

```
Get the top 10 pages by page views for the last 30 days
```

### Analyze User Behavior

```
Show me the most popular events in my Analytics property in the last 180 days
```

### Manage Data Filters

```
Create a data filter to exclude Playwright automation traffic
```

### Get Property Information

```
Give me details about my Google Analytics property with 'Handi' in the name
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev

# Run tests
npm test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please open an issue to discuss bugs or feature requests.

## 🔗 Links

- [Google Analytics Data API Documentation](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Analytics Admin API Documentation](https://developers.google.com/analytics/devguides/config/admin/v1)
- [Model Context Protocol](https://modelcontextprotocol.io/)
