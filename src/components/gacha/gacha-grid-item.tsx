import { useState } from 'react'
import { cn } from '@/lib/utils'
import { RARITY_GRID_BG } from '@/lib/constants'
import { GachaItemDetail } from '@/components/gacha/gacha-item-detail'
import type { GachaItem } from '@/api/types'

interface GachaGridItemProps {
  item: GachaItem
}

export function GachaGridItem({ item }: GachaGridItemProps) {
  const [detailOpen, setDetailOpen] = useState(false)

  const displayName = item.name ?? String(item.item_id)
  const iconUrl = item.icon ?? undefined

  const bgColor = RARITY_GRID_BG[item.rarity]

  const showPity = (item.rarity === 4 || item.rarity === 5) && item.num_since_last > 0

  return (
    <>
      <button
        type="button"
        title={displayName}
        onClick={() => setDetailOpen(true)}
        className={cn(
          'relative aspect-square w-full rounded-lg overflow-hidden',
          'transition-transform duration-150 ease-out hover:scale-105',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'cursor-pointer',
        )}
        style={{ background: bgColor }}
      >
        {/* Pity badge — top-left, 4★/5★ only */}
        {showPity && (
          <span
            className="absolute top-0.5 left-0.5 z-10 rounded px-1 py-0.5 text-[9px] font-bold leading-none text-white"
            style={{ background: 'rgba(0,0,0,0.55)' }}
          >
            {item.num_since_last}
          </span>
        )}

        {/* Item icon */}
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={displayName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-black/10" />
        )}

        {/* Pull number — bottom-right */}
        <span
          className="absolute bottom-0.5 right-0.5 z-10 rounded px-1 py-0.5 text-[9px] font-medium leading-none text-white"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          #{item.num}
        </span>
      </button>

      <GachaItemDetail
        open={detailOpen}
        onOpenChange={setDetailOpen}
        item={item}
        iconUrl={iconUrl}
        displayName={displayName}
      />
    </>
  )
}
