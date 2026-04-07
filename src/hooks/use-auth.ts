import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getDiscordAuthUrl, getMe, logout } from '@/api/auth'
import type { HTTPError } from 'ky'

export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      const httpError = error as HTTPError
      if (httpError?.response?.status === 401) return false
      return failureCount < 2
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Clear all cached data, then redirect to Discord OAuth directly.
      // We can't rely on AuthGuard re-triggering because the query observer
      // may not re-run its useEffect after the cache is cleared mid-session.
      queryClient.clear()
      sessionStorage.setItem('original_route', window.location.pathname + window.location.search)
      getDiscordAuthUrl()
        .then(({ url }) => {
          window.location.href = url
        })
        .catch(() => {
          window.location.reload()
        })
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Logout failed')
    },
  })
}
