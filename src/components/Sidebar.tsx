import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DuoHome,
  DuoChartPie,
  DuoBookOpen,
  DuoBinocular,
  DuoAddressBook,
  WantedSetting,
  WantedCrown,
} from "@/components/icons"
import type { SVGProps, ComponentType } from "react"

/* ─── Types ─── */

interface NavItem {
  href: string | null // null = 비활성 (연결 페이지 없음)
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}

interface SidebarProps {
  isOpen: boolean
  isCollapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

/* ─── Navigation Items ─── */

const mainNavItems: NavItem[] = [
  { href: "/", label: "대시보드", icon: DuoHome },
  { href: "/region", label: "지역분석", icon: DuoChartPie },
  { href: "/pledges", label: "역대공약분석", icon: DuoBookOpen },
  { href: "/policy", label: "정책개발", icon: DuoBinocular },
  { href: null, label: "주소록", icon: DuoAddressBook },
]

const utilityNavItems: NavItem[] = [
  { href: null, label: "설정", icon: WantedSetting },
  { href: null, label: "프리미엄", icon: WantedCrown },
]

/* ─── SidebarNavItem ─── */

function SidebarNavItem({
  item,
  isActive,
  isCollapsed,
}: {
  item: NavItem
  isActive: boolean
  isCollapsed: boolean
}) {
  const disabled = item.href === null
  const Icon = item.icon

  const content = (
    <div
      className={cn(
        "group/nav relative flex items-center gap-2 rounded-[12px] px-5 py-3.5",
        "min-h-[44px] min-w-[44px]",
        disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer",
      )}
    >
      {/* Hover/Active overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[12px] bg-label-inverse-48 transition-opacity",
          isActive && !disabled
            ? "opacity-100"
            : "opacity-0",
          !disabled && !isActive && "group-hover/nav:opacity-100",
        )}
      />

      {/* Icon */}
      <Icon className="relative z-10 size-6 shrink-0 text-label-inverse" />

      {/* Label (펼친 상태에서만 표시) */}
      {!isCollapsed && (
        <span className="relative z-10 whitespace-nowrap text-label-3 font-semibold text-label-inverse">
          {item.label}
        </span>
      )}
    </div>
  )

  if (disabled) {
    return content
  }

  return (
    <Link to={item.href!} className="outline-none">
      {content}
    </Link>
  )
}

/* ─── Sidebar ─── */

export function Sidebar({
  isOpen,
  isCollapsed,
  onClose,
  onToggleCollapse,
}: SidebarProps) {
  const location = useLocation()

  function isItemActive(item: NavItem) {
    if (item.href === null) return false
    if (item.href === "/") return location.pathname === "/"
    return location.pathname.startsWith(item.href)
  }

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between px-2 py-6">
      {/* Top */}
      <div className="flex flex-col gap-3">
        {/* 햄버거 메뉴 버튼 */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "flex min-h-[44px] min-w-[44px] items-center rounded-[12px] px-4",
            "cursor-pointer text-label-inverse outline-none transition-opacity hover:opacity-80",
          )}
          aria-label={isCollapsed ? "메뉴 펼치기" : "메뉴 접기"}
        >
          <Menu className="size-8" />
        </button>

        {/* 네비게이션 목록 */}
        <nav className="flex flex-col gap-1 py-6">
          {mainNavItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              isActive={isItemActive(item)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-6">
        {/* Divider */}
        <hr className="border-line-normal" />

        {/* 유틸리티 아이템 */}
        <nav className="flex flex-col gap-1">
          {utilityNavItems.map((item) => (
            <SidebarNavItem
              key={item.label}
              item={item}
              isActive={isItemActive(item)}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        {/* 로고 (펼친 상태에서만 표시) */}
        {!isCollapsed && (
          <div className="px-4">
            <span className="text-label-3 font-bold text-label-inverse">
              DemocraSee
            </span>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <aside
        className={cn(
          "hidden overflow-hidden bg-primary-heavy transition-[width] duration-300 ease-in-out md:block",
          "sticky top-0 h-screen",
          isCollapsed ? "w-20" : "w-[280px]",
        )}
      >
        {sidebarContent}
      </aside>

      {/* 모바일 오버레이 */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ease-in-out md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 모바일 사이드바 패널 (항상 펼친 상태) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] bg-primary-heavy transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col justify-between px-2 py-6">
          {/* Top */}
          <div className="flex flex-col gap-3">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] items-center rounded-[12px] px-4 cursor-pointer text-label-inverse outline-none transition-opacity hover:opacity-80"
              aria-label="메뉴 닫기"
            >
              <Menu className="size-8" />
            </button>

            {/* 네비게이션 목록 */}
            <nav className="flex flex-col gap-1 py-6">
              {mainNavItems.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  isActive={isItemActive(item)}
                  isCollapsed={false}
                />
              ))}
            </nav>
          </div>

          {/* Bottom */}
          <div className="flex flex-col gap-6">
            <hr className="border-line-normal" />
            <nav className="flex flex-col gap-1">
              {utilityNavItems.map((item) => (
                <SidebarNavItem
                  key={item.label}
                  item={item}
                  isActive={isItemActive(item)}
                  isCollapsed={false}
                />
              ))}
            </nav>
            <div className="px-4">
              <span className="text-label-3 font-bold text-label-inverse">
                DemocraSee
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
