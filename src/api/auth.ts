import { apiClient } from './client'
import type { UserResponse, AuthURLResponse, AuthCallbackRequest } from './types'

export async function getMe(): Promise<UserResponse> {
  return apiClient.get('api/auth/me').json<UserResponse>()
}

export async function getDiscordAuthUrl(): Promise<AuthURLResponse> {
  return apiClient.get('api/auth/discord/url').json<AuthURLResponse>()
}

export async function discordCallback(code: string, state: string): Promise<UserResponse> {
  const body: AuthCallbackRequest = { code, state }
  return apiClient.post('api/auth/discord/callback', { json: body }).json<UserResponse>()
}
