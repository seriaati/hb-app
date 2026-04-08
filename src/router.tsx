import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/auth-guard'
import { LoadingSpinner } from '@/components/layout/loading-spinner'

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })))
const OAuthCallbackPage = lazy(() =>
  import('@/pages/oauth-callback').then((m) => ({ default: m.OAuthCallbackPage })),
)
const PlatformsPage = lazy(() =>
  import('@/pages/platforms').then((m) => ({ default: m.PlatformsPage })),
)
const LoginMethodsPage = lazy(() =>
  import('@/pages/login-methods').then((m) => ({ default: m.LoginMethodsPage })),
)
const LoginEmailPage = lazy(() =>
  import('@/pages/login-email').then((m) => ({ default: m.LoginEmailPage })),
)
const LoginDevtoolsPage = lazy(() =>
  import('@/pages/login-devtools').then((m) => ({ default: m.LoginDevtoolsPage })),
)
const LoginModAppPage = lazy(() =>
  import('@/pages/login-mod-app').then((m) => ({ default: m.LoginModAppPage })),
)
const LoginMobilePage = lazy(() =>
  import('@/pages/login-mobile').then((m) => ({ default: m.LoginMobilePage })),
)
const LoginQRCodePage = lazy(() =>
  import('@/pages/login-qrcode').then((m) => ({ default: m.LoginQRCodePage })),
)
const GeetestPage = lazy(() =>
  import('@/pages/geetest').then((m) => ({ default: m.GeetestPage })),
)
const EmailVerifyPage = lazy(() =>
  import('@/pages/email-verify').then((m) => ({ default: m.EmailVerifyPage })),
)
const DeviceInfoPage = lazy(() =>
  import('@/pages/device-info').then((m) => ({ default: m.DeviceInfoPage })),
)
const FinishPage = lazy(() => import('@/pages/finish').then((m) => ({ default: m.FinishPage })))
const CompletePage = lazy(() =>
  import('@/pages/complete').then((m) => ({ default: m.CompletePage })),
)
const GachaLogPage = lazy(() =>
  import('@/pages/gacha-log').then((m) => ({ default: m.GachaLogPage })),
)
const GeetestCommandPage = lazy(() =>
  import('@/pages/geetest-command').then((m) => ({ default: m.GeetestCommandPage })),
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found').then((m) => ({ default: m.NotFoundPage })),
)

const fallback = <LoadingSpinner fullPage />

const wrap = (element: React.ReactNode) => <Suspense fallback={fallback}>{element}</Suspense>

export const router = createBrowserRouter([
  {
    path: '/',
    element: wrap(<HomePage />),
  },
  {
    path: '/oauth/callback',
    element: wrap(<OAuthCallbackPage />),
  },
  {
    path: '/platforms',
    element: wrap(
      <AuthGuard>
        <PlatformsPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform',
    element: wrap(
      <AuthGuard>
        <LoginMethodsPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform/email',
    element: wrap(
      <AuthGuard>
        <LoginEmailPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform/devtools',
    element: wrap(
      <AuthGuard>
        <LoginDevtoolsPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform/modapp',
    element: wrap(
      <AuthGuard>
        <LoginModAppPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform/mobile',
    element: wrap(
      <AuthGuard>
        <LoginMobilePage />
      </AuthGuard>,
    ),
  },
  {
    path: '/login/:platform/qrcode',
    element: wrap(
      <AuthGuard>
        <LoginQRCodePage />
      </AuthGuard>,
    ),
  },
  {
    path: '/geetest',
    element: wrap(<GeetestPage />),
  },
  {
    path: '/email-verify',
    element: wrap(
      <AuthGuard>
        <EmailVerifyPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/device-info',
    element: wrap(
      <AuthGuard>
        <DeviceInfoPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/finish',
    element: wrap(
      <AuthGuard>
        <FinishPage />
      </AuthGuard>,
    ),
  },
  {
    path: '/complete',
    element: wrap(
      <AuthGuard>
        <CompletePage />
      </AuthGuard>,
    ),
  },
  {
    path: '/gacha_log',
    element: wrap(<GachaLogPage />),
  },
  {
    path: '/geetest_command',
    element: wrap(<GeetestCommandPage />),
  },
  {
    path: '*',
    element: wrap(<NotFoundPage />),
  },
])
