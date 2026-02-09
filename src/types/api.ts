/**
 * API 응답 타입 정의
 *
 * 모든 API 함수는 ApiResponse<T> 타입을 반환합니다.
 * success 필드를 통해 성공/실패를 구분하며, TypeScript의 타입 가드로 자동 타입 추론이 가능합니다.
 */

/**
 * API 성공 응답
 *
 * @template T - 응답 데이터의 타입
 *
 * @example
 * ```typescript
 * // 로그인 성공 응답
 * const loginResponse: ApiSuccessResponse<LoginResponse> = {
 *   success: true,
 *   data: {
 *     accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
 *     refreshToken: "...",
 *     user: { id: "1", username: "hong", name: "홍길동", role: "candidate" }
 *   }
 * }
 * ```
 */
export interface ApiSuccessResponse<T> {
  /** 응답 성공 여부 (항상 true) */
  success: true
  /** 응답 데이터 */
  data: T
}

/**
 * API 에러 응답
 *
 * @example
 * ```typescript
 * // 일반 에러 응답
 * const errorResponse: ApiErrorResponse = {
 *   success: false,
 *   error: {
 *     code: "AUTH_001",
 *     message: "아이디 또는 비밀번호가 일치하지 않습니다"
 *   }
 * }
 *
 * // 유효성 검사 에러 응답
 * const validationError: ApiErrorResponse = {
 *   success: false,
 *   error: {
 *     code: "VALIDATION_ERROR",
 *     message: "입력값이 올바르지 않습니다",
 *     errors: {
 *       username: ["아이디는 4자 이상이어야 합니다"],
 *       password: ["비밀번호는 8자 이상이어야 합니다"]
 *     }
 *   }
 * }
 * ```
 */
export interface ApiErrorResponse {
  /** 응답 실패 여부 (항상 false) */
  success: false
  /** 에러 정보 */
  error: {
    /** 에러 코드 (예: "AUTH_001", "VALIDATION_ERROR") */
    code: string
    /** 사용자에게 표시할 에러 메시지 */
    message: string
    /** 필드별 유효성 검사 에러 (선택) */
    errors?: Record<string, string[]>
  }
}

/**
 * API 응답 (성공 또는 실패)
 *
 * 타입 가드를 통해 성공/실패를 구분할 수 있습니다.
 *
 * @template T - 성공 시 반환될 데이터의 타입
 *
 * @example
 * ```typescript
 * // API 함수 정의
 * async function getUser(id: string): Promise<ApiResponse<User>> {
 *   const response = await fetch(`/api/users/${id}`)
 *   return response.json()
 * }
 *
 * // 타입 가드를 사용한 응답 처리
 * const response = await getUser("123")
 * if (response.success) {
 *   // response.data는 User 타입
 *   console.log(response.data.name)
 * } else {
 *   // response.error는 에러 정보
 *   console.error(response.error.message)
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React Query 커스텀 훅과 함께 사용
 * import { useApiQuery } from '@/lib/api/hooks'
 *
 * function UserProfile({ userId }: { userId: string }) {
 *   const { data, isLoading } = useApiQuery({
 *     queryKey: ['user', userId],
 *     queryFn: () => getUser(userId),
 *   })
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *   return <div>{data.name}</div>
 * }
 * ```
 */
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
