// src/contexts/NavigationContext.tsx
import { createContext, useMemo, useState } from "react"

export interface BreadcrumbItem {
  label: string
}

export interface NavigationContextValue {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const NavigationContext = createContext<NavigationContextValue | null>(null)

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const value = useMemo(
    () => ({ breadcrumbs, setBreadcrumbs }),
    [breadcrumbs]
  )
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}
