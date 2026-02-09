import { Menu } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between bg-background">
      <div className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="메뉴 열기"
          className="size-11"
        >
          <Menu className="size-6" />
        </Button>
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
