import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18nBackend from '@/hooks/use-i18n-backend'
import { resolveLocale } from '@/lib/constants'

const detectedLocale = resolveLocale(navigator.language)

i18n
  .use(I18nBackend)
  .use(initReactI18next)
  .init({
    lng: detectedLocale,
    fallbackLng: 'en-US',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  })

export default i18n
