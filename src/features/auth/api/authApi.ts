import type { User } from "@/types/common"
import type { ApiResponse } from "@/types/api"

// Mock 사용자 데이터
const MOCK_USER: User = {
  id: "1",
  username: "test",
  name: "홍길동",
  email: "hong@example.com",
  phone: "010-1234-5678",
  role: "candidate",
  createdAt: new Date().toISOString(),
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  user: User
  token: string
}

// Mock 지연 시뮬레이션
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function login(
  data: LoginRequest
): Promise<ApiResponse<LoginResponse>> {
  // 네트워크 지연 시뮬레이션
  await delay(800)

  // Mock 로그인 검증
  if (data.username === "test" && data.password === "test1234") {
    const token = `mock_token_${Date.now()}`
    return {
      success: true,
      data: {
        user: MOCK_USER,
        token,
      },
    }
  }

  // 로그인 실패
  return {
    success: false,
    error: {
      code: "INVALID_CREDENTIALS",
      message: "아이디 또는 비밀번호가 올바르지 않습니다",
    },
  }
}

export async function logout(): Promise<ApiResponse<void>> {
  await delay(300)
  return { success: true }
}

export async function getMe(): Promise<ApiResponse<User>> {
  await delay(500)

  const token = localStorage.getItem("auth_token")
  if (!token) {
    return {
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "인증이 필요합니다",
      },
    }
  }

  return {
    success: true,
    data: MOCK_USER,
  }
}

// 아이디 중복 확인 (회원가입 Step 1)
export async function checkUsername(
  username: string
): Promise<ApiResponse<{ available: boolean }>> {
  await delay(500)

  // Mock: username이 "test"이면 이미 사용 중
  const available = username !== "test"

  return {
    success: true,
    data: { available },
  }
}

// 인증번호 발송 (회원가입 Step 2)
export async function sendVerification(
  phone: string
): Promise<ApiResponse<void>> {
  await delay(800)

  // Mock: 항상 성공
  console.log(`[Mock] 인증번호 발송: ${phone}`)

  return {
    success: true,
  }
}

// 인증번호 확인 (회원가입 Step 2)
export async function verifyPhone(
  phone: string,
  code: string
): Promise<ApiResponse<void>> {
  await delay(500)

  // Mock: code가 "123456"이면 성공
  if (code === "123456") {
    console.log(`[Mock] 인증 성공: ${phone}`)
    return {
      success: true,
    }
  }

  return {
    success: false,
    error: {
      code: "INVALID_CODE",
      message: "인증번호가 올바르지 않습니다",
    },
  }
}
