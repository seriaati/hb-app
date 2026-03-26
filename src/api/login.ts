import { apiClient } from './client'
import type {
  LoginFlowResponse,
  EmailPasswordRequest,
  DevToolsCookiesRequest,
  RawCookiesRequest,
  ModAppRequest,
  MobileRequest,
  OTPVerifyRequest,
  EmailVerifyRequest,
  DeviceInfoRequest,
  QRCodeResponse,
  QRCodeStatusResponse,
} from './types'

export async function emailPasswordLogin(
  body: EmailPasswordRequest,
  platform: string,
): Promise<LoginFlowResponse> {
  return apiClient
    .post(`api/login/email-password`, { json: body, searchParams: { platform } })
    .json<LoginFlowResponse>()
}

export async function geetestCallback(): Promise<LoginFlowResponse> {
  return apiClient.post('api/login/geetest-callback').json<LoginFlowResponse>()
}

export async function emailVerify(code: string): Promise<LoginFlowResponse> {
  const body: EmailVerifyRequest = { code }
  return apiClient.post('api/login/email-verify', { json: body }).json<LoginFlowResponse>()
}

export async function mobileSendOtp(mobile: string): Promise<LoginFlowResponse> {
  const body: MobileRequest = { mobile }
  return apiClient.post('api/login/mobile-send-otp', { json: body }).json<LoginFlowResponse>()
}

export async function mobileVerify(code: string): Promise<LoginFlowResponse> {
  const body: OTPVerifyRequest = { code }
  return apiClient.post('api/login/mobile-verify', { json: body }).json<LoginFlowResponse>()
}

export async function devToolsLogin(body: DevToolsCookiesRequest): Promise<LoginFlowResponse> {
  return apiClient.post('api/login/dev-tools', { json: body }).json<LoginFlowResponse>()
}

export async function rawCookiesLogin(body: RawCookiesRequest): Promise<LoginFlowResponse> {
  return apiClient.post('api/login/raw-cookies', { json: body }).json<LoginFlowResponse>()
}

export async function modAppLogin(body: ModAppRequest): Promise<LoginFlowResponse> {
  return apiClient.post('api/login/mod-app', { json: body }).json<LoginFlowResponse>()
}

export async function createQRCode(): Promise<QRCodeResponse> {
  return apiClient.post('api/login/qrcode/create').json<QRCodeResponse>()
}

export async function checkQRCode(): Promise<QRCodeStatusResponse> {
  return apiClient.post('api/login/qrcode/check').json<QRCodeStatusResponse>()
}

export async function submitDeviceInfo(body: DeviceInfoRequest): Promise<LoginFlowResponse> {
  return apiClient.post('api/login/device-info', { json: body }).json<LoginFlowResponse>()
}
