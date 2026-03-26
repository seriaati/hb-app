import { apiClient } from './client'
import type { GachaLogResponse, GachaIconsResponse, GachaNamesResponse, GachaParams } from './types'

export async function getGachaLogs(params: GachaParams): Promise<GachaLogResponse> {
  const searchParams: Record<string, string | number> = {
    account_id: params.account_id,
  }
  if (params.banner_type !== undefined) searchParams.banner_type = params.banner_type
  if (params.locale) searchParams.locale = params.locale
  if (params.rarities?.length) searchParams.rarities = params.rarities.join(',')
  if (params.size !== undefined) searchParams.size = params.size
  if (params.page !== undefined) searchParams.page = params.page
  if (params.name_contains) searchParams.name_contains = params.name_contains

  return apiClient.get('api/gacha/logs', { searchParams }).json<GachaLogResponse>()
}

export async function getGachaIcons(): Promise<GachaIconsResponse> {
  return apiClient.get('api/gacha/icons').json<GachaIconsResponse>()
}

export async function getGachaNames(
  locale: string,
  game: string,
  itemIds: string[],
): Promise<GachaNamesResponse> {
  return apiClient
    .get('api/gacha/names', {
      searchParams: { locale, game, item_ids: itemIds.join(',') },
    })
    .json<GachaNamesResponse>()
}
