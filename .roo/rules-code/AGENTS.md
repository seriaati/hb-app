# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Coding Rules

- **Never call API functions directly from components** — always wrap in a hook in `src/hooks/`. Queries use `useQuery`, mutations use `useMutation`.
- **API paths must not start with `/`** — `ky`'s `prefixUrl` breaks if paths have a leading slash. Use `'api/auth/me'`, not `'/api/auth/me'`.
- **Login flow branching must use [`handleLoginFlowResponse()`](src/lib/login-flow.ts)** — do not inline `switch`/`if` on `next_step`. The response field is `next_step`, not `status`.
- **Navigate to `/geetest` via `location.state`**, not URL params: `navigate('/geetest', { state: { gt_version, mmt, purpose } })`. The page reads `useLocation().state`.
- **`GeetestPurpose`** must be passed as `options.geetestPurpose` to `handleLoginFlowResponse()` — values are `'login'` or `'email_verify'`.
- **Double-fire guard for mount-triggered mutations**: use `const called = useRef(false)` pattern (see [`OAuthCallbackPage`](src/pages/oauth-callback.tsx)). For `/geetest`, use `initializedChallengeRef` keyed on `mmt.challenge`/`mmt.session_id` instead — it supports re-navigation without remounting.
- **`useLogout` calls `queryClient.clear()`** before redirecting — do not rely on `AuthGuard` re-triggering after logout.
- **`SUPPORTED_LOCALES`** only contains `en-US` and `zh-TW` — do not assume more locales are supported on the frontend.
- **Rarity color maps** (`RARITY_COLORS`, `RARITY_ROW_COLORS` in [`src/lib/constants.ts`](src/lib/constants.ts)) are keyed by **number**, not string.
- **Account ID composite key**: `${account.game}_${account.uid}` — used for both selection state and the `selected_accounts` array sent to the backend.
- **All colors must be oklch** — never introduce hex or hsl. Use `color-mix(in oklch, ...)` for tinting.
- **`cn()`** from [`src/lib/utils.ts`](src/lib/utils.ts) is the only way to merge class strings — never concatenate manually.
- **`@base-ui/react`** is a listed dependency but unused — use shadcn/ui from `src/components/ui/` instead.
- **No `tailwind.config.js`** — Tailwind v4 is configured via `@tailwindcss/vite` plugin and `@theme inline` in [`src/index.css`](src/index.css) only.
- **Doc URL helpers** in [`src/lib/constants.ts`](src/lib/constants.ts) (`getAccountSecurityUrl()`, `getBeforeStartUrl()`, etc.) accept a locale string and return locale-prefixed URLs — use these instead of hardcoding URLs.
- **QR code polling** uses `setInterval` in a `useRef` with `useMutation` (not `useQuery` refetchInterval) because the check endpoint is a POST.
- **Image assets** go in `public/images/` with absolute paths — `src/assets/` is legacy and unused.
