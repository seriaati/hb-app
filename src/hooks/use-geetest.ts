import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { GEETEST_SDK_URLS } from '@/lib/constants'
import type { GeetestMMTData } from '@/api/types'

export interface GeetestV3Captcha {
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

export interface GeetestV4Captcha {
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

export type CaptchaState = 'loading' | 'ready' | 'verifying' | 'error' | 'closed' | 'success'

export interface GeetestV3Validate {
  geetest_challenge: string
  geetest_validate: string
  geetest_seccode: string
}

export interface GeetestV4Validate {
  lot_number: string
  captcha_output: string
  pass_token: string
  gen_time: string
}

interface UseGeetestOptions {
  gtVersion: number | null
  apiServer: string | null
  mmt: GeetestMMTData | null
  onV3Success: (validate: GeetestV3Validate) => void
  onV4Success: (validate: GeetestV4Validate) => void
  onError: (message: string) => void
  onClose: () => void
}

interface UseGeetestReturn {
  captchaState: CaptchaState
  setCaptchaState: (state: CaptchaState) => void
  error: string | null
  launchCaptcha: () => void
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

export function useGeetest(options: UseGeetestOptions): UseGeetestReturn {
  const { gtVersion, apiServer, mmt, onV3Success, onV4Success, onError, onClose } = options
  const { t } = useTranslation()

  const [captchaState, setCaptchaState] = useState<CaptchaState>('loading')
  const [error, setError] = useState<string | null>(null)
  const captchaRef = useRef<GeetestV3Captcha | GeetestV4Captcha | null>(null)
  const initializedChallengeRef = useRef<string | null>(null)

  function initV3(mmtData: GeetestMMTData) {
    if (!window.initGeetest) {
      const msg = t('geetest_failed')
      setError(msg)
      setCaptchaState('error')
      onError(msg)
      return
    }

    window.initGeetest(
      {
        gt: mmtData.gt,
        challenge: mmtData.challenge,
        offline: !mmtData.success,
        new_captcha: mmtData.new_captcha,
        api_server: apiServer ?? 'api-na.geetest.com',
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

        captcha.onSuccess(() => {
          onV3Success(captcha.getValidate())
        })

        captcha.onClose(() => {
          setCaptchaState('closed')
          onClose()
        })

        captcha.onError((err) => {
          console.error('Geetest v3 error:', err)
          const msg = t('geetest_failed')
          setError(msg)
          toast.error(msg)
          setCaptchaState('error')
          onError(msg)
        })
      },
    )
  }

  function initV4(mmtData: GeetestMMTData) {
    if (!window.initGeetest4) {
      const msg = t('geetest_failed')
      setError(msg)
      setCaptchaState('error')
      onError(msg)
      return
    }

    window.initGeetest4(
      {
        captchaId: mmtData.gt,
        riskType: mmtData.risk_type,
        userInfo: mmtData.session_id ? JSON.stringify({ mmt_key: mmtData.session_id }) : undefined,
        api_server: apiServer ?? 'gcaptcha4.captchami.com',
        product: 'bind',
        language: 'en',
      },
      (captcha) => {
        captchaRef.current = captcha

        captcha.onReady(() => {
          setCaptchaState('ready')
          captcha.showCaptcha()
        })

        captcha.onSuccess(() => {
          onV4Success(captcha.getValidate())
        })

        captcha.onClose(() => {
          setCaptchaState('closed')
          onClose()
        })

        captcha.onError((err) => {
          console.error('Geetest v4 error:', err)
          const msg = t('geetest_failed')
          setError(msg)
          toast.error(msg)
          setCaptchaState('error')
          onError(msg)
        })
      },
    )
  }

  useEffect(() => {
    if (gtVersion === null || mmt === null) {
      const msg = t('geetest_failed')
      setError(msg)
      setCaptchaState('error')
      onError(msg)
      return
    }

    const challengeKey = mmt.challenge ?? mmt.session_id ?? null
    if (initializedChallengeRef.current === challengeKey) return
    initializedChallengeRef.current = challengeKey

    setCaptchaState('loading')
    setError(null)
    captchaRef.current = null

    const sdkUrl = GEETEST_SDK_URLS[gtVersion]

    loadScript(sdkUrl)
      .then(() => {
        if (gtVersion === 3) {
          initV3(mmt)
        } else {
          initV4(mmt)
        }
      })
      .catch((err) => {
        const msg = err instanceof Error ? err.message : t('geetest_failed')
        setError(msg)
        toast.error(msg)
        setCaptchaState('error')
        onError(msg)
      })
  }, [mmt?.challenge, mmt?.session_id]) // eslint-disable-line react-hooks/exhaustive-deps

  function launchCaptcha() {
    const captcha = captchaRef.current
    if (!captcha) return
    if (gtVersion === 3) {
      ;(captcha as GeetestV3Captcha).verify()
    } else {
      ;(captcha as GeetestV4Captcha).showCaptcha()
    }
    setCaptchaState('ready')
  }

  return { captchaState, setCaptchaState, error, launchCaptcha }
}
