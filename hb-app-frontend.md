# Hoyo Buddy Web App Frontend — Implementation Plan

## Overview

Build the React + Vite frontend for Hoyo Buddy in the repo at `/home/seria/Documents/GitHub/hb-app`. This app consumes the existing FastAPI backend API (source code in `/home/seria/Documents/GitHub/hoyo-buddy/web_app/api`) at `http://localhost:8000` (dev) / `https://hb-api.seria.moe` (prod) and provides two subsystems:

1. **Login System** — Discord OAuth → platform selection → login method → HoYoverse auth → account selection → save to DB
2. **Gacha Log System** — Paginated gacha history viewer (no auth required, accessed via direct URL from Discord bot)

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Build tool | Vite 6 | Fast, standard for React |
| UI framework | React 19 + TypeScript | Type safety, ecosystem |
| Styling | Tailwind CSS 4 + shadcn/ui | Beautiful defaults, accessible components |
| Routing | React Router v7 | Most mature, simplest mental model |
| Server state | TanStack Query v5 | Automatic caching, refetching, loading/error states for API calls |
| Client state | Zustand | Minimal boilerplate, works great alongside TanStack Query |
| HTTP client | ky | Lightweight, built on fetch, good defaults |
| i18n | i18next + react-i18next | Industry standard, lazy-load locale bundles from API |
| Linting | ESLint + Prettier | Standard |
| Icons | Lucide React | Ships with shadcn/ui |

---

## Backend API Summary

The backend is already built. The frontend consumes these endpoints:

### Auth (session cookie based)

- `GET /api/auth/me` → `UserResponse` — current user, 401 if not logged in
- `GET /api/auth/discord/url` → `AuthURLResponse` — Discord OAuth URL
- `POST /api/auth/discord/callback` `{code, state}` → `UserResponse` — exchange code for session

### Login Flow (requires auth)

- `POST /api/login/email-password?platform=...` `{email, password}` → `LoginFlowResponse`
- `POST /api/login/geetest-callback` → `LoginFlowResponse`
- `POST /api/login/email-verify` `{code}` → `LoginFlowResponse`
- `POST /api/login/mobile-send-otp` `{mobile}` → `LoginFlowResponse`
- `POST /api/login/mobile-verify` `{code}` → `LoginFlowResponse`
- `POST /api/login/dev-tools` `{ltuid_v2, account_id_v2, ltoken_v2, ltmid_v2, account_mid_v2}` → `LoginFlowResponse`
- `POST /api/login/raw-cookies` `{cookies}` → `LoginFlowResponse`
- `POST /api/login/mod-app` `{login_details}` → `LoginFlowResponse`
- `POST /api/login/qrcode/create` → `QRCodeResponse`
- `POST /api/login/qrcode/check` → `QRCodeStatusResponse`
- `POST /api/login/device-info` `{device_info, aaid?}` → `LoginFlowResponse`

### Accounts (requires auth)

- `GET /api/accounts/available` → `FinishAccountsResponse`
- `POST /api/accounts/submit` `{selected_accounts}` → `LoginFlowResponse`

### Gacha (no auth)

- `GET /api/gacha/logs?account_id=&banner_type=&locale=&rarities=&size=&page=&name_contains=` → `GachaLogResponse`
- `GET /api/gacha/icons` → `GachaIconsResponse`
- `GET /api/gacha/names?locale=&game=&item_ids=` → `GachaNamesResponse`

### i18n

- `GET /api/i18n/{locale}` → `I18nResponse`

---

## Route Structure

```
/                           → Landing / redirect
/oauth/callback             → Discord OAuth callback handler
/platforms?user_id=&locale=&channel_id=&guild_id=  → Platform selection (HoYoLAB / Miyoushe)
/login/:platform            → Login method selection
/login/:platform/email      → Email + password form
/login/:platform/devtools   → Dev tools cookie fields
/login/:platform/rawcookies → Raw cookies form
/login/:platform/modapp     → Mod app login details
/login/:platform/mobile     → Mobile OTP (Miyoushe only)
/login/:platform/qrcode     → QR code login (Miyoushe only)
/geetest                    → Geetest landing page (redirected here after captcha)
/email-verify               → Email verification code input
/device-info                → Device info form (Miyoushe only)
/finish                     → Account selection + submit
/gacha_log?account_id=&locale=&banner_type=&rarities=  → Gacha log viewer
```

