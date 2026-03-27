import { useTranslation } from 'react-i18next'
import type { GachaItem } from '@/api/types'

interface GachaStatsProps {
  items: GachaItem[]
  total: number
}

export function GachaStats({ items, total }: GachaStatsProps) {
  const { t } = useTranslation()

  const fiveStarItems = items.filter((i) => i.rarity === 5)
  const fourStarItems = items.filter((i) => i.rarity === 4)

  const lastFiveStarIndex = items.findIndex((i) => i.rarity === 5)
  const currentPity = lastFiveStarIndex === -1 ? items.length : lastFiveStarIndex

  const avgPer5Star =
    fiveStarItems.length > 0
      ? Math.round(total / fiveStarItems.length)
      : null

  const stats = [
    { label: t('web.stat_total_pulls'), value: total.toLocaleString(), highlight: false },
    { label: t('web.stat_pity'), value: currentPity.toString(), highlight: currentPity >= 70 },
    { label: '5★', value: fiveStarItems.length.toString(), highlight: false },
    { label: '4★', value: fourStarItems.length.toString(), highlight: false },
    { label: t('web.stat_avg_per_5star'), value: avgPer5Star !== null ? `${avgPer5Star}` : '—', highlight: false },
  ]

  return (
    <div className="grid grid-cols-5 gap-2">
      {stats.map(({ label, value, highlight }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-xl border py-3 px-2 text-center"
          style={{
            borderColor: highlight
              ? 'color-mix(in oklch, var(--destructive) 30%, var(--border))'
              : 'var(--border)',
            background: highlight
              ? 'color-mix(in oklch, var(--destructive) 6%, var(--card))'
              : 'var(--card)',
          }}
        >
          <p
            className="text-lg font-bold leading-none"
            style={{
              fontFamily: 'var(--font-display)',
              color: highlight ? 'var(--destructive)' : 'var(--foreground)',
            }}
          >
            {value}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground leading-tight">{label}</p>
        </div>
      ))}
    </div>
  )
}
