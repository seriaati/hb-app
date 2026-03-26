import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Code2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDevToolsLogin } from '@/hooks/use-login'
import { LoginLayout } from '@/components/layout/login-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const FIELDS = [
  { key: 'ltuid_v2', label: 'ltuid_v2' },
  { key: 'account_id_v2', label: 'account_id_v2' },
  { key: 'ltoken_v2', label: 'ltoken_v2' },
  { key: 'ltmid_v2', label: 'ltmid_v2' },
  { key: 'account_mid_v2', label: 'account_mid_v2' },
] as const

type FieldKey = (typeof FIELDS)[number]['key']

const ACCENT = 'oklch(0.55 0.22 10)'

export function LoginDevtoolsPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const login = useDevToolsLogin()
  const [values, setValues] = useState<Record<FieldKey, string>>({
    ltuid_v2: '',
    account_id_v2: '',
    ltoken_v2: '',
    ltmid_v2: '',
    account_mid_v2: '',
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    login.mutate(values, {
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
            <Code2 size={28} style={{ color: ACCENT }} />
          </div>
        ),
        eyebrow: 'HoYoLAB',
        title: t('web.devtools_title', 'DevTools Cookies'),
        description:
          'Extract your session cookies directly from your browser\'s developer tools. Open DevTools → Application → Cookies on hoyolab.com and copy the values.',
        features: ['No Password Needed', 'Browser-based', 'HoYoLAB Only'],
        securityNote:
          'Cookie values are transmitted directly to the HoYoverse API and never stored on our servers. Tokens expire naturally when you log out of HoYoLAB.',
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
            {t('web.devtools_title', 'DevTools Cookies')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.devtools_desc', 'Open browser DevTools → Application → Cookies and copy the values below')}
          </p>
        </div>

        {/* Tutorial image */}
        <div className="overflow-hidden rounded-xl border border-border">
          <img
            src="/images/dev_tools_tutorial.gif"
            alt="DevTools tutorial"
            className="w-full"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={key} className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
              </Label>
              <Input
                id={key}
                value={values[key]}
                onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                placeholder={`Enter ${label}`}
                required
                className="h-10 font-mono text-sm"
              />
            </div>
          ))}

          <div className="flex flex-col gap-2 pt-2">
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
