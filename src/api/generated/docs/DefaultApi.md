# DefaultApi

All URIs are relative to *http://localhost:8081*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addFavorite**](#addfavorite) | **POST** /api/favorites/{petId} | 添加收藏|
|[**assignPermissions**](#assignpermissions) | **PUT** /api/admin/roles/{id}/permissions | 分配角色权限|
|[**calculateDistance**](#calculatedistance) | **POST** /api/public/distance | 计算两点距离|
|[**cancelApplication**](#cancelapplication) | **POST** /api/adoption/applications/{applicationId}/cancel | 取消申请|
|[**checkFavoriteStatus**](#checkfavoritestatus) | **GET** /api/favorites/check | 检查收藏状态|
|[**createApplication**](#createapplication) | **POST** /api/adoption/applications | 提交领养申请|
|[**createCheckin**](#createcheckin) | **POST** /api/checkins | 创建打卡|
|[**createPermission**](#createpermission) | **POST** /api/admin/permissions | 创建权限|
|[**createPetV2**](#createpetv2) | **POST** /api/pets/org/createPet | 机构创建宠物|
|[**createRole**](#createrole) | **POST** /api/admin/roles | 创建角色|
|[**deleteCheckin**](#deletecheckin) | **DELETE** /api/checkins/{checkinId} | 删除打卡|
|[**deletePermission**](#deletepermission) | **DELETE** /api/admin/permissions/{id} | 删除权限|
|[**deletePet**](#deletepet) | **DELETE** /api/pets/org/{id} | 机构删除宠物|
|[**deletePetMedia**](#deletepetmedia) | **DELETE** /api/org/pets/{petId}/media/{mediaId} | 删除宠物媒体|
|[**deleteRole**](#deleterole) | **DELETE** /api/admin/roles/{id} | 删除角色|
|[**geocode**](#geocode) | **POST** /api/public/geocode | 地址地理编码|
|[**getApplicationDetail**](#getapplicationdetail) | **GET** /api/adoption/applications/{applicationId} | 获取申请详情|
|[**getApplicationLogs**](#getapplicationlogs) | **GET** /api/adoption/applications/{applicationId}/logs | 获取申请流程日志|
|[**getCaptcha**](#getcaptcha) | **GET** /api/public/captcha | 获取图片验证码|
|[**getCheckinDetail**](#getcheckindetail) | **GET** /api/checkins/{checkinId} | 获取打卡详情|
|[**getCreditDetail**](#getcreditdetail) | **GET** /api/credit/detail | 获取信用详情|
|[**getCreditInfo**](#getcreditinfo) | **GET** /api/credit/me | 获取我的信用信息|
|[**getCreditLogs**](#getcreditlogs) | **GET** /api/credit/logs | 获取信用流水|
|[**getCurrentUser**](#getcurrentuser) | **GET** /api/user/profile | 获取当前用户信息|
|[**getCurrentUserId**](#getcurrentuserid) | **GET** /api/user/id | 获取当前用户ID|
|[**getCurrentUserInfo**](#getcurrentuserinfo) | **GET** /api/auth/me | 获取当前用户信息|
|[**getCurrentUsername**](#getcurrentusername) | **GET** /api/user/username | 获取当前用户名|
|[**getMyApplications**](#getmyapplications) | **GET** /api/adoption/applications/me | 获取我的申请列表|
|[**getMyCheckins**](#getmycheckins) | **GET** /api/checkins/my | 获取我的打卡列表|
|[**getMyFavorites**](#getmyfavorites) | **GET** /api/favorites/my | 获取我的收藏列表|
|[**getNearbyOrgs**](#getnearbyorgs) | **GET** /api/public/nearby-orgs | 获取周边宠物机构|
|[**getNotices**](#getnotices) | **GET** /api/public/notices | 获取公告列表|
|[**getOrgApplicationDetail**](#getorgapplicationdetail) | **GET** /api/org/adoption/applications/{applicationId} | 机构获取申请详情|
|[**getOrgApplicationLogs**](#getorgapplicationlogs) | **GET** /api/org/adoption/applications/{applicationId}/logs | 机构获取申请流程日志|
|[**getOrgApplications**](#getorgapplications) | **GET** /api/org/adoption/applications | 机构获取申请列表|
|[**getOrgPetDetail**](#getorgpetdetail) | **GET** /api/pets/org/detail/{id} | 机构获取宠物详情|
|[**getOrgPetList**](#getorgpetlist) | **GET** /api/pets/org/my-pets | 机构获取宠物列表|
|[**getPermissionById**](#getpermissionbyid) | **GET** /api/admin/permissions/{id} | 获取权限详情|
|[**getPermissionList**](#getpermissionlist) | **GET** /api/admin/permissions | 获取权限列表|
|[**getPermissionTree**](#getpermissiontree) | **GET** /api/admin/permissions/tree | 获取权限树|
|[**getPetDetail**](#getpetdetail) | **GET** /api/pets/{id} | 获取宠物详情|
|[**getPetList**](#getpetlist) | **GET** /api/pets | 获取宠物列表|
|[**getRecommendPets**](#getrecommendpets) | **GET** /api/pets/recommend | 获取推荐宠物列表|
|[**getRegions**](#getregions) | **GET** /api/public/regions | 获取省市区数据|
|[**getRoleById**](#getrolebyid) | **GET** /api/admin/roles/{id} | 获取角色详情|
|[**getRoleList**](#getrolelist) | **GET** /api/admin/roles | 获取角色列表|
|[**getRolePermissions**](#getrolepermissions) | **GET** /api/admin/roles/{id}/permissions | 获取角色权限|
|[**getSearchSuggestions**](#getsearchsuggestions) | **GET** /api/pets/suggest | 获取搜索建议|
|[**getSimilarPets**](#getsimilarpets) | **GET** /api/pets/{id}/similar | 获取相似宠物列表|
|[**getSystemConfig**](#getsystemconfig) | **GET** /api/public/config | 获取系统配置|
|[**getTagList**](#gettaglist) | **GET** /api/tags | 获取标签列表|
|[**getTags**](#gettags) | **GET** /api/public/tags | 获取标签库|
|[**getUserPreference**](#getuserpreference) | **GET** /api/users/preference | 获取用户偏好设置|
|[**getUserProfile**](#getuserprofile) | **GET** /api/users/profile | 获取用户详细信息|
|[**getUserStats**](#getuserstats) | **GET** /api/users/stats | 获取用户统计数据|
|[**hasPermission**](#haspermission) | **GET** /api/user/has-permission | 检查用户权限|
|[**hasRole**](#hasrole) | **GET** /api/user/has-role | 检查用户角色|
|[**login**](#login) | **POST** /api/auth/login | 用户登录|
|[**logout**](#logout) | **POST** /api/auth/logout | 用户登出|
|[**recordBehavior**](#recordbehavior) | **POST** /api/behavior | 记录用户行为|
|[**refreshToken**](#refreshtoken) | **POST** /api/auth/refresh-token | 刷新令牌|
|[**register**](#register) | **POST** /api/auth/register | 用户注册|
|[**removeFavorite**](#removefavorite) | **DELETE** /api/favorites/{petId} | 取消收藏|
|[**savePetMedia**](#savepetmedia) | **POST** /api/org/pets/{id}/media | 保存宠物媒体关联|
|[**sendCode**](#sendcode) | **POST** /api/public/send-code | 发送验证码|
|[**submitPetAudit**](#submitpetaudit) | **POST** /api/pets/org/pets/{id}/submit-audit | 提交宠物审核|
|[**toggleFavorite**](#togglefavorite) | **POST** /api/favorites/toggle | 收藏切换|
|[**updateApplicationStatus**](#updateapplicationstatus) | **POST** /api/org/adoption/applications/{applicationId}/status | 更新申请状态|
|[**updatePermission**](#updatepermission) | **PUT** /api/admin/permissions/{id} | 更新权限|
|[**updatePet**](#updatepet) | **PUT** /api/pets/org/{id} | 机构更新宠物信息|
|[**updateProfile1**](#updateprofile1) | **PUT** /api/auth/profile | 修改个人资料|
|[**updateRole**](#updaterole) | **PUT** /api/admin/roles/{id} | 更新角色|
|[**updateUserPreference**](#updateuserpreference) | **PUT** /api/users/preference | 更新用户偏好设置|
|[**upload**](#upload) | **POST** /api/upload | 文件上传|
|[**verifyCode**](#verifycode) | **POST** /api/public/verify-code | 验证码验证|

# **addFavorite**
> R addFavorite()

收藏指定的宠物

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; // (default to undefined)

const { status, data } = await apiInstance.addFavorite(
    petId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **assignPermissions**
> R assignPermissions(rolePermissionRequest)

为角色分配权限

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RolePermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let rolePermissionRequest: RolePermissionRequest; //

const { status, data } = await apiInstance.assignPermissions(
    id,
    rolePermissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **rolePermissionRequest** | **RolePermissionRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **calculateDistance**
> RDistanceResponse calculateDistance(distanceRequest)

计算两个坐标点之间的距离

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    DistanceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let distanceRequest: DistanceRequest; //

const { status, data } = await apiInstance.calculateDistance(
    distanceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **distanceRequest** | **DistanceRequest**|  | |


### Return type

**RDistanceResponse**

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

# **cancelApplication**
> RVoid cancelApplication(applicationCancelRequest)

用户取消进行中的领养申请

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    ApplicationCancelRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)
let applicationCancelRequest: ApplicationCancelRequest; //

const { status, data } = await apiInstance.cancelApplication(
    applicationId,
    applicationCancelRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationCancelRequest** | **ApplicationCancelRequest**|  | |
| **applicationId** | [**number**] |  | defaults to undefined|


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

# **checkFavoriteStatus**
> RFavoriteCheckResponse checkFavoriteStatus()

检查指定宠物是否已被当前用户收藏

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; //宠物ID (default to undefined)

const { status, data } = await apiInstance.checkFavoriteStatus(
    petId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RFavoriteCheckResponse**

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

# **createApplication**
> RAdoptionApplicationResponse createApplication(adoptionApplicationRequest)

用户提交新的领养申请

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    AdoptionApplicationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let adoptionApplicationRequest: AdoptionApplicationRequest; //

const { status, data } = await apiInstance.createApplication(
    adoptionApplicationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **adoptionApplicationRequest** | **AdoptionApplicationRequest**|  | |


### Return type

**RAdoptionApplicationResponse**

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

# **createCheckin**
> RCheckinResponse createCheckin(checkinCreateRequest)

领养后创建打卡记录，同时计算信用分

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    CheckinCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let checkinCreateRequest: CheckinCreateRequest; //

const { status, data } = await apiInstance.createCheckin(
    checkinCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkinCreateRequest** | **CheckinCreateRequest**|  | |


### Return type

**RCheckinResponse**

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

# **createPermission**
> R createPermission(permissionRequest)

创建新的权限

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let permissionRequest: PermissionRequest; //

const { status, data } = await apiInstance.createPermission(
    permissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permissionRequest** | **PermissionRequest**|  | |


### Return type

**R**

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

# **createPetV2**
> RPetCreateResponse createPetV2(petCreateRequestV2)

机构创建新的宠物档案，支持嵌套JSON格式

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PetCreateRequestV2
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petCreateRequestV2: PetCreateRequestV2; //

const { status, data } = await apiInstance.createPetV2(
    petCreateRequestV2
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petCreateRequestV2** | **PetCreateRequestV2**|  | |


### Return type

**RPetCreateResponse**

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

# **createRole**
> R createRole(roleRequest)

创建新的角色

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.createRole(
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |


### Return type

**R**

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

# **deleteCheckin**
> R deleteCheckin()

删除指定的打卡记录

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let checkinId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCheckin(
    checkinId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkinId** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **deletePermission**
> R deletePermission()

删除指定权限

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deletePermission(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **deletePet**
> RVoid deletePet()

机构删除指定宠物

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)

const { status, data } = await apiInstance.deletePet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RVoid**

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

# **deletePetMedia**
> RVoid deletePetMedia()

删除指定的宠物媒体文件

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; //宠物ID (default to undefined)
let mediaId: number; //媒体ID (default to undefined)

const { status, data } = await apiInstance.deletePetMedia(
    petId,
    mediaId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] | 宠物ID | defaults to undefined|
| **mediaId** | [**number**] | 媒体ID | defaults to undefined|


### Return type

**RVoid**

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

# **deleteRole**
> R deleteRole()

删除指定角色

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRole(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **geocode**
> RGeocodeResponse geocode(geocodeRequest)

将地址转换为经纬度坐标

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    GeocodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let geocodeRequest: GeocodeRequest; //

const { status, data } = await apiInstance.geocode(
    geocodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **geocodeRequest** | **GeocodeRequest**|  | |


### Return type

**RGeocodeResponse**

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

# **getApplicationDetail**
> RApplicationDetailVO getApplicationDetail()

获取指定申请的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)

const { status, data } = await apiInstance.getApplicationDetail(
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationId** | [**number**] |  | defaults to undefined|


### Return type

**RApplicationDetailVO**

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

# **getApplicationLogs**
> RListApplicationFlowLogVO getApplicationLogs()

获取指定申请的所有流程日志

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)

const { status, data } = await apiInstance.getApplicationLogs(
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationId** | [**number**] |  | defaults to undefined|


### Return type

**RListApplicationFlowLogVO**

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

# **getCaptcha**
> RCaptchaResponse getCaptcha()

获取图片验证码用于防刷

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let timestamp: number; // (default to undefined)

const { status, data } = await apiInstance.getCaptcha(
    timestamp
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **timestamp** | [**number**] |  | defaults to undefined|


### Return type

**RCaptchaResponse**

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

# **getCheckinDetail**
> RCheckinDetailResponse getCheckinDetail()

获取指定打卡记录的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let checkinId: number; // (default to undefined)

const { status, data } = await apiInstance.getCheckinDetail(
    checkinId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **checkinId** | [**number**] |  | defaults to undefined|


### Return type

**RCheckinDetailResponse**

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

# **getCreditDetail**
> RCreditDetailResponse getCreditDetail()

获取当前用户的信用详情，包含历史记录和等级信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCreditDetail();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RCreditDetailResponse**

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

# **getCreditInfo**
> RCreditInfoResponse getCreditInfo()

获取当前用户的信用分、等级、徽章等信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCreditInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RCreditInfoResponse**

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

# **getCreditLogs**
> RPageResultCreditLogItem getCreditLogs()

获取当前用户的信用分变更记录

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let reason: string; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 20)

const { status, data } = await apiInstance.getCreditLogs(
    reason,
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reason** | [**string**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 20|


### Return type

**RPageResultCreditLogItem**

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

# **getCurrentUser**
> RUserContext getCurrentUser()

获取当前登录用户的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCurrentUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RUserContext**

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

# **getCurrentUserId**
> RLong getCurrentUserId()

获取当前登录用户的ID

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCurrentUserId();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RLong**

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

# **getCurrentUserInfo**
> RUserInfoResponse getCurrentUserInfo()

获取当前登录用户的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCurrentUserInfo();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RUserInfoResponse**

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

# **getCurrentUsername**
> RString getCurrentUsername()

获取当前登录用户的用户名

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getCurrentUsername();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RString**

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

# **getMyApplications**
> RIPageMyApplicationVO getMyApplications()

获取当前用户的所有领养申请列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let status: string; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)
let sortBy: string; // (optional) (default to 'create_time')
let order: string; // (optional) (default to 'desc')

const { status, data } = await apiInstance.getMyApplications(
    status,
    pageNo,
    pageSize,
    sortBy,
    order
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|
| **sortBy** | [**string**] |  | (optional) defaults to 'create_time'|
| **order** | [**string**] |  | (optional) defaults to 'desc'|


### Return type

**RIPageMyApplicationVO**

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

# **getMyCheckins**
> RPageResultCheckinListItem getMyCheckins()

获取当前用户的打卡记录列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getMyCheckins(
    petId,
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RPageResultCheckinListItem**

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

# **getMyFavorites**
> RPageResultFavoriteListItem getMyFavorites()

获取当前用户的收藏列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getMyFavorites(
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RPageResultFavoriteListItem**

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

# **getNearbyOrgs**
> RNearbyOrgResponse getNearbyOrgs()

根据坐标获取附近的宠物机构

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let lng: number; // (default to undefined)
let lat: number; // (default to undefined)
let distance: number; // (optional) (default to 50.0)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getNearbyOrgs(
    lng,
    lat,
    distance,
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **lng** | [**number**] |  | defaults to undefined|
| **lat** | [**number**] |  | defaults to undefined|
| **distance** | [**number**] |  | (optional) defaults to 50.0|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RNearbyOrgResponse**

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

# **getNotices**
> RPageResultNoticeResponse getNotices()

获取平台公告列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getNotices(
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RPageResultNoticeResponse**

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

# **getOrgApplicationDetail**
> RApplicationDetailVO getOrgApplicationDetail()

机构获取指定申请的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)

const { status, data } = await apiInstance.getOrgApplicationDetail(
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationId** | [**number**] |  | defaults to undefined|


### Return type

**RApplicationDetailVO**

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

# **getOrgApplicationLogs**
> RListApplicationFlowLogVO getOrgApplicationLogs()

机构获取指定申请的所有流程日志

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)

const { status, data } = await apiInstance.getOrgApplicationLogs(
    applicationId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **applicationId** | [**number**] |  | defaults to undefined|


### Return type

**RListApplicationFlowLogVO**

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

# **getOrgApplications**
> RIPageOrgApplicationVO getOrgApplications()

机构获取其发布宠物的所有领养申请列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let keyword: string; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)
let sortBy: string; // (optional) (default to 'create_time')
let order: string; // (optional) (default to 'desc')

const { status, data } = await apiInstance.getOrgApplications(
    petId,
    status,
    keyword,
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
| **status** | [**string**] |  | (optional) defaults to undefined|
| **keyword** | [**string**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|
| **sortBy** | [**string**] |  | (optional) defaults to 'create_time'|
| **order** | [**string**] |  | (optional) defaults to 'desc'|


### Return type

**RIPageOrgApplicationVO**

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

# **getOrgPetDetail**
> RPetDetailResponse getOrgPetDetail()

机构获取指定宠物的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)

const { status, data } = await apiInstance.getOrgPetDetail(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RPetDetailResponse**

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

# **getOrgPetList**
> RPageResultOrgPetListResponse getOrgPetList()

机构获取自己发布的宠物列表

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    OrgPetQueryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let request: OrgPetQueryRequest; // (default to undefined)

const { status, data } = await apiInstance.getOrgPetList(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **OrgPetQueryRequest** |  | defaults to undefined|


### Return type

**RPageResultOrgPetListResponse**

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

# **getPermissionById**
> RPermissionResponse getPermissionById()

根据ID获取权限详情

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getPermissionById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RPermissionResponse**

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

# **getPermissionList**
> RPageResultPermissionResponse getPermissionList()

分页获取权限列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let permType: string; // (optional) (default to undefined)
let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getPermissionList(
    permType,
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permType** | [**string**] |  | (optional) defaults to undefined|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RPageResultPermissionResponse**

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

# **getPermissionTree**
> RListPermissionResponse getPermissionTree()

获取所有权限的树形结构

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getPermissionTree();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RListPermissionResponse**

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

# **getPetDetail**
> RPetDetailResponse getPetDetail()

根据宠物ID获取详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)

const { status, data } = await apiInstance.getPetDetail(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RPetDetailResponse**

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

# **getPetList**
> RPageResultPetListResponse getPetList()

获取宠物列表，支持关键词搜索、筛选、分页等功能

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PetListRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let request: PetListRequest; // (default to undefined)

const { status, data } = await apiInstance.getPetList(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **PetListRequest** |  | defaults to undefined|


### Return type

**RPageResultPetListResponse**

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

# **getRecommendPets**
> RPageResultPetListResponse getRecommendPets()

基于用户偏好获取推荐宠物列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let page: number; //页码 (optional) (default to 1)
let pageSize: number; //每页数量 (optional) (default to 12)
let lng: number; //用户经度 (optional) (default to undefined)
let lat: number; //用户纬度 (optional) (default to undefined)

const { status, data } = await apiInstance.getRecommendPets(
    page,
    pageSize,
    lng,
    lat
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | 页码 | (optional) defaults to 1|
| **pageSize** | [**number**] | 每页数量 | (optional) defaults to 12|
| **lng** | [**number**] | 用户经度 | (optional) defaults to undefined|
| **lat** | [**number**] | 用户纬度 | (optional) defaults to undefined|


### Return type

**RPageResultPetListResponse**

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

# **getRegions**
> RRegionResponse getRegions()

获取中国省市区三级联动数据

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let level: number; // (optional) (default to undefined)
let parentCode: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getRegions(
    level,
    parentCode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **level** | [**number**] |  | (optional) defaults to undefined|
| **parentCode** | [**string**] |  | (optional) defaults to undefined|


### Return type

**RRegionResponse**

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

# **getRoleById**
> RRoleResponse getRoleById()

根据ID获取角色详情，包含权限列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRoleById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RRoleResponse**

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

# **getRoleList**
> RPageResultRoleResponse getRoleList()

分页获取角色列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let pageNo: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getRoleList(
    pageNo,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNo** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**RPageResultRoleResponse**

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

# **getRolePermissions**
> RListPermissionResponse getRolePermissions()

获取指定角色的权限列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRolePermissions(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RListPermissionResponse**

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

# **getSearchSuggestions**
> RPetSuggestResponse getSearchSuggestions()

根据关键词获取搜索建议，包括品种、宠物名、标签等

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let keyword: string; //搜索关键词 (default to undefined)

const { status, data } = await apiInstance.getSearchSuggestions(
    keyword
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **keyword** | [**string**] | 搜索关键词 | defaults to undefined|


### Return type

**RPetSuggestResponse**

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

# **getSimilarPets**
> RListSimilarPetResponse getSimilarPets()

获取与指定宠物相似的宠物列表

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)
let limit: number; //返回数量限制 (optional) (default to 6)

const { status, data } = await apiInstance.getSimilarPets(
    id,
    limit
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 宠物ID | defaults to undefined|
| **limit** | [**number**] | 返回数量限制 | (optional) defaults to 6|


### Return type

**RListSimilarPetResponse**

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

# **getSystemConfig**
> RSystemConfigResponse getSystemConfig()

获取前端需要的系统配置信息

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getSystemConfig();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RSystemConfigResponse**

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

# **getTagList**
> RTagListResponse getTagList()

获取标签字典列表，支持按类型筛选

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let tagType: string; //标签类型：PERSONALITY/HEALTH/FEATURE (optional) (default to undefined)
let enabled: number; //是否启用：0/1，默认1 (optional) (default to 1)

const { status, data } = await apiInstance.getTagList(
    tagType,
    enabled
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **tagType** | [**string**] | 标签类型：PERSONALITY/HEALTH/FEATURE | (optional) defaults to undefined|
| **enabled** | [**number**] | 是否启用：0/1，默认1 | (optional) defaults to 1|


### Return type

**RTagListResponse**

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

# **getTags**
> RTagResponse getTags()

获取宠物标签库

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let type: string; // (optional) (default to undefined)
let enabled: boolean; // (optional) (default to true)

const { status, data } = await apiInstance.getTags(
    type,
    enabled
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **type** | [**string**] |  | (optional) defaults to undefined|
| **enabled** | [**boolean**] |  | (optional) defaults to true|


### Return type

**RTagResponse**

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

# **getUserPreference**
> RUserPreferenceResponse getUserPreference()

获取用户的宠物偏好设置

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getUserPreference();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RUserPreferenceResponse**

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

# **getUserProfile**
> RUserDetailResponse getUserProfile()

获取用户详细信息，包含信用分、统计数据等

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getUserProfile();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RUserDetailResponse**

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

# **getUserStats**
> RUserStatsResponse getUserStats()

获取用户的申请、收藏、打卡、领养等统计数据

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.getUserStats();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RUserStatsResponse**

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

# **hasPermission**
> RBoolean hasPermission()

检查当前用户是否有指定权限

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let permission: string; // (default to undefined)

const { status, data } = await apiInstance.hasPermission(
    permission
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permission** | [**string**] |  | defaults to undefined|


### Return type

**RBoolean**

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

# **hasRole**
> RBoolean hasRole()

检查当前用户是否有指定角色

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let role: string; // (default to undefined)

const { status, data } = await apiInstance.hasRole(
    role
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **role** | [**string**] |  | defaults to undefined|


### Return type

**RBoolean**

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

# **login**
> RLoginResponse login(loginRequest)

用户登录接口，返回JWT令牌

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**RLoginResponse**

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

# **logout**
> RVoid logout()

用户登出接口，将当前token加入黑名单

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

const { status, data } = await apiInstance.logout();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**RVoid**

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

# **recordBehavior**
> R recordBehavior(behaviorRecordRequest)

记录用户的浏览、收藏、申请等行为用于推荐

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    BehaviorRecordRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let behaviorRecordRequest: BehaviorRecordRequest; //

const { status, data } = await apiInstance.recordBehavior(
    behaviorRecordRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **behaviorRecordRequest** | **BehaviorRecordRequest**|  | |


### Return type

**R**

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

# **refreshToken**
> RLoginResponse refreshToken(refreshTokenRequest)

使用刷新令牌获取新的访问令牌

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RefreshTokenRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let refreshTokenRequest: RefreshTokenRequest; //

const { status, data } = await apiInstance.refreshToken(
    refreshTokenRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **refreshTokenRequest** | **RefreshTokenRequest**|  | |


### Return type

**RLoginResponse**

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

# **register**
> RUserEntity register(registerRequest)

用户注册接口

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.register(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

**RUserEntity**

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

# **removeFavorite**
> R removeFavorite()

取消对指定宠物的收藏

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let petId: number; // (default to undefined)

const { status, data } = await apiInstance.removeFavorite(
    petId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petId** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **savePetMedia**
> RPetMediaEntity savePetMedia(petMediaRequest)

将已上传的文件URL与宠物关联

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PetMediaRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)
let petMediaRequest: PetMediaRequest; //

const { status, data } = await apiInstance.savePetMedia(
    id,
    petMediaRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petMediaRequest** | **PetMediaRequest**|  | |
| **id** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RPetMediaEntity**

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

# **sendCode**
> RVoid sendCode(sendCodeRequest)

发送邮件或短信验证码

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    SendCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let sendCodeRequest: SendCodeRequest; //

const { status, data } = await apiInstance.sendCode(
    sendCodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **sendCodeRequest** | **SendCodeRequest**|  | |


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

# **submitPetAudit**
> RVoid submitPetAudit()

将宠物档案提交到管理员审核

### Example

```typescript
import {
    DefaultApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)

const { status, data } = await apiInstance.submitPetAudit(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | 宠物ID | defaults to undefined|


### Return type

**RVoid**

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

# **toggleFavorite**
> RFavoriteToggleResponse toggleFavorite(favoriteToggleRequest)

切换宠物的收藏状态，已收藏则取消，未收藏则添加

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    FavoriteToggleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let favoriteToggleRequest: FavoriteToggleRequest; //

const { status, data } = await apiInstance.toggleFavorite(
    favoriteToggleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **favoriteToggleRequest** | **FavoriteToggleRequest**|  | |


### Return type

**RFavoriteToggleResponse**

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

# **updateApplicationStatus**
> RStatusUpdateResponse updateApplicationStatus(statusUpdateRequest)

机构更新领养申请的处理状态

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    StatusUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let applicationId: number; // (default to undefined)
let statusUpdateRequest: StatusUpdateRequest; //

const { status, data } = await apiInstance.updateApplicationStatus(
    applicationId,
    statusUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **statusUpdateRequest** | **StatusUpdateRequest**|  | |
| **applicationId** | [**number**] |  | defaults to undefined|


### Return type

**RStatusUpdateResponse**

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

# **updatePermission**
> R updatePermission(permissionRequest)

更新权限信息

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PermissionRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let permissionRequest: PermissionRequest; //

const { status, data } = await apiInstance.updatePermission(
    id,
    permissionRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **permissionRequest** | **PermissionRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **updatePet**
> RVoid updatePet(petUpdateRequest)

机构更新指定宠物的详细信息

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    PetUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; //宠物ID (default to undefined)
let petUpdateRequest: PetUpdateRequest; //

const { status, data } = await apiInstance.updatePet(
    id,
    petUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **petUpdateRequest** | **PetUpdateRequest**|  | |
| **id** | [**number**] | 宠物ID | defaults to undefined|


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

# **updateProfile1**
> RVoid updateProfile1(userProfileUpdateRequest)

修改当前用户的个人资料

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserProfileUpdateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userProfileUpdateRequest: UserProfileUpdateRequest; //

const { status, data } = await apiInstance.updateProfile1(
    userProfileUpdateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userProfileUpdateRequest** | **UserProfileUpdateRequest**|  | |


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

# **updateRole**
> R updateRole(roleRequest)

更新角色信息

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    RoleRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let id: number; // (default to undefined)
let roleRequest: RoleRequest; //

const { status, data } = await apiInstance.updateRole(
    id,
    roleRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roleRequest** | **RoleRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**R**

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

# **updateUserPreference**
> RVoid updateUserPreference(userPreferenceRequest)

更新用户的宠物偏好设置

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UserPreferenceRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let userPreferenceRequest: UserPreferenceRequest; //

const { status, data } = await apiInstance.updateUserPreference(
    userPreferenceRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **userPreferenceRequest** | **UserPreferenceRequest**|  | |


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

# **upload**
> RUploadResponse upload()

通用文件上传接口

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    UploadRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let type: string; // (default to undefined)
let uploadRequest: UploadRequest; // (optional)

const { status, data } = await apiInstance.upload(
    type,
    uploadRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadRequest** | **UploadRequest**|  | |
| **type** | [**string**] |  | defaults to undefined|


### Return type

**RUploadResponse**

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

# **verifyCode**
> RVerifyCodeResponse verifyCode(verifyCodeRequest)

验证验证码并返回临时token

### Example

```typescript
import {
    DefaultApi,
    Configuration,
    VerifyCodeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new DefaultApi(configuration);

let verifyCodeRequest: VerifyCodeRequest; //

const { status, data } = await apiInstance.verifyCode(
    verifyCodeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **verifyCodeRequest** | **VerifyCodeRequest**|  | |


### Return type

**RVerifyCodeResponse**

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

