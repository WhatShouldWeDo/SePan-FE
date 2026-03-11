// src/components/Header.tsx
import { useState, useRef, useEffect } from "react"
import { Menu } from "lucide-react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/contexts/NavigationContext"

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { breadcrumbs } = useNavigation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  const initials = user?.name?.charAt(0) ?? "?"

  return (
    <header className="h-[52px] border-b border-line-neutral/50 bg-white/72 backdrop-blur-[12px] px-4 md:px-10 flex items-center justify-between shrink-0">
      {/* 좌측: 모바일 햄버거 + 브레드크럼 */}
      <div className="flex items-center gap-2">
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

        {/* 브레드크럼 */}
        <nav aria-label="현재 위치" className="flex items-center gap-1.5">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            return (
              <span key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <span
                    className="text-label-alternative text-sm font-bold select-none"
                    aria-hidden="true"
                  >
                    ›
                  </span>
                )}
                <span
                  className={
                    isLast
                      ? "text-label-strong text-base font-bold"
                      : "text-label-alternative text-base font-bold"
                  }
                >
                  {item.label}
                </span>
              </span>
            )
          })}
        </nav>
      </div>

      {/* 우측: 아바타 + 드롭다운 */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-label="사용자 메뉴"
          aria-expanded={isDropdownOpen}
          className="size-8 rounded-full bg-fill-normal border border-line-neutral flex items-center justify-center text-sm font-bold text-label-alternative hover:bg-fill-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {initials}
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[152px] rounded-[10px] border border-line-neutral bg-white shadow-sm py-2">
            {user && (
              <>
                <div className="px-4 py-2 text-sm font-semibold text-label-normal">
                  {user.name}님
                </div>
                <div className="my-1 h-px bg-fill-normal" />
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setIsDropdownOpen(false)
                logout()
              }}
              className="w-full px-4 py-2 text-left text-sm text-status-negative hover:bg-fill-normal transition-colors"
            >
              로그아웃
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
