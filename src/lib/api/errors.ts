/**
 * API 에러 핸들링 유틸리티
 *
 * 제공 기능:
 * - parseApiError: 다양한 에러 타입을 사용자 친화적 메시지로 변환
 * - toastError: 에러를 Toast UI로 표시
 * - handleApiError: 에러 로깅 + Toast 표시 통합
 */
import type { ApiResponse } from '@/types/api'
import { ApiClientError } from './client'
import { toast, type ToastOptions } from '@/lib/toast/toast'

/**
 * API 에러를 사용자 친화적 메시지로 변환
 *
 * @param error - ApiClientError, ApiResponse, Error, unknown 등 다양한 에러 타입
 * @returns 사용자에게 표시할 에러 메시지
 *
 * @example
 * ```typescript
 * try {
 *   const response = await api.get('/users')
 * } catch (error) {
 *   const message = parseApiError(error)
 *   console.log(message) // "사용자를 찾을 수 없습니다"
 * }
 * ```
 */
export function parseApiError(error: unknown): string {
  // 1. ApiClientError (fetch 레벨 에러)
  if (error instanceof ApiClientError) {
    return error.message
  }

  // 2. ApiResponse (success: false)
  if (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    error.success === false
  ) {
    const apiError = error as ApiResponse<never>
    if (!apiError.success) {
      // 유효성 검사 에러 (errors 필드가 있는 경우)
      if (apiError.error.errors) {
        const firstFieldErrors = Object.values(apiError.error.errors)[0]
        if (firstFieldErrors && firstFieldErrors.length > 0) {
          return firstFieldErrors[0]
        }
      }
      // 일반 에러 메시지
      return apiError.error.message
    }
  }

  // 3. Error 객체
  if (error instanceof Error) {
    return error.message
  }

  // 4. 기본 메시지 (unknown 타입 처리)
  return '알 수 없는 오류가 발생했습니다'
}

/**
 * 에러를 Toast로 표시
 *
 * @param error - 에러 객체 또는 메시지
 * @param options - Toast 옵션 (duration, position 등)
 *
 * @example
 * ```typescript
 * // 에러 객체 전달
 * toastError(new Error('로그인 실패'))
 *
 * // ApiResponse 전달
 * const response = await login({ username, password })
 * if (!response.success) {
 *   toastError(response)
 * }
 *
 * // 옵션 지정
 * toastError(error, { duration: 5000 })
 * ```
 */
export function toastError(error: unknown, options?: ToastOptions): void {
  const message = parseApiError(error)
  toast.error(message, options)
}

/**
 * 에러 처리 통합 함수 (로깅 + Toast 표시)
 *
 * 개발 환경에서는 console.error로 에러를 출력하고,
 * 모든 환경에서 Toast로 에러 메시지를 표시합니다.
 *
 * @param error - 에러 객체
 * @param context - 에러 발생 컨텍스트 (로깅용, 예: 'LoginForm.submit')
 * @param options - Toast 옵션
 *
 * @example
 * ```typescript
 * const handleLogin = async () => {
 *   try {
 *     const response = await login(credentials)
 *     if (!response.success) {
 *       handleApiError(response, 'LoginForm.handleLogin')
 *       return
 *     }
 *     // 성공 처리...
 *   } catch (error) {
 *     handleApiError(error, 'LoginForm.handleLogin')
 *   }
 * }
 * ```
 */
export function handleApiError(
  error: unknown,
  context?: string,
  options?: ToastOptions
): void {
  // 개발 환경에서는 에러 로깅
  if (import.meta.env.DEV) {
    if (context) {
      console.error(`[${context}]`, error)
    } else {
      console.error(error)
    }
  }

  // Toast 표시
  toastError(error, options)

  // TODO: Production 환경에서 에러 로깅 서비스 연동 (Sentry 등)
  // if (import.meta.env.PROD) {
  //   reportErrorToService(error, context)
  // }
}
