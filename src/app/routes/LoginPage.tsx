import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/features/auth/components/LoginForm"

export function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>
          계정에 로그인하여 서비스를 이용하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="mt-4 text-center text-sm">
          계정이 없으신가요?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
