import type { NavigateFunction } from 'react-router-dom'
import type { LoginFlowResponse } from '@/api/types'
import { useLoginStore } from '@/stores/login-store'

export type GeetestPurpose = 'login' | 'email_verify'

export function handleLoginFlowResponse(
  data: LoginFlowResponse,
  navigate: NavigateFunction,
  options?: {
    onVerifyOtp?: () => void
    onUnknown?: () => void
    geetestPurpose?: GeetestPurpose
  },
) {
  switch (data.next_step) {
    case 'geetest':
      navigate('/geetest', {
        state: {
          gt_version: data.gt_version,
          api_server: data.api_server,
          mmt: data.mmt,
          purpose: options?.geetestPurpose ?? 'login',
        },
      })
      break
    case 'email_verify':
      // The backend only returns email_verify right after HoYoLAB sends an email
      useLoginStore.getState().setEmailSentAt(Date.now())
      navigate('/email-verify')
      break
    case 'verify_otp':
      options?.onVerifyOtp?.()
      break
    case 'finish':
      navigate('/finish')
      break
    case 'done':
      navigate('/complete')
      break
    default:
      options?.onUnknown?.()
  }
}
