import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resolveLocale } from '@/lib/constants'
import enUS from '@/locales/en-US.json'
import zhTW from '@/locales/zh-TW.json'

const detectedLocale = resolveLocale(navigator.language)

i18n.use(initReactI18next).init({
  lng: detectedLocale,
  fallbackLng: 'en-US',
  resources: {
    'en-US': { translation: enUS },
    'zh-TW': { translation: zhTW },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
