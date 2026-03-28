import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDownIcon, CheckIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { GachaBannerType } from '@/api/types'

interface GachaFiltersProps {
  bannerTypes: GachaBannerType[]
  bannerTypesLoading?: boolean
  selectedBannerType: number
  onBannerTypeChange: (bannerType: number) => void
  selectedRarities: number[]
  onRaritiesChange: (rarities: number[]) => void
  nameSearch: string
  onNameSearchChange: (search: string) => void
}

const RARITIES = [5, 4, 3, 2]

/** oklch color per rarity for the active pill state */
const RARITY_PILL_COLORS: Record<number, { bg: string; border: string; text: string }> = {
  5: {
    bg: 'color-mix(in oklch, oklch(0.72 0.14 68) 20%, transparent)',
    border: 'oklch(0.72 0.14 68)',
    text: 'oklch(0.72 0.14 68)',
  },
  4: {
    bg: 'color-mix(in oklch, oklch(0.65 0.15 300) 20%, transparent)',
    border: 'oklch(0.65 0.15 300)',
    text: 'oklch(0.65 0.15 300)',
  },
  3: {
    bg: 'color-mix(in oklch, oklch(0.60 0.10 240) 20%, transparent)',
    border: 'oklch(0.60 0.10 240)',
    text: 'oklch(0.60 0.10 240)',
  },
  2: {
    bg: 'color-mix(in oklch, oklch(0.60 0.10 150) 20%, transparent)',
    border: 'oklch(0.60 0.10 150)',
    text: 'oklch(0.60 0.10 150)',
  },
}

export function GachaFilters({
  bannerTypes,
  bannerTypesLoading,
  selectedBannerType,
  onBannerTypeChange,
  selectedRarities,
  onRaritiesChange,
  nameSearch,
  onNameSearchChange,
}: GachaFiltersProps) {
  const { t } = useTranslation()
  const [localSearch, setLocalSearch] = useState(nameSearch)

  // Debounce name search
  useEffect(() => {
    const timer = setTimeout(() => {
      onNameSearchChange(localSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [localSearch, onNameSearchChange])

  function toggleRarity(rarity: number) {
    if (selectedRarities.includes(rarity)) {
      onRaritiesChange(selectedRarities.filter((r) => r !== rarity))
    } else {
      onRaritiesChange([...selectedRarities, rarity])
    }
  }

  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!open) return
    function handlePointerDown(e: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const selectedLabel = bannerTypes.find((bt) => bt.id === selectedBannerType)?.name ?? ''

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Banner type select — always rendered; skeleton while loading */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t('banner_type_label', 'Banner:')}
        </span>
        {bannerTypesLoading || bannerTypes.length === 0 ? (
          <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        ) : (
          <div ref={containerRef} className="relative">
            {/* Trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className={cn(
                'flex h-8 min-w-32 items-center justify-between gap-2 rounded-lg border border-input',
                'bg-background px-2.5 text-sm text-foreground',
                'cursor-pointer select-none outline-none transition-colors',
                'hover:bg-muted/40',
                'focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50',
                open && 'border-ring ring-2 ring-ring/50',
              )}
            >
              <span className="truncate">{selectedLabel}</span>
              <ChevronDownIcon
                className={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform duration-150',
                  open && 'rotate-180',
                )}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                role="listbox"
                className={cn(
                  'absolute left-0 top-full z-50 mt-1 min-w-full overflow-hidden rounded-lg',
                  'border border-border bg-popover text-popover-foreground shadow-md',
                  'animate-in fade-in-0 zoom-in-95 duration-100',
                )}
              >
                <div className="max-h-60 overflow-y-auto p-1">
                  {bannerTypes.map((bt) => {
                    const isSelected = bt.id === selectedBannerType
                    return (
                      <button
                        key={bt.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onBannerTypeChange(bt.id)
                          setOpen(false)
                        }}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5',
                          'cursor-pointer text-left text-sm outline-none transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isSelected && 'bg-accent/50 font-medium',
                        )}
                      >
                        <span className="truncate">{bt.name}</span>
                        {isSelected && <CheckIcon className="size-3.5 shrink-0 text-muted-foreground" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rarity toggle pills */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {t('rarity_label', 'Rarity:')}
        </span>
        <div className="flex gap-1.5">
          {RARITIES.map((rarity) => {
            const active = selectedRarities.includes(rarity)
            const colors = RARITY_PILL_COLORS[rarity]
            return (
              <button
                key={rarity}
                type="button"
                onClick={() => toggleRarity(rarity)}
                className={cn(
                  'cursor-pointer rounded-full px-2.5 py-1 text-xs font-bold transition-all duration-150',
                  'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active ? 'shadow-sm' : 'border-border/60 text-muted-foreground hover:border-border',
                )}
                style={
                  active
                    ? {
                        background: colors.bg,
                        borderColor: colors.border,
                        color: colors.text,
                      }
                    : undefined
                }
              >
                {rarity}★
              </button>
            )
          })}
        </div>
      </div>

      {/* Name search */}
      <div className="flex-1 min-w-40">
        <Input
          placeholder={t('search_by_name', 'Search by name…')}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="h-8 text-sm"
        />
      </div>
    </div>
  )
}
