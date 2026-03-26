import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEmailPasswordLogin } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginEmailPage() {
  const { platform } = useParams<{ platform: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useEmailPasswordLogin(platform ?? '')

  const platformName = platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'
  const accentColor =
    platform === 'miyoushe' ? 'oklch(0.48 0.16 265)' : 'oklch(0.55 0.22 10)'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          if (data.status === 'success') {
            navigate('/finish')
          } else if (data.status === 'geetest_required') {
            navigate('/geetest')
          } else if (data.status === 'email_verify_required') {
            navigate('/email-verify')
          } else {
            toast.info(data.message ?? 'Unknown status')
          }
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : 'Login failed')
        },
      },
    )
  }

  return (
    <LoginLayout
      panel={{
        accentColor,
        hero: (
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: `color-mix(in oklch, ${accentColor} 15%, var(--background))`,
              border: `1px solid color-mix(in oklch, ${accentColor} 30%, transparent)`,
            }}
          >
            <Mail size={28} style={{ color: accentColor }} />
          </div>
        ),
        eyebrow: platformName,
        title: t('web.email_login_title', 'Email & Password'),
        description:
          'Sign in securely with your HoYoverse account email and password. Two-factor authentication and CAPTCHA challenges are handled automatically.',
        features: ['Secure Login', 'Auto CAPTCHA', '2FA Support'],
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img
              src={`/images/${platform}.webp`}
              alt={platformName}
              className="h-8 w-8 rounded-lg object-cover"
            />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              {platformName}
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.email_login_title', 'Email & Password')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('web.email_login_desc', 'Sign in with your HoYoverse account credentials')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('web.email_address', 'Email address')}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              {t('web.password', 'Password')}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-10"
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-10 font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {login.isPending ? t('web.signing_in', 'Signing in…') : t('web.sign_in', 'Sign In')}
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
      </div>
    </LoginLayout>
  )
}
