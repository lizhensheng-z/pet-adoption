# PetDetailResponse

宠物详情响应数据

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
**healthDesc** | **string** | 健康描述 | [optional] [default to undefined]
**personalityDesc** | **string** | 性格描述 | [optional] [default to undefined]
**adoptRequirements** | **string** | 领养要求 | [optional] [default to undefined]
**status** | **string** | 宠物状态 | [optional] [default to undefined]
**lng** | **number** | 经度 | [optional] [default to undefined]
**lat** | **number** | 纬度 | [optional] [default to undefined]
**coverUrl** | **string** | 封面图片URL | [optional] [default to undefined]
**mediaList** | [**Array&lt;PetMediaResponse&gt;**](PetMediaResponse.md) | 媒体文件列表 | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | 宠物标签列表 | [optional] [default to undefined]
**orgUserId** | **number** | 发布机构用户ID | [optional] [default to undefined]
**orgName** | **string** | 发布机构名称 | [optional] [default to undefined]
**publishedTime** | **string** | 发布时间 | [optional] [default to undefined]
**createTime** | **string** | 创建时间 | [optional] [default to undefined]

## Example

```typescript
import { PetDetailResponse } from './api';

const instance: PetDetailResponse = {
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
    healthDesc,
    personalityDesc,
    adoptRequirements,
    status,
    lng,
    lat,
    coverUrl,
    mediaList,
    tags,
    orgUserId,
    orgName,
    publishedTime,
    createTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
