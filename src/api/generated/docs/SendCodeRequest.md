# SendCodeRequest

发送验证码请求

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**phone** | **string** | 手机号 | [optional] [default to undefined]
**email** | **string** | 邮箱 | [optional] [default to undefined]
**type** | **string** | 用途：register、reset_password、bind_phone、verify_email | [default to undefined]
**captchaId** | **string** | 验证码ID | [default to undefined]
**captchaAnswer** | **string** | 验证码答案 | [default to undefined]

## Example

```typescript
import { SendCodeRequest } from './api';

const instance: SendCodeRequest = {
    phone,
    email,
    type,
    captchaId,
    captchaAnswer,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
