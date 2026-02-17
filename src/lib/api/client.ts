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
    "Content-Type": "application/json",
    ...customHeaders,
  }

  // 인증 토큰 자동 첨부
  const token = getAuthToken()
  if (token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }

  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, config)

  if (!response.ok) {
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
