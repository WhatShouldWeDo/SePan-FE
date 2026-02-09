/**
 * Toast UI wrapper (sonner 기반)
 *
 * 설정:
 * - 위치: top-right
 * - 에러 지속 시간: 4초
 * - 성공 Toast는 기본적으로 표시하지 않음 (명시적 호출 시만)
 */
import { toast as sonnerToast } from 'sonner'

export interface ToastOptions {
  /** Toast 지속 시간 (밀리초) */
  duration?: number
  /** Toast 위치 */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  /** 사용자가 직접 닫을 수 있는지 여부 */
  dismissible?: boolean
}

/** 기본 에러 Toast 지속 시간 (4초) */
const DEFAULT_ERROR_DURATION = 4000

/** 기본 성공 Toast 지속 시간 (3초) */
const DEFAULT_SUCCESS_DURATION = 3000

export const toast = {
  /**
   * 성공 메시지 Toast 표시
   * @param message - 표시할 메시지
   * @param options - Toast 옵션
   */
  success: (message: string, options?: ToastOptions) => {
    sonnerToast.success(message, {
      duration: options?.duration ?? DEFAULT_SUCCESS_DURATION,
      position: options?.position,
      dismissible: options?.dismissible,
    })
  },

  /**
   * 에러 메시지 Toast 표시
   * @param message - 표시할 에러 메시지
   * @param options - Toast 옵션
   */
  error: (message: string, options?: ToastOptions) => {
    sonnerToast.error(message, {
      duration: options?.duration ?? DEFAULT_ERROR_DURATION,
      position: options?.position,
      dismissible: options?.dismissible,
    })
  },

  /**
   * 정보 메시지 Toast 표시
   * @param message - 표시할 메시지
   * @param options - Toast 옵션
   */
  info: (message: string, options?: ToastOptions) => {
    sonnerToast.info(message, {
      duration: options?.duration,
      position: options?.position,
      dismissible: options?.dismissible,
    })
  },

  /**
   * 경고 메시지 Toast 표시
   * @param message - 표시할 메시지
   * @param options - Toast 옵션
   */
  warning: (message: string, options?: ToastOptions) => {
    sonnerToast.warning(message, {
      duration: options?.duration,
      position: options?.position,
      dismissible: options?.dismissible,
    })
  },
}