---

## File Structure

```
hb-app/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.ts           (if needed by shadcn, v4 may not need this)
├── components.json              (shadcn/ui config)
├── eslint.config.js
├── .prettierrc
├── .env.example                 (VITE_API_BASE_URL=http://localhost:8000)
├── .gitignore
├── public/
│   ├── favicon.png
│   └── images/                  (copy from hoyo_buddy/web_app/assets/images/)
│       ├── genshin.png
│       ├── hkrpg.png
│       ├── honkai3rd.png
│       ├── hoyolab.webp
│       ├── miyoushe.webp
│       ├── nap.png
│       ├── tot.png
│       ├── logo.png
│       ├── dev_tools_tutorial.gif
│       └── js_tutorial.gif
├── src/
│   ├── main.tsx                 (entry point, providers)
│   ├── App.tsx                  (router outlet)
│   ├── router.tsx               (route definitions)
│   ├── vite-env.d.ts
│   ├── index.css                (tailwind imports + globals)
│   ├── api/
│   │   ├── client.ts            (ky instance with base URL + credentials)
│   │   ├── types.ts             (TypeScript interfaces mirroring backend schemas)
│   │   ├── auth.ts              (auth API functions)
│   │   ├── login.ts             (login flow API functions)
│   │   ├── accounts.ts          (accounts API functions)
│   │   ├── gacha.ts             (gacha API functions)
│   │   └── i18n.ts              (i18n API function)
│   ├── hooks/
│   │   ├── use-auth.ts          (TanStack Query hook for /api/auth/me)
│   │   ├── use-login.ts         (mutation hooks for login flow)
│   │   ├── use-accounts.ts      (query/mutation hooks for accounts)
│   │   ├── use-gacha.ts         (query hooks for gacha data)
│   │   └── use-i18n-backend.ts  (custom i18next backend plugin)
│   ├── stores/
│   │   └── login-store.ts       (Zustand store for login flow UI state)
│   ├── lib/
│   │   ├── utils.ts             (shadcn cn() utility)
│   │   ├── i18n.ts              (i18next initialization)
│   │   └── constants.ts         (API base URL, geetest server URLs, etc.)
│   ├── components/
│   │   └── ui/                  (shadcn/ui components, auto-generated)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── checkbox.tsx
│   │       ├── dialog.tsx
│   │       ├── skeleton.tsx
│   │       ├── badge.tsx
│   │       ├── table.tsx
│   │       ├── pagination.tsx
│   │       ├── tabs.tsx
│   │       ├── toast.tsx / sonner.tsx
│   │       └── ... (as needed)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── page-container.tsx    (centered max-w wrapper + padding)
│   │   │   └── loading-spinner.tsx   (full-page loading state)
│   │   ├── auth/
│   │   │   └── auth-guard.tsx        (redirect to Discord OAuth if not logged in)
│   │   ├── login/
│   │   │   ├── platform-card.tsx     (HoYoLAB / Miyoushe selection card)
│   │   │   ├── method-card.tsx       (login method button card)
│   │   │   ├── email-password-form.tsx
│   │   │   ├── devtools-form.tsx
│   │   │   ├── raw-cookies-form.tsx
│   │   │   ├── mod-app-form.tsx
│   │   │   ├── mobile-otp-form.tsx
│   │   │   ├── qr-code-login.tsx
│   │   │   ├── email-verify-dialog.tsx
│   │   │   └── device-info-form.tsx
│   │   ├── accounts/
│   │   │   ├── account-list.tsx      (selectable account cards)
│   │   │   └── account-card.tsx      (single game account display)
│   │   └── gacha/
│   │       ├── gacha-log-table.tsx   (main paginated table)
│   │       ├── gacha-banner-tabs.tsx (banner type selector)
│   │       ├── gacha-filters.tsx     (rarity filter, name search)
│   │       ├── gacha-item-row.tsx    (single row with icon + name)
│   │       └── gacha-stats.tsx       (summary stats panel)
│   └── pages/
│       ├── home.tsx                  (landing page / redirect logic)
│       ├── oauth-callback.tsx        (handles ?code=&state= from Discord)
│       ├── platforms.tsx             (platform selection)
│       ├── login-methods.tsx         (method selection grid)
│       ├── login-email.tsx           (email/password page)
│       ├── login-devtools.tsx        (dev tools cookie page)
│       ├── login-raw-cookies.tsx     (raw cookies page)
│       ├── login-mod-app.tsx         (mod app page)
│       ├── login-mobile.tsx          (mobile OTP page, Miyoushe)
│       ├── login-qrcode.tsx          (QR code page, Miyoushe)
│       ├── geetest.tsx               (geetest redirect landing)
│       ├── email-verify.tsx          (email verification code)
│       ├── device-info.tsx           (device info form, Miyoushe)
│       ├── finish.tsx                (account selection + submit)
│       └── gacha-log.tsx             (gacha history viewer)
```

