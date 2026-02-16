# LoginResponse

登录响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**accessToken** | **string** | 访问令牌 | [optional] [default to undefined]
**refreshToken** | **string** | 刷新令牌 | [optional] [default to undefined]
**expiresIn** | **number** | 令牌有效期(秒) | [optional] [default to undefined]
**tokenType** | **string** | 令牌类型 | [optional] [default to undefined]
**userId** | **number** | 用户ID | [optional] [default to undefined]
**username** | **string** | 用户名 | [optional] [default to undefined]
**role** | **string** | 用户角色 | [optional] [default to undefined]
**permissions** | **Array&lt;string&gt;** | 用户权限列表 | [optional] [default to undefined]
**avatar** | **string** | 头像URL | [optional] [default to undefined]

## Example

```typescript
import { LoginResponse } from './api';

const instance: LoginResponse = {
    accessToken,
    refreshToken,
    expiresIn,
    tokenType,
    userId,
    username,
    role,
    permissions,
    avatar,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
