import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { loginSchema, type LoginFormData } from "../schemas/loginSchema"
import { useAuth } from "../hooks/useAuth"

export function LoginForm() {
  const { login } = useAuth()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    const result = await login(data.username, data.password)
    if (!result.success && result.error) {
      setServerError(result.error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 p-3 text-sm text-destructive"
        >
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">아이디</Label>
        <Input
          id="username"
          type="text"
          placeholder="아이디를 입력하세요"
          autoComplete="username"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
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
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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
