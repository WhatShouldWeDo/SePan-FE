import { useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "manager" | "accountant" | "staff"
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// TODO: 실제 API 연동 시 교체
const MOCK_USER: User = {
  id: "1",
  name: "홍길동",
  email: "hong@example.com",
  role: "candidate",
}

export function useAuth() {
  const navigate = useNavigate()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // 초기 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      // TODO: 토큰 유효성 검증 API 호출
      setState({
        user: MOCK_USER,
        isAuthenticated: true,
        isLoading: false,
      })
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    // TODO: 실제 로그인 API 호출
    console.log("Login attempt:", { username, password })

    // Mock 로그인
    localStorage.setItem("auth_token", "mock_token")
    setState({
      user: MOCK_USER,
      isAuthenticated: true,
      isLoading: false,
    })
    navigate("/")
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token")
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    navigate("/login")
  }, [navigate])

  return {
    ...state,
    login,
    logout,
  }
}
