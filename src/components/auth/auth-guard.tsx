import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { getDiscordAuthUrl } from '@/api/auth'
import { LoadingSpinner } from '@/components/layout/loading-spinner'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: user, isLoading, error } = useAuth()

  useEffect(() => {
    if (!isLoading && !user && error) {
      // Save current URL for redirect after OAuth
      sessionStorage.setItem('original_route', window.location.pathname + window.location.search)
      // Redirect to Discord OAuth
      getDiscordAuthUrl()
        .then(({ url }) => {
          window.location.href = url
        })
        .catch(console.error)
    }
  }, [isLoading, user, error])

  if (isLoading) {
    return <LoadingSpinner fullPage />
  }

  if (!user) {
    return <LoadingSpinner fullPage />
  }

  return <>{children}</>
}
