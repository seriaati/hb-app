import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Smartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMobileSendOtp, useMobileVerify } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.48 0.16 265)'

export function LoginMobilePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const sendOtp = useMobileSendOtp()
  const verifyOtp = useMobileVerify()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    sendOtp.mutate(mobile, {
      onSuccess: (data) => {
        if (data.status === 'geetest_required') {
          navigate('/geetest')
        } else if (data.status === 'otp_sent') {
          setOtpSent(true)
          toast.success('OTP sent to your mobile number')
        } else {
          toast.info(data.message ?? 'Unknown status')
        }
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to send OTP')
      },
    })
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    verifyOtp.mutate(otp, {
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
    <LoginLayout
      panel={{
        accentColor: ACCENT,
        hero: (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in oklch, ${ACCENT} 15%, var(--background))`,
              border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
            }}
          >
            <Smartphone size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: 'Miyoushe',
        title: t('web.mobile_title', 'Mobile OTP'),
        description:
          'Sign in with your Chinese mobile number registered on Miyoushe. An OTP will be sent via SMS to verify your identity.',
        features: ['SMS Verification', 'Miyoushe Only', 'No Password'],
        securityNote:
          'Your mobile number is used only to request an OTP from Miyoushe servers. It is never stored or shared.',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/miyoushe.webp" alt="Miyoushe" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Miyoushe
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.mobile_title', 'Mobile OTP')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('web.mobile_desc', 'Sign in with your Miyoushe mobile number')}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mobile" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t('web.mobile_number', 'Mobile Number')}
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="+86 1xx xxxx xxxx"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
                className="h-10"
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                disabled={sendOtp.isPending}
                className="w-full h-10 font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {sendOtp.isPending ? t('web.sending', 'Sending…') : t('web.send_otp', 'Send OTP')}
              </Button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
              >
                {t('web.back', '← Back')}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            {/* Sent notice */}
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: 'color-mix(in oklch, var(--accent) 30%, transparent)',
                background: 'color-mix(in oklch, var(--accent) 8%, transparent)',
                color: 'var(--foreground)',
              }}
            >
              {t('web.otp_sent_to', 'OTP sent to {mobile}', { mobile }).replace('{mobile}', '')}{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                {mobile}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="otp" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {t('web.otp_code', 'OTP Code')}
              </Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
                className="h-12 text-center text-xl tracking-[0.4em] font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                disabled={verifyOtp.isPending}
                className="w-full h-10 font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {verifyOtp.isPending ? t('web.verifying', 'Verifying…') : t('web.verify_otp', 'Verify OTP')}
              </Button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
              >
                {t('web.change_number', '← Change number')}
              </button>
            </div>
          </form>
        )}
      </div>
    </LoginLayout>
  )
}