---

## Login Flow Diagram

```mermaid
flowchart TD
    A[User clicks Add Account in Discord] --> B[/platforms?user_id=X&locale=Y]
    B --> C{Authenticated?}
    C -->|No| D[GET /api/auth/discord/url]
    D --> E[Redirect to Discord OAuth]
    E --> F[/oauth/callback?code=&state=]
    F --> G[POST /api/auth/discord/callback]
    G --> H[Redirect back to /platforms]
    C -->|Yes| I[Platform Selection Page]
    I --> J{HoYoLAB or Miyoushe?}
    
    J -->|HoYoLAB| K[/login/hoyolab - Method Selection]
    K --> K1[Email + Password]
    K --> K2[DevTools Cookies]
    K --> K3[Raw Cookies]
    K --> K4[Mod App]
    
    J -->|Miyoushe| L[/login/miyoushe - Method Selection]
    L --> L1[Email + Password]
    L --> L2[Mobile OTP]
    L --> L3[QR Code]
    L --> L4[Mod App]
    
    K1 --> M{Login Result}
    L1 --> M
    M -->|Success| N[/finish - Account Selection]
    M -->|Geetest Required| O[Open Geetest Captcha]
    O --> P[/geetest - Callback Landing]
    P --> Q[POST /api/login/geetest-callback]
    Q --> M
    M -->|Email Verify| R[/email-verify]
    R --> S[POST /api/login/email-verify]
    S --> N
    
    L2 --> T[POST /api/login/mobile-send-otp]
    T --> U{OTP Result}
    U -->|Geetest| O
    U -->|OTP Sent| V[Enter OTP Code]
    V --> W[POST /api/login/mobile-verify]
    W --> N
    
    L3 --> X[POST /api/login/qrcode/create]
    X --> Y[Display QR + Poll /api/login/qrcode/check]
    Y -->|Confirmed| N
    
    K2 --> N
    K3 --> N
    K4 --> N
    L4 --> N
    
    N --> Z[GET /api/accounts/available]
    Z --> AA[User selects accounts]
    AA --> AB[POST /api/accounts/submit]
    AB --> AC[Redirect to Discord via protocol URL]
```

---

## Implementation Tasks

### Phase 1: Project Scaffolding

#### Task 1: Initialize Vite + React + TypeScript project

- Run `npm create vite@latest . -- --template react-ts` in `/home/seria/Documents/GitHub/hb-app`
- Install dependencies: `npm install`
- Verify the dev server runs with `npm run dev`

#### Task 2: Install and configure Tailwind CSS v4

- Install: `npm install tailwindcss @tailwindcss/vite`
- Add the Vite plugin to `vite.config.ts`
- Update `src/index.css` with `@import "tailwindcss"`

#### Task 3: Initialize shadcn/ui

