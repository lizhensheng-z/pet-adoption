# CreditDetailResponse

信用详情响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**currentScore** | **number** | 当前信用分 | [optional] [default to undefined]
**level** | **string** | 信用等级 | [optional] [default to undefined]
**levelName** | **string** | 等级名称 | [optional] [default to undefined]
**scoreChange** | **number** | 信用分变化（正数为增加，负数为减少） | [optional] [default to undefined]
**history** | [**Array&lt;CreditLogItem&gt;**](CreditLogItem.md) | 历史记录 | [optional] [default to undefined]
**nextLevelScore** | **number** | 下一等级所需分数 | [optional] [default to undefined]
**scoreToNextLevel** | **number** | 距离下一等级还差多少分 | [optional] [default to undefined]

## Example

```typescript
import { CreditDetailResponse } from './api';

const instance: CreditDetailResponse = {
    currentScore,
    level,
    levelName,
    scoreChange,
    history,
    nextLevelScore,
    scoreToNextLevel,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
