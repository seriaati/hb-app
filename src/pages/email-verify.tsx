import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useEmailVerify } from '@/hooks/use-login'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function EmailVerifyPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const verify = useEmailVerify()
  const [code, setCode] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    verify.mutate(code, {
      onSuccess: (data) => {
        if (data.status === 'success') {
          navigate('/finish')
        } else if (data.status === 'geetest_required') {
          navigate('/geetest')
        } else {
          toast.info(data.message ?? 'Unknown status')
        }
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Verification failed')
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
            {t('web.email_verify_title', 'Email Verification')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.email_verify_desc', 'Enter the 6-digit verification code sent to your email address')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="code" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t('web.verification_code', 'Verification Code')}
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
              {t('web.code_expires_note', 'Check your inbox — the code expires in a few minutes')}
            </p>
          </div>

          <Button
            type="submit"
            disabled={verify.isPending || code.length < 6}
            className="w-full h-10 font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {verify.isPending ? t('web.verifying', 'Verifying…') : t('web.verify_code', 'Verify Code')}
          </Button>
        </form>
      </div>
    </PageContainer>
  )
}
