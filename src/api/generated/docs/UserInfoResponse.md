# UserInfoResponse

用户信息响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** | 用户ID | [optional] [default to undefined]
**username** | **string** | 用户名 | [optional] [default to undefined]
**role** | **string** | 用户角色 | [optional] [default to undefined]
**avatar** | **string** | 头像URL | [optional] [default to undefined]
**phone** | **string** | 手机号 | [optional] [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**status** | **string** | 用户状态 | [optional] [default to undefined]
**createTime** | **string** | 创建时间 | [optional] [default to undefined]
**permissions** | **Array&lt;string&gt;** | 权限列表 | [optional] [default to undefined]

## Example

```typescript
import { UserInfoResponse } from './api';

const instance: UserInfoResponse = {
    userId,
    username,
    role,
    avatar,
    phone,
    email,
    status,
    createTime,
    permissions,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
