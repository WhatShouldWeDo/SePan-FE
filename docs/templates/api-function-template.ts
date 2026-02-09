/**
 * API 함수 작성 템플릿
 *
 * 이 파일은 신규 API 함수를 작성할 때 참고할 템플릿입니다.
 * Mock 데이터로 시작해서 실제 API로 점진적으로 전환할 수 있도록 설계되었습니다.
 */

import type { ApiResponse } from '@/types/api'

// ============================================================
// 1. 타입 정의
// ============================================================

/**
 * [기능명] 요청 타입
 *
 * @example
 * ```typescript
 * const request: ExampleRequest = {
 *   id: "123",
 *   name: "홍길동"
 * }
 * ```
 */
export interface ExampleRequest {
  /** 요청 파라미터 설명 */
  id: string
  name: string
}

/**
 * [기능명] 응답 타입
 *
 * @example
 * ```typescript
 * const response: ExampleResponse = {
 *   id: "123",
 *   name: "홍길동",
 *   createdAt: "2025-01-01T00:00:00Z"
 * }
 * ```
 */
export interface ExampleResponse {
  /** 응답 필드 설명 */
  id: string
  name: string
  createdAt: string
}

// ============================================================
// 2. API 함수 (Mock 버전)
// ============================================================

/**
 * [기능명] API 함수 (Mock)
 *
 * **TODO**: 실제 API 엔드포인트 연동 필요
 * - 엔드포인트: POST /api/example
 * - Mock 데이터를 반환하며, 실제 API 연동 시 주석 해제
 *
 * @param request - 요청 데이터
 * @returns ApiResponse<ExampleResponse>
 *
 * @example
 * ```typescript
 * // 기본 사용
 * const response = await exampleApi({ id: "123", name: "홍길동" })
 * if (response.success) {
 *   console.log(response.data)
 * }
 * ```
 *
 * @example
 * ```typescript
 * // React Query와 함께 사용
 * import { useApiMutation } from '@/lib/api/hooks'
 *
 * function ExampleForm() {
 *   const { mutate, isPending } = useApiMutation({
 *     mutationFn: (data: ExampleRequest) => exampleApi(data),
 *     onSuccess: (data) => {
 *       console.log('성공:', data)
 *     },
 *   })
 *
 *   const handleSubmit = () => {
 *     mutate({ id: "123", name: "홍길동" })
 *   }
 * }
 * ```
 */
export async function exampleApi(
  request: ExampleRequest
): Promise<ApiResponse<ExampleResponse>> {
  // Mock 지연 시뮬레이션 (개발 환경에서만)
  await new Promise((resolve) => setTimeout(resolve, 500))

  // ========================================
  // Mock 데이터 (개발 단계)
  // ========================================
  // 유효성 검사 예시
  if (!request.id) {
    return {
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ID는 필수입니다',
        errors: {
          id: ['ID를 입력해주세요'],
        },
      },
    }
  }

  // 성공 응답 Mock
  return {
    success: true,
    data: {
      id: request.id,
      name: request.name,
      createdAt: new Date().toISOString(),
    },
  }

  // ========================================
  // 실제 API 연동 (TODO)
  // ========================================
  // try {
  //   const response = await fetch('/api/example', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // Authorization 헤더 추가 (필요 시)
  //       // 'Authorization': `Bearer ${getAuthToken()}`,
  //     },
  //     body: JSON.stringify(request),
  //   })
  //
  //   const data = await response.json()
  //
  //   // 응답이 이미 ApiResponse 형식인 경우
  //   return data as ApiResponse<ExampleResponse>
  //
  //   // 응답을 ApiResponse 형식으로 변환해야 하는 경우
  //   // if (response.ok) {
  //   //   return { success: true, data }
  //   // } else {
  //   //   return {
  //   //     success: false,
  //   //     error: {
  //   //       code: data.code || 'API_ERROR',
  //   //       message: data.message || 'API 요청 중 오류가 발생했습니다',
  //   //     },
  //   //   }
  //   // }
  // } catch (error) {
  //   // 네트워크 에러 처리
  //   return {
  //     success: false,
  //     error: {
  //       code: 'NETWORK_ERROR',
  //       message: '네트워크 오류가 발생했습니다',
  //     },
  //   }
  // }
}

