import { useMutation } from '@tanstack/react-query'
import {
  emailPasswordLogin,
  geetestCallback,
  emailVerify,
  mobileSendOtp,
  mobileVerify,
  devToolsLogin,
  modAppLogin,
  createQRCode,
  checkQRCode,
  submitDeviceInfo,
  geetestCommand,
} from '@/api/login'
import type {
  EmailPasswordRequest,
  DevToolsCookiesRequest,
  ModAppRequest,
  DeviceInfoRequest,
  GeetestCallbackRequest,
  GeetestCommandRequest,
} from '@/api/types'

export function useEmailPasswordLogin(platform: string) {
  return useMutation({
    mutationFn: (body: EmailPasswordRequest) => emailPasswordLogin(body, platform),
  })
}

export function useGeetestCallback() {
  return useMutation({
    mutationFn: (body: GeetestCallbackRequest) => geetestCallback(body),
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

export function useGeetestCommand() {
  return useMutation({
    mutationFn: (body: GeetestCommandRequest) => geetestCommand(body),
  })
}
