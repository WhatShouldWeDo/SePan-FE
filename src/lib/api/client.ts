// API 클라이언트 - fetch 기반

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api"

export class ApiClientError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = "ApiClientError"
    this.status = status
    this.code = code
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown
}

function getAuthToken(): string | null {
  return localStorage.getItem("auth_token")
}

export async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers: customHeaders, ...restOptions } = options

  const headers: HeadersInit = {
    ...customHeaders,
  }

  // body가 있고 FormData가 아닌 경우에만 Content-Type 설정
  // FormData는 브라우저가 boundary를 포함한 Content-Type을 자동 설정
  if (body && !(body instanceof FormData)) {
    ;(headers as Record<string, string>)["Content-Type"] = "application/json"
  }

  // 인증 토큰 자동 첨부
  const token = getAuthToken()
  if (token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  }

  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, config)

  if (!response.ok) {
    // 401 Unauthorized → 토큰 클리어 및 로그인 리다이렉트
    if (response.status === 401) {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("refresh_token")
      window.location.href = "/login"
      throw new ApiClientError("인증이 만료되었습니다", 401, "UNAUTHORIZED")
    }

    let errorMessage = "요청 처리 중 오류가 발생했습니다"
    let errorCode: string | undefined

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorMessage
      errorCode = errorData.code
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }

    throw new ApiClientError(errorMessage, response.status, errorCode)
  }

  // 204 No Content 처리
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// HTTP 메서드 헬퍼
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
}
