import { createBrowserRouter } from 'react-router-dom'
import { AuthGuard } from '@/components/auth/auth-guard'
import { HomePage } from '@/pages/home'
import { OAuthCallbackPage } from '@/pages/oauth-callback'
import { PlatformsPage } from '@/pages/platforms'
import { LoginMethodsPage } from '@/pages/login-methods'
import { LoginEmailPage } from '@/pages/login-email'
import { LoginDevtoolsPage } from '@/pages/login-devtools'
import { LoginModAppPage } from '@/pages/login-mod-app'
import { LoginMobilePage } from '@/pages/login-mobile'
import { LoginQRCodePage } from '@/pages/login-qrcode'
import { GeetestPage } from '@/pages/geetest'
import { EmailVerifyPage } from '@/pages/email-verify'
import { DeviceInfoPage } from '@/pages/device-info'
import { FinishPage } from '@/pages/finish'
import { CompletePage } from '@/pages/complete'
import { GachaLogPage } from '@/pages/gacha-log'
import { GeetestCommandPage } from '@/pages/geetest-command'
import { NotFoundPage } from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/oauth/callback',
    element: <OAuthCallbackPage />,
  },
  {
    path: '/platforms',
    element: (
      <AuthGuard>
        <PlatformsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform',
    element: (
      <AuthGuard>
        <LoginMethodsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform/email',
    element: (
      <AuthGuard>
        <LoginEmailPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform/devtools',
    element: (
      <AuthGuard>
        <LoginDevtoolsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform/modapp',
    element: (
      <AuthGuard>
        <LoginModAppPage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform/mobile',
    element: (
      <AuthGuard>
        <LoginMobilePage />
      </AuthGuard>
    ),
  },
  {
    path: '/login/:platform/qrcode',
    element: (
      <AuthGuard>
        <LoginQRCodePage />
      </AuthGuard>
    ),
  },
  {
    path: '/geetest',
    element: <GeetestPage />,
  },
  {
    path: '/email-verify',
    element: (
      <AuthGuard>
        <EmailVerifyPage />
      </AuthGuard>
    ),
  },
  {
    path: '/device-info',
    element: (
      <AuthGuard>
        <DeviceInfoPage />
      </AuthGuard>
    ),
  },
  {
    path: '/finish',
    element: (
      <AuthGuard>
        <FinishPage />
      </AuthGuard>
    ),
  },
  {
    path: '/complete',
    element: (
      <AuthGuard>
        <CompletePage />
      </AuthGuard>
    ),
  },
  {
    path: '/gacha_log',
    element: <GachaLogPage />,
  },
  {
    path: '/geetest_command',
    element: <GeetestCommandPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
