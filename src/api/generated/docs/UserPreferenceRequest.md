# UserPreferenceRequest

用户偏好设置请求

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**petTypes** | **Array&lt;string&gt;** | 宠物类型偏好（cat, dog, other） | [optional] [default to undefined]
**ageRange** | **Array&lt;number&gt;** | 年龄范围（月）[最小, 最大] | [optional] [default to undefined]
**gender** | **string** | 性别偏好（MALE, FEMALE, UNKNOWN） | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | 标签偏好 | [optional] [default to undefined]
**distance** | **number** | 距离偏好（公里） | [optional] [default to undefined]
**sizes** | **Array&lt;string&gt;** | 体型偏好（S, M, L） | [optional] [default to undefined]
**healthRequirements** | **Array&lt;string&gt;** | 健康要求（已绝育, 已疫苗, 已驱虫） | [optional] [default to undefined]

## Example

```typescript
import { UserPreferenceRequest } from './api';

const instance: UserPreferenceRequest = {
    petTypes,
    ageRange,
    gender,
    tags,
    distance,
    sizes,
    healthRequirements,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
