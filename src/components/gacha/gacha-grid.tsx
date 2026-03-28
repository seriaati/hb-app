import { useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { GachaGridItem } from '@/components/gacha/gacha-grid-item'
import type { GachaItem } from '@/api/types'

interface GachaGridProps {
  items: GachaItem[]
  total: number
  hasPrev: boolean
  nextCursor: string | null
  isLoading: boolean
  onNext: () => void
  onPrev: () => void
}

export function GachaGrid({
  items,
  total,
  hasPrev,
  nextCursor,
  isLoading,
  onNext,
  onPrev,
}: GachaGridProps) {
  const { t } = useTranslation()

  const hasNext = nextCursor !== null

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrev) onPrev()
      if (e.key === 'ArrowRight' && hasNext) onNext()
    },
    [hasPrev, hasNext, onPrev, onNext],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  if (isLoading) {
    return (
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
        {t('no_gacha_records', 'No gacha records found.')}
      </div>
    )
  }

  const showPagination = hasPrev || hasNext

  return (
    <div className="flex flex-col gap-4">
      {/* Grid */}
      <div
        className="grid gap-1.5 page-enter"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}
      >
        {items.map((item) => (
          <GachaGridItem key={item.id} item={item} />
        ))}
      </div>

      {/* Footer: total records + pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <span>{t('total_records', { total: total.toLocaleString() })}</span>
        {showPagination && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={onPrev}
                  aria-disabled={!hasPrev}
                  className={!hasPrev ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={onNext}
                  aria-disabled={!hasNext}
                  className={!hasNext ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  )
}
