import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        페이지를 찾을 수 없습니다
      </p>
      <Button asChild className="mt-6">
        <Link to="/">홈으로 돌아가기</Link>
      </Button>
    </div>
  )
}
