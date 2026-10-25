# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

hb-app is the web frontend for **Hoyo Buddy**, a Discord bot for HoYoverse games (https://app.hb.seria.moe). It handles account login and gacha log viewing. Users always arrive from links the bot posts in Discord, so pages expect query params rather than being navigated to from `/`. The backend lives in the separate `hoyo-buddy` repo (`hoyo_buddy/api/`).

## Commands

Use **bun** only (not npm/npx/yarn).

```
bun install
bun run dev       # Vite dev server
bun run build     # tsc -b && vite build (type-check + bundle)
bun run lint      # eslint .
bun run preview
```

There is no test suite. Verify changes with `bun run build` and `bun run lint`.

`VITE_API_BASE_URL` (see `.env.example`) points at the backend; it defaults to `http://localhost:8000`.

Formatting follows `.prettierrc` (no semicolons, single quotes, 2-space indent, trailing commas, 100-char width), but prettier is not a dependency and there is no format script.

## Architecture

### Routing and auth

Routes are declared in `src/router.tsx` as lazy-loaded pages. Most are wrapped in `AuthGuard`, which calls `useAuth` (`GET api/auth/me`). On error it stores `pathname + search` in `sessionStorage['original_route']` and redirects to the Discord OAuth URL; `OAuthCallbackPage` reads and clears that key to send the user back. `useAuth` doesn't retry on 401. `useLogout` clears the whole QueryClient and redirects to OAuth itself, because AuthGuard won't reliably re-trigger after a cache clear.

Unguarded routes: `/`, `/oauth/callback`, `/geetest`, `/gacha_log` (underscore, matches the bot's links), and the 404 route.

### Login wizard (server-driven)

Entry is `/platforms?user_id=&locale=&channel_id=&guild_id=`. That page copies the params into the Zustand store `useLoginStore` (`src/stores/login-store.ts`), and later pages read them from the store, not the URL. Add new URL-sourced params to `LoginParams` there.

Flow: `/platforms` → `/login/:platform` (method picker) → `/login/:platform/<method>` → backend responds with `LoginFlowResponse`. The backend decides the next step via `next_step` (not `status`). Always branch through `handleLoginFlowResponse()` in `src/lib/login-flow.ts`:

- `geetest` → `/geetest` with `{ gt_version, api_server, mmt, purpose }` in **router `location.state`** (not URL params); `purpose` is `GeetestPurpose` (`'login' | 'email_verify'`), passed as `options.geetestPurpose`
- `email_verify` → `/email-verify`
- `verify_otp` → `options.onVerifyOtp()`
- `finish` → `/finish` (account selection; may detour to `/device-info` when the accounts response has `status: 'device_info_required'`)
- `done` → `/complete` (shows Discord deep link built from the store's `channelId`/`guildId` via `src/lib/discord.ts`)

Adding a step means extending `LoginFlowNextStep` in `src/api/types.ts` and adding a case to that helper.

Login methods are declared in `src/pages/login-methods.tsx`, each with a `platforms` array that filters them: email (hoyolab, miyoushe), devtools (hoyolab, miyoushe), modapp/mobile OTP/QR code (miyoushe only). A hidden raw-cookies method appears after typing `dev` on that page. The email, devtools, raw-cookies and mod-app login calls pass `platform` as a query param; mobile and QR do not.

On `/finish`, the selected account IDs are `${account.game}_${account.uid}`. A 403 from `api/accounts/submit` means a free user hit the account limit and opens `SponsorDialog`.

### Geetest

`src/hooks/use-geetest.ts` holds the captcha logic shared by `/geetest` (login flow) and `/geetest_command` (guarded; bot-initiated verification that reads all MMT data from URL params). SDK scripts load at runtime from `GEETEST_SDK_URLS` (`static.geetest.com`) and expose `window.initGeetest` / `window.initGeetest4`. `/geetest` can be re-navigated to without remounting (e.g. a second captcha for email verification). The hook detects a new session by `mmt.challenge`/`mmt.session_id` changing, using `initializedChallengeRef` plus a render-time reset. Keep that behavior when refactoring.

### Gacha log

`/gacha_log` is a standalone viewer opened directly from Discord. It reads `account_id`, `locale`, `banner_type`, `rarities` (comma-separated), and `game` from URL search params and writes filter changes back to the URL. Pagination is cursor-based: `cursorStack` keeps visited cursors so the user can go back, and changing a filter resets it. Banner types come from the API; when none is in the URL, the first one is selected.

### Data layer

- All HTTP goes through `apiClient` (`src/api/client.ts`, a `ky` instance with `prefixUrl`). Paths must **not** start with `/` (`'api/auth/me'`). A `beforeError` hook replaces `err.message` with the server's `detail`/`message`, so catch with `err instanceof Error ? err.message : fallback`. Use `HTTPError` from `ky` when you need the status code.
- Components never call `src/api/*` directly; wrap each call in a hook in `src/hooks/` (`useQuery` for reads, `useMutation` for writes). TanStack Query v5: no `onSuccess`/`onError` on `useQuery`.
- QR login polls a POST endpoint, so `login-qrcode.tsx` uses `useMutation` with a 3s `setInterval` held in a ref.
- For mutations fired on mount, guard against StrictMode double-firing with a `useRef` flag (see `oauth-callback.tsx`).

### i18n

Translations are **bundled**: `src/lib/i18n.ts` imports all 12 `src/locales/*.json` files (`fallbackLng: 'en-US'`). Use snake_case keys via `t('key')`. `resolveLocale()` in `src/lib/constants.ts` maps a browser locale onto `SUPPORTED_LOCALES`.

Only edit `src/locales/en-US.json` by hand. `txsync.mjs push --locale en-US` flattens it into `tx/en-US.json` (Transifex structured JSON); a GitHub workflow runs this on push to main, so commit both files or let CI regenerate `tx/`. Translations come back from Transifex into `tx/<lang>.json` and `txsync.mjs pull` writes them to `src/locales/`. Don't hand-edit other locales.

### UI and styling

- shadcn/ui components live in `src/components/ui/` and are built on `@base-ui/react` (not Radix). Link-styled buttons use `<a className={buttonVariants(...)}>`.
- Tailwind v4 with no `tailwind.config.js`; theme tokens are CSS variables under `@theme inline` in `src/index.css`, alongside custom utilities in `@layer utilities`.
- Colors are oklch only; tint with `color-mix(in oklch, ...)`. Platform accents: HoYoLAB `oklch(0.56 0.17 12)`, Miyoushe `oklch(0.48 0.16 265)`.
- Sora (`var(--font-display)`) for headings, buttons, labels, applied inline via `style={{ fontFamily: 'var(--font-display)' }}`; DM Sans is the body font.
- Merge classes with `cn()` from `src/lib/utils.ts`.
- Login pages use `LoginLayout` (`panel` with `accentColor`, `hero`, `title`, `description`; `securityNote={null}` hides the credentials note). Other pages use `PageContainer` (`narrow` → `max-w-md`).
- Static images live in `public/images/` and are referenced by absolute path (`/images/logo.png`, `/images/{game}.png`).
- Game keys: `genshin`, `hkrpg`, `honkai3rd`, `nap`, `tot`. Rarity maps in `constants.ts` are keyed by number. Locale-aware docs links come from the `get*Url(locale)` helpers in `constants.ts`.

Imports use the `@/` alias for `src/`.
