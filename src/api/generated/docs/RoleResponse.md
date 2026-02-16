# RoleResponse

数据列表

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**roleCode** | **string** |  | [optional] [default to undefined]
**roleName** | **string** |  | [optional] [default to undefined]
**enabled** | **string** |  | [optional] [default to undefined]
**remark** | **string** |  | [optional] [default to undefined]
**createTime** | **string** |  | [optional] [default to undefined]
**updateTime** | **string** |  | [optional] [default to undefined]
**permissions** | [**Array&lt;PermissionResponse&gt;**](PermissionResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { RoleResponse } from './api';

const instance: RoleResponse = {
    id,
    roleCode,
    roleName,
    enabled,
    remark,
    createTime,
    updateTime,
    permissions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
