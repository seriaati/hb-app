import { useQuery } from '@tanstack/react-query'
import { getGachaLogs, getGachaIcons, getGachaNames } from '@/api/gacha'
import type { GachaParams } from '@/api/types'

export function useGachaLogs(params: GachaParams) {
  return useQuery({
    queryKey: ['gacha', 'logs', params],
    queryFn: () => getGachaLogs(params),
    enabled: !!params.account_id,
    placeholderData: (prev) => prev,
  })
}

export function useGachaIcons() {
  return useQuery({
    queryKey: ['gacha', 'icons'],
    queryFn: getGachaIcons,
    staleTime: 60 * 60 * 1000, // 1 hour — icons rarely change
  })
}

export function useGachaNames(locale: string, game: string, itemIds: string[]) {
  return useQuery({
    queryKey: ['gacha', 'names', locale, game, itemIds],
    queryFn: () => getGachaNames(locale, game, itemIds),
    enabled: itemIds.length > 0 && !!game,
    staleTime: 60 * 60 * 1000,
  })
}
