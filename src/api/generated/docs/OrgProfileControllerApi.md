# OrgProfileControllerApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAdoptionRecords**](#getadoptionrecords) | **GET** /api/org/adoptions | |
|[**getDashboardHome**](#getdashboardhome) | **GET** /api/org/dashboard/home | 获取机构首页综合数据|
|[**getDashboardStatistics**](#getdashboardstatistics) | **GET** /api/org/dashboard/statistics | 获取机构首页统计数据|
|[**getDashboardTodos**](#getdashboardtodos) | **GET** /api/org/dashboard/todos | 获取机构待办事项列表|
|[**getFollowupReminderList**](#getfollowupreminderlist) | **GET** /api/org/followup/reminders | 获取机构回访提醒列表|
|[**getFollowupReminders**](#getfollowupreminders) | **GET** /api/org/followup-reminders | |
|[**getProfile**](#getprofile) | **GET** /api/org/profile | |
|[**getRecentApplications**](#getrecentapplications) | **GET** /api/org/applications/recent | 获取机构最新申请列表|
|[**getRecentPets**](#getrecentpets) | **GET** /api/org/pets/recent | 获取机构最近宠物列表|
|[**getStatistics**](#getstatistics) | **GET** /api/org/statistics | |
|[**updateProfile**](#updateprofile) | **PUT** /api/org/profile | |

# **getAdoptionRecords**
> RPageResultOrgAdoptionRecord getAdoptionRecords()


### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let petId: number; // (optional) (default to undefined)
let userId: number; // (optional) (default to undefined)
let month: string; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)
let sortBy: string; // (optional) (default to 'adoptedTime')
let order: string; // (optional) (default to 'desc')

const { status, data } = await apiInstance.getAdoptionRecords(
    petId,
    userId,
    month,
    pageNo,
    pageSize,
    sortBy,
    order
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] |  | (optional) defaults to undefined|
| **userId** | [**number**] |  | (optional) defaults to undefined|
| **month** | [**string**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|
| **sortBy** | [**string**] |  | (optional) defaults to 'adoptedTime'|
| **order** | [**string**] |  | (optional) defaults to 'desc'|


### Return type

**RPageResultOrgAdoptionRecord**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDashboardHome**
> RDashboardHomeResponse getDashboardHome()

一次性获取首页所需的所有数据，减少请求次数，提升性能

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

const { status, data } = await apiInstance.getDashboardHome();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RDashboardHomeResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDashboardStatistics**
> RDashboardStatisticsResponse getDashboardStatistics()

获取当前机构的关键统计数据

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

const { status, data } = await apiInstance.getDashboardStatistics();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RDashboardStatisticsResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getDashboardTodos**
> RTodoListResponse getDashboardTodos()

获取当前机构的待办事项，包括待审核申请、超期回访提醒等

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let type: string; // (optional) (default to undefined)
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getDashboardTodos(
    type,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] |  | (optional) defaults to undefined|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**RTodoListResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowupReminderList**
> RFollowupReminderListResponse getFollowupReminderList()

获取需要回访的宠物列表，包括即将到期和已超期的回访

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let status: string; // (optional) (default to 'all')
let limit: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getFollowupReminderList(
    status,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | (optional) defaults to 'all'|
| **limit** | [**number**] |  | (optional) defaults to 10|


### Return type

**RFollowupReminderListResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getFollowupReminders**
> RFollowupReminderResponse getFollowupReminders()


### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

const { status, data } = await apiInstance.getFollowupReminders();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RFollowupReminderResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProfile**
> ROrgProfileResponse getProfile()


### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

const { status, data } = await apiInstance.getProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ROrgProfileResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecentApplications**
> RRecentApplicationListResponse getRecentApplications()

获取机构最新的领养申请列表，用于首页展示

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let limit: number; // (optional) (default to 5)

const { status, data } = await apiInstance.getRecentApplications(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 5|


### Return type

**RRecentApplicationListResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRecentPets**
> RRecentPetListResponse getRecentPets()

获取机构最近发布的宠物列表，用于首页展示

### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let limit: number; // (optional) (default to 5)

const { status, data } = await apiInstance.getRecentPets(
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **limit** | [**number**] |  | (optional) defaults to 5|


### Return type

**RRecentPetListResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStatistics**
> ROrgStatisticsResponse getStatistics()


### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

const { status, data } = await apiInstance.getStatistics();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**ROrgStatisticsResponse**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProfile**
> RVoid updateProfile(orgProfileUpdateRequest)


### Example

```typescript
import {
    OrgProfileControllerApi,
    Configuration,
    OrgProfileUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrgProfileControllerApi(configuration);

let orgProfileUpdateRequest: OrgProfileUpdateRequest; //

const { status, data } = await apiInstance.updateProfile(
    orgProfileUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orgProfileUpdateRequest** | **OrgProfileUpdateRequest**|  | |


### Return type

**RVoid**

### Authorization

[Bearer Authentication](../README.md#Bearer Authentication)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

