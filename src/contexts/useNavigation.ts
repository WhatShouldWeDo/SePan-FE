// src/contexts/useNavigation.ts
import { useContext, useEffect } from "react"
import { NavigationContext } from "./NavigationContext"
import type { BreadcrumbItem } from "./NavigationContext"

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
