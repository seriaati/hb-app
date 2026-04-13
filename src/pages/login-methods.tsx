import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Mail, Code2, Smartphone, QrCode, Wrench, ChevronRight, BookOpen, Bug } from 'lucide-react'
import { LoginLayout } from '@/components/layout/login-layout'
import { getLoginMethodFaqUrl } from '@/lib/constants'

export function LoginMethodsPage() {
  const { platform } = useParams<{ platform: string }>()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const faqUrl = getLoginMethodFaqUrl(i18n.language)
  const [devMode, setDevMode] = useState(false)
  const bufferRef = useRef('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      bufferRef.current += e.key.toLowerCase()
      if (bufferRef.current.length > 3) {
        bufferRef.current = bufferRef.current.slice(-3)
      }
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        bufferRef.current = ''
      }, 2000)
      if (bufferRef.current === 'dev') {
        setDevMode(true)
        toast('Dev mode activated', { description: 'Hidden login method unlocked.' })
        bufferRef.current = ''
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const platformName = platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'

  const PLATFORM_META: Record<
    string,
    { name: string; description: string; accentColor: string }
  > = {
    hoyolab: {
      name: 'HoYoLAB',
      description: t('add_account_desc'),
      accentColor: 'oklch(0.56 0.17 12)',
    },
    miyoushe: {
      name: 'Miyoushe',
      description: t('add_account_desc'),
      accentColor: 'oklch(0.48 0.16 265)',
    },
  }

  const meta = PLATFORM_META[platform ?? ''] ?? PLATFORM_META['hoyolab']

  const loginMethods = [
    {
      id: 'email',
      label: t('login_method.email.label'),
      description: t('login_method.email.desc'),
      icon: <Mail size={18} />,
      path: 'email',
      platforms: ['hoyolab', 'miyoushe'],
    },
    {
      id: 'devtools',
      label: t('login_method.devtools.label'),
      description: t('login_method.devtools.desc'),
      icon: <Code2 size={18} />,
      path: 'devtools',
      platforms: ['hoyolab', 'miyoushe'],
    },
    {
      id: 'modapp',
      label: '通过改装版 App',
      description: '使用改装版米游社 App 拦截并提取您的登录信息',
      icon: <Wrench size={18} />,
      path: 'modapp',
      platforms: ['miyoushe'],
    },
    {
      id: 'mobile',
      label: '短信验证码登录',
      description: '使用短信验证码登录您的账户',
      icon: <Smartphone size={18} />,
      path: 'mobile',
      platforms: ['miyoushe'],
    },
    {
      id: 'qrcode',
      label: '二维码登录',
      description: '使用米游社 App 扫描二维码登录',
      icon: <QrCode size={18} />,
      path: 'qrcode',
      platforms: ['miyoushe'],
    },
    ...(devMode
      ? [
          {
            id: 'raw-cookies',
            label: 'Dev Cookies',
            description: 'Paste raw cookie JSON for development',
            icon: <Bug size={18} />,
            path: 'raw-cookies',
            platforms: ['hoyolab', 'miyoushe'],
          },
        ]
      : []),
  ]

  const availableMethods = loginMethods.filter((m) => m.platforms.includes(platform ?? ''))

  const features = [
    t('feature_daily_checkin'),
    t('feature_build_card'),
    t('feature_multi_account'),
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
            {t('select_login_method')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('select_login_method_desc')}
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
            {t('login_method_faq_note', 'Not sure which method to use?')}
          </span>
          <ChevronRight size={13} className="shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="cursor-pointer text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 text-left"
        >
          {t('back_to_platforms')}
        </button>
      </div>
    </LoginLayout>
  )
}
