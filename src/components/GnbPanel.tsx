// src/components/GnbPanel.tsx
import { useContext, useEffect, useLayoutEffect, useRef } from "react"
import { GnbPanelContext } from "@/contexts/GnbPanelContext"

export function GnbPanel() {
  const ctx = useContext(GnbPanelContext)
  const contentRef = useRef<HTMLDivElement>(null)

  // portal 타겟 DOM 노드 등록
  useLayoutEffect(() => {
    if (!ctx) return
    ctx.setPanelEl(contentRef.current)
    return () => ctx.setPanelEl(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 패널 열려있을 때 스크롤 감지 → 닫기
  useEffect(() => {
    if (!ctx?.isPanelOpen) return
    function handleScroll() {
      ctx!.setIsPanelOpen(false)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx?.isPanelOpen])

  if (!ctx) return null

  const isOpen = ctx.isPanelOpen

  return (
    <div
      // 닫힘: overflow-hidden으로 높이 0 클리핑
      // 열림: overflow-visible로 SubcategoryPanel(absolute) 노출 허용
      className={[
        "transition-[max-height] duration-200 ease-out",
        isOpen ? "overflow-visible" : "overflow-hidden",
      ].join(" ")}
      style={{ maxHeight: isOpen ? "500px" : "0px" }}
      aria-hidden={!isOpen}
    >
      {/* CategoryNav가 createPortal로 여기에 렌더됨 */}
      <div
        ref={contentRef}
        className="bg-background border-b border-line-neutral/50 shadow-sm"
      />
    </div>
  )
}
