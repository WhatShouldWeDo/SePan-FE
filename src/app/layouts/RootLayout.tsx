// src/app/layouts/RootLayout.tsx
import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { GnbPanel } from "@/components/GnbPanel"
import { NavigationProvider } from "@/contexts/NavigationContext"
import { GnbPanelProvider } from "@/contexts/GnbPanelContext"

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  return (
    <NavigationProvider>
      <GnbPanelProvider>
        <div className="flex min-h-screen bg-background">
          {/* Sidebar: 내부적으로 z-40/z-50 관리 (fixed 엘리먼트는 부모 z-index 무시) */}
          <Sidebar
            isOpen={isMobileMenuOpen}
            isCollapsed={isSidebarCollapsed}
            onClose={() => setIsMobileMenuOpen(false)}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
          <div className="flex flex-1 flex-col min-w-0">
            {/* sticky 컨테이너: GNB + 패널을 하나의 sticky 단위로 묶음 */}
            <div className="sticky top-0 z-30">
              <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
              <GnbPanel />
            </div>
            <main className="flex-1 p-4 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </GnbPanelProvider>
    </NavigationProvider>
  )
}
