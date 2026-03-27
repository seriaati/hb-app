# AGENTS.md — Project-Specific AI Assistant Guide

This file documents non-obvious patterns, conventions, and gotchas discovered by analyzing the codebase. It is intended to help AI assistants avoid common mistakes when working on this project.

---

## Package Manager

**Always use `bun`** for this project — never `npm`, `npx`, or `yarn`.

- Install dependencies: `bun install`
- Run scripts: `bun run <script>`
- Add packages: `bun add <package>`
- Remove packages: `bun remove <package>`
- Execute binaries: `bunx <binary>`

---

## Project Overview

**hb-app** is the web frontend for **Hoyo Buddy**, a Discord bot companion for HoYoverse games (Genshin Impact, Honkai: Star Rail, Zenless Zone Zero, etc.). The app is opened from Discord via a URL with query parameters and guides users through a multi-step login flow to connect their HoYoverse accounts.

The app is **not a standalone product** — it is always launched from Discord with specific query parameters (`user_id`, `locale`, `channel_id`, `guild_id`). The home page (`/`) is just a landing screen; real entry is via `/platforms?user_id=...`.

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 (`createBrowserRouter`) |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| HTTP client | `ky` (not `axios` or `fetch`) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Theming | `next-themes` |
| Toasts | `sonner` |
| i18n | `i18next` + `react-i18next` |
| Icons | `lucide-react` |

---

## Critical Patterns

### Path Alias

All source imports use `@/` which resolves to `./src/`. Never use relative paths like `../../lib/utils` — always use `@/lib/utils`.

### API Client

All API calls go through [`apiClient`](src/api/client.ts) (a `ky` instance), **not** raw `fetch`. Key behaviors:
- `prefixUrl` is set to `VITE_API_BASE_URL` (defaults to `http://localhost:8000`).
- `credentials: 'include'` — session cookies are sent automatically.
- Error messages are extracted from `body.detail` or `body.message` in a `beforeError` hook. When catching errors in components, use `err instanceof Error ? err.message : 'fallback'` — the hook ensures the message is already human-readable.
- API functions live in `src/api/` and are thin wrappers; they are **never called directly in components** — always via hooks.

### API URL Convention

API paths do **not** start with `/`. They are relative strings like `'api/auth/me'`, not `'/api/auth/me'`. The `prefixUrl` in `ky` requires this — a leading slash would break the URL construction.

### Hook Layer

Every API function has a corresponding hook in `src/hooks/`:
- Queries → `useQuery` (e.g., [`useAuth`](src/hooks/use-auth.ts), [`useGachaLogs`](src/hooks/use-gacha.ts))
- Mutations → `useMutation` (e.g., [`useEmailPasswordLogin`](src/hooks/use-login.ts))

Do not call API functions directly from components. Add a hook wrapper first.

### State Management Split

- **Server/async state**: TanStack Query (auth, accounts, gacha data, i18n translations)
- **Client/UI state**: Zustand ([`useLoginStore`](src/stores/login-store.ts)) — stores `platform`, `userId`, `locale`, `channelId`, `guildId` set from URL query params on the `/platforms` page

The Zustand store is populated once on `/platforms` from URL search params and then read throughout the login flow. If you need to add new URL-sourced parameters, add them to `LoginParams` in the store.

---

## Login Flow Architecture

The login flow is a **multi-step wizard** driven by `LoginFlowResponse.status` from the backend. Every login mutation's `onSuccess` handler must branch on `status`:

```
'success'               → navigate('/finish')
'geetest_required'      → navigate('/geetest')
'email_verify_required' → navigate('/email-verify')
'otp_sent'              → show OTP input (local state)
'device_info_required'  → navigate('/device-info')
'qrcode_created'        → show QR image
'qrcode_scanned'        → update UI status
'qrcode_confirmed'      → navigate('/finish')
'qrcode_expired'        → show regenerate button
```

The `/geetest` page fires `geetestCallback` immediately on mount (using a `useRef` guard to prevent double-fire in React Strict Mode) and then re-branches on the returned status. The `/finish` page also checks `data.status === 'device_info_required'` and redirects to `/device-info` if needed.

**The `/finish` page is the terminal step** — it calls `getAvailableAccounts`, lets the user select accounts, then calls `submitAccounts`. If `result.message` starts with `'discord://'`, it redirects the browser to that deep link (back to Discord).

---

## Platform-Specific Login Methods

Two platforms are supported: `hoyolab` (global) and `miyoushe` (Chinese). Login methods are **platform-gated**:

| Method | hoyolab | miyoushe |
|---|---|---|
| Email & Password | ✓ | ✓ |
| DevTools Cookies | ✓ | ✗ |
| Raw Cookies / JS | ✓ | ✗ |
| Mod App | ✓ | ✓ |
| Mobile OTP | ✗ | ✓ |
| QR Code | ✗ | ✓ |

