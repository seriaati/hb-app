import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { discordCallback } from '@/api/auth'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)
  const { t } = useTranslation()

  useEffect(() => {
    if (called.current) return
    called.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      setError(t('missing_oauth_params'))
      return
    }

    discordCallback(code, state)
      .then(() => {
        const originalRoute = sessionStorage.getItem('original_route') ?? '/platforms'
        sessionStorage.removeItem('original_route')
        navigate(originalRoute, { replace: true })
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : t('auth_failed')
        setError(message)
        toast.error(message)
      })
  }, [navigate, searchParams, t])

  if (error) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => navigate('/')}>{t('go_home')}</Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} />
      <p className="text-muted-foreground">{t('completing_sign_in')}</p>
    </div>
  )
}
