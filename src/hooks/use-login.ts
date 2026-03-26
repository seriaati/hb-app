import { useMutation } from '@tanstack/react-query'
import {
  emailPasswordLogin,
  geetestCallback,
  emailVerify,
  mobileSendOtp,
  mobileVerify,
  devToolsLogin,
  rawCookiesLogin,
  modAppLogin,
  createQRCode,
  checkQRCode,
  submitDeviceInfo,
} from '@/api/login'
import type {
  EmailPasswordRequest,
  DevToolsCookiesRequest,
  RawCookiesRequest,
  ModAppRequest,
  DeviceInfoRequest,
} from '@/api/types'

export function useEmailPasswordLogin(platform: string) {
  return useMutation({
    mutationFn: (body: EmailPasswordRequest) => emailPasswordLogin(body, platform),
  })
}

export function useGeetestCallback() {
  return useMutation({
    mutationFn: geetestCallback,
  })
}

export function useEmailVerify() {
  return useMutation({
    mutationFn: (code: string) => emailVerify(code),
  })
}

export function useMobileSendOtp() {
  return useMutation({
    mutationFn: (mobile: string) => mobileSendOtp(mobile),
  })
}

export function useMobileVerify() {
  return useMutation({
    mutationFn: (code: string) => mobileVerify(code),
  })
}

export function useDevToolsLogin() {
  return useMutation({
    mutationFn: (body: DevToolsCookiesRequest) => devToolsLogin(body),
  })
}

export function useRawCookiesLogin() {
  return useMutation({
    mutationFn: (body: RawCookiesRequest) => rawCookiesLogin(body),
  })
}

export function useModAppLogin() {
  return useMutation({
    mutationFn: (body: ModAppRequest) => modAppLogin(body),
  })
}

export function useCreateQRCode() {
  return useMutation({
    mutationFn: createQRCode,
  })
}

export function useCheckQRCode() {
  return useMutation({
    mutationFn: checkQRCode,
  })
}

export function useSubmitDeviceInfo() {
  return useMutation({
    mutationFn: (body: DeviceInfoRequest) => submitDeviceInfo(body),
  })
}
