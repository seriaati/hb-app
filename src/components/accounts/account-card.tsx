import { Checkbox } from '@/components/ui/checkbox'
import { GAME_ICONS, GAME_NAMES } from '@/lib/constants'
import type { AccountInfo } from '@/api/types'

interface AccountCardProps {
  account: AccountInfo
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function AccountCard({ account, checked, onCheckedChange }: AccountCardProps) {
  const iconSrc = GAME_ICONS[account.game] ?? '/images/logo.png'
  const gameName = GAME_NAMES[account.game] ?? account.game

  return (
    <div
      className="row-interactive flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all duration-200"
      style={{
        borderColor: checked
          ? 'color-mix(in oklch, var(--accent) 40%, var(--border))'
          : 'var(--border)',
        background: checked
          ? 'color-mix(in oklch, var(--accent) 5%, var(--card))'
          : 'var(--card)',
      }}
      onClick={() => onCheckedChange(!checked)}
    >
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        onClick={(e) => e.stopPropagation()}
        className="shrink-0"
      />
      <img
        src={iconSrc}
        alt={gameName}
        className="h-10 w-10 shrink-0 rounded-xl object-cover"
      />
      <div className="flex-1 min-w-0">
        <p
          className="font-semibold truncate text-foreground text-sm"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {account.nickname}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {gameName} · UID {account.uid}
        </p>
        <p className="text-xs text-muted-foreground">
          {account.server_name} · Lv. {account.level}
        </p>
      </div>
    </div>
  )
}
