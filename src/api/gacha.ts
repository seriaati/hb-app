import { apiClient } from './client'
import type { GachaLogResponse, GachaBannerTypesResponse, GachaParams, GachaStatsResponse } from './types'

export async function getGachaLogs(params: GachaParams): Promise<GachaLogResponse> {
  const searchParams: Record<string, string | number> = {
    account_id: params.account_id,
  }
  if (params.banner_type !== undefined) searchParams.banner_type = params.banner_type
  if (params.locale) searchParams.locale = params.locale
  if (params.rarities?.length) searchParams.rarities = params.rarities.join(',')
  if (params.size !== undefined) searchParams.size = params.size
  if (params.cursor) searchParams.cursor = params.cursor
  if (params.name_contains) searchParams.name_contains = params.name_contains

  return apiClient.get('api/gacha/logs', { searchParams }).json<GachaLogResponse>()
}

export async function getGachaStats(
  accountId: string,
  bannerType?: number,
): Promise<GachaStatsResponse> {
  const searchParams: Record<string, string | number> = { account_id: accountId }
  if (bannerType !== undefined) searchParams.banner_type = bannerType
  return apiClient.get('api/gacha/stats', { searchParams }).json<GachaStatsResponse>()
}

export async function getBannerTypes(
  game: string,
  locale: string,
): Promise<GachaBannerTypesResponse> {
  return apiClient
    .get('api/gacha/banner-types', { searchParams: { game, locale } })
    .json<GachaBannerTypesResponse>()
}
