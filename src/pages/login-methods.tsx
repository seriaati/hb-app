import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Code2, Smartphone, QrCode, Wrench, ChevronRight, BookOpen } from 'lucide-react'
import { LoginLayout } from '@/components/layout/login-layout'
import { getLoginMethodFaqUrl } from '@/lib/constants'

export function LoginMethodsPage() {
  const { platform } = useParams<{ platform: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const faqUrl = getLoginMethodFaqUrl(i18n.language)

  const platformName = platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'

  const PLATFORM_META: Record<
    string,
    { name: string; tagline: string; description: string; accentColor: string }
  > = {
    hoyolab: {
      name: 'HoYoLAB',
      tagline: t('web.hoyolab_tagline'),
      description: t('web.hoyolab_description'),
      accentColor: 'oklch(0.56 0.17 12)',
    },
    miyoushe: {
      name: 'Miyoushe',
      tagline: t('web.miyoushe_tagline'),
      description: t('web.miyoushe_description'),
      accentColor: 'oklch(0.48 0.16 265)',
    },
  }

  const meta = PLATFORM_META[platform ?? ''] ?? PLATFORM_META['hoyolab']

  const loginMethods = [
    {
      id: 'email',
      label: t('web.login_method.email.label'),
      description: t('web.login_method.email.desc'),
      icon: <Mail size={18} />,
      path: 'email',
      platforms: ['hoyolab', 'miyoushe'],
    },
    {
      id: 'devtools',
      label: t('web.login_method.devtools.label'),
      description: t('web.login_method.devtools.desc'),
      icon: <Code2 size={18} />,
      path: 'devtools',
      platforms: ['hoyolab'],
    },
    {
      id: 'modapp',
      label: t('web.login_method_modapp_label'),
      description: t('web.login_method_modapp_desc'),
      icon: <Wrench size={18} />,
      path: 'modapp',
      platforms: ['miyoushe'],
    },
    {
      id: 'mobile',
      label: t('web.login_method_mobile_label'),
      description: t('web.login_method_mobile_desc'),
      icon: <Smartphone size={18} />,
      path: 'mobile',
      platforms: ['miyoushe'],
    },
    {
      id: 'qrcode',
      label: t('web.login_method_qrcode_label'),
      description: t('web.login_method_qrcode_desc'),
      icon: <QrCode size={18} />,
      path: 'qrcode',
      platforms: ['miyoushe'],
    },
  ]

  const availableMethods = loginMethods.filter((m) => m.platforms.includes(platform ?? ''))

  const features = [
    t('web.feature_gacha_logs'),
    t('web.feature_daily_checkin'),
    t('web.feature_realtime_notes'),
    t('web.feature_multi_account'),
  ]

  return (
    <LoginLayout
      panel={{
        accentColor: meta.accentColor,
        hero: (
          <img
            src={`/images/${platform}.webp`}
            alt={platformName}
            className="h-16 w-16 rounded-2xl object-cover shadow-lg"
          />
        ),
        eyebrow: meta.tagline,
        title: meta.name,
        description: meta.description,
        features,
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
            {t('web.select_login_method')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('web.select_login_method_desc')}
          </p>
        </div>

        {/* Methods list */}
        <div className="flex flex-col gap-2">
          {availableMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => navigate(`/login/${platform}/${method.path}`)}
              className="method-card group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left w-full"
            >
              {/* Icon */}
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
                style={{
                  background: 'color-mix(in oklch, var(--accent) 12%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                {method.icon}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-foreground text-sm"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {method.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {method.description}
                </p>
              </div>

              <ChevronRight
                size={15}
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          ))}
        </div>

        {/* FAQ / help card */}
        <a
          href={faqUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-left transition-colors hover:border-border hover:bg-card group"
        >
          <BookOpen size={14} className="shrink-0 text-muted-foreground" />
          <span className="flex-1 text-xs text-muted-foreground leading-relaxed">
            {t('web.login_method_faq_note', 'Not sure which method to use?')}
          </span>
          <ChevronRight size={13} className="shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-left"
        >
          {t('web.back_to_platforms')}
        </button>
      </div>
    </LoginLayout>
  )
}
