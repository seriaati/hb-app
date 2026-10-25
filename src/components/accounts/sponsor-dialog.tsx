import { useTranslation } from 'react-i18next'
import { Check, Heart } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { buttonVariants } from '@/components/ui/button'
import { DONATE_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'

const PERK_KEYS = [
  'sponsor_perk_queue_priority',
  'sponsor_perk_unlimited_accounts',
  'sponsor_perk_custom_images',
  'sponsor_perk_animated_art',
  'sponsor_perk_ai_images',
  'sponsor_perk_gacha_import',
  'sponsor_perk_auto_accompany',
  'sponsor_perk_discord_role',
  'sponsor_perk_discord_channel',
]

interface SponsorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SponsorDialog({ open, onOpenChange }: SponsorDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-display)' }}>
            {t('sponsor_limit_title')}
          </DialogTitle>
          <DialogDescription>{t('sponsor_limit_desc')}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-3">
          <span
            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('sponsor_perks_title')}
          </span>
          <ul className="flex flex-col gap-1.5">
            {PERK_KEYS.map((key) => (
              <li key={key} className="flex gap-2 text-sm text-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{t('sponsor_donate_note')}</p>

        <DialogFooter>
          <a
            href={DONATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'default' }), 'w-full gap-2 font-semibold')}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Heart />
            {t('sponsor_donate')}
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
