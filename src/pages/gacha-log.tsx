import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'
import { useGachaLogs, useGachaBannerTypes, useGachaStats } from '@/hooks/use-gacha'
import { GachaFilters } from '@/components/gacha/gacha-filters'
import { GachaGrid } from '@/components/gacha/gacha-grid'
import { GachaStats } from '@/components/gacha/gacha-stats'
import { GAME_ICONS, GAME_ACCENT_COLORS } from '@/lib/constants'

export function GachaLogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  const accountId = searchParams.get('account_id') ?? ''
  const locale = searchParams.get('locale') ?? 'en-US'
  const initialBannerType = Number(searchParams.get('banner_type') ?? '0')
  const initialRarities = searchParams
    .get('rarities')
    ?.split(',')
    .map(Number)
    .filter(Boolean) ?? [3, 4, 5]

  const game = searchParams.get('game') ?? ''

  useEffect(() => {
    i18n.changeLanguage(locale)
  }, [locale])

  const [bannerType, setBannerType] = useState(initialBannerType)
  const [rarities, setRarities] = useState<number[]>(initialRarities)
  const [nameSearch, setNameSearch] = useState('')
  // cursorStack holds the cursors for pages we've visited so we can go back.
  // cursorStack[0] is always undefined (first page), cursorStack[n] is the
  // next_cursor returned by page n-1.
  const [cursorStack, setCursorStack] = useState<(string | undefined)[]>([undefined])
  const [stackIndex, setStackIndex] = useState(0)

  const currentCursor = cursorStack[stackIndex]

  const gachaParams = {
    account_id: accountId,
    banner_type: bannerType || undefined,
    locale,
    rarities,
    size: 100,
    cursor: currentCursor,
    name_contains: nameSearch || undefined,
  }

  const { data: logsData, isLoading: logsLoading, error: logsError } = useGachaLogs(gachaParams)

  const { data: statsData, isLoading: statsLoading } = useGachaStats(
    accountId,
    bannerType || undefined,
  )

  // Prefer the `game` URL param; fall back to the value returned by the logs endpoint
  const resolvedGame = game || logsData?.game || ''

  const { data: bannerTypesData, isLoading: bannerTypesLoading } = useGachaBannerTypes(
    resolvedGame,
    locale,
  )
  const bannerTypes = bannerTypesData?.banner_types ?? []

  // Once banner types load, default to the first one if no valid type was in the URL
  useEffect(() => {
    if (bannerTypes.length > 0 && bannerType === 0) {
      setBannerType(bannerTypes[0].id)
    }
  }, [bannerTypes, bannerType])

  const accentColor = GAME_ACCENT_COLORS[resolvedGame] ?? 'oklch(0.72 0.14 68)'
  const gameIconSrc = GAME_ICONS[resolvedGame]

  const resetCursor = useCallback(() => {
    setCursorStack([undefined])
    setStackIndex(0)
  }, [])

  const handleBannerTypeChange = useCallback(
    (bt: number) => {
      setBannerType(bt)
      resetCursor()
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('banner_type', String(bt))
        return next
      })
    },
    [resetCursor, setSearchParams],
  )

  const handleRaritiesChange = useCallback(
    (r: number[]) => {
      setRarities(r)
      resetCursor()
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        next.set('rarities', r.join(','))
        return next
      })
    },
    [resetCursor, setSearchParams],
  )

  const handleNameSearchChange = useCallback(
    (s: string) => {
      setNameSearch(s)
      resetCursor()
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        if (s) {
          next.set('name_search', s)
        } else {
          next.delete('name_search')
        }
        return next
      })
    },
    [resetCursor, setSearchParams],
  )

  const handleNext = useCallback(() => {
    if (!logsData?.next_cursor) return
    const nextCursor = logsData.next_cursor
    setCursorStack((prev) => {
      const next = prev.slice(0, stackIndex + 1)
      next.push(nextCursor)
      return next
    })
    setStackIndex((i) => i + 1)
  }, [logsData?.next_cursor, stackIndex])

  const handlePrev = useCallback(() => {
    if (stackIndex === 0) return
    setStackIndex((i) => i - 1)
  }, [stackIndex])

  if (!accountId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background bg-texture">
        <p className="text-sm text-muted-foreground">{t('missing_account_id')}</p>
      </div>
    )
  }

  if (logsError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background bg-texture">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <div
            className="rounded-xl px-4 py-3 text-sm w-full"
            style={{
              background: 'color-mix(in oklch, var(--destructive) 10%, transparent)',
              color: 'var(--destructive)',
              border: '1px solid color-mix(in oklch, var(--destructive) 25%, transparent)',
            }}
          >
            {logsError instanceof Error ? logsError.message : t('failed_to_load_accounts')}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 underline underline-offset-4"
          >
            {t('retry', 'Retry')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* bg-texture overlay */}
      <div className="pointer-events-none absolute inset-0 bg-texture opacity-60" />

      {/* Decorative blobs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-120 w-120 rounded-full opacity-15 blur-3xl"
        style={{ background: accentColor }}
      />
      <div
        className="pointer-events-none absolute top-1/3 -right-32 h-72 w-72 rounded-full opacity-10 blur-3xl"
        style={{ background: accentColor }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full opacity-8 blur-3xl"
        style={{ background: accentColor }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 page-enter">
          {/* Logo row */}
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src="/images/logo.png"
              alt="Hoyo Buddy"
              className="h-7 w-7 rounded-lg object-cover"
            />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-display)' }}
            >
              Hoyo Buddy
            </span>
          </div>

          {/* Title row with game icon */}
          <div className="flex items-center gap-3">
            {gameIconSrc && (
              <img
                src={gameIconSrc}
                alt={resolvedGame}
                className="h-9 w-9 rounded-xl object-cover shadow-sm"
                style={{
                  filter: `drop-shadow(0 4px 12px color-mix(in oklch, ${accentColor} 40%, transparent))`,
                }}
              />
            )}
            <div>
              <h1
                className="text-2xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('gacha_history')}
              </h1>
              {/* Accent underline */}
              <div
                className="mt-1 h-0.5 w-12 rounded-full"
                style={{ background: accentColor }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 page-enter">
          {/* Stats */}
          <GachaStats stats={statsData} isLoading={statsLoading} />

          {/* Filters (includes banner type select) */}
          <GachaFilters
            bannerTypes={bannerTypes}
            bannerTypesLoading={bannerTypesLoading}
            selectedBannerType={bannerType}
            onBannerTypeChange={handleBannerTypeChange}
            selectedRarities={rarities}
            onRaritiesChange={handleRaritiesChange}
            nameSearch={nameSearch}
            onNameSearchChange={handleNameSearchChange}
          />

          {/* Grid */}
          <GachaGrid
            items={logsData?.items ?? []}
            total={logsData?.total ?? 0}
            hasPrev={stackIndex > 0}
            nextCursor={logsData?.next_cursor ?? null}
            isLoading={logsLoading}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        </div>
      </div>
    </div>
  )
}
