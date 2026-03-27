import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Mail, BookOpen, UserX, Gamepad2, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useEmailPasswordLogin } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getEmailLoginDocsUrl, getBeforeStartUrl, getConsolePlayerUrl } from '@/lib/constants'

export function LoginEmailPage() {
  const { platform } = useParams<{ platform: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const docsUrl = getEmailLoginDocsUrl(i18n.language)
  const beforeStartUrl = getBeforeStartUrl(i18n.language)
  const consoleUrl = getConsolePlayerUrl(i18n.language)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useEmailPasswordLogin(platform ?? '')

  const platformName = platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'
  const accentColor =
    platform === 'miyoushe' ? 'oklch(0.48 0.16 265)' : 'oklch(0.56 0.17 12)'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          handleLoginFlowResponse(data, navigate)
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : t('web.login_failed'))
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
        title: t('web.email_login_title'),
        description: t('web.email_login_panel_desc'),
        features: [
          t('web.feature_secure_login'),
          t('web.feature_auto_captcha'),
          t('web.feature_2fa'),
        ],
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
            {t('web.email_login_title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('web.email_login_desc')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('web.email_address')}
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
              {t('web.password')}
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
              {login.isPending ? t('web.signing_in') : t('web.sign_in')}
            </Button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
            >
              {t('web.back')}
            </button>
          </div>
        </form>

        {/* Help cards */}
        <div className="flex flex-col gap-2">
          {[
            { href: docsUrl, icon: <BookOpen size={14} />, label: t('web.email_login_how_it_works', 'How does this work?') },
            { href: consoleUrl, icon: <Gamepad2 size={14} />, label: t('web.email_login_console', 'I am a console player') },
            { href: beforeStartUrl, icon: <UserX size={14} />, label: t('web.email_login_no_account', "I don't have a HoYoverse account (login with Google, Facebook)") },
          ].map(({ href, icon, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-left transition-colors hover:border-border hover:bg-card group"
            >
              <span className="shrink-0 text-muted-foreground">{icon}</span>
              <span className="flex-1 text-xs text-muted-foreground leading-relaxed">
                {label}
              </span>
              <ChevronRight size={13} className="shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          ))}
        </div>
      </div>
    </LoginLayout>
  )
}
