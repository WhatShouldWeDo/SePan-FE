import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/Sidebar"
import { Header } from "@/components/Header"
import { NavigationProvider } from "@/contexts/NavigationContext"

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)

  return (
    <NavigationProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          isOpen={isMobileMenuOpen}
          isCollapsed={isSidebarCollapsed}
          onClose={() => setIsMobileMenuOpen(false)}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        />
        <div className="flex flex-1 flex-col">
          <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </NavigationProvider>
  )
}
