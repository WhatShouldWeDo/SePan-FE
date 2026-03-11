import type { SVGProps } from "react"

export function DuoChartPie(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        opacity="0.3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.00246 12.2005L13 14V4.06189C16.9463 4.55399 20 7.92038 20 12C20 16.4183 16.4183 20 12 20C7.64875 20 4.10886 16.5261 4.00246 12.2005Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.0604 10.0121C3.54712 6.05992 6.91622 3 11 3V11.6L3.0604 10.0121Z"
        fill="currentColor"
      />
    </svg>
  )
}
