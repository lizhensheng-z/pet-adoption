# MyApplicationVO

我的申请列表项

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 申请ID | [optional] [default to undefined]
**petId** | **number** | 宠物ID | [optional] [default to undefined]
**petName** | **string** | 宠物名称 | [optional] [default to undefined]
**petCoverUrl** | **string** | 宠物封面URL | [optional] [default to undefined]
**petSpecies** | **string** | 宠物物种 | [optional] [default to undefined]
**petBreed** | **string** | 宠物品种 | [optional] [default to undefined]
**status** | **string** | 申请状态 | [optional] [default to undefined]
**statusDesc** | **string** | 状态描述 | [optional] [default to undefined]
**submitTime** | **string** | 提交时间 | [optional] [default to undefined]
**orgName** | **string** | 机构名称 | [optional] [default to undefined]
**orgAvatar** | **string** | 机构头像 | [optional] [default to undefined]

## Example

```typescript
import { MyApplicationVO } from './api';

const instance: MyApplicationVO = {
    id,
    petId,
    petName,
    petCoverUrl,
    petSpecies,
    petBreed,
    status,
    statusDesc,
    submitTime,
    orgName,
    orgAvatar,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
