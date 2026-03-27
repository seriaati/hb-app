# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Documentation Context

- **`src/assets/` is legacy and unused** — all production image assets are in `public/images/` with absolute paths. The `src/assets/` directory contains only leftover Vite scaffold files.
- **`@base-ui/react` is listed as a dependency but not used** — shadcn/ui components in `src/components/ui/` are the actual UI primitives.
- **Login flow response field is `next_step`**, not `status` — `LoginFlowResponse.next_step` drives the wizard. The type is `LoginFlowNextStep = 'geetest' | 'email_verify' | 'verify_otp' | 'finish' | 'redirect'`.
- **`/gacha_log` uses an underscore**, not a hyphen — the route is `/gacha_log`, not `/gacha-log`. This matches the Discord bot's deep-link format.
- **`SUPPORTED_LOCALES` has only 2 entries** (`en-US`, `zh-TW`) — the backend supports more locales for i18n, but the frontend language selector only exposes these two.
- **Doc URL helpers exist for locale-aware links** — `getAccountSecurityUrl()`, `getBeforeStartUrl()`, `getConsolePlayerUrl()`, `getEmailLoginDocsUrl()`, `getLoginMethodFaqUrl()` in [`src/lib/constants.ts`](src/lib/constants.ts) all accept a locale string. Do not hardcode docs URLs.
- **`GEETEST_SERVERS`** in [`src/lib/constants.ts`](src/lib/constants.ts) maps platform → geetest server URL (`hoyolab` / `miyoushe`) — used when constructing geetest API calls.
- **Geetest page state comes from React Router `location.state`** — `gt_version`, `mmt`, and `purpose` are passed via `navigate('/geetest', { state: ... })`, not URL search params.
- **The app has no standalone mode** — it is always opened from Discord with `user_id`, `locale`, `channel_id`, `guild_id` query params. The home page (`/`) is a placeholder; real flow starts at `/platforms`.
- **Tailwind v4 has no config file** — there is no `tailwind.config.js`. All theme tokens are CSS custom properties in [`src/index.css`](src/index.css) under `@theme inline`.
