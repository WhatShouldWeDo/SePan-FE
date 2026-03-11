// src/contexts/GnbPanelContext.tsx
import { createContext, useMemo, useState } from "react"

export interface GnbPanelContextValue {
  /** GnbPanel이 마운트 후 등록하는 portal 타겟 DOM 엘리먼트 */
  panelEl: HTMLElement | null
  setPanelEl: (el: HTMLElement | null) => void
  /** 현재 패널이 열려있는지 */
  isPanelOpen: boolean
  setIsPanelOpen: (v: boolean) => void
  /** 현재 페이지가 패널을 등록했는지 (Chevron 표시 여부) */
  hasPanel: boolean
  setHasPanel: (v: boolean) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const GnbPanelContext = createContext<GnbPanelContextValue | null>(null)

export function GnbPanelProvider({ children }: { children: React.ReactNode }) {
  const [panelEl, setPanelEl] = useState<HTMLElement | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [hasPanel, setHasPanel] = useState(false)

  const value = useMemo(
    () => ({ panelEl, setPanelEl, isPanelOpen, setIsPanelOpen, hasPanel, setHasPanel }),
    [panelEl, isPanelOpen, hasPanel],
  )

  return (
    <GnbPanelContext.Provider value={value}>
      {children}
    </GnbPanelContext.Provider>
  )
}
