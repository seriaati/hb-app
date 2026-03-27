# AGENTS.md

This file provides guidance to agents when working with code in this repository.

---

## Package Manager

**Always use `bun`** — never `npm`, `npx`, or `yarn`.

```
bun install / bun run <script> / bun add <pkg> / bun remove <pkg> / bunx <bin>
```

Scripts: `bun run dev` · `bun run build` · `bun run lint` · `bun run preview`

---

## Project Overview

**hb-app** is the web frontend for **Hoyo Buddy**, a Discord bot companion for HoYoverse games. Always launched from Discord with query params (`user_id`, `locale`, `channel_id`, `guild_id`). The home page (`/`) is a landing screen; real entry is via `/platforms?user_id=...`.

---

## Tech Stack

React 19 + Vite 8 · React Router v7 · TanStack Query v5 · Zustand v5 · `ky` (HTTP) · Tailwind CSS v4 + shadcn/ui · `next-themes` · `sonner` · `i18next` + `react-i18next` · `lucide-react`

---

## Critical Patterns

### Path Alias
All imports use `@/` → `./src/`. Never use relative paths like `../../lib/utils`.

### API Client
All calls go through [`apiClient`](src/api/client.ts) (`ky` instance) — never raw `fetch`. `prefixUrl` = `VITE_API_BASE_URL`. API paths must **not** start with `/` (e.g. `'api/auth/me'`, not `'/api/auth/me'`). Error messages are pre-extracted from `body.detail`/`body.message` in a `beforeError` hook — catch with `err instanceof Error ? err.message : 'fallback'`.

### Hook Layer
API functions in `src/api/` are never called directly from components — always wrap in a hook in `src/hooks/`. Queries → `useQuery`, mutations → `useMutation`.

### State Management
- **Server state**: TanStack Query (auth, accounts, gacha, i18n)
- **Client/UI state**: Zustand [`useLoginStore`](src/stores/login-store.ts) — stores `platform`, `userId`, `locale`, `channelId`, `guildId` from URL params set on `/platforms`. Add new URL-sourced params to `LoginParams` in the store.

### Prettier Config
No semicolons, single quotes, 2-space indent, trailing commas, 100-char print width (`.prettierrc`).

---

## Login Flow Architecture

Login flow is a multi-step wizard driven by `LoginFlowResponse.next_step` (not `status`). Use the shared helper [`handleLoginFlowResponse()`](src/lib/login-flow.ts) — do not re-implement branching inline:

```
'geetest'      → navigate('/geetest', { state: { gt_version, mmt, purpose } })
'email_verify' → navigate('/email-verify')
'verify_otp'   → call options.onVerifyOtp()
'finish'       → navigate('/finish')
'redirect'     → window.location.href = data.message
```

`GeetestPurpose` is `'login' | 'email_verify'` — pass via `options.geetestPurpose`.

### Geetest Page
`/geetest` receives `gt_version`, `mmt`, `purpose` via **React Router `location.state`** (not URL params). It can be re-navigated to without remounting (e.g. for email-verify geetest) — it detects new sessions via `mmt.challenge`/`mmt.session_id` change using `initializedChallengeRef`. Geetest SDK scripts are loaded dynamically from `static.geetest.com`.

### Finish Page
Calls `getAvailableAccounts`, user selects accounts, then `submitAccounts`. If `result.message` starts with `'discord://'`, redirect browser to that deep link.

---

## Platform-Specific Login Methods

Two platforms: `hoyolab` (global) and `miyoushe` (Chinese).

| Method | hoyolab | miyoushe |
|---|---|---|
| Email & Password | ✓ | ✓ |
| DevTools Cookies | ✓ | ✗ |
| Raw Cookies / JS | ✓ | ✗ |
| Mod App | ✓ | ✓ |
| Mobile OTP | ✗ | ✓ |
| QR Code | ✗ | ✓ |

Filtering in [`LoginMethodsPage`](src/pages/login-methods.tsx) via `method.platforms.includes(platform)`. The `emailPasswordLogin` API call passes `platform` as a query param; other login endpoints do not.

---

## Authentication & Route Guards

[`AuthGuard`](src/components/auth/auth-guard.tsx): on 401, saves `window.location.pathname + search` to `sessionStorage` as `'original_route'`, fetches Discord OAuth URL, redirects. [`OAuthCallbackPage`](src/pages/oauth-callback.tsx) reads and removes `'original_route'` after callback.

**Unguarded routes**: `/`, `/oauth/callback`, `/geetest`, `/gacha_log` (underscore, not hyphen).

`useAuth` has `staleTime: 5min` and never retries on 401.

`useLogout` clears the entire QueryClient cache (`queryClient.clear()`) before redirecting — do not rely on AuthGuard re-triggering after logout.

---

## i18n System

Translations are **fetched from the backend** at runtime via `GET api/i18n/{locale}`, cached in a module-level `Map`. Not bundled. `useSuspense: false`.

**Key convention**: `'web.<snake_case_key>'`. Always provide a fallback:
```tsx
t('web.sign_in', 'Sign In')
```

**Supported locales** (frontend): only `en-US` and `zh-TW` are in `SUPPORTED_LOCALES`. [`resolveLocale()`](src/lib/constants.ts) maps browser locales to these, falling back to `'en-US'`.

