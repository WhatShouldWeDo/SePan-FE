import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function SignupPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>
          새 계정을 만들어 서비스를 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* TODO: SignupStepper 컴포넌트 추가 */}
        <p className="text-center text-muted-foreground">
          회원가입 폼이 여기에 표시됩니다
        </p>
        <div className="mt-4 text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="text-primary hover:underline">
            로그인
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
