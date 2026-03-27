import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Smartphone } from 'lucide-react'
import { useMobileSendOtp, useMobileVerify } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.48 0.16 265)'

export function LoginMobilePage() {
  const navigate = useNavigate()
  const sendOtp = useMobileSendOtp()
  const verifyOtp = useMobileVerify()
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)

  function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    sendOtp.mutate(mobile, {
      onSuccess: (data) => {
        handleLoginFlowResponse(data, navigate, {
          onVerifyOtp: () => {
            setOtpSent(true)
            toast.success('验证码已发送至您的手机号')
          },
        })
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : '发送验证码失败')
      },
    })
  }

  function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    verifyOtp.mutate(otp, {
      onSuccess: (data) => {
        handleLoginFlowResponse(data, navigate)
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : '验证失败')
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
        eyebrow: '米游社',
        title: '手机验证码登录',
        description: '使用已注册米游社的中国大陆手机号登录，系统将通过短信发送验证码验证您的身份。',
        features: ['无需密码'],
        securityNote: '您的手机号仅用于向米游社服务器请求验证码，不会被存储或共享。',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/miyoushe.webp" alt="米游社" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              米游社
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            手机验证码登录
          </h1>
          <p className="text-sm text-muted-foreground">
            使用米游社手机号登录
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mobile" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                手机号
              </Label>
              <div className="flex h-10 items-stretch rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:ring-[3px] focus-within:ring-ring/50 focus-within:border-ring">
                <span className="flex items-center px-3 text-sm font-medium text-muted-foreground border-r border-input select-none bg-muted/40 rounded-l-md">
                  +86
                </span>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="1xx xxxx xxxx"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                  className="h-full border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-l-none flex-1"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                type="submit"
                disabled={sendOtp.isPending}
                className="w-full h-10 font-semibold"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {sendOtp.isPending ? '发送中…' : '发送验证码'}
              </Button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
              >
                ← 返回
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
              验证码已发送至{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>
                +86{mobile}
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="otp" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                验证码
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
                {verifyOtp.isPending ? '验证中…' : '验证'}
              </Button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
              >
                ← 更换号码
              </button>
            </div>
          </form>
        )}
      </div>
    </LoginLayout>
  )
}
