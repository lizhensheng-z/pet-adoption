# RegisterRequest

注册请求

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**username** | **string** | 用户名 | [default to undefined]
**password** | **string** | 密码 | [default to undefined]
**phone** | **string** | 手机号 | [optional] [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**role** | **string** | 用户角色：USER/ORG/ADMIN | [optional] [default to undefined]

## Example

```typescript
import { RegisterRequest } from './api';

const instance: RegisterRequest = {
    username,
    password,
    phone,
    email,
    role,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
