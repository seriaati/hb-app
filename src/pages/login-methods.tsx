import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Mail, Code2, Cookie, Smartphone, QrCode, Wrench, ChevronRight } from 'lucide-react'
import { LoginLayout } from '@/components/layout/login-layout'

const PLATFORM_META: Record<
  string,
  { name: string; tagline: string; description: string; accentColor: string }
> = {
  hoyolab: {
    name: 'HoYoLAB',
    tagline: 'Global Community Platform',
    description:
      'Connect your HoYoLAB account to access gacha logs, daily check-ins, and real-time notes for all your HoYoverse games.',
    accentColor: 'oklch(0.55 0.22 10)',
  },
  miyoushe: {
    name: 'Miyoushe',
    tagline: '米游社 · Chinese Platform',
    description:
      '连接您的米游社账号，获取抽卡记录、每日签到和实时便笺等功能，支持所有米哈游游戏。',
    accentColor: 'oklch(0.48 0.16 265)',
  },
}

export function LoginMethodsPage() {
  const { platform } = useParams<{ platform: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const platformName = platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'
  const meta = PLATFORM_META[platform ?? ''] ?? PLATFORM_META['hoyolab']

  const loginMethods = [
    {
      id: 'email',
      label: t('web.login_method.email.label', 'Email & Password'),
      description: t('web.login_method.email.desc', 'Sign in with your email and password'),
      icon: <Mail size={18} />,
      path: 'email',
      platforms: ['hoyolab', 'miyoushe'],
    },
    {
      id: 'devtools',
      label: t('web.login_method.devtools.label', 'DevTools Cookies'),
      description: t('web.login_method.devtools.desc', 'Extract cookies from browser developer tools'),
      icon: <Code2 size={18} />,
      path: 'devtools',
      platforms: ['hoyolab'],
    },
    {
      id: 'rawcookies',
      label: t('web.login_method.rawcookies.label', 'JavaScript / Raw Cookies'),
      description: t('web.login_method.rawcookies.desc', 'Paste raw cookie string from browser console'),
      icon: <Cookie size={18} />,
      path: 'rawcookies',
      platforms: ['hoyolab'],
    },
    {
      id: 'modapp',
      label: t('web.login_method.modapp.label', 'Mod App'),
      description: t('web.login_method.modapp.desc', 'Use a modified app to extract login details'),
      icon: <Wrench size={18} />,
      path: 'modapp',
      platforms: ['hoyolab', 'miyoushe'],
    },
    {
      id: 'mobile',
      label: t('web.login_method.mobile.label', 'Mobile OTP'),
      description: t('web.login_method.mobile.desc', 'Sign in with your mobile number and OTP'),
      icon: <Smartphone size={18} />,
      path: 'mobile',
      platforms: ['miyoushe'],
    },
    {
      id: 'qrcode',
      label: t('web.login_method.qrcode.label', 'QR Code'),
      description: t('web.login_method.qrcode.desc', 'Scan a QR code with the Miyoushe app'),
      icon: <QrCode size={18} />,
      path: 'qrcode',
      platforms: ['miyoushe'],
    },
  ]

  const availableMethods = loginMethods.filter((m) => m.platforms.includes(platform ?? ''))

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
        features: ['Gacha Logs', 'Daily Check-in', 'Real-time Notes', 'Multi-account'],
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
            {t('web.select_login_method', 'Select Login Method')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('web.select_login_method_desc', 'Choose how you\'d like to authenticate')}
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
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200"
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
                className="flex-shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          ))}
        </div>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-left"
        >
          {t('web.back_to_platforms', '← Back to platforms')}
        </button>
      </div>
    </LoginLayout>
  )
}
