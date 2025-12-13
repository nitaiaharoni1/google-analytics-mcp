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
- **`get_metadata`** - Discover available dimensions and metrics for a property (essential for report building)
- **`run_audience_export`** - Export audience data for analysis

### 🛠️ **Admin Tools**

- **`get_account_summaries`** - List all Google Analytics accounts and properties
- **`get_property_details`** - Get detailed information about a specific property
- **`get_custom_dimensions_and_metrics`** - Retrieve custom dimensions and metrics for a property
- **`list_google_ads_links`** - List links between Analytics properties and Google Ads accounts

### 🔍 **Data Filter Management**

⚠️ **Note**: Data filters are not available via the Google Analytics Admin API. You must create them manually in the Google Analytics UI.

See [DATA_FILTERS_SETUP_GUIDE.md](./DATA_FILTERS_SETUP_GUIDE.md) for step-by-step instructions on setting up filters to exclude non-production traffic (localhost, staging domains, bots).

### 📡 **Data Streams Management**

- **`list_data_streams`** - List all data streams (web, iOS, Android) for a property
- **`get_data_stream`** - Get details of a specific data stream
- **`list_measurement_protocol_secrets`** - List Measurement Protocol API secrets
- **`create_measurement_protocol_secret`** - Create a new Measurement Protocol secret
- **`delete_measurement_protocol_secret`** - Delete a Measurement Protocol secret

### 🎯 **Conversion Events Management**

- **`list_conversion_events`** - List all conversion events for a property
- **`get_conversion_event`** - Get details of a specific conversion event
- **`create_conversion_event`** - Create a new conversion event (track key actions)
- **`delete_conversion_event`** - Delete a conversion event

### 👥 **Audiences Management**

- **`list_audiences`** - List all audiences (user segments) for a property
- **`get_audience`** - Get details of a specific audience
- **`create_audience`** - Create a new audience based on filter expressions
- **`archive_audience`** - Archive (soft delete) an audience

### 📏 **Custom Definitions Management**

- **`create_custom_dimension`** - Create a new custom dimension
- **`update_custom_dimension`** - Update an existing custom dimension
- **`archive_custom_dimension`** - Archive a custom dimension
- **`create_custom_metric`** - Create a new custom metric
- **`update_custom_metric`** - Update an existing custom metric
- **`archive_custom_metric`** - Archive a custom metric

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

### Discover Available Metrics

```
Get metadata for my property to see what dimensions and metrics are available
```

### Manage Conversion Events

```
List all conversion events for my property
Create a new conversion event for 'purchase' events
```

### Manage Data Streams

```
List all data streams for my property
Create a Measurement Protocol secret for server-side tracking
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
