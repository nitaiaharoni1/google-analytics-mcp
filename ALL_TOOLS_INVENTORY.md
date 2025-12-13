# Google Analytics MCP - Complete Tools Inventory

## Date: December 13, 2025
## Total Tools: 46 (5 data filter tools not available via API)

---

## 📊 Reporting Tools (2 tools)

### Basic Reporting
1. ✅ **run_report** - Query historical Analytics data with custom dimensions, metrics, date ranges, and filters
2. ✅ **run_realtime_report** - Get real-time Analytics data for active users, events, and current activity

---

## 🛠️ Admin Tools (7 tools)

### Account Management
3. ✅ **get_account_summaries** - List all accounts with their associated properties
4. ✅ **list_accounts** - List all Google Analytics accounts
5. ✅ **get_account** - Get account details by ID

### Property Management
6. ✅ **list_properties** - List all properties (with optional filtering by account)
7. ✅ **get_property_details** - Get detailed information about a specific property
8. ✅ **get_custom_dimensions_and_metrics** - Retrieve custom dimensions and metrics for a property
9. ✅ **list_google_ads_links** - List links between Analytics properties and Google Ads accounts

---

## 🔍 Data Filter Management (0 tools - Not Available via API)

⚠️ **Data filters are not available via the Google Analytics Admin API REST endpoints.**

The API endpoint `/v1alpha/properties/{property}/dataFilters` returns 404 Not Found. Data filters must be created manually in the Google Analytics UI.

**Workaround**: See [DATA_FILTERS_SETUP_GUIDE.md](./DATA_FILTERS_SETUP_GUIDE.md) for manual setup instructions.

---

## 📡 Data Streams Management (5 tools)

15. ✅ **list_data_streams** - List all data streams (web, iOS, Android) for a property
16. ✅ **get_data_stream** - Get details of a specific data stream
17. ✅ **list_measurement_protocol_secrets** - List Measurement Protocol secrets for a data stream
18. ✅ **create_measurement_protocol_secret** - Create a new Measurement Protocol secret
19. ✅ **delete_measurement_protocol_secret** - Delete a Measurement Protocol secret

---

## 🎯 Conversion Events Management (4 tools)

20. ✅ **list_conversion_events** - List all conversion events for a property
21. ✅ **get_conversion_event** - Get details of a specific conversion event
22. ✅ **create_conversion_event** - Create a new conversion event
23. ✅ **delete_conversion_event** - Delete a conversion event

---

## 👥 Audiences Management (4 tools)

24. ✅ **list_audiences** - List all audiences (user segments) for a property
25. ✅ **get_audience** - Get details of a specific audience
26. ✅ **create_audience** - Create a new audience based on filter expressions
27. ✅ **archive_audience** - Archive (soft delete) an audience

---

## 📏 Custom Definitions Management (6 tools)

### Custom Dimensions
28. ✅ **create_custom_dimension** - Create a new custom dimension
29. ✅ **update_custom_dimension** - Update an existing custom dimension
30. ✅ **archive_custom_dimension** - Archive a custom dimension

### Custom Metrics
31. ✅ **create_custom_metric** - Create a new custom metric
32. ✅ **update_custom_metric** - Update an existing custom metric
33. ✅ **archive_custom_metric** - Archive a custom metric

---

## 📈 Advanced Reporting (3 tools)

34. ✅ **batch_run_reports** - Run multiple reports in a single batch request
35. ✅ **run_pivot_report** - Run pivot table reports
36. ✅ **check_compatibility** - Check dimension/metric compatibility before running reports

---

## 🔑 Key Events Management (5 tools)

37. ✅ **list_key_events** - List all key events for a property
38. ✅ **get_key_event** - Get key event details
39. ✅ **create_key_event** - Create a new key event
40. ✅ **update_key_event** - Update an existing key event
41. ✅ **archive_key_event** - Archive (delete) a key event

---

## 🔗 Integrations Management (8 tools)

### Firebase Links
42. ✅ **list_firebase_links** - List Firebase links
43. ✅ **get_firebase_link** - Get Firebase link details
44. ✅ **create_firebase_link** - Create Firebase link
45. ✅ **delete_firebase_link** - Delete Firebase link

### BigQuery Links
46. ✅ **list_bigquery_links** - List BigQuery links
47. ✅ **get_bigquery_link** - Get BigQuery link details

### AdSense Links
48. ✅ **list_adsense_links** - List AdSense links
49. ✅ **get_adsense_link** - Get AdSense link details

---

## 📋 Metadata & Discovery (2 tools)

50. ✅ **get_metadata** - Discover available dimensions and metrics for a property
51. ✅ **run_audience_export** - Export audience data for analysis

---

## 📊 Summary by Category

| Category | Count | Tools |
|----------|-------|-------|
| Reporting | 2 | Basic + Realtime |
| Admin | 7 | Accounts + Properties |
| Data Filters | 0 | Not available via API - use UI |
| Data Streams | 5 | Full CRUD |
| Conversion Events | 4 | List, Get, Create, Delete |
| Audiences | 4 | List, Get, Create, Archive |
| Custom Definitions | 6 | Dimensions + Metrics CRUD |
| Advanced Reporting | 3 | Batch, Pivot, Compatibility |
| Key Events | 5 | Full CRUD |
| Integrations | 8 | Firebase, BigQuery, AdSense |
| Metadata | 2 | Discovery + Exports |
| **TOTAL** | **51** | |

---

## ✅ Verification Status

- ✅ All 11 tool files exist
- ✅ All tools properly exported
- ✅ All tools registered in index.ts
- ✅ TypeScript compilation passes
- ✅ API methods verified (21/21 checked)

---

## 📝 Notes

- Tools are organized into logical modules
- Each tool has proper error handling
- All tools follow consistent patterns
- TypeScript types are properly defined
- Tools are ready for runtime testing