- Run `npx shadcn@latest init` — select New York style, Zinc base color, CSS variables
- This creates `components.json`, updates `tsconfig.json` paths, adds `lib/utils.ts`
- Install base components: button, card, input, label, select, checkbox, dialog, skeleton, badge, table, tabs, sonner (toast), pagination

#### Task 4: Install runtime dependencies

- `npm install react-router-dom @tanstack/react-query zustand ky i18next react-i18next lucide-react`
- `npm install -D @types/node`

#### Task 5: Configure environment variables

- Create `.env.example` with `VITE_API_BASE_URL=http://localhost:8000`
- Create `.env` (gitignored) with the same

#### Task 6: Copy static assets

- Copy `favicon.png` from `hoyo_buddy/web_app/assets/favicon.png` to `public/favicon.png`
- Copy all `hoyo_buddy/web_app/assets/images/*` to `public/images/`
- Update `index.html` favicon reference

---

### Phase 2: Core Infrastructure

#### Task 7: Set up the API client (`src/api/client.ts`)

- Create a `ky` instance with:
  - `prefixUrl` from `import.meta.env.VITE_API_BASE_URL`
  - `credentials: 'include'` (for session cookies)
  - JSON content type defaults
  - Error hook that throws structured errors

#### Task 8: Define TypeScript types (`src/api/types.ts`)

- Mirror all Pydantic schemas from the backend:
  - `UserResponse`, `AuthURLResponse`, `AuthCallbackRequest`
  - `LoginFlowResponse`, `EmailPasswordRequest`, `DevToolsCookiesRequest`, `RawCookiesRequest`, `ModAppRequest`, `MobileRequest`, `OTPVerifyRequest`, `EmailVerifyRequest`, `DeviceInfoRequest`
  - `QRCodeResponse`, `QRCodeStatusResponse`
  - `AccountInfo`, `FinishAccountsResponse`, `AccountSubmitRequest`
  - `GachaItem`, `GachaLogResponse`, `GachaIconsResponse`, `GachaNamesResponse`, `GachaParams`
  - `I18nResponse`
  - `ErrorResponse`

#### Task 9: Create API function modules

- `src/api/auth.ts` — `getMe()`, `getDiscordAuthUrl()`, `discordCallback(code, state)`
- `src/api/login.ts` — `emailPasswordLogin(body, platform)`, `geetestCallback()`, `emailVerify(code)`, `mobileSendOtp(mobile)`, `mobileVerify(code)`, `devToolsLogin(body)`, `rawCookiesLogin(body)`, `modAppLogin(body)`, `createQRCode()`, `checkQRCode()`, `submitDeviceInfo(body)`
- `src/api/accounts.ts` — `getAvailableAccounts()`, `submitAccounts(body)`
- `src/api/gacha.ts` — `getGachaLogs(params)`, `getGachaIcons()`, `getGachaNames(locale, game, itemIds)`
- `src/api/i18n.ts` — `getTranslations(locale)`

#### Task 10: Set up TanStack Query hooks

- `src/hooks/use-auth.ts`:
  - `useAuth()` — `useQuery` wrapping `getMe()`, stale time of 5 min, retry false on 401
- `src/hooks/use-login.ts`:
  - `useEmailPasswordLogin()` — `useMutation` wrapping `emailPasswordLogin()`
  - `useGeetestCallback()` — `useMutation`
  - `useEmailVerify()` — `useMutation`
  - `useMobileSendOtp()` — `useMutation`
  - `useMobileVerify()` — `useMutation`
  - `useDevToolsLogin()` — `useMutation`
  - `useRawCookiesLogin()` — `useMutation`
  - `useModAppLogin()` — `useMutation`
  - `useCreateQRCode()` — `useMutation`
  - `useCheckQRCode()` — `useMutation`
  - `useSubmitDeviceInfo()` — `useMutation`
- `src/hooks/use-accounts.ts`:
  - `useAvailableAccounts()` — `useQuery`
  - `useSubmitAccounts()` — `useMutation`
