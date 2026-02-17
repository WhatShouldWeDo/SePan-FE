/**
 * React Query 커스텀 훅 (API 통합용)
 *
 * 제공 기능:
 * - useApiQuery: ApiResponse<T> 타입을 자동으로 처리하는 useQuery wrapper
 * - useApiMutation: ApiResponse<T> 타입을 자동으로 처리하는 useMutation wrapper
 * - 에러/성공 Toast 자동화
 */
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query'
import type { ApiResponse } from '@/types/api'
import { toastError } from './errors'
import { toast } from '@/lib/toast/toast'

/**
 * useApiQuery 옵션 타입
 *
 * React Query의 UseQueryOptions를 확장하되,
 * queryFn은 ApiResponse<T>를 반환하도록 오버라이드
 */
type UseApiQueryOptions<T, TQueryKey extends QueryKey = QueryKey> = Omit<
  UseQueryOptions<T, Error, T, TQueryKey>,
  'queryFn'
> & {
  /** API 호출 함수 (ApiResponse<T> 반환) */
  queryFn: () => Promise<ApiResponse<T>>
  /** 에러 발생 시 Toast 표시 여부 (기본: true) */
  showErrorToast?: boolean
}

/**
 * API 쿼리를 위한 React Query 커스텀 훅
 *
 * - ApiResponse<T> 타입 자동 처리 (success/error 분기)
 * - success: false인 경우 에러로 throw
 * - 에러 시 Toast 자동 표시 (옵션)
 *
 * @example
 * ```typescript
 * // 기본 사용
 * const { data, isLoading, error } = useApiQuery({
 *   queryKey: ['users', userId],
 *   queryFn: () => getUser(userId),
 * })
 *
 * // Toast 비활성화
 * const { data } = useApiQuery({
 *   queryKey: ['users', userId],
 *   queryFn: () => getUser(userId),
 *   showErrorToast: false, // 에러 Toast 비활성화
 * })
 * ```
 */
export function useApiQuery<T, TQueryKey extends QueryKey = QueryKey>(
  options: UseApiQueryOptions<T, TQueryKey>
) {
  const { queryFn, showErrorToast = true, ...restOptions } = options

  return useQuery({
    ...restOptions,
    queryFn: async () => {
      const response = await queryFn()

      // ApiResponse 검증
      if (!response.success) {
        // 에러 Toast 표시
        if (showErrorToast) {
          toastError(response)
        }
        // React Query 에러로 throw
        throw new Error(response.error.message)
      }

      // 성공 시 data 반환
      return response.data
    },
  })
}

/**
 * useApiMutation 옵션 타입
 *
 * React Query의 UseMutationOptions를 확장하되,
 * mutationFn은 ApiResponse<TData>를 반환하도록 오버라이드
 */
type UseApiMutationOptions<TData, TVariables> = Omit<
  UseMutationOptions<TData, Error, TVariables>,
  'mutationFn'
> & {
  /** API 호출 함수 (ApiResponse<TData> 반환) */
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>
  /** 에러 발생 시 Toast 표시 여부 (기본: true) */
  showErrorToast?: boolean
  /** 성공 시 Toast 표시 여부 (기본: false) */
  showSuccessToast?: boolean
  /** 성공 Toast 메시지 (showSuccessToast: true일 때 필수) */
  successMessage?: string
}

/**
 * API Mutation을 위한 React Query 커스텀 훅
 *
 * - ApiResponse<TData> 타입 자동 처리 (success/error 분기)
 * - success: false인 경우 에러로 throw
 * - 에러/성공 시 Toast 자동 표시 (옵션)
 *
 * @example
 * ```typescript
 * // 기본 사용 (에러 Toast만)
 * const { mutate, isPending } = useApiMutation({
 *   mutationFn: (data: LoginRequest) => login(data),
 *   onSuccess: (data) => {
 *     console.log('로그인 성공:', data)
 *   },
 * })
 *
 * // 성공 Toast 표시
 * const { mutate } = useApiMutation({
 *   mutationFn: (data: SignupRequest) => signup(data),
 *   showSuccessToast: true,
 *   successMessage: '회원가입이 완료되었습니다',
 *   onSuccess: () => {
 *     navigate('/login')
 *   },
 * })
 *
 * // Toast 모두 비활성화
 * const { mutate } = useApiMutation({
 *   mutationFn: (data: UpdateRequest) => updateProfile(data),
 *   showErrorToast: false,
 *   onError: (error) => {
 *     // 커스텀 에러 처리
 *   },
 * })
 * ```
 */
export function useApiMutation<TData, TVariables>(
  options: UseApiMutationOptions<TData, TVariables>
) {
  const {
    mutationFn,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage,
    onSuccess,
    onError,
    ...restOptions
  } = options

  return useMutation({
    ...restOptions,
    mutationFn: async (variables: TVariables) => {
      const response = await mutationFn(variables)

      // ApiResponse 검증
      if (!response.success) {
        // 에러 Toast 표시
        if (showErrorToast) {
          toastError(response)
        }
        // React Query 에러로 throw
        throw new Error(response.error.message)
      }

      // 성공 시 data 반환
      return response.data
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      // 성공 Toast 표시
      if (showSuccessToast && successMessage) {
        toast.success(successMessage)
      }
      // 사용자 정의 onSuccess 콜백 호출
      onSuccess?.(data, variables, onMutateResult, context)
    },
    onError: (error, variables, onMutateResult, context) => {
      // 에러 Toast는 mutationFn에서 이미 처리되었지만,
      // fetch 에러 등 ApiResponse가 아닌 에러는 여기서 처리
      if (showErrorToast && !(error instanceof Error && error.message)) {
        toastError(error)
      }
      // 사용자 정의 onError 콜백 호출
      onError?.(error, variables, onMutateResult, context)
    },
  })
}
