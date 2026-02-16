# CreditInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]
**score** | **number** |  | [optional] [default to undefined]
**level** | **number** |  | [optional] [default to undefined]
**levelName** | **string** |  | [optional] [default to undefined]
**levelDescription** | **string** |  | [optional] [default to undefined]
**progressToNextLevel** | [**LevelProgress**](LevelProgress.md) |  | [optional] [default to undefined]
**statistics** | [**CreditStatistics**](CreditStatistics.md) |  | [optional] [default to undefined]
**recentActivities** | [**Array&lt;CreditLogItem&gt;**](CreditLogItem.md) |  | [optional] [default to undefined]
**badges** | [**Array&lt;BadgeInfo&gt;**](BadgeInfo.md) |  | [optional] [default to undefined]
**lastCalcTime** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { CreditInfoResponse } from './api';

const instance: CreditInfoResponse = {
    userId,
    username,
    score,
    level,
    levelName,
    levelDescription,
    progressToNextLevel,
    statistics,
    recentActivities,
    badges,
    lastCalcTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
