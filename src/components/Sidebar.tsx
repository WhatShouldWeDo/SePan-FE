import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "대시보드", icon: "🏠" },
  { href: "/region", label: "지역분석", icon: "📊" },
  { href: "/policy", label: "정책개발", icon: "📝" },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 border-r bg-sidebar text-sidebar-foreground hidden md:block">
      <div className="p-6">
        <Link to="/" className="text-xl font-bold">
          Democrasee
        </Link>
      </div>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href ||
            (item.href !== "/" && location.pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
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
    </aside>
  )
}
