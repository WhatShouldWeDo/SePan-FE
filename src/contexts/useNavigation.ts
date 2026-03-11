// src/contexts/useNavigation.ts
import { useContext, useEffect } from "react"
import { NavigationContext } from "./NavigationContext"
import { GnbPanelContext } from "./GnbPanelContext"
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

export function useGnbPanel() {
  const ctx = useContext(GnbPanelContext)
  if (!ctx) throw new Error("useGnbPanel must be used within GnbPanelProvider")

  // 마운트 시 "이 페이지는 패널을 가진다"고 등록
  useEffect(() => {
    ctx.setHasPanel(true)
    return () => {
      ctx.setHasPanel(false)
      ctx.setIsPanelOpen(false)
    }
  // ctx.setHasPanel / ctx.setIsPanelOpen은 안정적인 setState ref이므로 의존성 생략 안전
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    panelEl: ctx.panelEl,
    isPanelOpen: ctx.isPanelOpen,
  }
}
