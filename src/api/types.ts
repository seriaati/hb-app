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
export type LoginFlowNextStep = 'geetest' | 'email_verify' | 'verify_otp' | 'finish' | 'redirect'

// MMT data embedded in LoginFlowResponse when next_step === 'geetest'
export interface GeetestMMTData {
  gt: string
  challenge: string
  new_captcha: number | boolean
  success: number | boolean
  session_id?: string
  check_id?: string
  risk_type?: string
}

export interface LoginFlowResponse {
  next_step: LoginFlowNextStep
  gt_version: number | null
  mmt: GeetestMMTData | null
  message: string | null
}

// Payload for POST /login/geetest-callback (v3) — SessionMMTResult
export interface SessionMMTResult {
  session_id: string
  check_id?: string
  geetest_challenge: string
  geetest_validate: string
  geetest_seccode: string
}

// Payload for POST /login/geetest-callback (v4) — SessionMMTv4Result
export interface SessionMMTv4Result {
  session_id: string
  check_id?: string
  lot_number: string
  captcha_output: string
  pass_token: string
  gen_time: string
}

export type GeetestCallbackRequest = SessionMMTResult | SessionMMTv4Result

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

// Error type
export interface ErrorResponse {
  detail: string
}
