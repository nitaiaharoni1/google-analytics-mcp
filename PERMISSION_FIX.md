# Fixing Permission Failures

## Problem

Write operations (create, update, delete) are failing with "Insufficient Permission" errors because the Application Default Credentials (ADC) were created with only read-only scopes.

## Solution

Re-authenticate with write scopes:

```bash
# Remove existing ADC credentials
rm ~/.config/gcloud/application_default_credentials.json

# Re-authenticate with write scopes
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/analytics.edit,https://www.googleapis.com/auth/cloud-platform

# Set quota project (if needed)
gcloud auth application-default set-quota-project gen-lang-client-0223167878
```

## Why This Happens

1. **ADC Scope Limitation**: When you run `gcloud auth application-default login`, the scopes you specify are stored in the refresh token. If you only requested read-only scopes initially, the refresh token won't have write permissions even if your code requests them later.

2. **Runtime Scope Requests**: While the code requests `analytics.edit` scope at runtime, Google's OAuth system checks the refresh token's original scopes first. If the token doesn't have write scopes, the request fails.

## Required Scopes

- `https://www.googleapis.com/auth/analytics.readonly` - Read operations
- `https://www.googleapis.com/auth/analytics.edit` - Write operations (create, update, delete)
- `https://www.googleapis.com/auth/cloud-platform` - Full access (optional but recommended)

## Verify After Fix

After re-authenticating, test a write operation:

```bash
# Test creating a property (will fail if permissions are insufficient)
# Use the MCP tool: create_property
```

## Alternative: Use OAuth2 Instead

If ADC continues to have issues, you can use OAuth2:

1. Set environment variables:
   ```bash
   export GOOGLE_CLIENT_ID="your-client-id"
   export GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

2. Run authentication:
   ```bash
   npx google-analytics-mcp-server auth
   ```

3. The OAuth2 flow will request the correct scopes interactively.


