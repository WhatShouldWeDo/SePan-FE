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

  // 드롭다운 외부 클릭 시 닫기 (Fix 3: pointerdown for cross-platform)
  useEffect(() => {
    function handleClickOutside(e: PointerEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    if (isDropdownOpen) {
      document.addEventListener("pointerdown", handleClickOutside)
    }
    return () => document.removeEventListener("pointerdown", handleClickOutside)
  }, [isDropdownOpen])

  // Fix 2: Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsDropdownOpen(false)
    }
    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }
    return () => document.removeEventListener("keydown", handleKeyDown)
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

        {/* Fix 6: 브레드크럼 — breadcrumbs가 있을 때만 nav 렌더 */}
        {breadcrumbs.length > 0 && (
          <nav aria-label="현재 위치" className="flex items-center gap-1.5">
            {/* Fix 4: key={item.label} instead of key={index} */}
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <span key={item.label} className="flex items-center gap-1.5">
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
        )}
      </div>

      {/* 우측: 아바타 + 드롭다운 */}
      <div className="relative" ref={dropdownRef}>
        {/* Fix 1: 44px touch target wrapping 32px visual circle */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          aria-label="사용자 메뉴"
          aria-expanded={isDropdownOpen}
          aria-haspopup="menu"
          aria-controls="user-menu-dropdown"
          className="size-11 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span className="size-8 rounded-full bg-fill-normal border border-line-neutral flex items-center justify-center text-sm font-bold text-label-alternative hover:bg-fill-strong transition-colors">
            {initials}
          </span>
        </button>

        {isDropdownOpen && (
          /* Fix 5: role="menu" + id on dropdown */
          <div
            role="menu"
            id="user-menu-dropdown"
            className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[152px] rounded-[10px] border border-line-neutral bg-white shadow-sm py-2"
          >
            {user && (
              <>
                <div className="px-4 py-2 text-sm font-semibold text-label-normal">
                  {user.name}님
                </div>
                <div className="my-1 h-px bg-fill-normal" />
              </>
            )}
            {/* Fix 5: role="menuitem" on logout button */}
            <button
              type="button"
              role="menuitem"
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
