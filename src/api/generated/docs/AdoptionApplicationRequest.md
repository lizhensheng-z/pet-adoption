# AdoptionApplicationRequest

领养申请请求

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**petId** | **number** | 宠物ID | [default to undefined]
**reason** | **string** | 申请理由 | [default to undefined]
**contactInfo** | **string** | 联系方式 | [default to undefined]
**remarks** | **string** | 备注信息 | [optional] [default to undefined]
**questionnaire** | **{ [key: string]: object; }** | 领养问卷数据 | [optional] [default to undefined]

## Example

```typescript
import { AdoptionApplicationRequest } from './api';

const instance: AdoptionApplicationRequest = {
    petId,
    reason,
    contactInfo,
    remarks,
    questionnaire,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
