# Plan: Add `api_server` to Geetest v4 Initialization

## Problem

The current [`initV4()`](src/pages/geetest.tsx:198) function does not pass `api_server` to `window.initGeetest4()`. The old server-side template ([`gt.html:91`](gt.html:91)) correctly passes `api_server` for both v3 and v4. Without it, the v4 captcha may contact the wrong server.

## Changes

### 1. Update `GEETEST_SERVERS` in [`src/lib/constants.ts`](src/lib/constants.ts:123)

The existing constant is unused and holds game server URLs (not geetest API servers). Replace it with version-keyed geetest API server URLs:

```ts
// Before (unused, wrong values)
export const GEETEST_SERVERS: Record<string, string> = {
  hoyolab: 'https://gs.hoyoverse.com',
  miyoushe: 'https://gs.mihoyo.com',
}

// After
export const GEETEST_API_SERVERS: Record<number, string> = {
  3: 'api-na.geetest.com',
  4: 'gcaptcha4.captchami.com',
}

export const GEETEST_SDK_URLS: Record<number, string> = {
  3: 'https://static.geetest.com/static/js/gt.0.5.0.js',
  4: 'https://static.geetest.com/v4/gt4.js',
}
```

### 2. Update [`src/pages/geetest.tsx`](src/pages/geetest.tsx)

**a)** Import the new constants and use them instead of inline strings:

- Replace the inline SDK URL selection (lines 261–263) with `GEETEST_SDK_URLS[gtVersion]`
- Replace the hardcoded `api_server: 'api-na.geetest.com'` in `initV3()` (line 168) with `GEETEST_API_SERVERS[3]`
- **Add** `api_server: GEETEST_API_SERVERS[4]` to the `initV4()` params object (around line 207)

**b)** Resulting `initV4` params:

```ts
{
  captchaId: mmtData.gt,
  riskType: mmtData.risk_type,
  userInfo: mmtData.session_id ? JSON.stringify({ mmt_key: mmtData.session_id }) : undefined,
  api_server: GEETEST_API_SERVERS[4],  // <-- NEW
  product: 'bind',
  language: 'en',
}
```

## Files Touched

| File | Change |
|------|--------|
| [`src/lib/constants.ts`](src/lib/constants.ts) | Replace `GEETEST_SERVERS` with `GEETEST_API_SERVERS` and `GEETEST_SDK_URLS` |
| [`src/pages/geetest.tsx`](src/pages/geetest.tsx) | Import new constants, add `api_server` to v4 init, use constants for SDK URLs |
