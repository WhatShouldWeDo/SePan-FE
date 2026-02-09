import { Outlet } from "react-router-dom"

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-4 sm:px-6">
        <Outlet />
      </div>
    </div>
  )
}
