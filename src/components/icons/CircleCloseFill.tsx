import type { SVGProps } from "react"

function CircleCloseFill(props: SVGProps<SVGSVGElement>) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.1 12C2.1 6.532 6.532 2.1 12 2.1c5.468 0 9.9 4.432 9.9 9.9 0 5.468-4.432 9.9-9.9 9.9C6.532 21.9 2.1 17.468 2.1 12Zm7.264-2.636a.9.9 0 0 0 0 1.272L10.728 12l-2.364 2.364a.9.9 0 1 0 1.272 1.272L12 13.272l2.364 2.364a.9.9 0 1 0 1.272-1.272L13.272 12l2.364-2.364a.9.9 0 0 0-1.272-1.272L12 10.728 9.636 8.364a.9.9 0 0 0-.272 1Z"
        fill="currentColor"
      />
    </svg>
  )
}

export { CircleCloseFill }