- `src/hooks/use-gacha.ts`:
  - `useGachaLogs(params)` — `useQuery` with `keepPreviousData`
  - `useGachaIcons()` — `useQuery` with long stale time (icons rarely change)
  - `useGachaNames(locale, game, itemIds)` — `useQuery`

#### Task 11: Set up Zustand store (`src/stores/login-store.ts`)

- Track login flow UI state:
  - `platform: string | null` — selected platform
  - `locale: string` — from URL params
  - `userId: number | null` — from URL params
  - `channelId: number | null` — from URL params
  - `guildId: number | null` — from URL params
  - `setPlatform()`, `setParams()` actions
- This store persists URL query params through the multi-step login flow

#### Task 12: Set up i18n

- `src/lib/i18n.ts`:
  - Initialize i18next with `react-i18next`
  - Create a custom backend plugin that calls `getTranslations(locale)` and caches via TanStack Query or i18next's own cache
  - Default to `en-US`, detect from URL `locale` param
  - Fallback to key if translation missing

#### Task 13: Set up routing (`src/router.tsx`)

- Define all routes using `createBrowserRouter`:
  - `/` → `HomePage`
  - `/oauth/callback` → `OAuthCallbackPage`
  - `/platforms` → `PlatformsPage` (wrapped in `AuthGuard`)
  - `/login/:platform` → `LoginMethodsPage` (wrapped in `AuthGuard`)
  - `/login/:platform/email` → `LoginEmailPage`
  - `/login/:platform/devtools` → `LoginDevtoolsPage`
  - `/login/:platform/rawcookies` → `LoginRawCookiesPage`
  - `/login/:platform/modapp` → `LoginModAppPage`
  - `/login/:platform/mobile` → `LoginMobilePage`
  - `/login/:platform/qrcode` → `LoginQRCodePage`
  - `/geetest` → `GeetestPage`
  - `/email-verify` → `EmailVerifyPage`
  - `/device-info` → `DeviceInfoPage`
  - `/finish` → `FinishPage`
  - `/gacha_log` → `GachaLogPage` (no auth guard)

#### Task 14: Set up app entry point (`src/main.tsx`, `src/App.tsx`)

- `main.tsx`: Wrap app with `QueryClientProvider`, `RouterProvider`
- `App.tsx`: Router outlet, toast container (Sonner)

#### Task 15: Create layout components

- `src/components/layout/page-container.tsx` — centered container with max width, padding, and min-height
- `src/components/layout/loading-spinner.tsx` — full-page centered spinner using shadcn Skeleton or Lucide Loader icon

#### Task 16: Create AuthGuard component

- `src/components/auth/auth-guard.tsx`:
  - Calls `useAuth()` hook
  - If loading → show loading spinner
  - If 401/error → redirect to Discord OAuth (save current URL to sessionStorage as `original_route`)
  - If authenticated → render children
  - After OAuth callback, redirect back to `original_route`

---

### Phase 3: Auth + OAuth Flow

#### Task 17: Build OAuth callback page (`src/pages/oauth-callback.tsx`)

- Read `code` and `state` from URL search params
- Call `POST /api/auth/discord/callback` with `{code, state}`
- On success → redirect to `sessionStorage.getItem('original_route')` or `/platforms`
- On error → show error message with retry button
- Show loading state while processing

#### Task 18: Build home page (`src/pages/home.tsx`)

- If URL has query params (`user_id`, etc.) → redirect to `/platforms` preserving params
- Otherwise → show a simple landing with the Hoyo Buddy logo

---

### Phase 4: Login System Pages

#### Task 19: Build platforms page (`src/pages/platforms.tsx`)

- Parse URL query params: `user_id`, `locale`, `platform`, `channel_id`, `guild_id`
- Save params to Zustand store and to session (for i18n locale)
- Display two platform cards: HoYoLAB and Miyoushe
  - Each card shows the platform logo image and name
  - Clicking navigates to `/login/hoyolab` or `/login/miyoushe`

#### Task 20: Build login methods page (`src/pages/login-methods.tsx`)

