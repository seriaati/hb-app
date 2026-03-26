import { apiClient } from './client'
import type { FinishAccountsResponse, AccountSubmitRequest, LoginFlowResponse } from './types'

export async function getAvailableAccounts(): Promise<FinishAccountsResponse> {
  return apiClient.get('api/accounts/available').json<FinishAccountsResponse>()
}

export async function submitAccounts(body: AccountSubmitRequest): Promise<LoginFlowResponse> {
  return apiClient.post('api/accounts/submit', { json: body }).json<LoginFlowResponse>()
}