This filtering happens in [`LoginMethodsPage`](src/pages/login-methods.tsx) via `method.platforms.includes(platform)`. When adding a new login method, you must declare which platforms it supports in the `loginMethods` array.

The `platform` value comes from the URL param (`:platform`) and is also stored in `useLoginStore`. The `emailPasswordLogin` API call passes `platform` as a query param; other login endpoints do not.

---

## Authentication & Route Guards

[`AuthGuard`](src/components/auth/auth-guard.tsx) wraps most routes. It:
1. Calls `GET api/auth/me` via `useAuth`.
2. On 401, saves `window.location.pathname + search` to `sessionStorage` as `'original_route'`.
3. Fetches the Discord OAuth URL and redirects the browser.
4. After OAuth callback, [`OAuthCallbackPage`](src/pages/oauth-callback.tsx) reads `'original_route'` from `sessionStorage`, removes it, and navigates there.

**Unguarded routes**: `/` (home), `/oauth/callback`, `/geetest`, `/gacha_log`. Note the gacha log uses an underscore: `/gacha_log`, not `/gacha-log`.

`useAuth` never retries on 401 (`retry: false` for that status code) to avoid hammering the server when unauthenticated.

---

## i18n System

Translations are **fetched from the backend** at runtime, not bundled. The custom backend ([`use-i18n-backend.ts`](src/hooks/use-i18n-backend.ts)) calls `GET api/i18n/{locale}` and caches results in a module-level `Map`. The i18n system is initialized with `useSuspense: false`.

**Translation key convention**: `'web.<snake_case_key>'` (e.g., `'web.sign_in'`, `'web.select_platform'`). Always provide a fallback string as the second argument to `t()`:
```tsx
t('web.sign_in', 'Sign In')
```

Locale resolution ([`resolveLocale`](src/lib/constants.ts)) maps browser locales to the 14 supported backend locales, falling back to `'en-US'`. The locale is detected from `navigator.language` at module init time.

---

## Styling Conventions

### Tailwind v4 + CSS Variables

The project uses **Tailwind CSS v4** (not v3). The config is in `vite.config.ts` via `@tailwindcss/vite` plugin — there is no `tailwind.config.js`. Theme tokens are defined as CSS custom properties in [`src/index.css`](src/index.css) using `@theme inline`.

All colors use **oklch** color space. Do not introduce hex or hsl colors — use oklch or `color-mix(in oklch, ...)` for tinting.

### CSS Custom Properties for Colors

Never hardcode color values in components. Use CSS variables:
- `var(--accent)` — brand red-pink, used for interactive highlights
- `var(--muted-foreground)` — secondary text
- `var(--border)` — borders
- `var(--card)` — card backgrounds
- `var(--destructive)` — error states

The accent color differs per platform: HoYoLAB uses `oklch(0.55 0.22 10)` (red-pink), Miyoushe uses `oklch(0.48 0.16 265)` (blue-purple). These are passed as `accentColor` to `LoginLayout`.

### Font Variables

- `var(--font-display)` / `var(--font-heading)` → Sora Variable (headings, buttons, labels)
- `var(--font-sans)` → DM Sans Variable (body text)

Apply display font inline: `style={{ fontFamily: 'var(--font-display)' }}`. Headings (`h1`–`h6`) get it automatically via the base layer.

### Utility Classes

Custom utility classes defined in `src/index.css`:
- `.page-enter` — fade+slide-up entrance animation (0.35s)
- `.stagger-children` — applies `page-enter` with staggered delays to direct children (up to 8 children, 50ms increments)
- `.method-card` — hover/active styles for clickable card rows (border accent + lift)
- `.row-interactive` — hover background tint for table/list rows
- `.bg-texture` — subtle radial gradient overlay for page backgrounds
- `.accent-line` — left border accent decoration via `::before`
- `.pulse-dot` — pulsing animation for status indicators

### `cn()` Utility

Use [`cn()`](src/lib/utils.ts) (re-export of `clsx` + `tailwind-merge`) for all conditional class merging. Never concatenate class strings manually.

---

## Layout Components

### `LoginLayout`

[`LoginLayout`](src/components/layout/login-layout.tsx) is the shared two-column layout for all login/auth pages. It renders:
- **Mobile** (`< lg`): `PageContainer` with `narrow` prop
- **Desktop** (`lg+`): left branding panel + right form panel

The `panel` prop requires `accentColor`, `hero` (ReactNode), `title`, and `description`. `securityNote` defaults to a standard credentials disclaimer; pass `null` to suppress it.

### `PageContainer`