- Read `:platform` route param
- Display a grid of method cards based on platform:
  - **HoYoLAB**: Email/Password, DevTools, JavaScript (Raw Cookies), Mod App
  - **Miyoushe**: Email/Password, Mobile OTP, QR Code, Mod App
- Each card navigates to the corresponding login form page

#### Task 21: Build email/password login page (`src/pages/login-email.tsx`)

- Form with email + password fields (shadcn Input + Label)
- Submit button calls `useEmailPasswordLogin()` mutation
- Handle `LoginFlowResponse`:
  - `status: 'success'` → navigate to `/finish`
  - `status: 'geetest_required'` → open geetest captcha (external window/redirect)
  - `status: 'email_verify_required'` → navigate to `/email-verify`
- Show error messages from backend via toast

#### Task 22: Build dev tools login page (`src/pages/login-devtools.tsx`)

- Show the tutorial GIF (`/images/dev_tools_tutorial.gif`)
- Form with 5 cookie fields: `ltuid_v2`, `account_id_v2`, `ltoken_v2`, `ltmid_v2`, `account_mid_v2`
- Submit calls `useDevToolsLogin()`
- On success → navigate to `/finish`

#### Task 23: Build raw cookies login page (`src/pages/login-raw-cookies.tsx`)

- Show the JS tutorial GIF (`/images/js_tutorial.gif`)
- Textarea for raw cookie string
- Submit calls `useRawCookiesLogin()`
- On success → navigate to `/finish`

#### Task 24: Build mod app login page (`src/pages/login-mod-app.tsx`)

- Textarea for login details string
- Submit calls `useModAppLogin()`
- On success → navigate to `/finish`

#### Task 25: Build mobile OTP login page (`src/pages/login-mobile.tsx`)

- Form with mobile number input
- "Send OTP" button calls `useMobileSendOtp()`
- Handle result:
  - `status: 'geetest_required'` → geetest captcha
  - `status: 'otp_sent'` → show OTP code input field
- OTP verification calls `useMobileVerify()`
- On success → navigate to `/finish`

#### Task 26: Build QR code login page (`src/pages/login-qrcode.tsx`)

- "Generate QR Code" button calls `useCreateQRCode()`
- Display the base64 QR code image
- Poll `useCheckQRCode()` every 3 seconds
- Show status: "Waiting for scan..." → "Scanned, confirming..." → "Confirmed!"
- On `status: 'confirmed'` → navigate to `/finish`
- Handle QR code expiry (410 status) with "Regenerate" button

#### Task 27: Build geetest page (`src/pages/geetest.tsx`)

- Landing page after geetest captcha completion (redirected here by the geetest server)
- Read `user_id` from URL params
- Call `useGeetestCallback()` mutation
- Handle result: success → `/finish`, another geetest → re-open, email verify → `/email-verify`
- Show loading spinner while processing

#### Task 28: Build email verify page (`src/pages/email-verify.tsx`)

- Form with 6-digit code input
- Submit calls `useEmailVerify()`
- On success → navigate to `/finish`

#### Task 29: Build device info page (`src/pages/device-info.tsx`)

- Textarea for device info JSON
- Optional AAID text input
- Submit calls `useSubmitDeviceInfo()`
- On success → navigate to `/finish`

---

### Phase 5: Account Selection

#### Task 30: Build finish page (`src/pages/finish.tsx`)

- Call `useAvailableAccounts()` query on mount
- Handle `status: 'device_info_required'` → redirect to `/device-info`
- Display list of game accounts with checkboxes:
  - Show game icon, nickname, UID, server, level
  - All checked by default
- Submit button calls `useSubmitAccounts()` with selected account IDs
- On success:
  - If `message` contains a `discord://` URL → `window.location.href = message`
  - Otherwise → show success message

#### Task 31: Build account card component (`src/components/accounts/account-card.tsx`)

- Card showing: game icon (from `/images/{game}.png`), nickname, UID, server name, level
- Checkbox for selection
- Game icon mapping: `genshin` → `genshin.png`, `hkrpg` → `hkrpg.png`, `nap` → `nap.png`, `honkai3rd` → `honkai3rd.png`, `tot` → `tot.png`