// ============================================================
// 3. React Query 사용 예시 (참고용)
// ============================================================

/**
 * React Query Mutation 훅 사용 예시
 *
 * ```typescript
 * import { useApiMutation } from '@/lib/api/hooks'
 * import { exampleApi, type ExampleRequest } from '@/features/example/api/exampleApi'
 *
 * function ExampleComponent() {
 *   const { mutate, isPending, error } = useApiMutation({
 *     mutationFn: (data: ExampleRequest) => exampleApi(data),
 *     showSuccessToast: true,
 *     successMessage: '요청이 성공적으로 처리되었습니다',
 *     onSuccess: (data) => {
 *       console.log('API 호출 성공:', data)
 *       // 성공 후 처리 (예: 페이지 이동, 상태 업데이트 등)
 *     },
 *   })
 *
 *   const handleSubmit = (formData: ExampleRequest) => {
 *     mutate(formData)
 *   }
 *
 *   return (
 *     <form onSubmit={(e) => {
 *       e.preventDefault()
 *       handleSubmit({ id: "123", name: "홍길동" })
 *     }}>
 *       <button type="submit" disabled={isPending}>
 *         {isPending ? '처리 중...' : '제출'}
 *       </button>
 *     </form>
 *   )
 * }
 * ```
 */

/**
 * React Query Query 훅 사용 예시
 *
 * ```typescript
 * import { useApiQuery } from '@/lib/api/hooks'
 * import { getExample, type ExampleResponse } from '@/features/example/api/exampleApi'
 *
 * function ExampleList() {
 *   const { data, isLoading, error } = useApiQuery({
 *     queryKey: ['example', 'list'],
 *     queryFn: () => getExample(),
 *   })
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *   if (error) return <div>에러 발생: {error.message}</div>
 *   if (!data) return null
 *
 *   return (
 *     <ul>
 *       {data.map((item) => (
 *         <li key={item.id}>{item.name}</li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */

// ============================================================
// 4. Mock → 실제 API 전환 가이드
// ============================================================

/**
 * ## Mock → 실제 API 전환 단계
 *
 * ### 1단계: Mock 데이터로 개발
 * - 타입 정의 (Request, Response)
 * - API 함수 작성 (Mock 데이터 반환)
 * - 컴포넌트에서 useApiQuery/useApiMutation 사용
 * - UI/UX 플로우 검증
 *
 * ### 2단계: 실제 API 준비
 * - 백엔드 API 엔드포인트 확인 (Method, URL, 인증 방식)
 * - 요청/응답 스키마 확인 (Mock 타입과 실제 API 응답 비교)
 * - 에러 케이스 확인 (에러 코드, 메시지 형식)
 *
 * ### 3단계: API 함수 전환
 * - Mock 데이터 부분을 주석 처리
 * - 실제 API 호출 코드 작성 (fetch 또는 axios)
 * - Authorization 헤더 추가 (필요 시)
 * - 에러 처리 로직 추가 (네트워크 에러, API 에러)
 *
 * ### 4단계: 통합 테스트
 * - 실제 API 호출 테스트 (개발/스테이징 환경)
 * - 성공/실패 케이스 검증
 * - Toast 메시지 확인
 * - 에러 핸들링 확인
 *
 * ### 5단계: 정리
 * - Mock 코드 삭제
 * - JSDoc의 "TODO" 주석 제거
 * - 코드 리뷰 및 최종 검증
 *
 * ---
 *
 * ## 체크리스트
 *
 * - [ ] Request/Response 타입 정의 완료
 * - [ ] API 함수 작성 (Mock 버전)
 * - [ ] JSDoc 주석 작성 (사용 예시 포함)
 * - [ ] 컴포넌트에서 useApiMutation/useApiQuery 사용
 * - [ ] UI 플로우 검증 (Mock 데이터)
 * - [ ] 백엔드 API 스펙 확인
 * - [ ] 실제 API 호출 코드 작성
 * - [ ] 통합 테스트 완료
 * - [ ] Mock 코드 정리
 * - [ ] 코드 리뷰 완료
 */

