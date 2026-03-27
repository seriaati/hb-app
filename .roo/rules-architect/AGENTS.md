# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Architectural Constraints

- **Login flow is a server-driven wizard** — the backend dictates the next step via `LoginFlowResponse.next_step`. The frontend must not hardcode step order; always branch through [`handleLoginFlowResponse()`](src/lib/login-flow.ts). Adding a new step requires adding a new `LoginFlowNextStep` value and a case in that function.
- **`/geetest` is intentionally unguarded** — it sits outside `AuthGuard` because it can be reached mid-login before a session exists. It must remain unguarded even if other mid-flow pages are guarded.
- **Geetest page supports re-navigation without remounting** — React Router updates `location.state` in place when navigating to the same route. The page detects new MMT sessions via `mmt.challenge`/`mmt.session_id` change, not component remount. Any refactor of this page must preserve this behavior.
- **Zustand store is populated once at `/platforms`** — `useLoginStore` holds `platform`, `userId`, `locale`, `channelId`, `guildId` from URL params. These are not re-read from the URL on subsequent pages; they come from the store. New URL-sourced params must be added to `LoginParams` in [`src/stores/login-store.ts`](src/stores/login-store.ts).
- **Two separate state systems with strict boundaries** — TanStack Query owns all server/async state (auth, accounts, gacha, i18n). Zustand owns only URL-sourced session params. Do not put server data in Zustand or UI session params in Query cache.
- **`useLogout` bypasses AuthGuard intentionally** — it calls `queryClient.clear()` then redirects directly to Discord OAuth. AuthGuard cannot be relied upon to re-trigger after cache clear mid-session.
- **`/gacha_log` is a standalone viewer** — it is not part of the login wizard, has no AuthGuard, and reads all state from URL search params. It is designed to be opened directly from Discord without any prior session.
- **Platform-specific login method filtering is declarative** — each login method in [`LoginMethodsPage`](src/pages/login-methods.tsx) declares `platforms: string[]`. Adding a new platform requires updating this array per method, not adding conditional rendering.
- **Geetest SDK is loaded dynamically per-session** — scripts from `static.geetest.com` are injected into `<head>` at runtime. The SDK is not bundled. Any architecture that pre-bundles or SSRs this page will break geetest initialization.
- **`ky` `prefixUrl` requires path-relative API strings** — the entire API layer depends on paths without leading slashes. A leading `/` silently breaks URL construction by overriding the prefix origin.
