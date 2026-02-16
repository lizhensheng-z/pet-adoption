# ApplicationDetailVO

申请详情信息

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 申请ID | [optional] [default to undefined]
**petId** | **number** | 宠物ID | [optional] [default to undefined]
**petName** | **string** | 宠物名称 | [optional] [default to undefined]
**petCoverUrl** | **string** | 宠物封面URL | [optional] [default to undefined]
**userId** | **number** | 用户ID | [optional] [default to undefined]
**userName** | **string** | 用户昵称 | [optional] [default to undefined]
**userAvatar** | **string** | 用户头像 | [optional] [default to undefined]
**userPhone** | **string** | 用户手机号 | [optional] [default to undefined]
**userEmail** | **string** | 用户邮箱 | [optional] [default to undefined]
**status** | **string** | 申请状态 | [optional] [default to undefined]
**statusDesc** | **string** | 状态描述 | [optional] [default to undefined]
**questionnaire** | **{ [key: string]: object; }** | 申请问卷JSON数据 | [optional] [default to undefined]
**submitTime** | **string** | 提交时间 | [optional] [default to undefined]
**rejectReason** | **string** | 拒绝原因 | [optional] [default to undefined]
**orgRemark** | **string** | 机构备注 | [optional] [default to undefined]
**decidedTime** | **string** | 最终决定时间 | [optional] [default to undefined]
**canCancel** | **boolean** | 是否可以取消 | [optional] [default to undefined]
**canModify** | **boolean** | 是否可以修改 | [optional] [default to undefined]

## Example

```typescript
import { ApplicationDetailVO } from './api';

const instance: ApplicationDetailVO = {
    id,
    petId,
    petName,
    petCoverUrl,
    userId,
    userName,
    userAvatar,
    userPhone,
    userEmail,
    status,
    statusDesc,
    questionnaire,
    submitTime,
    rejectReason,
    orgRemark,
    decidedTime,
    canCancel,
    canModify,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
