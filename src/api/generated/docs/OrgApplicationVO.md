# OrgApplicationVO

机构申请列表项

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 申请ID | [optional] [default to undefined]
**petId** | **number** | 宠物ID | [optional] [default to undefined]
**petName** | **string** | 宠物名称 | [optional] [default to undefined]
**petCoverUrl** | **string** | 宠物封面URL | [optional] [default to undefined]
**userId** | **number** | 用户ID | [optional] [default to undefined]
**userNickname** | **string** | 用户昵称 | [optional] [default to undefined]
**userAvatar** | **string** | 用户头像 | [optional] [default to undefined]
**userPhone** | **string** | 用户手机号 | [optional] [default to undefined]
**userEmail** | **string** | 用户邮箱 | [optional] [default to undefined]
**status** | **string** | 申请状态 | [optional] [default to undefined]
**statusDesc** | **string** | 状态描述 | [optional] [default to undefined]
**submitTime** | **string** | 提交时间 | [optional] [default to undefined]
**userCreditScore** | **number** | 用户信用分 | [optional] [default to undefined]

## Example

```typescript
import { OrgApplicationVO } from './api';

const instance: OrgApplicationVO = {
    id,
    petId,
    petName,
    petCoverUrl,
    userId,
    userNickname,
    userAvatar,
    userPhone,
    userEmail,
    status,
    statusDesc,
    submitTime,
    userCreditScore,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
