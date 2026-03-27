import { useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useGachaLogs, useGachaIcons, useGachaNames } from '@/hooks/use-gacha'
import { GachaBannerTabs } from '@/components/gacha/gacha-banner-tabs'
import { GachaFilters } from '@/components/gacha/gacha-filters'
import { GachaLogTable } from '@/components/gacha/gacha-log-table'
import { GachaStats } from '@/components/gacha/gacha-stats'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { ThemeToggle } from '@/components/ui/theme-toggle'

export function GachaLogPage() {
  const [searchParams] = useSearchParams()
  const { t } = useTranslation()

  const accountId = searchParams.get('account_id') ?? ''
  const locale = searchParams.get('locale') ?? 'en-US'
  const initialBannerType = Number(searchParams.get('banner_type') ?? '2')
  const initialRarities = searchParams
    .get('rarities')
    ?.split(',')
    .map(Number)
    .filter(Boolean) ?? [3, 4, 5]

  const [bannerType, setBannerType] = useState(initialBannerType)
  const [rarities, setRarities] = useState<number[]>(initialRarities)
  const [nameSearch, setNameSearch] = useState('')
  const [page, setPage] = useState(1)

  const gachaParams = {
    account_id: accountId,
    banner_type: bannerType,
    locale,
    rarities,
    size: 20,
    page,
    name_contains: nameSearch || undefined,
  }

  const { data: logsData, isLoading: logsLoading } = useGachaLogs(gachaParams)
  const { data: iconsData } = useGachaIcons()

  const itemIds = logsData?.items.map((i) => String(i.item_id)) ?? []
  const game = searchParams.get('game') ?? ''

  const { data: namesData } = useGachaNames(locale, game, itemIds)

  const icons = iconsData?.icons ?? {}
  const names = namesData?.names ?? {}

  const handleBannerTypeChange = useCallback((bt: number) => {
    setBannerType(bt)
    setPage(1)
  }, [])

  const handleRaritiesChange = useCallback((r: number[]) => {
    setRarities(r)
    setPage(1)
  }, [])

  const handleNameSearchChange = useCallback((s: string) => {
    setNameSearch(s)
    setPage(1)
  }, [])

  if (!accountId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background bg-texture">
        <p className="text-sm text-muted-foreground">{t('missing_account_id')}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background bg-texture text-foreground">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 page-enter">
          <div className="flex items-center gap-3 mb-1">
            <img src="/images/logo.png" alt="Hoyo Buddy" className="h-7 w-7 rounded-lg object-cover" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
              Hoyo Buddy
            </span>
          </div>
          <h1
            className="text-2xl font-semibold tracking-tight text-foreground"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('gacha_history')}
          </h1>
        </div>

        <div className="flex flex-col gap-5 page-enter">
          {/* Banner type tabs */}
          {game && (
            <GachaBannerTabs
              bannerTypes={[bannerType]}
              currentBannerType={bannerType}
              onBannerTypeChange={handleBannerTypeChange}
              game={game}
            />
          )}

          {/* Stats */}
          {logsData && (
            <GachaStats items={logsData.items} total={logsData.total} />
          )}

          {/* Filters */}
          <GachaFilters
            selectedRarities={rarities}
            onRaritiesChange={handleRaritiesChange}
            nameSearch={nameSearch}
            onNameSearchChange={handleNameSearchChange}
          />

          {/* Table */}
          {logsLoading && !logsData ? (
            <div className="flex items-center justify-center py-16">
              <LoadingSpinner size={28} />
            </div>
          ) : (
            <GachaLogTable
              items={logsData?.items ?? []}
              total={logsData?.total ?? 0}
              page={logsData?.page ?? 1}
              max_page={logsData?.max_page ?? 1}
              isLoading={logsLoading}
              icons={icons}
              names={names}
              onPageChange={setPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}
