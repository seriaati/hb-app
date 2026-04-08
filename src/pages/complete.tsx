import { useTranslation } from 'react-i18next'
import { CheckCircle, ExternalLink } from 'lucide-react'
import { useLoginStore } from '@/stores/login-store'
import { buildDiscordUrls } from '@/lib/discord'
import { PageContainer } from '@/components/layout/page-container'
import { buttonVariants } from '@/components/ui/button'

export function CompletePage() {
  const { t } = useTranslation()
  const channelId = useLoginStore((s) => s.channelId)
  const guildId = useLoginStore((s) => s.guildId)

  const discordUrls = channelId ? buildDiscordUrls(channelId, guildId) : null

  return (
    <PageContainer narrow>
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            {t('complete_title', 'Accounts Added!')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(
              'complete_desc',
              'Your accounts have been added to Hoyo Buddy. You can now return to Discord.',
            )}
          </p>
        </div>
        {discordUrls && (
          <div className="flex flex-col items-center gap-2">
            <a href={discordUrls.deepLink} className={buttonVariants({ variant: 'default' })}>
              {t('return_to_discord', 'Return to Discord')}
            </a>
            <a
              href={discordUrls.webUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <ExternalLink className="h-3 w-3" />
              {t('open_discord_browser', 'Open Discord in browser')}
            </a>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
