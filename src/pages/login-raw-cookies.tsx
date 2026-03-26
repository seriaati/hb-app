import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Cookie } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRawCookiesLogin } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.55 0.22 10)'

export function LoginRawCookiesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = useRawCookiesLogin()
  const [cookies, setCookies] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { cookies },
      {
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
          toast.error(err instanceof Error ? err.message : 'Login failed')
        },
      },
    )
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
            <Cookie size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: 'HoYoLAB',
        title: t('web.rawcookies_title', 'JavaScript / Raw Cookies'),
        description:
          'Run a short JavaScript snippet in your browser console on hoyolab.com to copy your full cookie string, then paste it below.',
        features: ['One-line Script', 'No Extensions', 'HoYoLAB Only'],
        securityNote:
          'The cookie string is parsed locally and only the required tokens are sent to the HoYoverse API. Nothing is stored on our servers.',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/hoyolab.webp" alt="HoYoLAB" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              HoYoLAB
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.rawcookies_title', 'JavaScript / Raw Cookies')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.rawcookies_desc', 'Open your browser console and run the JavaScript snippet to copy your cookies')}
          </p>
        </div>

        {/* Tutorial image */}
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src="/images/js_tutorial.gif"
            alt="JavaScript tutorial"
            className="w-full"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cookies" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t('web.cookie_string', 'Cookie String')}
            </Label>
            <textarea
              id="cookies"
              className="min-h-[120px] w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder={t('web.paste_cookie_string', 'Paste your cookie string here…')}
              value={cookies}
              onChange={(e) => setCookies(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <Button
              type="submit"
              disabled={login.isPending}
              className="w-full h-10 font-semibold"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {login.isPending ? t('web.submitting', 'Submitting…') : t('web.submit_cookies', 'Submit Cookies')}
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
