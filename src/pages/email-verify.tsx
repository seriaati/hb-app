import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useEmailResend, useEmailVerify } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { useLoginStore } from '@/stores/login-store'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const RESEND_COOLDOWN_SECONDS = 60

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const verify = useEmailVerify()
  const resend = useEmailResend()
  const emailSentAt = useLoginStore((state) => state.emailSentAt)
  const [code, setCode] = useState('')
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const resendSecondsLeft =
    emailSentAt === null
      ? 0
      : Math.min(
          RESEND_COOLDOWN_SECONDS,
          Math.max(0, RESEND_COOLDOWN_SECONDS - Math.floor((now - emailSentAt) / 1000)),
        )

  function handleResend() {
    resend.mutate(undefined, {
      onSuccess: (data) => {
        handleLoginFlowResponse(data, navigate, { geetestPurpose: 'email_verify' })
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : t('resend_code_failed'))
      },
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    verify.mutate(code, {
      onSuccess: (data) => {
        handleLoginFlowResponse(data, navigate)
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : t('verification_failed'))
      },
    })
  }

  return (
    <PageContainer narrow>
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('email_verify_title')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('email_verify_desc')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="code" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t('verification_code')}
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              maxLength={6}
              required
              className="h-14 text-center text-3xl tracking-[0.5em] font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            />
            <p className="text-xs text-muted-foreground text-center">
              {t('code_expires_note')}
            </p>
          </div>

          <Button
            type="submit"
            disabled={verify.isPending || code.length < 6}
            className="w-full h-10 font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {verify.isPending ? t('verifying') : t('verify_code')}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={resend.isPending || resendSecondsLeft > 0}
            className="w-full h-10"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {resendSecondsLeft > 0
              ? t('resend_code_countdown', { seconds: resendSecondsLeft })
              : t('resend_code')}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}