// ============================================================
// 5. 추가 패턴: GET API (Query용)
// ============================================================

/**
 * GET API 함수 예시 (Query용)
 *
 * @example
 * ```typescript
 * import { useApiQuery } from '@/lib/api/hooks'
 *
 * function ExampleDetail({ id }: { id: string }) {
 *   const { data, isLoading } = useApiQuery({
 *     queryKey: ['example', id],
 *     queryFn: () => getExampleById(id),
 *   })
 *
 *   if (isLoading) return <div>로딩 중...</div>
 *   return <div>{data.name}</div>
 * }
 * ```
 */
export async function getExampleById(
  id: string
): Promise<ApiResponse<ExampleResponse>> {
  // Mock 지연
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock 데이터
  return {
    success: true,
    data: {
      id,
      name: `Example ${id}`,
      createdAt: new Date().toISOString(),
    },
  }

  // 실제 API (TODO)
  // try {
  //   const response = await fetch(`/api/example/${id}`, {
  //     method: 'GET',
  //     headers: {
  //       // Authorization: `Bearer ${getAuthToken()}`,
  //     },
  //   })
  //   const data = await response.json()
  //   return data as ApiResponse<ExampleResponse>
  // } catch (error) {
  //   return {
  //     success: false,
  //     error: {
  //       code: 'NETWORK_ERROR',
  //       message: '네트워크 오류가 발생했습니다',
  //     },
  //   }
  // }
}

// ============================================================
// 6. 추가 패턴: 리스트 조회 (페이지네이션)
// ============================================================

export interface ExampleListRequest {
  page?: number
  limit?: number
  search?: string
}

export interface ExampleListResponse {
  items: ExampleResponse[]
  total: number
  page: number
  limit: number
}

/**
 * 리스트 조회 API 함수 예시 (페이지네이션)
 *
 * @example
 * ```typescript
 * import { useApiQuery } from '@/lib/api/hooks'
 *
 * function ExampleList() {
 *   const [page, setPage] = useState(1)
 *
 *   const { data, isLoading } = useApiQuery({
 *     queryKey: ['example', 'list', page],
 *     queryFn: () => getExampleList({ page, limit: 10 }),
 *   })
 *
 *   return (
 *     <div>
 *       <ul>
 *         {data?.items.map((item) => (
 *           <li key={item.id}>{item.name}</li>
 *         ))}
 *       </ul>
 *       <button onClick={() => setPage(page + 1)}>다음</button>
 *     </div>
 *   )
 * }
 * ```
 */
export async function getExampleList(
  params: ExampleListRequest = {}
): Promise<ApiResponse<ExampleListResponse>> {
  const { page = 1, limit = 10, search = '' } = params

  // Mock 지연
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Mock 데이터
  const mockItems = Array.from({ length: limit }, (_, i) => ({
    id: `${page}-${i}`,
    name: `Example ${page}-${i}`,
    createdAt: new Date().toISOString(),
  }))

  return {
    success: true,
    data: {
      items: mockItems,
      total: 100,
      page,
      limit,
    },
  }

  // 실제 API (TODO)
  // try {
  //   const queryParams = new URLSearchParams({
  //     page: String(page),
  //     limit: String(limit),
  //     ...(search && { search }),
  //   })
  //
  //   const response = await fetch(`/api/example?${queryParams}`, {
  //     method: 'GET',
  //     headers: {
  //       // Authorization: `Bearer ${getAuthToken()}`,
  //     },
  //   })
  //   const data = await response.json()
  //   return data as ApiResponse<ExampleListResponse>
  // } catch (error) {
  //   return {
  //     success: false,
  //     error: {
  //       code: 'NETWORK_ERROR',
  //       message: '네트워크 오류가 발생했습니다',
  //     },
  //   }
  // }
}
