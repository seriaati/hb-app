import type { BackendModule, ReadCallback } from 'i18next'
import { getTranslations } from '@/api/i18n'

const cache = new Map<string, Record<string, string>>()

const I18nBackend: BackendModule = {
  type: 'backend',
  init() {},
  read(language: string, _namespace: string, callback: ReadCallback) {
    if (cache.has(language)) {
      callback(null, cache.get(language)!)
      return
    }
    getTranslations(language)
      .then((response) => {
        cache.set(language, response.translations)
        callback(null, response.translations)
      })
      .catch((err: unknown) => {
        callback(err as Error, null)
      })
  },
}

export default I18nBackend
