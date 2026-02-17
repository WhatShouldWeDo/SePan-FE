import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import type { User } from "@/types/common"
import { useApiQuery } from "@/lib/api/hooks"
import * as authApi from "../api/authApi"

/** React Query 캐시 키 — 외부에서 queryClient.setQueryData 시 사용 */
export const AUTH_QUERY_KEY = ["auth", "me"] as const

interface LoginResult {
  success: boolean
  error?: string
}

/**
 * 인증 상태 관리 훅 (React Query 기반)
 *
 * - getMe() 쿼리로 인증 상태 자동 관리
 * - login/logout 시 queryClient.setQueryData로 캐시 직접 갱신
 * - localStorage에 token 존재할 때만 getMe() 호출 (enabled 조건)
 */
export function useAuth() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading,
    error,
  } = useApiQuery<User>({
    queryKey: [...AUTH_QUERY_KEY],
    queryFn: () => authApi.getMe(),
    enabled: !!localStorage.getItem("auth_token"),
    staleTime: Infinity,
    retry: false,
    showErrorToast: false,
  })

  const isAuthenticated = !!user

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      const result = await authApi.login({ username, password })

      if (result.success) {
        localStorage.setItem("auth_token", result.data.token)
        queryClient.setQueryData([...AUTH_QUERY_KEY], result.data.user)
        navigate("/")
        return { success: true }
      }

      return { success: false, error: result.error.message }
    },
    [navigate, queryClient],
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    localStorage.removeItem("auth_token")
    queryClient.setQueryData([...AUTH_QUERY_KEY], null)
    queryClient.removeQueries({ queryKey: [...AUTH_QUERY_KEY] })
    navigate("/login")
  }, [navigate, queryClient])

  const clearError = useCallback(() => {
    queryClient.resetQueries({ queryKey: [...AUTH_QUERY_KEY] })
  }, [queryClient])

  return {
    user: user ?? null,
    isAuthenticated,
    isLoading,
    error: error?.message ?? null,
    login,
    logout,
    clearError,
  }
}
