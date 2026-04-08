import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { useGeetestCallback } from '@/hooks/use-login'
import { useGeetest } from '@/hooks/use-geetest'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import type { GeetestPurpose } from '@/lib/login-flow'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import type { GeetestMMTData } from '@/api/types'
import type { GeetestV3Validate, GeetestV4Validate } from '@/hooks/use-geetest'

type RouterState = {
  gt_version?: number
  api_server?: string
  mmt?: GeetestMMTData
  purpose?: GeetestPurpose
} | null

export function GeetestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const geetestCallbackMutation = useGeetestCallback()

  const state = location.state as RouterState
  const gtVersion: number | null = state?.gt_version ?? null
  const apiServer: string | null = state?.api_server ?? null
  const mmt: GeetestMMTData | null = state?.mmt ?? null
  const purpose: GeetestPurpose = state?.purpose ?? 'login'
  const isEmailVerifyGeetest = purpose === 'email_verify'

  function handleBack() {
    if (purpose === 'email_verify') {
      navigate('/email-verify')
    } else {
      navigate(-1)
    }
  }

  function handleV3Success(validate: GeetestV3Validate) {
    setCaptchaState('verifying')
    geetestCallbackMutation.mutate(
      {
        session_id: mmt?.session_id ?? '',
        ...(mmt?.check_id && { check_id: mmt.check_id }),
        geetest_challenge: validate.geetest_challenge,
        geetest_validate: validate.geetest_validate,
        geetest_seccode: validate.geetest_seccode,
      },
      {
        onSuccess: (data) =>
          handleLoginFlowResponse(data, navigate, { geetestPurpose: 'email_verify' }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('geetest_failed')
          toast.error(message)
          setCaptchaState('error')
        },
      },
    )
  }

  function handleV4Success(validate: GeetestV4Validate) {
    setCaptchaState('verifying')
    geetestCallbackMutation.mutate(
      {
        session_id: mmt?.session_id ?? '',
        captcha_id: validate.captcha_id,
        lot_number: validate.lot_number,
        pass_token: validate.pass_token,
        gen_time: validate.gen_time,
        captcha_output: validate.captcha_output,
      },
      {
        onSuccess: (data) =>
          handleLoginFlowResponse(data, navigate, { geetestPurpose: 'email_verify' }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('geetest_failed')
          toast.error(message)
          setCaptchaState('error')
        },
      },
    )
  }

  const { captchaState, setCaptchaState, error, launchCaptcha } = useGeetest({
    gtVersion,
    apiServer,
    mmt,
    onV3Success: handleV3Success,
    onV4Success: handleV4Success,
    onError: () => {},
    onClose: () => {},
  })

  if (captchaState === 'error' || error) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">{error ?? t('geetest_failed')}</p>
          <Button onClick={handleBack}>{t('back')}</Button>
        </div>
      </PageContainer>
    )
  }

  if (captchaState === 'verifying') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <LoadingSpinner size={32} />
        <p className="text-muted-foreground">{t('processing_verification')}</p>
      </div>
    )
  }

  if (captchaState === 'closed') {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-6 py-16 text-center">
          {isEmailVerifyGeetest && (
            <div className="flex w-full max-w-xs flex-col items-center gap-2 rounded-xl border border-border bg-card px-6 py-4 text-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
                <Mail className="h-4 w-4" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                {t('geetest_email_verify_title', 'One more verification')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t(
                  'geetest_email_verify_desc',
                  'To send your verification code, please complete this security check.',
                )}
              </p>
            </div>
          )}
          <p className="text-muted-foreground">{t('captcha_closed')}</p>
          <Button onClick={launchCaptcha}>{t('launch_captcha')}</Button>
          <button
            type="button"
            onClick={handleBack}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
          >
            {t('back')}
          </button>
        </div>
      </PageContainer>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      {isEmailVerifyGeetest && (
        <div className="mb-2 flex max-w-xs flex-col items-center gap-3 rounded-xl border border-border bg-card px-6 py-5 text-center shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <Mail className="h-5 w-5" style={{ color: 'var(--accent)' }} />
          </div>
          <p className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
            {t('geetest_email_verify_title', 'One more verification')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t(
              'geetest_email_verify_desc',
              'To send your verification code, please complete this security check.',
            )}
          </p>
        </div>
      )}
      <LoadingSpinner size={32} />
      <p className="text-muted-foreground">{t('loading_captcha')}</p>
      <div id="geetest-captcha" />
    </div>
  )
}