[`PageContainer`](src/components/layout/page-container.tsx) is used for non-login pages (finish, email-verify, device-info). It always renders `LanguageSelector` + `ThemeToggle` in the top-right corner. The `narrow` prop constrains width to `max-w-md` (vs `max-w-2xl`).

---

## Game & Banner Constants

All game identifiers, banner type names, icons, and rarity colors are centralized in [`src/lib/constants.ts`](src/lib/constants.ts).

**Game keys** (used as `account.game` and in `GAME_NAMES`/`GAME_ICONS`):
- `genshin`, `hkrpg`, `honkai3rd`, `nap`, `tot`

**Banner type keys** are composite strings for non-Genshin games: `'2_hkrpg'`, `'1_nap'`, etc. Genshin banner types are plain numbers as strings: `'1'`, `'2'`, `'3'`, `'11'`.

**Account ID format** in `finish.tsx`: `${account.game}_${account.uid}` (e.g., `'genshin_12345678'`). This composite key is used for both the `Set<string>` of selected accounts and the `selected_accounts` array sent to the backend.

**Rarity colors** (`RARITY_COLORS`, `RARITY_ROW_COLORS`) are keyed by number (5, 4, 3, 2), not string.

---

## Gacha Log Page

[`GachaLogPage`](src/pages/gacha-log.tsx) is **not** behind `AuthGuard` — it reads all its parameters from URL search params (`account_id`, `locale`, `banner_type`, `rarities`, `game`) and is designed to be opened directly from Discord.

`useGachaLogs` uses `placeholderData: (prev) => prev` to keep showing old data while fetching new pages (avoids flash). `useGachaIcons` and `useGachaNames` have a 1-hour `staleTime`.

The `rarities` param is serialized as a comma-separated string in the URL and in API calls: `rarities.join(',')`.

Changing `bannerType`, `rarities`, or `nameSearch` resets `page` to 1.

---

## Double-Fire Prevention Pattern

Pages that fire a mutation immediately on mount (not triggered by user interaction) use a `useRef` guard:

```tsx
const called = useRef(false)
useEffect(() => {
  if (called.current) return
  called.current = true
  // fire mutation
}, [])
```

This prevents double-execution in React Strict Mode. Used in [`GeetestPage`](src/pages/geetest.tsx) and [`OAuthCallbackPage`](src/pages/oauth-callback.tsx).

---

## QR Code Polling

[`LoginQRCodePage`](src/pages/login-qrcode.tsx) polls `checkQRCode` every 3 seconds using `setInterval` stored in a `useRef`. The interval is cleared on unmount via the `useEffect` cleanup. The mutation is called inside the interval — this is intentional (not a query with `refetchInterval`) because the check endpoint is a POST.

---

## Image Assets

Platform images are in `public/images/` and referenced as absolute paths:
- `/images/hoyolab.webp`, `/images/miyoushe.webp` — platform logos
- `/images/{platform}.webp` — used dynamically in login pages via template literal
- `/images/logo.png` — Hoyo Buddy app logo
- `/images/dev_tools_tutorial.gif` — tutorial shown on the DevTools login page
- Game icons: `/images/genshin.png`, `/images/hkrpg.png`, `/images/honkai3rd.png`, `/images/nap.png`, `/images/tot.png`

Do not import images from `src/assets/` for UI — those are unused legacy files. Use `public/images/`.

---

## Environment Variables

Only one env variable: `VITE_API_BASE_URL`. It must be prefixed with `VITE_` to be exposed to the browser. Defaults to `http://localhost:8000` if not set. Defined in [`src/lib/constants.ts`](src/lib/constants.ts) as `API_BASE_URL`.

---

## Things to Avoid

- **Do not use `react-query` v4 APIs** — the project uses TanStack Query v5. The `onSuccess`/`onError` options on `useQuery` are removed in v5; use them only on `useMutation` callbacks or `useEffect` on `data`/`error`.
- **Do not add a `QueryClientProvider`** — it is already set up in [`src/main.tsx`](src/main.tsx).
- **Do not use `<Link>` for back navigation** — all back buttons use `navigate(-1)` or `navigate('/path')`.
- **Do not use `<Navigate>` for redirects in effects** — use `navigate()` from `useNavigate()` inside `useEffect`.
- **Do not add new routes without considering `AuthGuard`** — most routes require authentication.
- **Do not use `tailwind.config.js`** — Tailwind v4 is configured via the Vite plugin and CSS `@theme` block only.
- **Do not use `@base-ui/react`** — it is listed as a dependency but not currently used in any component. Use shadcn/ui components from `src/components/ui/` instead.
- **Do not hardcode platform names** — use `platform === 'hoyolab' ? 'HoYoLAB' : 'Miyoushe'` or the `PLATFORM_META` pattern from `login-methods.tsx`.