---

### Phase 6: Gacha Log Viewer

#### Task 32: Build gacha log page (`src/pages/gacha-log.tsx`)

- Parse URL query params: `account_id`, `locale`, `banner_type`, `rarities`
- No auth required — this page is accessed via direct URL from the Discord bot
- Layout:
  - Banner type selector (tabs)
  - Filters bar: rarity checkboxes (2★-5★), name search input
  - Stats summary panel
  - Paginated table of gacha items

#### Task 33: Build gacha banner tabs (`src/components/gacha/gacha-banner-tabs.tsx`)

- Tabs component using shadcn Tabs
- Banner types vary by game — determine game from the first API response
- Changing tab updates the `banner_type` query param and refetches

#### Task 34: Build gacha filters (`src/components/gacha/gacha-filters.tsx`)

- Rarity filter: checkboxes for 2★, 3★, 4★, 5★
- Name search: debounced text input (300ms)
- Filters update URL query params and trigger refetch

#### Task 35: Build gacha log table (`src/components/gacha/gacha-log-table.tsx`)

- Table columns: #, Icon, Name, Rarity (star display), Pity Count, Time
- Use `useGachaLogs()` for data
- Use `useGachaNames()` to resolve `item_id` → display name
- Use `useGachaIcons()` to resolve item icons
- Rarity-based row coloring: 5★ gold, 4★ purple, 3★ blue
- Pagination at the bottom using shadcn Pagination

#### Task 36: Build gacha stats panel (`src/components/gacha/gacha-stats.tsx`)

- Summary stats derived from the gacha log response:
  - Total pulls on this banner
  - Current pity count (pulls since last 5★)
  - 5★ count, 4★ count
  - Average pulls per 5★

---

### Phase 7: Polish and Production

#### Task 37: Add constants and configuration (`src/lib/constants.ts`)

- `API_BASE_URL` from env
- `GEETEST_SERVERS` mapping (mirroring backend `GEETEST_SERVERS`)
- `BANNER_TYPE_NAMES` for display labels
- Game enum values

#### Task 38: Error handling and loading states

- Every page should handle: loading, error, and empty states
- Use Sonner toast for API error notifications
- 401 errors should redirect to Discord OAuth flow
- Network errors should show a retry option

#### Task 39: Responsive design

- All pages should work on mobile (the app is opened from Discord mobile)
- Use Tailwind responsive classes
- Test key breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)

#### Task 40: Dark mode support

- Configure Tailwind dark mode via `class` strategy
- Default to system preference via `prefers-color-scheme`
- Ensure all shadcn/ui components respect dark mode
- The app will primarily be used in a dark context (Discord embeds open in browser)

#### Task 41: Build and deployment configuration

- Update `vite.config.ts` for production build optimizations
- Configure `base` URL if needed
- Add `build` and `preview` scripts
- Add `.env.production` with `VITE_API_BASE_URL=https://hb-api.seria.moe`

---

## Key Design Decisions

### Why TanStack Query for server state

The app is heavily API-driven — almost every page fetches from or mutates the backend. TanStack Query provides automatic caching (gacha icons, translations), loading/error states, background refetching, and mutation handling. This eliminates ~80% of state management code compared to doing it manually.

### Why Zustand for client state

Only a small amount of truly client-side state exists (login flow params from URL, selected platform). Zustand is the simplest option — a single store with a few fields. No boilerplate, no providers needed.

### Why React Router v7 over TanStack Router

React Router is more battle-tested and has a simpler learning curve. The routing needs here are straightforward (no complex data loading patterns). TanStack Router's type-safe search params are nice but overkill for this app.

### Session cookie based auth

The backend uses `itsdangerous` signed cookies with `httponly`, `samesite=lax`. The frontend just needs `credentials: 'include'` on all API calls — no token management needed in the frontend at all.

### i18n approach

Rather than bundling translation files, we fetch them from the backend API (`/api/i18n/{locale}`). This ensures the frontend always has the same translations as the backend and avoids duplicate maintenance. i18next's caching prevents redundant fetches.
