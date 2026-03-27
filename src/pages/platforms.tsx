import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { useLoginStore } from '@/stores/login-store'
import { LoginLayout } from '@/components/layout/login-layout'
import { getAccountSecurityUrl } from '@/lib/constants'

export function PlatformsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const accountSecurityUrl = getAccountSecurityUrl(i18n.language)
  const setParams = useLoginStore((s) => s.setParams)
  const setPlatform = useLoginStore((s) => s.setPlatform)

  useEffect(() => {
    const userId = searchParams.get('user_id')
    const locale = searchParams.get('locale')
    const channelId = searchParams.get('channel_id')
    const guildId = searchParams.get('guild_id')

    setParams({
      userId: userId ? Number(userId) : null,
      locale: locale ?? 'en-US',
      channelId: channelId ? Number(channelId) : null,
      guildId: guildId ? Number(guildId) : null,
    })
  }, [searchParams, setParams])

  function handleSelect(platformId: string) {
    setPlatform(platformId)
    navigate(`/login/${platformId}`)
  }

  const platforms = [
    {
      id: 'hoyolab',
      name: 'HoYoLAB',
      image: '/images/hoyolab.webp',
      accentColor: 'oklch(0.56 0.17 12)',
    },
    {
      id: 'miyoushe',
      name: '米游社',
      image: '/images/miyoushe.webp',
      accentColor: 'oklch(0.48 0.16 265)',
    },
  ]

  const features = [
    t('web.feature_gacha_logs'),
    t('web.feature_daily_checkin'),
    t('web.feature_realtime_notes'),
    t('web.feature_multi_account'),
  ]

  return (
    <LoginLayout
      panel={{
        accentColor: 'oklch(0.56 0.17 12)',
        hero: (
          <img
            src="/images/logo.png"
            alt="Hoyo Buddy"
            className="h-16 w-16 rounded-2xl object-cover shadow-lg"
          />
        ),
        eyebrow: 'Hoyo Buddy',
        title: t('web.add_account_title'),
        description: t('web.add_account_desc'),
        features,
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.select_platform')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.select_platform_desc')}
          </p>
        </div>

        {/* Platform list */}
        <div className="flex flex-col gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleSelect(platform.id)}
              className="method-card group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left w-full"
              style={{ '--accent': platform.accentColor } as React.CSSProperties}
            >
              <img
                src={platform.image}
                alt={platform.name}
                className="h-12 w-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p
                  className="font-semibold text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {platform.name}
                </p>
              </div>
              <ChevronRight
                size={16}
                className="shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          ))}
        </div>

        {/* Account security FAQ */}
        <a
          href={accountSecurityUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-left transition-colors hover:border-border hover:bg-card group"
        >
          <ShieldCheck size={14} className="shrink-0 text-muted-foreground" />
          <span className="flex-1 text-xs text-muted-foreground leading-relaxed">
            {t('web.select_platform_security_note', 'We treat your account security seriously.')}
          </span>
          <ChevronRight size={13} className="shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5" />
        </a>
      </div>
    </LoginLayout>
  )
}
