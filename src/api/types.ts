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
  api_server: string | null
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

// Gacha stats type
export interface GachaStatsResponse {
  total_pulls: number
  five_star_pity: number
  four_star_pity: number
  total_five_stars: number
  total_four_stars: number
  avg_pulls_per_five_star: number
  avg_pulls_per_four_star: number
  fifty_fifty_wins: number
  fifty_fifty_total: number
  fifty_fifty_win_rate: number
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
  icon: string | null
  name: string | null
}

export interface GachaLogResponse {
  items: GachaItem[]
  total: number
  next_cursor: string | null
  game: string
}

export interface GachaBannerType {
  id: number
  name: string
}

export interface GachaBannerTypesResponse {
  banner_types: GachaBannerType[]
}

export interface GachaParams {
  account_id: string
  banner_type?: number
  locale?: string
  rarities?: number[]
  size?: number
  cursor?: string
  name_contains?: string
}

// Geetest command types
export interface GeetestCommandRequest {
  account_id: number
  gt_type: string
  mmt_result: Record<string, string>
}

// Error type
export interface ErrorResponse {
  detail: string
}
