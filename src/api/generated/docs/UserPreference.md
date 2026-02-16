# UserPreference

用户偏好设置

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**species** | **Array&lt;string&gt;** | 宠物种类偏好 | [optional] [default to undefined]
**sizePreference** | **Array&lt;string&gt;** | 体型偏好 | [optional] [default to undefined]
**ageRange** | **Array&lt;number&gt;** | 年龄范围(月) | [optional] [default to undefined]
**personality** | **Array&lt;string&gt;** | 性格偏好 | [optional] [default to undefined]
**requiredHealth** | **Array&lt;string&gt;** | 健康要求 | [optional] [default to undefined]
**city** | **string** | 城市 | [optional] [default to undefined]

## Example

```typescript
import { UserPreference } from './api';

const instance: UserPreference = {
    species,
    sizePreference,
    ageRange,
    personality,
    requiredHealth,
    city,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
