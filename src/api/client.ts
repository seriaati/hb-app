import ky from 'ky'
import { API_BASE_URL } from '@/lib/constants'

export const apiClient = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeError: [
      async (error) => {
        const { response } = error
        if (response) {
          try {
            const body = await response.clone().json() as { detail?: string; message?: string }
            error.message = body.detail ?? body.message ?? error.message
          } catch {
            // ignore parse errors
          }
        }
        return error
      },
    ],
  },
})
