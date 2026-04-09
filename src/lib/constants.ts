export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string ?? 'http://localhost:8000'

export const PRIVACY_POLICY_URL = 'https://github.com/seriaati/hoyo-buddy/blob/main/PRIVACY.md'
export const DISCORD_SERVER_URL = 'https://link.seria.moe/hb-dc'

/**
 * Maps site locales to the language prefix used in the documentation URLs.
 * Locales not listed here fall back to English (no prefix).
 */
const DOCS_LOCALE_MAP: Record<string, string> = {
  'vi': 'vi',
  'zh-TW': 'zh-Hant',
  'zh-CN': 'zh-Hans',
  'es': 'es',
}

/**
 * Returns the Account Security documentation URL for the given site locale.
 * Falls back to the English URL if the locale is not supported by the docs.
 */
export function getAccountSecurityUrl(locale: string): string {
  const base = 'https://docs.hb.seria.moe'
  const path = 'docs/Account-Security'
  // Try exact locale match first, then language-only match
  const langCode =
    DOCS_LOCALE_MAP[locale] ??
    DOCS_LOCALE_MAP[locale.split('-')[0]] ??
    null
  return langCode ? `${base}/${langCode}/${path}` : `${base}/${path}`
}

export const SUPPORTED_LOCALES: { value: string; label: string; nativeLabel: string }[] = [
  { value: 'en-US', label: 'English', nativeLabel: 'English' },
  { value: 'zh-TW', label: 'Chinese (Traditional)', nativeLabel: '中文（繁體）' },
  { value: 'zh-CN', label: 'Chinese (Simplified)', nativeLabel: '中文（简体）' },
  { value: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { value: 'ko', label: 'Korean', nativeLabel: '한국어' },
  { value: 'fr', label: 'French', nativeLabel: 'Français' },
  { value: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { value: 'es-ES', label: 'Spanish', nativeLabel: 'Español' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)', nativeLabel: 'Português (Brasil)' },
  { value: 'ru', label: 'Russian', nativeLabel: 'Русский' },
  { value: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt' },
  { value: 'id', label: 'Indonesian', nativeLabel: 'Bahasa Indonesia' },
  { value: 'nl', label: 'Dutch', nativeLabel: 'Nederlands' },
]

/**
 * Returns the "Before Start" docs URL (no anchor) for users without a HoYoverse account.
 * The page itself is locale-prefixed but has no per-language anchor needed.
 */
export function getBeforeStartUrl(locale: string): string {
  const base = 'https://docs.hb.seria.moe'
  const path = 'docs/Before-Start'
  const langCode =
    DOCS_LOCALE_MAP[locale] ?? DOCS_LOCALE_MAP[locale.split('-')[0]] ?? null
  return langCode ? `${base}/${langCode}/${path}` : `${base}/${path}`
}

/**
 * Returns the "I am a console player" section URL for the given locale.
 */
export function getConsolePlayerUrl(locale: string): string {
  const CONSOLE_URLS: Record<string, string> = {
    vi: 'https://docs.hb.seria.moe/vi/docs/Before-Start#t%C3%B4i-ch%C6%A1i-tr%C3%AAn-m%C3%A1y-ch%C6%A1i-game-playstation-v%C3%A0-xbox',
    'zh-Hant':
      'https://docs.hb.seria.moe/zh-Hant/docs/Before-Start#%E6%88%91%E6%98%AF%E4%B8%BB%E6%A9%9F%E7%8E%A9%E5%AE%B6',
    'zh-Hans':
      'https://docs.hb.seria.moe/zh-Hans/docs/Before-Start#%E6%88%91%E6%98%AF%E4%B8%BB%E6%9C%BA%E7%8E%A9%E5%AE%B6',
    es: 'https://docs.hb.seria.moe/es/docs/Before-Start#soy-un-jugador-de-consola',
  }
  const langCode =
    DOCS_LOCALE_MAP[locale] ?? DOCS_LOCALE_MAP[locale.split('-')[0]] ?? null
  return (
    (langCode && CONSOLE_URLS[langCode]) ||
    'https://docs.hb.seria.moe/docs/Before-Start#i-am-a-console-player'
  )
}

/**
 * Returns the "How does the email and password login method work?" docs URL for the given locale.
 * Each language has its own anchor fragment; falls back to the English URL.
 */
export function getEmailLoginDocsUrl(locale: string): string {
  const EMAIL_LOGIN_URLS: Record<string, string> = {
    vi: 'https://docs.hb.seria.moe/vi/docs/Account-Security#ph%C6%B0%C6%A1ng-ph%C3%A1p-%C4%91%C4%83ng-nh%E1%BA%ADp-b%E1%BA%B1ng-email-v%C3%A0-m%E1%BA%ADt-kh%E1%BA%A9u-ho%E1%BA%A1t-%C4%91%E1%BB%99ng-nh%C6%B0-th%E1%BA%BF-n%C3%A0o',
    'zh-Hant':
      'https://docs.hb.seria.moe/zh-Hant/docs/Account-Security#%E9%9B%BB%E5%AD%90%E9%83%B5%E4%BB%B6%E5%92%8C%E5%AF%86%E7%A2%BC%E7%99%BB%E9%8C%84%E6%96%B9%E5%BC%8F%E5%A6%82%E4%BD%95%E9%81%8B%E4%BD%9C',
    'zh-Hans':
      'https://docs.hb.seria.moe/zh-Hans/docs/Account-Security#%E7%94%B5%E5%AD%90%E9%82%AE%E7%AE%B1%E5%92%8C%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95%E6%96%B9%E5%BC%8F%E5%A6%82%E4%BD%95%E8%BF%90%E4%BD%9C',
    es: 'https://docs.hb.seria.moe/es/docs/Account-Security#c%C3%B3mo-funciona-el-inicio-de-sesi%C3%B3n-con-correo-y-contrase%C3%B1a',
  }
  const langCode =
    DOCS_LOCALE_MAP[locale] ?? DOCS_LOCALE_MAP[locale.split('-')[0]] ?? null
  return (
    (langCode && EMAIL_LOGIN_URLS[langCode]) ||
    'https://docs.hb.seria.moe/docs/Account-Security#how-does-the-email-and-password-login-method-work'
  )
}

/**
 * Returns the "Which login method should I use?" FAQ URL for the given site locale.
 * Each language has its own anchor fragment; falls back to the English URL.
 */
export function getLoginMethodFaqUrl(locale: string): string {
  const FAQ_URLS: Record<string, string> = {
    vi: 'https://docs.hb.seria.moe/vi/docs/FAQ#t%C3%B4i-n%C3%AAn-s%E1%BB%AD-d%E1%BB%A5ng-ph%C6%B0%C6%A1ng-th%E1%BB%A9c-%C4%91%C4%83ng-nh%E1%BA%ADp-n%C3%A0o',
    'zh-Hant':
      'https://docs.hb.seria.moe/zh-Hant/docs/FAQ#%E6%88%91%E6%87%89%E8%A9%B2%E9%81%B8%E6%93%87%E5%93%AA%E7%A8%AE%E7%99%BB%E5%85%A5%E6%96%B9%E5%BC%8F',
    'zh-Hans':
      'https://docs.hb.seria.moe/zh-Hans/docs/FAQ#%E6%88%91%E5%BA%94%E8%AF%A5%E9%80%89%E6%8B%A9%E5%93%AA%E7%A7%8D%E7%99%BB%E5%BD%95%E6%96%B9%E5%BC%8F',
    es: 'https://docs.hb.seria.moe/es/docs/FAQ#qu%C3%A9-m%C3%A9todo-de-inicio-de-sesi%C3%B3n-debo-usar',
  }
  const langCode =
    DOCS_LOCALE_MAP[locale] ?? DOCS_LOCALE_MAP[locale.split('-')[0]] ?? null
  const key = langCode ?? null
  return (key && FAQ_URLS[key]) || 'https://docs.hb.seria.moe/docs/FAQ#which-login-method-should-i-use'
}

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

export const GEETEST_SDK_URLS: Record<number, string> = {
  3: 'https://static.geetest.com/static/js/gt.0.5.0.js',
  4: 'https://static.geetest.com/v4/gt4.js',
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

/** Grid cell background colors keyed by rarity number */
export const RARITY_GRID_BG: Record<number, string> = {
  5: 'oklch(0.47 0.10 55)',
  4: 'oklch(0.32 0.09 300)',
  3: 'oklch(0.31 0.05 240)',
  2: 'oklch(0.34 0.05 150)',
  1: 'oklch(0.30 0.02 240)',
}

/** Accent colors per game for the gacha log page header */
export const GAME_ACCENT_COLORS: Record<string, string> = {
  genshin: 'oklch(0.72 0.14 68)',
  hkrpg: 'oklch(0.55 0.18 295)',
  nap: 'oklch(0.60 0.14 190)',
  honkai3rd: 'oklch(0.55 0.16 265)',
  tot: 'oklch(0.60 0.17 350)',
}
