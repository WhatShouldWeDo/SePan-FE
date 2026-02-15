import type { SVGProps } from "react"

/**
 * 체크마크(✓) 아이콘 — Select/Item/Check, Checkbox, CheckMultiple에서 사용
 * Figma: Icon/Normal/Check (가중치 0.75 적용)
 */
function CheckmarkIcon(props: SVGProps<SVGSVGElement>) {
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
        d="M5.5 12.5L10 17L18.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { CheckmarkIcon }
