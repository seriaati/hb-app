import { cn } from '@/lib/utils'
import { LanguageSelector } from '@/components/ui/language-selector'
import { DiscordUserBadge } from '@/components/auth/discord-user-badge'
import { FooterLinks } from '@/components/layout/footer-links'

interface PageContainerProps {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function PageContainer({ children, className, narrow = false }: PageContainerProps) {
  return (
    <div className="relative min-h-screen bg-background bg-texture text-foreground">
      {/* Controls — fixed top right */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
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
