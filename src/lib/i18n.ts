import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resolveLocale } from '@/lib/constants'
import enUS from '@/locales/en-US.json'
import esES from '@/locales/es-ES.json'
import fr from '@/locales/fr.json'
import id from '@/locales/id.json'
import ja from '@/locales/ja.json'
import ko from '@/locales/ko.json'
import nl from '@/locales/nl.json'
import ptBR from '@/locales/pt-BR.json'
import ru from '@/locales/ru.json'
import vi from '@/locales/vi.json'
import zhCN from '@/locales/zh-CN.json'
import zhTW from '@/locales/zh-TW.json'

const detectedLocale = resolveLocale(navigator.language)

i18n.use(initReactI18next).init({
  lng: detectedLocale,
  fallbackLng: 'en-US',
  resources: {
    'en-US': { translation: enUS },
    'zh-TW': { translation: zhTW },
    'zh-CN': { translation: zhCN },
    'ja': { translation: ja },
    'ko': { translation: ko },
    'fr': { translation: fr },
    'es-ES': { translation: esES },
    'pt-BR': { translation: ptBR },
    'ru': { translation: ru },
    'vi': { translation: vi },
    'id': { translation: id },
    'nl': { translation: nl },
  },
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
})

export default i18n
