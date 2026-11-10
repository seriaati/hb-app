import { create } from 'zustand'

interface LoginParams {
  userId: number | null
  locale: string
  channelId: number | null
  guildId: number | null
}

interface LoginStore extends LoginParams {
  platform: string | null
  emailSentAt: number | null
  setPlatform: (platform: string) => void
  setParams: (params: Partial<LoginParams>) => void
  setEmailSentAt: (emailSentAt: number) => void
}

export const useLoginStore = create<LoginStore>((set) => ({
  platform: null,
  emailSentAt: null,
  userId: null,
  locale: 'en-US',
  channelId: null,
  guildId: null,
  setPlatform: (platform) => set({ platform }),
  setParams: (params) => set((state) => ({ ...state, ...params })),
  setEmailSentAt: (emailSentAt) => set({ emailSentAt }),
}))
