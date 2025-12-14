# Google Analytics Data Filters - Manual Setup Guide

## Overview
Since data filters are not available via the Google Analytics Admin API, you need to create them manually in the Google Analytics UI. This guide will help you exclude non-production traffic (localhost, staging domains, bots) from your Handi.ai Website analytics.

## Current Traffic Analysis (Last 30 Days)

| Hostname | Sessions | Status |
|----------|----------|--------|
| **localhost** | 2,302 | ❌ Development/Testing - **EXCLUDE** |
| **handi.co.il** | 77 | ✅ Production - **KEEP** |
| **nitaiaharoni1.github.io** | 20 | ❌ Test/Staging - **EXCLUDE** |
| **handi-website-chi.vercel.app** | 9 | ❌ Vercel Preview - **EXCLUDE** |

**Total non-production traffic: 2,331 sessions (96.8%)**  
**Production traffic: 77 sessions (3.2%)**

## Step-by-Step Instructions

### 1. Access Google Analytics Admin

1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your **Handi.ai Website** property (Property ID: 513368305)
3. Click **Admin** (gear icon) in the bottom left
4. In the **Property** column, click **Data Filters**

### 2. Create Filter: Exclude localhost

1. Click **Create filter**
2. **Filter name**: `Exclude localhost`
3. **Filter type**: Select **Exclude**
4. **Filter field**: Select **Hostname**
5. **Match type**: Select **Exactly matches**
6. **Filter value**: `localhost`
7. Click **Save**

### 3. Create Filter: Exclude GitHub Pages Staging

1. Click **Create filter** again
2. **Filter name**: `Exclude GitHub Pages staging`
3. **Filter type**: Select **Exclude**
4. **Filter field**: Select **Hostname**
5. **Match type**: Select **Exactly matches**
6. **Filter value**: `nitaiaharoni1.github.io`
7. Click **Save**

### 4. Create Filter: Exclude Vercel Preview Domains

1. Click **Create filter** again
2. **Filter name**: `Exclude Vercel preview domains`
3. **Filter type**: Select **Exclude**
4. **Filter field**: Select **Hostname**
5. **Match type**: Select **Ends with** (to catch all `*.vercel.app` domains)
6. **Filter value**: `vercel.app`
7. Click **Save**

### 5. Activate Filters

After creating filters, you need to **activate** them:

1. For each filter you created, click on it
2. Toggle the **Active** switch to **ON**
3. Click **Save**

**Note**: Filters only apply to **new data** going forward. Historical data will not be affected.

## Alternative: Single Filter with Multiple Conditions

If your Analytics UI supports it, you can create one filter with multiple conditions:

1. **Filter name**: `Exclude non-production traffic`
2. **Filter type**: Select **Exclude**
3. Add multiple conditions:
   - Hostname exactly matches `localhost`
   - OR Hostname exactly matches `nitaiaharoni1.github.io`
   - OR Hostname ends with `vercel.app`

## Verify Filters Are Working

After creating and activating filters:

1. Wait 24-48 hours for new data to come in
2. Go to **Reports** → **Realtime** → **Traffic acquisition**
3. Check that traffic from `localhost`, `nitaiaharoni1.github.io`, and `*.vercel.app` is excluded
4. Run a report query using the MCP tool:
   ```
   Get sessions by hostname for the last 7 days
   ```
   You should only see `handi.co.il` in the results.

## Additional Recommendations

### Exclude Bot Traffic

Google Analytics automatically excludes known bots, but you can add additional filters:

1. **Filter name**: `Exclude known bots`
2. **Filter type**: Select **Exclude**
3. **Filter field**: Select **User agent**
4. **Match type**: Select **Contains**
5. **Filter value**: Common bot patterns like:
   - `bot`
   - `crawler`
   - `spider`
   - `scraper`

### Exclude Internal IP Addresses

If you want to exclude traffic from your office/home IP:

1. **Filter name**: `Exclude internal IPs`
2. **Filter type**: Select **Exclude**
3. **Filter field**: Select **IP address**
4. **Match type**: Select **Exactly matches** or **Begins with**
5. **Filter value**: Your IP address (e.g., `192.168.1.1`)

## Important Notes

⚠️ **Filters are permanent**: Once activated, excluded data cannot be recovered.  
⚠️ **Test first**: Consider creating filters in "Test" mode first to verify they work correctly.  
⚠️ **Historical data**: Filters only affect new data. Past data remains unchanged.  
⚠️ **Filter order matters**: If you have multiple filters, they are applied in order.

## Quick Reference

**Property**: Handi.ai Website  
**Property ID**: 513368305  
**Production Domain**: handi.co.il  
**Domains to Exclude**:
- localhost
- nitaiaharoni1.github.io
- *.vercel.app (all Vercel preview domains)

## Need Help?

- [Google Analytics Help: Data Filters](https://support.google.com/analytics/answer/10108813)
- [Filter internal traffic](https://support.google.com/analytics/answer/9303313)
- [Exclude bot traffic](https://support.google.com/analytics/answer/10108813#bot-traffic)



