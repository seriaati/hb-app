import { useTranslation } from 'react-i18next'
import { LogOut } from 'lucide-react'
import { useAuth, useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface DiscordUserBadgeProps {
  className?: string
}

export function DiscordUserBadge({ className }: DiscordUserBadgeProps) {
  const { data: user } = useAuth()
  const { mutate: doLogout, isPending } = useLogout()
  const { t } = useTranslation()

  if (!user) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-2.5 py-1.5 backdrop-blur-sm',
        className,
      )}
    >
      {/* Avatar */}
      <img
        src={user.avatar_url}
        alt={user.username}
        className="h-6 w-6 rounded-full object-cover shrink-0 ring-1 ring-border/40"
      />

      {/* Username */}
      <span
        className="text-xs font-medium text-foreground/80 max-w-[120px] truncate"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {user.username}
      </span>

      {/* Divider */}
      <span className="h-3.5 w-px bg-border/60 shrink-0" />

      {/* Logout button */}
      <button
        onClick={() => doLogout()}
        disabled={isPending}
        title={t('web.switch_discord_account', 'Switch account')}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <LogOut size={12} />
        <span className="hidden sm:inline">{t('web.switch_account', 'Switch')}</span>
      </button>
    </div>
  )
}
