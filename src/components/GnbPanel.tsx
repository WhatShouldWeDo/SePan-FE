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

  // 패널 열려있을 때 window 스크롤 감지 → 닫기
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
    /*
     * absolute: sticky 컨테이너 기준, top-full = GNB 바로 아래
     * z-index: -1 (sticky 컨테이너 내부 stacking context에서 Header 뒤)
     *   → translateY(-100%) 슬라이드 시 GNB 헤더가 패널을 덮음
     * overflow-hidden 없음 → CategoryNav의 SubcategoryPanel absolute 허용
     */
    <div
      className="absolute left-0 right-0 transition-transform duration-200 ease-out"
      style={{
        top: "100%",
        zIndex: -1,
        transform: isOpen ? "translateY(0)" : "translateY(-100%)",
      }}
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
