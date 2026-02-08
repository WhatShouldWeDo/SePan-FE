import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { User } from "@/types/common"
import * as authApi from "../api/authApi"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface LoginResult {
  success: boolean
  error?: string
}

export function useAuth() {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
        return
      }

      const result = await authApi.getMe()
      if (result.success) {
        setState({
          user: result.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
      } else {
        localStorage.removeItem("auth_token")
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      setState((prev) => ({ ...prev, error: null }))

      const result = await authApi.login({ username, password })

      if (result.success) {
        localStorage.setItem("auth_token", result.data.token)
        setState({
          user: result.data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })
        navigate("/")
        return { success: true }
      }

      const errorMessage = result.error.message
      setState((prev) => ({ ...prev, error: errorMessage }))
      return { success: false, error: errorMessage }
    },
    [navigate]
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    localStorage.removeItem("auth_token")
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    navigate("/login")
  }, [navigate])

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }))
  }, [])

  return {
    ...state,
    login,
    logout,
    clearError,
  }
}
