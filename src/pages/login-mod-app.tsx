import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Wrench } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useModAppLogin } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const ACCENT = 'oklch(0.55 0.22 10)'

export function LoginModAppPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = useModAppLogin()
  const [loginDetails, setLoginDetails] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(
      { login_details: loginDetails },
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
            <Wrench size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: 'HoYoLAB · Miyoushe',
        title: t('web.modapp_title', 'Mod App Login'),
        description:
          'Use a modified HoYoverse app to intercept and extract your login details. This method works for both HoYoLAB and Miyoushe accounts.',
        features: ['HoYoLAB & Miyoushe', 'Mobile-friendly', 'No Browser Needed'],
        securityNote:
          'Login details extracted from the mod app are used only to authenticate with HoYoverse APIs. They are never stored on our servers.',
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.modapp_title', 'Mod App Login')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.modapp_desc', 'Use a modified HoYoverse app to extract your login details and paste them below')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login_details" className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t('web.login_details', 'Login Details')}
            </Label>
            <textarea
              id="login_details"
              className="min-h-[140px] w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors resize-none"
              placeholder={t('web.paste_login_details', 'Paste your login details here…')}
              value={loginDetails}
              onChange={(e) => setLoginDetails(e.target.value)}
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
              {login.isPending ? t('web.submitting', 'Submitting…') : t('web.submit_details', 'Submit Details')}
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
