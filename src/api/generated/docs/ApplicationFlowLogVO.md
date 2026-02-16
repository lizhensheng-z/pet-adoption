# ApplicationFlowLogVO

申请流程日志信息

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 日志ID | [optional] [default to undefined]
**applicationId** | **number** | 申请ID | [optional] [default to undefined]
**fromStatus** | **string** | 变更前状态 | [optional] [default to undefined]
**toStatus** | **string** | 变更后状态 | [optional] [default to undefined]
**operatorId** | **number** | 操作者用户ID | [optional] [default to undefined]
**operatorName** | **string** | 操作者用户名 | [optional] [default to undefined]
**remark** | **string** | 流转备注 | [optional] [default to undefined]
**createTime** | **string** | 创建时间 | [optional] [default to undefined]

## Example

```typescript
import { ApplicationFlowLogVO } from './api';

const instance: ApplicationFlowLogVO = {
    id,
    applicationId,
    fromStatus,
    toStatus,
    operatorId,
    operatorName,
    remark,
    createTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
