export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:8000'

export const SUPPORTED_LOCALES: { value: string; label: string; nativeLabel: string }[] = [
  { value: 'ar',    label: 'Arabic',               nativeLabel: 'العربية' },
  { value: 'de',    label: 'German',               nativeLabel: 'Deutsch' },
  { value: 'en-US', label: 'English (US)',          nativeLabel: 'English' },
  { value: 'es-ES', label: 'Spanish (Spain)',       nativeLabel: 'Español' },
  { value: 'fr',    label: 'French',               nativeLabel: 'Français' },
  { value: 'id',    label: 'Indonesian',            nativeLabel: 'Bahasa Indonesia' },
  { value: 'ja',    label: 'Japanese',              nativeLabel: '日本語' },
  { value: 'ko',    label: 'Korean',               nativeLabel: '한국어' },
  { value: 'nl',    label: 'Dutch',                nativeLabel: 'Nederlands' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)',   nativeLabel: 'Português (BR)' },
  { value: 'ru',    label: 'Russian',              nativeLabel: 'Русский' },
  { value: 'vi',    label: 'Vietnamese',            nativeLabel: 'Tiếng Việt' },
  { value: 'zh-CN', label: 'Chinese (Simplified)',  nativeLabel: '中文（简体）' },
  { value: 'zh-TW', label: 'Chinese (Traditional)', nativeLabel: '中文（繁體）' },
]

/**
 * Maps any browser/BCP-47 locale tag to the nearest supported backend locale.
 * Falls back to 'en-US' if no match is found.
 */
export function resolveLocale(browserLocale: string): string {
  const supported = SUPPORTED_LOCALES.map((l) => l.value)
  // Exact match
  if (supported.includes(browserLocale)) return browserLocale
  // Language-only match (e.g. "en" → "en-US", "zh" → "zh-CN", "pt" → "pt-BR")
  const lang = browserLocale.split('-')[0].toLowerCase()
  const byLang = supported.find((s) => s.split('-')[0].toLowerCase() === lang)
  if (byLang) return byLang
  return 'en-US'
}

export const GEETEST_SERVERS: Record<string, string> = {
  hoyolab: 'https://gs.hoyoverse.com',
  miyoushe: 'https://gs.mihoyo.com',
}

export const BANNER_TYPE_NAMES: Record<string, string> = {
  // Genshin Impact
  '1': 'Permanent Wish',
  '2': 'Character Event Wish',
  '3': 'Weapon Event Wish',
  '11': 'Chronicled Wish',
  // Honkai: Star Rail
  '1_hkrpg': 'Stellar Warp',
  '2_hkrpg': 'Character Event Warp',
  '6_hkrpg': 'Light Cone Event Warp',
  '7_hkrpg': 'Departure Warp',
  // Zenless Zone Zero
  '1_nap': 'Standard Channel',
  '2_nap': 'Exclusive Channel',
  '3_nap': 'W-Engine Channel',
  '5_nap': 'Bangboo Channel',
}

export const GAME_NAMES: Record<string, string> = {
  genshin: 'Genshin Impact',
  hkrpg: 'Honkai: Star Rail',
  honkai3rd: 'Honkai Impact 3rd',
  nap: 'Zenless Zone Zero',
  tot: 'Tears of Themis',
}

export const GAME_ICONS: Record<string, string> = {
  genshin: '/images/genshin.png',
  hkrpg: '/images/hkrpg.png',
  honkai3rd: '/images/honkai3rd.png',
  nap: '/images/nap.png',
  tot: '/images/tot.png',
}

export const RARITY_COLORS: Record<number, string> = {
  5: 'text-yellow-500',
  4: 'text-purple-500',
  3: 'text-blue-500',
  2: 'text-green-500',
}

export const RARITY_ROW_COLORS: Record<number, string> = {
  5: 'bg-yellow-500/10',
  4: 'bg-purple-500/10',
  3: 'bg-blue-500/10',
  2: 'bg-green-500/10',
}
