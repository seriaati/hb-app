import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RARITY_COLORS, RARITY_GRID_BG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { GachaItem } from '@/api/types'

interface GachaItemDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: GachaItem
  iconUrl: string | undefined
  displayName: string
}

export function GachaItemDetail({
  open,
  onOpenChange,
  item,
  iconUrl,
  displayName,
}: GachaItemDetailProps) {
  const { t } = useTranslation()

  const bgColor = RARITY_GRID_BG[item.rarity]

  const pullDate = new Date(item.time).toLocaleString()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle style={{ fontFamily: 'var(--font-display)' }}>{displayName}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {/* Icon with rarity background */}
          <div
            className="flex h-24 w-24 items-center justify-center rounded-xl overflow-hidden"
            style={{ background: bgColor }}
          >
            {iconUrl ? (
              <img src={iconUrl} alt={displayName} className="h-full w-full object-contain p-1" />
            ) : (
              <div className="h-3/4 w-3/4 rounded-lg bg-black/10" />
            )}
          </div>

          {/* Rarity stars */}
          <span className={cn('text-lg font-bold tracking-wider', RARITY_COLORS[item.rarity])}>
            {'★'.repeat(item.rarity)}
          </span>
        </div>

        {/* Detail rows */}
        <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
          <DetailRow label={t('detail_id', 'ID')} value={String(item.id)} />
          <DetailRow label={t('detail_pull_date', 'Pull Date')} value={pullDate} />
          <DetailRow
            label={t('detail_pity_count', 'Pity Count')}
            value={String(item.num_since_last)}
          />
          <DetailRow label={t('table_header_pity', 'Pull #')} value={`#${item.num}`} />
          <DetailRow label={t('detail_wish_id', 'Wish ID')} value={item.wish_id} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
