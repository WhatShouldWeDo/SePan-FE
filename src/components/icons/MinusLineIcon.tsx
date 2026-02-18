import type { SVGProps } from "react"

/**
 * 가로 직선(—) 아이콘 — Checkbox indeterminate 상태에서 사용
 * Figma: Icon/Normal/Line Horizontal
 */
function MinusLineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 12H18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export { MinusLineIcon }
