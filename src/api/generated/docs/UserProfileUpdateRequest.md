# UserProfileUpdateRequest

用户资料更新请求

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**avatar** | **string** | 头像URL | [optional] [default to undefined]
**phone** | **string** | 手机号 | [optional] [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**preference** | [**UserPreference**](UserPreference.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UserProfileUpdateRequest } from './api';

const instance: UserProfileUpdateRequest = {
    avatar,
    phone,
    email,
    preference,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
