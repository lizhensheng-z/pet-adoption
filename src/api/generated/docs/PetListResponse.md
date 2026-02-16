# PetListResponse

宠物列表响应数据

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** | 宠物ID | [optional] [default to undefined]
**name** | **string** | 宠物名称 | [optional] [default to undefined]
**species** | **string** | 物种：CAT/DOG/OTHER | [optional] [default to undefined]
**breed** | **string** | 品种 | [optional] [default to undefined]
**ageMonth** | **number** | 年龄（月） | [optional] [default to undefined]
**gender** | **string** | 性别：MALE/FEMALE/UNKNOWN | [optional] [default to undefined]
**size** | **string** | 体型：S/M/L | [optional] [default to undefined]
**color** | **string** | 毛色 | [optional] [default to undefined]
**sterilized** | **boolean** | 是否绝育 | [optional] [default to undefined]
**vaccinated** | **boolean** | 是否疫苗 | [optional] [default to undefined]
**dewormed** | **boolean** | 是否驱虫 | [optional] [default to undefined]
**status** | **string** | 宠物状态 | [optional] [default to undefined]
**coverUrl** | **string** | 封面图片URL | [optional] [default to undefined]
**images** | **Array&lt;string&gt;** | 宠物图片列表 | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | 宠物标签列表 | [optional] [default to undefined]
**orgUserId** | **number** | 发布机构用户ID | [optional] [default to undefined]
**orgName** | **string** | 发布机构名称 | [optional] [default to undefined]
**publishedTime** | **string** | 发布时间 | [optional] [default to undefined]
**distance** | **number** | 距离（公里，当提供经纬度时计算） | [optional] [default to undefined]
**matchScore** | **number** | 匹配分数（用于推荐功能） | [optional] [default to undefined]

## Example

```typescript
import { PetListResponse } from './api';

const instance: PetListResponse = {
    id,
    name,
    species,
    breed,
    ageMonth,
    gender,
    size,
    color,
    sterilized,
    vaccinated,
    dewormed,
    status,
    coverUrl,
    images,
    tags,
    orgUserId,
    orgName,
    publishedTime,
    distance,
    matchScore,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
