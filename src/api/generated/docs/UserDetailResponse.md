# UserDetailResponse

用户详细信息响应（含信用分、统计数据）

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** | 用户ID | [optional] [default to undefined]
**username** | **string** | 用户名 | [optional] [default to undefined]
**nickname** | **string** | 昵称 | [optional] [default to undefined]
**avatar** | **string** | 头像URL | [optional] [default to undefined]
**role** | **string** | 用户角色 | [optional] [default to undefined]
**phone** | **string** | 手机号 | [optional] [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**city** | **string** | 城市 | [optional] [default to undefined]
**creditScore** | **number** | 信用分 | [optional] [default to undefined]
**creditChange** | **number** | 信用分变化 | [optional] [default to undefined]
**creditLevel** | **string** | 信用等级 | [optional] [default to undefined]
**medals** | **Array&lt;string&gt;** | 徽章列表 | [optional] [default to undefined]
**stats** | [**UserStatsResponse**](UserStatsResponse.md) |  | [optional] [default to undefined]
**createTime** | **string** | 创建时间 | [optional] [default to undefined]

## Example

```typescript
import { UserDetailResponse } from './api';

const instance: UserDetailResponse = {
    userId,
    username,
    nickname,
    avatar,
    role,
    phone,
    email,
    city,
    creditScore,
    creditChange,
    creditLevel,
    medals,
    stats,
    createTime,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
