import { Link } from "react-router-dom"
import { Zap } from "lucide-react"
import { LoginForm } from "@/features/auth/components/LoginForm"

export function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* 좌측 Primary 배경 영역 */}
      <div className="hidden bg-primary lg:block lg:w-[62.5%]" />

      {/* 우측 폼 영역 */}
      <div className="flex w-full items-center justify-center p-6 sm:p-10 lg:w-[37.5%] lg:p-[120px]">
        <div className="flex w-full max-w-[480px] flex-col gap-[50px]">
          {/* Header Section */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-7">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-tight text-primary">
                  DEMOCRA:SEE
                </span>
                <Zap className="size-6 fill-primary text-primary" />
              </div>

              {/* Title */}
              <h1 className="text-[34px] font-bold leading-[1.3] text-black">
                로그인
              </h1>
            </div>

            {/* Login Form */}
            <LoginForm />
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col gap-6">
            {/* 회원가입 링크 */}
            <div className="flex items-center justify-center gap-3">
              <span className="text-[18px] font-medium leading-[1.3] text-label-alternative">
                계정이 없으신가요?
              </span>
              <Link
                to="/signup"
                className="text-[18px] font-semibold leading-[1.3] text-primary-strong hover:underline"
              >
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
