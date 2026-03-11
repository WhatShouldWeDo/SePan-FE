// src/contexts/NavigationContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export interface BreadcrumbItem {
  label: string
}

interface NavigationContextValue {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

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

export function useBreadcrumb(items: BreadcrumbItem[]) {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error("useBreadcrumb must be used within NavigationProvider")

  // items 배열을 안정적으로 비교하기 위해 JSON 직렬화 사용
  const serialized = JSON.stringify(items)

  useEffect(() => {
    ctx.setBreadcrumbs(items)
    return () => {
      // 페이지 언마운트 시 초기화
      ctx.setBreadcrumbs([])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialized])
}

export function useNavigation() {
  const ctx = useContext(NavigationContext)
  if (!ctx) throw new Error("useNavigation must be used within NavigationProvider")
  return ctx
}
