import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { useGeetestCallback } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import type { GeetestPurpose } from '@/lib/login-flow'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import type { GeetestMMTData } from '@/api/types'

// Geetest v3 types
interface GeetestV3Captcha {
  onReady: (cb: () => void) => void
  onSuccess: (cb: () => void) => void
  onClose: (cb: () => void) => void
  onError: (cb: (err: unknown) => void) => void
  verify: () => void
  getValidate: () => {
    geetest_challenge: string
    geetest_validate: string
    geetest_seccode: string
  }
}

// Geetest v4 types
interface GeetestV4Captcha {
  onReady: (cb: () => void) => void
  onSuccess: (cb: () => void) => void
  onClose: (cb: () => void) => void
  onError: (cb: (err: unknown) => void) => void
  showCaptcha: () => void
  getValidate: () => {
    lot_number: string
    captcha_output: string
    pass_token: string
    gen_time: string
  }
}

declare global {
  interface Window {
    initGeetest?: (
      params: Record<string, unknown>,
      callback: (captcha: GeetestV3Captcha) => void,
    ) => void
    initGeetest4?: (
      params: Record<string, unknown>,
      callback: (captcha: GeetestV4Captcha) => void,
    ) => void
  }
}

type CaptchaState = 'loading' | 'ready' | 'verifying' | 'error' | 'closed'

type RouterState = {
  gt_version?: number
  mmt?: GeetestMMTData
  purpose?: GeetestPurpose
} | null

export function GeetestPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation()
  const geetestCallbackMutation = useGeetestCallback()

  const [captchaState, setCaptchaState] = useState<CaptchaState>('loading')
  const [error, setError] = useState<string | null>(null)
  const captchaRef = useRef<GeetestV3Captcha | GeetestV4Captcha | null>(null)
  // Track the last-initialized challenge so re-navigating to /geetest with new
  // MMT data (e.g. second geetest for email verification) triggers a fresh init.
  const initializedChallengeRef = useRef<string | null>(null)

  const state = location.state as RouterState
  const gtVersion: number | null = state?.gt_version ?? null
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

  function loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve()
        return
      }
      const script = document.createElement('script')
      script.src = src
      script.referrerPolicy = 'no-referrer'
      script.onload = () => resolve()
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`))
      document.head.appendChild(script)
    })
  }

  function handleV3Success(captcha: GeetestV3Captcha, mmtData: GeetestMMTData) {
    const validate = captcha.getValidate()
    setCaptchaState('verifying')
    geetestCallbackMutation.mutate(
      {
        session_id: mmtData.session_id ?? '',
        ...(mmtData.check_id && { check_id: mmtData.check_id }),
        geetest_challenge: validate.geetest_challenge,
        geetest_validate: validate.geetest_validate,
        geetest_seccode: validate.geetest_seccode,
      },
      {
        onSuccess: (data) =>
          handleLoginFlowResponse(data, navigate, { geetestPurpose: 'email_verify' }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('geetest_failed')
          setError(message)
          toast.error(message)
          setCaptchaState('error')
        },
      },
    )
  }

  function handleV4Success(captcha: GeetestV4Captcha, mmtData: GeetestMMTData) {
    const validate = captcha.getValidate()
    setCaptchaState('verifying')
    geetestCallbackMutation.mutate(
      {
        session_id: mmtData.session_id ?? '',
        ...(mmtData.check_id && { check_id: mmtData.check_id }),
        lot_number: validate.lot_number,
        captcha_output: validate.captcha_output,
        pass_token: validate.pass_token,
        gen_time: validate.gen_time,
      },
      {
        onSuccess: (data) =>
          handleLoginFlowResponse(data, navigate, { geetestPurpose: 'email_verify' }),
        onError: (err) => {
          const message = err instanceof Error ? err.message : t('geetest_failed')
          setError(message)
          toast.error(message)
          setCaptchaState('error')
        },
      },
    )
  }

  function initV3(mmtData: GeetestMMTData) {
    if (!window.initGeetest) {
      setError(t('geetest_failed'))
      setCaptchaState('error')
      return
    }

    window.initGeetest(
      {
        gt: mmtData.gt,
        challenge: mmtData.challenge,
        offline: !mmtData.success,
        new_captcha: mmtData.new_captcha,
        api_server: 'api-na.geetest.com',
        product: 'bind',
        lang: 'en',
        https: /^https/i.test(window.location.protocol),
      },
      (captcha) => {
        captchaRef.current = captcha

        captcha.onReady(() => {
          setCaptchaState('ready')
          captcha.verify()
        })

        captcha.onSuccess(() => handleV3Success(captcha, mmtData))

        captcha.onClose(() => {
          setCaptchaState('closed')
        })

        captcha.onError((err) => {
          console.error('Geetest v3 error:', err)
          const message = t('geetest_failed')
          setError(message)
          toast.error(message)
          setCaptchaState('error')
        })
      },
    )
  }

  function initV4(mmtData: GeetestMMTData) {
    if (!window.initGeetest4) {
      setError(t('geetest_failed'))
      setCaptchaState('error')
      return
    }

    window.initGeetest4(
      {
        captchaId: mmtData.gt,
        riskType: mmtData.risk_type,
        userInfo: mmtData.session_id ? JSON.stringify({ mmt_key: mmtData.session_id }) : undefined,
        product: 'bind',
        language: 'en',
      },
      (captcha) => {
        captchaRef.current = captcha

        captcha.onReady(() => {
          setCaptchaState('ready')
          captcha.showCaptcha()
        })

        captcha.onSuccess(() => handleV4Success(captcha, mmtData))

        captcha.onClose(() => {
          setCaptchaState('closed')
        })

        captcha.onError((err) => {
          console.error('Geetest v4 error:', err)
          const message = t('geetest_failed')
          setError(message)
          toast.error(message)
          setCaptchaState('error')
        })
      },
    )
  }

  useEffect(() => {
    if (gtVersion === null || mmt === null) {
      setError(t('geetest_failed'))
      setCaptchaState('error')
      return
    }

    // Use challenge (v3) or session_id (v4) as a unique key for this geetest session.
    // If we're already on /geetest and the backend returns another geetest step,
    // React Router updates location.state without remounting — detect the new data here.
    const challengeKey = mmt.challenge ?? mmt.session_id ?? null
    if (initializedChallengeRef.current === challengeKey) return
    initializedChallengeRef.current = challengeKey

    // Reset state for the new geetest session
    setCaptchaState('loading')
    setError(null)
    captchaRef.current = null

    console.log('Geetest GT version:', gtVersion)
    console.log('Geetest MMT data:', mmt)

    const sdkUrl =
      gtVersion === 3
        ? 'https://static.geetest.com/static/js/gt.0.5.0.js'
        : 'https://static.geetest.com/v4/gt4.js'

    loadScript(sdkUrl)
      .then(() => {
        if (gtVersion === 3) {
          initV3(mmt)
        } else {
          initV4(mmt)
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : t('geetest_failed')
        setError(message)
        toast.error(message)
        setCaptchaState('error')
      })
  }, [mmt?.challenge, mmt?.session_id]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleLaunchCaptcha() {
    const captcha = captchaRef.current
    if (!captcha) return
    if (gtVersion === 3) {
      ; (captcha as GeetestV3Captcha).verify()
    } else {
      ; (captcha as GeetestV4Captcha).showCaptcha()
    }
    setCaptchaState('ready')
  }

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
          <Button onClick={handleLaunchCaptcha}>{t('launch_captcha')}</Button>
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

  // loading / ready states — widget renders into its own overlay
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
