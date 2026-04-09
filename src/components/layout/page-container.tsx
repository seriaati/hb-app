import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/ui/language-selector'
import { DiscordUserBadge } from '@/components/auth/discord-user-badge'
import { FooterLinks } from '@/components/layout/footer-links'
import { HelpCircle } from 'lucide-react'
import { DISCORD_SERVER_URL } from '@/lib/constants'
import { useTranslation } from 'react-i18next'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  const { t } = useTranslation()
  return (
    <div className="relative min-h-screen bg-background bg-texture text-foreground">
      {/* Controls — fixed top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <a
          href={DISCORD_SERVER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
          title="Join our Discord server for support"
        >
          <HelpCircle size={16} />
          <span className="hidden sm:inline">{t('need_help', 'Need help?')}</span>
        </a>
        <DiscordUserBadge />
        <LanguageSelector />
      </div>

      <div
        className={cn(
          'mx-auto w-full px-4 pt-10 pb-6',
          narrow ? 'max-w-md' : 'max-w-2xl',
          className,
        )}
      >
        <div className="page-enter">
          {children}
        </div>
        <FooterLinks className="flex items-center justify-center gap-0 mt-8" />
      </div>
    </div>
  )
}
