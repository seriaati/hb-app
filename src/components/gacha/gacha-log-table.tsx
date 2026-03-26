import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { RARITY_COLORS, RARITY_ROW_COLORS } from '@/lib/constants'
import type { GachaItem } from '@/api/types'

interface GachaLogTableProps {
  items: GachaItem[]
  total: number
  page: number
  max_page: number
  isLoading: boolean
  icons: Record<string, string>
  names: Record<string, string>
  onPageChange: (page: number) => void
}

function StarDisplay({ rarity }: { rarity: number }) {
  return (
    <span className={cn('font-bold', RARITY_COLORS[rarity])}>
      {'★'.repeat(rarity)}
    </span>
  )
}

export function GachaLogTable({
  items,
  total,
  page,
  max_page,
  isLoading,
  icons,
  names,
  onPageChange,
}: GachaLogTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-10"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Rarity</TableHead>
              <TableHead className="w-16 text-right">Pity</TableHead>
              <TableHead className="w-36 text-right">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-muted-foreground">
                  No gacha records found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, idx) => {
                const itemIdStr = String(item.item_id)
                const displayName = names[itemIdStr] ?? itemIdStr
                const iconUrl = icons[itemIdStr]
                const rowNum = (page - 1) * 20 + idx + 1
                const date = new Date(item.time).toLocaleDateString()

                return (
                  <TableRow
                    key={item.id}
                    className={cn(RARITY_ROW_COLORS[item.rarity])}
                  >
                    <TableCell className="text-muted-foreground text-sm">{rowNum}</TableCell>
                    <TableCell>
                      {iconUrl ? (
                        <img
                          src={iconUrl}
                          alt={displayName}
                          className="h-8 w-8 rounded object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded bg-muted" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{displayName}</TableCell>
                    <TableCell>
                      <StarDisplay rarity={item.rarity} />
                    </TableCell>
                    <TableCell className="text-right text-sm">{item.num_since_last}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{date}</TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {max_page > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {max_page} · {total.toLocaleString()} total
          </span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(page - 1)}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(page + 1)}
                  aria-disabled={page >= max_page}
                  className={page >= max_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
