import { Link, useLocation } from "react-router-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  { href: "/", label: "대시보드", icon: "🏠" },
  { href: "/region", label: "지역분석", icon: "📊" },
  { href: "/policy", label: "정책개발", icon: "📝" },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  const handleNavClick = () => {
    // 모바일에서 네비게이션 클릭 시 사이드바 닫기
    onClose()
  }

  const sidebarContent = (
    <>
      <div className="p-6 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold" onClick={handleNavClick}>
          Democrasee
        </Link>
        {/* 모바일에서만 닫기 버튼 표시 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="메뉴 닫기"
          className="md:hidden size-11"
        >
          <X className="size-6" />
        </Button>
      </div>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium transition-colors min-h-[44px]",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside className="w-64 border-r bg-sidebar text-sidebar-foreground hidden md:block">
        {sidebarContent}
      </aside>

      {/* 모바일 오버레이 사이드바 */}
      {/* 배경 오버레이 - 페이드 애니메이션 */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ease-in-out",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* 사이드바 패널 - 슬라이드 애니메이션 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar text-sidebar-foreground md:hidden",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
