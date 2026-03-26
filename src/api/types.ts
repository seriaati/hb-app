// Auth types
export interface UserResponse {
  id: string
  username: string
  avatar_url: string
}

export interface AuthURLResponse {
  url: string
}

export interface AuthCallbackRequest {
  code: string
  state: string
}

// Login flow types
export type LoginFlowStatus =
  | 'success'
  | 'geetest_required'
  | 'email_verify_required'
  | 'otp_sent'
  | 'device_info_required'
  | 'qrcode_created'
  | 'qrcode_scanned'
  | 'qrcode_confirmed'
  | 'qrcode_expired'

export interface LoginFlowResponse {
  status: LoginFlowStatus
  next_step: string | null
  gt_version: number | null
  message: string | null
}

export interface EmailPasswordRequest {
  email: string
  password: string
}

export interface DevToolsCookiesRequest {
  ltuid_v2: string
  account_id_v2: string
  ltoken_v2: string
  ltmid_v2: string
  account_mid_v2: string
}

export interface RawCookiesRequest {
  cookies: string
}

export interface ModAppRequest {
  login_details: string
}

export interface MobileRequest {
  mobile: string
}

export interface OTPVerifyRequest {
  code: string
}

export interface EmailVerifyRequest {
  code: string
}

export interface DeviceInfoRequest {
  device_info: string
  aaid?: string
}

// QR Code types
export interface QRCodeResponse {
  ticket: string
  image_base64: string
}

export interface QRCodeStatusResponse {
  status: string
  cookies_saved: boolean
}

// Account types
export interface AccountInfo {
  uid: number
  nickname: string
  game: string
  server_name: string
  level: number
}

export interface FinishAccountsResponse {
  status: string
  accounts: AccountInfo[]
}

export interface AccountSubmitRequest {
  selected_accounts: string[]
}

// Gacha types
export interface GachaItem {
  id: number
  item_id: number
  rarity: number
  num: number
  num_since_last: number
  wish_id: string
  time: string
  banner_type: number
}

export interface GachaLogResponse {
  items: GachaItem[]
  total: number
  page: number
  max_page: number
}

export interface GachaIconsResponse {
  icons: Record<string, string> // item_id -> icon URL
}

export interface GachaNamesResponse {
  names: Record<string, string> // item_id -> display name
}

export interface GachaParams {
  account_id: string
  banner_type?: number
  locale?: string
  rarities?: number[]
  size?: number
  page?: number
  name_contains?: string
}

// i18n types
export interface I18nResponse {
  locale: string
  translations: Record<string, string>
}

// Error type
export interface ErrorResponse {
  detail: string
}
