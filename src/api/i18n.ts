import { apiClient } from './client'
import type { I18nResponse } from './types'

export async function getTranslations(locale: string): Promise<I18nResponse> {
  return apiClient.get(`api/i18n/${locale}`).json<I18nResponse>()
}