---

## Styling Conventions

- **Tailwind v4** — no `tailwind.config.js`. Config via `@tailwindcss/vite` plugin + `@theme inline` in [`src/index.css`](src/index.css).
- All colors use **oklch**. Never introduce hex or hsl.
- CSS variables: `var(--accent)`, `var(--muted-foreground)`, `var(--border)`, `var(--card)`, `var(--destructive)`.
- Accent color per platform: HoYoLAB = `oklch(0.56 0.17 12)` (red-pink), Miyoushe = `oklch(0.48 0.16 265)` (blue-purple). Passed as `accentColor` to `LoginLayout`.
- Fonts: `var(--font-display)`/`var(--font-heading)` = Sora (headings, buttons, labels); `var(--font-sans)` = DM Sans (body). Apply display font inline: `style={{ fontFamily: 'var(--font-display)' }}`.
- Use [`cn()`](src/lib/utils.ts) (`clsx` + `tailwind-merge`) for all conditional class merging.
- Custom utility classes in `src/index.css`: `.page-enter`, `.stagger-children`, `.method-card`, `.row-interactive`, `.bg-texture`, `.accent-line`, `.pulse-dot`.

---

## Layout Components

- [`LoginLayout`](src/components/layout/login-layout.tsx): two-column layout for login pages. `panel` prop requires `accentColor`, `hero`, `title`, `description`. Pass `securityNote={null}` to suppress the default credentials disclaimer.
- [`PageContainer`](src/components/layout/page-container.tsx): for non-login pages. Always renders `LanguageSelector` + `ThemeToggle`. `narrow` prop → `max-w-md`.

---

## Game & Banner Constants

All centralized in [`src/lib/constants.ts`](src/lib/constants.ts).

- **Game keys**: `genshin`, `hkrpg`, `honkai3rd`, `nap`, `tot`
- **Banner type keys**: Genshin = plain number strings (`'1'`, `'2'`, `'3'`, `'11'`); others = composite (`'2_hkrpg'`, `'1_nap'`, etc.)
- **Account ID format**: `${account.game}_${account.uid}` (e.g. `'genshin_12345678'`)
- **Rarity colors** (`RARITY_COLORS`, `RARITY_ROW_COLORS`): keyed by **number** (5, 4, 3, 2), not string
- **Doc URL helpers**: `getAccountSecurityUrl()`, `getBeforeStartUrl()`, `getConsolePlayerUrl()`, `getEmailLoginDocsUrl()`, `getLoginMethodFaqUrl()` — all accept a locale string and return locale-prefixed URLs
- **`GEETEST_SERVERS`**: platform-keyed geetest server URLs (`hoyolab` / `miyoushe`)

---

## Gacha Log Page

[`GachaLogPage`](src/pages/gacha-log.tsx) is **not** behind `AuthGuard`. Reads all params from URL search params (`account_id`, `locale`, `banner_type`, `rarities`, `game`). `rarities` is comma-separated in URL and API calls. Changing `bannerType`, `rarities`, or `nameSearch` resets `page` to 1. `useGachaLogs` uses `placeholderData: (prev) => prev` to avoid flash on page change.

---

## Double-Fire Prevention Pattern

For mutations fired immediately on mount (not user interaction), use a `useRef` guard:
```tsx
const called = useRef(false)
useEffect(() => {
  if (called.current) return
  called.current = true
  // fire mutation
}, [])
```
Used in [`OAuthCallbackPage`](src/pages/oauth-callback.tsx). Note: [`GeetestPage`](src/pages/geetest.tsx) uses a different guard (`initializedChallengeRef`) keyed on `mmt.challenge`/`mmt.session_id` to support re-navigation.

---

## QR Code Polling

[`LoginQRCodePage`](src/pages/login-qrcode.tsx) polls `checkQRCode` every 3s via `setInterval` in a `useRef`. Uses `useMutation` (not `useQuery` with `refetchInterval`) because the check endpoint is a POST.

---

## Image Assets

Use `public/images/` with absolute paths — **not** `src/assets/` (legacy, unused).
- Platform logos: `/images/hoyolab.webp`, `/images/miyoushe.webp`
- App logo: `/images/logo.png`
- Game icons: `/images/{game}.png` (genshin, hkrpg, honkai3rd, nap, tot)
- Tutorial: `/images/dev_tools_tutorial.gif`

---

## Things to Avoid

- **Do not use TanStack Query v4 APIs** — v5 removed `onSuccess`/`onError` on `useQuery`; use mutation callbacks or `useEffect` on `data`/`error`.
- **Do not add `QueryClientProvider`** — already in [`src/main.tsx`](src/main.tsx).
- **Do not use `<Navigate>` in effects** — use `navigate()` from `useNavigate()`.
- **Do not use `tailwind.config.js`** — Tailwind v4 only.
- **Do not use `@base-ui/react`** — listed as dependency but unused; use shadcn/ui from `src/components/ui/`.
- **Do not hardcode platform names** — use `platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'`.
- **Do not re-implement login flow branching** — use `handleLoginFlowResponse()` from `src/lib/login-flow.ts`.
- **Do not use `status` field for login flow** — the response field is `next_step` (`LoginFlowNextStep`).
