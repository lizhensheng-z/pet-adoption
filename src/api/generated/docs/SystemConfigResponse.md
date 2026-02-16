# SystemConfigResponse

系统配置响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**creditLevels** | [**Array&lt;CreditLevel&gt;**](CreditLevel.md) | 信用等级配置 | [optional] [default to undefined]
**petSpecies** | [**Array&lt;DictItem&gt;**](DictItem.md) | 宠物种类 | [optional] [default to undefined]
**petBreeds** | **{ [key: string]: Array&lt;string&gt;; }** | 宠物品种 | [optional] [default to undefined]
**petSizes** | [**Array&lt;DictItem&gt;**](DictItem.md) | 宠物体型 | [optional] [default to undefined]
**genders** | [**Array&lt;DictItem&gt;**](DictItem.md) | 性别选项 | [optional] [default to undefined]
**applicationStatuses** | [**Array&lt;ApplicationStatus&gt;**](ApplicationStatus.md) | 申请状态 | [optional] [default to undefined]
**tagCategories** | [**Array&lt;TagCategory&gt;**](TagCategory.md) | 标签分类 | [optional] [default to undefined]
**provinces** | **Array&lt;string&gt;** | 省份列表 | [optional] [default to undefined]

## Example

```typescript
import { SystemConfigResponse } from './api';

const instance: SystemConfigResponse = {
    creditLevels,
    petSpecies,
    petBreeds,
    petSizes,
    genders,
    applicationStatuses,
    tagCategories,
    provinces,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
