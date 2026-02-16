# CaptchaResponse

验证码响应

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**captchaId** | **string** | 验证码ID | [optional] [default to undefined]
**image** | **string** | 验证码图片(base64) | [optional] [default to undefined]
**expiresIn** | **number** | 有效期(秒) | [optional] [default to undefined]

## Example

```typescript
import { CaptchaResponse } from './api';

const instance: CaptchaResponse = {
    captchaId,
    image,
    expiresIn,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
