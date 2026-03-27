# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Non-Obvious Debug Rules

- **Geetest SDK loads dynamically** — `window.initGeetest` / `window.initGeetest4` are injected at runtime from `static.geetest.com`. If they are `undefined`, the script failed to load (network/CSP issue), not a code bug.
- **`/geetest` page logs MMT data to console** — `console.log('Geetest GT version:', gtVersion)` and `console.log('Geetest MMT data:', mmt)` fire on every new geetest session; use these to verify state passed via `location.state`.
- **Login flow state is in `location.state`**, not URL params — if `/geetest` shows an error immediately, check that the caller used `navigate('/geetest', { state: { gt_version, mmt, purpose } })` correctly.
- **`useAuth` never retries on 401** — a 401 from `GET api/auth/me` is intentional and triggers OAuth redirect; it will not retry. Do not add retry logic.
- **`apiClient` pre-extracts error messages** in a `beforeError` hook — the `err.message` on a caught `ky` error is already the human-readable `body.detail` or `body.message` from the server, not the raw HTTP status text.
- **QR code polling interval is stored in a `useRef`** — if polling appears to stop, check that the `useEffect` cleanup is clearing the interval ref correctly in [`LoginQRCodePage`](src/pages/login-qrcode.tsx).
- **`sessionStorage` key `'original_route'`** — set by `AuthGuard` on 401 and by `useLogout`; read and deleted by `OAuthCallbackPage`. If post-OAuth redirect lands on wrong page, check this value in DevTools.
- **i18n translations are fetched at runtime** — missing translation keys show the fallback string (second arg to `t()`), not an error. If UI shows raw key strings, the `GET api/i18n/{locale}` call failed.
- **`VITE_API_BASE_URL` defaults to `http://localhost:8000`** — if API calls fail in dev, ensure the backend is running on port 8000 or set the env var in `.env.local`.
