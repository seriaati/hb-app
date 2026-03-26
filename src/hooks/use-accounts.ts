import { useQuery, useMutation } from '@tanstack/react-query'
import { getAvailableAccounts, submitAccounts } from '@/api/accounts'
import type { AccountSubmitRequest } from '@/api/types'

export function useAvailableAccounts() {
  return useQuery({
    queryKey: ['accounts', 'available'],
    queryFn: getAvailableAccounts,
    retry: false,
  })
}

export function useSubmitAccounts() {
  return useMutation({
    mutationFn: (body: AccountSubmitRequest) => submitAccounts(body),
  })
}
