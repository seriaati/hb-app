import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import type { GachaStatsResponse } from '@/api/types'

interface GachaStatsProps {
  stats: GachaStatsResponse | undefined
  isLoading: boolean
}

export function GachaStats({ stats, isLoading }: GachaStatsProps) {
  const { t } = useTranslation()

  const fiveStarPityHighlight = (stats?.five_star_pity ?? 0) >= 70

  const statItems = [
    {
      label: t('stat_total_pulls'),
      value: stats ? stats.total_pulls.toLocaleString() : '—',
      highlight: false,
    },
    {
      label: t('stat_5star_pity'),
      value: stats ? stats.five_star_pity.toString() : '—',
      highlight: fiveStarPityHighlight,
    },
    {
      label: t('stat_4star_pity'),
      value: stats ? stats.four_star_pity.toString() : '—',
      highlight: false,
    },
    {
      label: '5★',
      value: stats ? stats.total_five_stars.toLocaleString() : '—',
      highlight: false,
    },
    {
      label: '4★',
      value: stats ? stats.total_four_stars.toLocaleString() : '—',
      highlight: false,
    },
    {
      label: t('stat_avg_per_5star'),
      value: stats ? stats.avg_pulls_per_five_star.toFixed(1) : '—',
      highlight: false,
    },
    {
      label: t('stat_avg_per_4star'),
      value: stats ? stats.avg_pulls_per_four_star.toFixed(1) : '—',
      highlight: false,
    },
    {
      label: t('stat_5050_win_rate'),
      value:
        stats && stats.fifty_fifty_total > 0
          ? `${(stats.fifty_fifty_win_rate * 100).toFixed(0)}%`
          : '—',
      highlight: false,
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-15.5 rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 stat-stagger">
      {statItems.map(({ label, value, highlight }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center rounded-xl border py-3 px-2 text-center transition-shadow duration-200 hover:shadow-sm"
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
            className="text-lg font-bold leading-none tabular-nums"
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
