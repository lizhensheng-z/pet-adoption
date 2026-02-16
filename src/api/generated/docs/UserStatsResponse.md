# UserStatsResponse

用户统计信息响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**applications** | **number** | 申请数量 | [optional] [default to undefined]
**favorites** | **number** | 收藏数量 | [optional] [default to undefined]
**checkins** | **number** | 打卡数量 | [optional] [default to undefined]
**adoptions** | **number** | 领养数量 | [optional] [default to undefined]
**pendingApplications** | **number** | 待处理申请数 | [optional] [default to undefined]
**monthlyCheckins** | **number** | 本月打卡数 | [optional] [default to undefined]

## Example

```typescript
import { UserStatsResponse } from './api';

const instance: UserStatsResponse = {
    applications,
    favorites,
    checkins,
    adoptions,
    pendingApplications,
    monthlyCheckins,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
