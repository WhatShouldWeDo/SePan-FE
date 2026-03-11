import type { SVGProps } from "react"

export function DuoAddressBook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        opacity="0.3"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 2H20C21.6569 2 23 3.34315 23 5V19C23 20.6569 21.6569 22 20 22H18V2Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 2H17C18.6569 2 20 3.34315 20 5V19C20 20.6569 18.6569 22 17 22H5C4.44771 22 4 21.5523 4 21V3C4 2.44771 4.44771 2 5 2ZM12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11ZM7.00036 16.4995C6.98863 16.662 7.26484 17 7.40417 17C11.4637 17 14.5228 17 16.5815 17C16.9988 17 17.0053 16.6222 16.9988 16.5C16.836 13.4332 14.6507 12 11.9907 12C9.36773 12 7.2157 13.5166 7.00036 16.4995Z"
        fill="currentColor"
      />
    </svg>
  )
}
