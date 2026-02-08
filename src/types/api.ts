// API 응답 타입 정의

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

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
