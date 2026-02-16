# PetListRequest

宠物列表查询请求参数

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**keyword** | **string** | 搜索关键词（匹配宠物名称、品种、性格描述） | [optional] [default to undefined]
**species** | **string** | 物种筛选：CAT/DOG/OTHER | [optional] [default to undefined]
**gender** | **string** | 性别筛选：MALE/FEMALE | [optional] [default to undefined]
**ageMin** | **number** | 最小年龄（月） | [optional] [default to undefined]
**ageMax** | **number** | 最大年龄（月） | [optional] [default to undefined]
**size** | **string** | 体型筛选：S/M/L | [optional] [default to undefined]
**vaccinated** | **boolean** | 是否疫苗 | [optional] [default to undefined]
**sterilized** | **boolean** | 是否绝育 | [optional] [default to undefined]
**status** | **string** | 状态筛选（默认：PUBLISHED） | [optional] [default to undefined]
**page** | **number** | 页码（从1开始） | [optional] [default to undefined]
**pageSize** | **number** | 每页数量 | [optional] [default to undefined]
**lng** | **number** | 用户经度（用于计算距离） | [optional] [default to undefined]
**lat** | **number** | 用户纬度（用于计算距离） | [optional] [default to undefined]
**maxDistance** | **number** | 最大距离（公里） | [optional] [default to undefined]
**sortBy** | **string** | 排序字段 | [optional] [default to undefined]
**order** | **string** | 排序方式：asc/desc | [optional] [default to undefined]

## Example

```typescript
import { PetListRequest } from './api';

const instance: PetListRequest = {
    keyword,
    species,
    gender,
    ageMin,
    ageMax,
    size,
    vaccinated,
    sterilized,
    status,
    page,
    pageSize,
    lng,
    lat,
    maxDistance,
    sortBy,
    order,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
