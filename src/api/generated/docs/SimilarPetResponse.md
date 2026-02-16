# SimilarPetResponse

相似宠物响应数据

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
**coverUrl** | **string** | 封面图片URL | [optional] [default to undefined]
**orgName** | **string** | 发布机构名称 | [optional] [default to undefined]
**lng** | **number** | 经度 | [optional] [default to undefined]
**lat** | **number** | 纬度 | [optional] [default to undefined]
**tags** | **Array&lt;string&gt;** | 宠物标签列表 | [optional] [default to undefined]
**similarityScore** | **number** | 相似度分数（0-100） | [optional] [default to undefined]

## Example

```typescript
import { SimilarPetResponse } from './api';

const instance: SimilarPetResponse = {
    id,
    name,
    species,
    breed,
    ageMonth,
    gender,
    size,
    coverUrl,
    orgName,
    lng,
    lat,
    tags,
    similarityScore,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
