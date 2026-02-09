/**
 * useApiMutation을 사용한 로그인 폼 마이그레이션 예시
 *
 * Before: useAuth + manual error handling
 * After: useApiMutation + automatic Toast
 */
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { loginSchema, type LoginFormData } from "@/features/auth/schemas/loginSchema"
import { login } from "@/features/auth/api/authApi"
import { useApiMutation } from "@/lib/api/hooks"

/**
 * Option 1: LoginForm에서 직접 useApiMutation 사용
 *
 * 장점:
 * - Toast 자동화 (에러 메시지 자동 표시)
 * - 코드 단순화 (serverError 상태 제거)
 * - React Query의 isPending, error 상태 활용
 *
 * 단점:
 * - 전역 인증 상태 관리는 별도로 필요 (Context 또는 Zustand)
 */
export function LoginFormWithApiMutation() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  // useApiMutation 사용 - Toast 자동화
  const { mutate: loginMutation, isPending } = useApiMutation({
    mutationFn: (data: LoginFormData) => login(data),
    // 에러 Toast는 자동으로 표시됨 (showErrorToast: true가 기본값)
    onSuccess: (data) => {
      // 토큰 저장
      localStorage.setItem("auth_token", data.token)
      // 사용자 정보는 전역 상태에 저장 (Context/Zustand)
      // 예: authStore.setUser(data.user)
      // 대시보드로 이동
      navigate("/")
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* serverError 표시 제거 - Toast로 자동 처리 */}

      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          type="text"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          disabled={isPending} {/* isSubmitting → isPending */}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? "username-error" : undefined}
          {...register("username")}
        />
        {errors.username && (
          <p id="username-error" className="text-sm text-destructive">
            {errors.username.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          autoComplete="current-password"
          disabled={isPending}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password && (
          <p id="password-error" className="text-sm text-destructive">
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full text-base"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Spinner size="sm" className="mr-2" />
            로그인 중...
          </>
        ) : (
          "로그인"
        )}
      </Button>
    </form>
  )
}

/**
 * Option 2: 회원가입에서 성공 Toast 사용 예시
 *
 * 특징:
 * - showSuccessToast: true로 성공 메시지 자동 표시
 * - successMessage로 커스텀 메시지 지정
 */
export function SignupFormExample() {
  const navigate = useNavigate()

  const { mutate: signupMutation, isPending } = useApiMutation({
    mutationFn: (data: SignupFormData) => signup(data),
    showSuccessToast: true, // 성공 Toast 표시
    successMessage: "회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.", // 커스텀 메시지
    onSuccess: () => {
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    },
  })

  // ... 나머지 구현
}

/**
 * Option 3: useApiQuery를 사용한 사용자 정보 조회 예시
 */
export function UserProfileExample() {
  const { data: user, isLoading, error } = useApiQuery({
    queryKey: ["user", "me"],
    queryFn: () => getMe(),
    // 에러 Toast는 자동으로 표시됨
  })

  if (isLoading) return <div>로딩 중...</div>
  if (error) return <div>에러 발생</div>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}

/**
 * Option 4: Toast 비활성화 (커스텀 에러 처리)
 */
export function CustomErrorHandlingExample() {
  const [customError, setCustomError] = useState<string | null>(null)

  const { mutate } = useApiMutation({
    mutationFn: (data: LoginFormData) => login(data),
    showErrorToast: false, // Toast 비활성화
    onError: (error) => {
      // 커스텀 에러 UI 표시
      setCustomError(error.message)
    },
  })

  return (
    <form>
      {customError && (
        <div className="custom-error-banner">{customError}</div>
      )}
      {/* ... */}
    </form>
  )
}

// 필요한 타입 import (예시)
import type { SignupFormData } from "@/features/auth/schemas/signupSchema"
import { signup } from "@/features/auth/api/authApi"
import { getMe } from "@/features/auth/api/authApi"
import { useState } from "react"
