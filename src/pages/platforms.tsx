import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'
import { useLoginStore } from '@/stores/login-store'
import { LoginLayout } from '@/components/layout/login-layout'

export function PlatformsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()
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
      description: t('web.platform_hoyolab_desc', 'Global platform'),
      tag: 'Global',
    },
    {
      id: 'miyoushe',
      name: 'Miyoushe',
      image: '/images/miyoushe.webp',
      description: t('web.platform_miyoushe_desc', '米游社 · Chinese platform'),
      tag: 'CN',
    },
  ]

  return (
    <LoginLayout
      panel={{
        accentColor: 'oklch(0.55 0.22 10)',
        hero: (
          <img
            src="/images/logo.png"
            alt="Hoyo Buddy"
            className="h-16 w-16 rounded-2xl object-cover shadow-lg"
          />
        ),
        eyebrow: 'Hoyo Buddy',
        title: t('web.add_account_title', 'Add Account'),
        description: t(
          'web.add_account_desc',
          'Connect your HoYoverse account to unlock gacha log tracking, daily check-ins, real-time notes, and more — all in one place.',
        ),
        features: ['Gacha Logs', 'Daily Check-in', 'Real-time Notes', 'Multi-account'],
      }}
    >
      <div className="flex flex-col gap-8 stagger-children">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/logo.png" alt="Hoyo Buddy" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Hoyo Buddy
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('web.select_platform', 'Select Platform')}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('web.select_platform_desc', 'Choose the platform you want to add an account for')}
          </p>
        </div>

        {/* Platform list */}
        <div className="flex flex-col gap-3">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handleSelect(platform.id)}
              className="method-card group flex items-center gap-4 rounded-xl border border-border bg-card p-4 text-left w-full"
            >
              <img
                src={platform.image}
                alt={platform.name}
                className="h-12 w-12 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className="font-semibold text-foreground"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {platform.name}
                  </p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
                    style={{
                      background: 'color-mix(in oklch, var(--accent) 15%, transparent)',
                      color: 'var(--accent)',
                    }}
                  >
                    {platform.tag}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{platform.description}</p>
              </div>
              <ChevronRight
                size={16}
                className="flex-shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </button>
          ))}
        </div>
      </div>
    </LoginLayout>
  )
}
