# FavoriteToggleResponse

收藏切换响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**favorited** | **boolean** | 当前收藏状态：true&#x3D;已收藏，false&#x3D;已取消收藏 | [optional] [default to undefined]
**favoriteId** | **number** | 收藏ID（如果已收藏） | [optional] [default to undefined]
**message** | **string** | 操作消息 | [optional] [default to undefined]

## Example

```typescript
import { FavoriteToggleResponse } from './api';

const instance: FavoriteToggleResponse = {
    favorited,
    favoriteId,
    message,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
