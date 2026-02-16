# CheckinDetailResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**petId** | **number** |  | [optional] [default to undefined]
**pet** | [**PetSimpleInfo**](PetSimpleInfo.md) |  | [optional] [default to undefined]
**userId** | **number** |  | [optional] [default to undefined]
**user** | [**UserSimpleInfo**](UserSimpleInfo.md) |  | [optional] [default to undefined]
**org** | [**OrgSimpleInfo**](OrgSimpleInfo.md) |  | [optional] [default to undefined]
**content** | **string** |  | [optional] [default to undefined]
**mediaUrls** | **Array&lt;string&gt;** |  | [optional] [default to undefined]
**createTime** | **string** |  | [optional] [default to undefined]
**updateTime** | **string** |  | [optional] [default to undefined]
**likes** | **number** |  | [optional] [default to undefined]
**comments** | **number** |  | [optional] [default to undefined]
**isLiked** | **boolean** |  | [optional] [default to undefined]
**canEdit** | **boolean** |  | [optional] [default to undefined]
**canDelete** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { CheckinDetailResponse } from './api';

const instance: CheckinDetailResponse = {
    id,
    petId,
    pet,
    userId,
    user,
    org,
    content,
    mediaUrls,
    createTime,
    updateTime,
    likes,
    comments,
    isLiked,
    canEdit,
    canDelete,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
