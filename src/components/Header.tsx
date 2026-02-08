import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b px-6 flex items-center justify-between bg-background">
      <div className="md:hidden">
        {/* TODO: 모바일 메뉴 버튼 */}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm text-muted-foreground">
            {user.name}님
          </span>
        )}
        <Button variant="ghost" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    </header>
  )
}
