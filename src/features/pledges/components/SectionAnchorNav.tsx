import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

interface Section {
  id: string
  label: string
  ref: React.RefObject<HTMLDivElement | null>
}

interface SectionAnchorNavProps {
  sections: Section[]
}

export function SectionAnchorNav({ sections }: SectionAnchorNavProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "")
  const sectionsRef = useRef(sections)
  sectionsRef.current = sections

  useEffect(() => {
    const elements = sectionsRef.current
      .map((s) => s.ref.current)
      .filter(Boolean) as HTMLDivElement[]

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-50% 0px" },
    )

    for (const el of elements) {
      observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  function handleClick(section: Section) {
    section.ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-10 bg-background">
      <div className="flex">
        {sections.map((section) => {
          const isActive = activeId === section.id

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => handleClick(section)}
              className={cn(
                "relative flex h-11 flex-1 items-center justify-center text-title-4 font-bold transition-colors",
                isActive
                  ? "text-label-normal"
                  : "text-label-assistive hover:text-label-neutral",
              )}
            >
              {section.label}
              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-label-normal" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
