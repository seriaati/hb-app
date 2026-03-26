import { useQuery } from '@tanstack/react-query'
import { getMe } from '@/api/auth'
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
