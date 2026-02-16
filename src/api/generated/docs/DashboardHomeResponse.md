# DashboardHomeResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**statistics** | [**DashboardStatisticsResponse**](DashboardStatisticsResponse.md) |  | [optional] [default to undefined]
**todos** | [**Array&lt;TodoItem&gt;**](TodoItem.md) |  | [optional] [default to undefined]
**recentPets** | [**Array&lt;RecentPetItem&gt;**](RecentPetItem.md) |  | [optional] [default to undefined]
**recentApplications** | [**Array&lt;RecentApplicationItem&gt;**](RecentApplicationItem.md) |  | [optional] [default to undefined]
**followupReminders** | [**Array&lt;FollowupReminderItem&gt;**](FollowupReminderItem.md) |  | [optional] [default to undefined]
**orgInfo** | [**OrgInfo**](OrgInfo.md) |  | [optional] [default to undefined]

## Example

```typescript
import { DashboardHomeResponse } from './api';

const instance: DashboardHomeResponse = {
    statistics,
    todos,
    recentPets,
    recentApplications,
    followupReminders,
    orgInfo,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
