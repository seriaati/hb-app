import { useQuery } from '@tanstack/react-query'
import { getGachaLogs, getBannerTypes, getGachaStats } from '@/api/gacha'
import type { GachaParams } from '@/api/types'

export function useGachaLogs(params: GachaParams) {
  return useQuery({
    queryKey: ['gacha', 'logs', params],
    queryFn: () => getGachaLogs(params),
    enabled: !!params.account_id,
    placeholderData: (prev) => prev,
  })
}

export function useGachaStats(accountId: string, bannerType?: number) {
  return useQuery({
    queryKey: ['gacha', 'stats', accountId, bannerType],
    queryFn: () => getGachaStats(accountId, bannerType),
    enabled: !!accountId,
    placeholderData: (prev) => prev,
  })
}

export function useGachaBannerTypes(game: string, locale: string) {
  return useQuery({
    queryKey: ['gacha', 'banner-types', game, locale],
    queryFn: () => getBannerTypes(game, locale),
    enabled: !!game,
    staleTime: 60 * 60 * 1000, // 1 hour — banner types rarely change
  })
}
