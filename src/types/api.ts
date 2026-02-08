// API 응답 타입 정의

export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    errors?: Record<string, string[]>
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// 레거시 호환용 (점진적 마이그레이션)
export interface ApiError {
  success: false
  message: string
  code?: string
  errors?: Record<string, string[]>
}

// 인증 관련
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    username: string
    name: string
    role: string
  }
}

export interface SignupRequest {
  username: string
  password: string
  name: string
  phone: string
  verificationCode: string
  approvalCode: string
  role: string
  regionId: string
}

export interface SignupResponse {
  success: boolean
  message: string
}
