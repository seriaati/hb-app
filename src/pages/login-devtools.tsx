import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Code2, X, ZoomIn, ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useDevToolsLogin } from '@/hooks/use-login'
import { handleLoginFlowResponse } from '@/lib/login-flow'
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

const ACCENT_HOYOLAB = 'oklch(0.56 0.17 12)'
const ACCENT_MIYOUSHE = 'oklch(0.48 0.16 265)'

const STEPS = [
  { labelKey: 'devtools_step1_label', descKey: 'devtools_step1_desc' },
  { labelKey: 'devtools_step2_label', descKey: 'devtools_step2_desc' },
  { labelKey: 'devtools_step3_label', descKey: 'devtools_step3_desc' },
  { labelKey: 'devtools_step4_label', descKey: 'devtools_step4_desc' },
  { labelKey: 'devtools_step5_label', descKey: 'devtools_step5_desc' },
  { labelKey: 'devtools_step6_label', descKey: 'devtools_step6_desc' },
] as const

export function LoginDevtoolsPage() {
  const navigate = useNavigate()
  const { platform } = useParams<{ platform: string }>()
  const { t } = useTranslation()
  const login = useDevToolsLogin(platform ?? 'hoyolab')
  const ACCENT = platform === 'miyoushe' ? ACCENT_MIYOUSHE : ACCENT_HOYOLAB
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
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
        setFormOpen(false)
        handleLoginFlowResponse(data, navigate)
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : t('login_failed'))
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
        eyebrow: platform === 'miyoushe' ? 'Miyoushe' : 'HoYoLAB',
        title: t('devtools_title'),
        description: t('devtools_panel_desc'),
        features: [
          t('feature_no_password'),
          t('feature_computer_only'),
        ],
      }}
    >
      <div className="flex flex-col gap-6 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5">
              <img
                src={platform === 'miyoushe' ? '/images/miyoushe.webp' : '/images/hoyolab.webp'}
                alt={platform === 'miyoushe' ? 'Miyoushe' : 'HoYoLAB'}
                className="h-6 w-6 rounded-md object-cover"
              />
            </div>
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              {platform === 'miyoushe' ? 'Miyoushe' : 'HoYoLAB'}
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('devtools_title')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('devtools_desc')}
          </p>
        </div>

        {/* Step-by-step instructions */}
        <div className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <div key={step.labelKey} className="flex gap-3">
              {/* Step number */}
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5"
                style={{
                  background: `color-mix(in oklch, ${ACCENT} 15%, var(--background))`,
                  border: `1px solid color-mix(in oklch, ${ACCENT} 30%, transparent)`,
                  color: ACCENT,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {index + 1}
              </div>
              {/* Step content */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <p className="text-sm font-medium text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  {t(step.labelKey)}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t(step.descKey)}
                </p>
                {/* Platform links for step 1 */}
                {index === 0 && (
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    <a
                      href="https://www.hoyolab.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        background: `color-mix(in oklch, ${ACCENT} 10%, var(--card))`,
                        border: `1px solid color-mix(in oklch, ${ACCENT} 25%, transparent)`,
                        color: ACCENT,
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      <img src="/images/hoyolab.webp" alt="" className="h-3.5 w-3.5 rounded-sm object-cover" />
                      {'HoYoLAB'}
                      <ExternalLink size={10} />
                    </a>
                    <a
                      href="https://www.miyoushe.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
                      style={{
                        background: 'color-mix(in oklch, oklch(0.48 0.16 265) 10%, var(--card))',
                        border: '1px solid color-mix(in oklch, oklch(0.48 0.16 265) 25%, transparent)',
                        color: 'oklch(0.48 0.16 265)',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      <img src="/images/miyoushe.webp" alt="" className="h-3.5 w-3.5 rounded-sm object-cover" />
                      {'米游社'}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tutorial image */}
        <div
          className="group relative overflow-hidden rounded-xl border border-border cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src="/images/dev_tools_tutorial.gif"
            alt="DevTools tutorial"
            className="w-full transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
            <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ZoomIn size={13} />
              {t('click_to_enlarge', 'Click to enlarge')}
            </div>
          </div>
        </div>

        {/* CTA button to open form modal */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={() => setFormOpen(true)}
            className="w-full h-10 font-semibold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('devtools_enter_cookies', 'Enter Cookies')}
          </Button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-center py-1"
          >
            {t('back')}
          </button>
        </div>
      </div>

      {/* Lightbox portal */}
      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <img
              src="/images/dev_tools_tutorial.gif"
              alt="DevTools tutorial"
              className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body,
        )}

      {/* Cookie form modal portal */}
      {formOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !login.isPending && setFormOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-2xl border border-border bg-popover shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                <div className="flex flex-col gap-0.5">
                  <h2
                    className="text-base font-semibold text-foreground leading-tight"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {t('devtools_modal_title', 'Enter Cookie Values')}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('devtools_modal_desc', 'Copy each value from the DevTools Application → Cookies panel and paste below.')}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={login.isPending}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors disabled:opacity-40"
                  onClick={() => setFormOpen(false)}
                  aria-label="Close"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Accent divider */}
              <div
                className="mx-5 h-px mb-4"
                style={{ background: `color-mix(in oklch, ${ACCENT} 25%, transparent)` }}
              />

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5 pb-5">
                {FIELDS.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1.5">
                    <Label htmlFor={`modal-${key}`} className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {label}
                    </Label>
                    <Input
                      id={`modal-${key}`}
                      value={values[key]}
                      onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
                      placeholder={`Enter ${label}`}
                      required
                      className="h-9 font-mono text-sm"
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    type="submit"
                    disabled={login.isPending}
                    className="w-full h-10 font-semibold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      background: ACCENT,
                    }}
                  >
                    {login.isPending ? t('submitting') : t('submit_cookies', 'Submit Cookies')}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </LoginLayout>
  )
}
