import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import { useGeetestCallback } from '@/hooks/use-login'
import { LoadingSpinner } from '@/components/layout/loading-spinner'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'

export function GeetestPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const geetestCallback = useGeetestCallback()
  const [error, setError] = useState<string | null>(null)
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    geetestCallback.mutate(undefined, {
      onSuccess: (data) => {
        if (data.status === 'success') {
          navigate('/finish', { replace: true })
        } else if (data.status === 'geetest_required') {
          navigate('/geetest', { replace: true })
        } else if (data.status === 'email_verify_required') {
          navigate('/email-verify', { replace: true })
        } else {
          toast.info(data.message ?? 'Unknown status')
          navigate('/finish', { replace: true })
        }
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : 'Geetest verification failed'
        setError(message)
        toast.error(message)
      },
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (error) {
    return (
      <PageContainer narrow>
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => navigate(-1)}>{t('web.back', '← Back')}</Button>
        </div>
      </PageContainer>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} />
      <p className="text-muted-foreground">{t('web.processing_verification', 'Processing verification…')}</p>
    </div>
  )
}
