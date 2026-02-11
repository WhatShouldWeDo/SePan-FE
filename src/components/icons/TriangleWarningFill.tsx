import type { SVGProps } from "react"

function TriangleWarningFill(props: SVGProps<SVGSVGElement>) {
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
				d="M10.2348 3.8284C10.9961 2.45498 12.9999 2.45498 13.7612 3.8284L21.6908 18.1284C22.4116 19.4274 21.4542 21 19.9277 21H4.06833C2.54183 21 1.58443 19.4274 2.30523 18.1284L10.2348 3.8284ZM12.9 16C12.9 16.4971 12.4971 16.9 12 16.9C11.5029 16.9 11.1 16.4971 11.1 16C11.1 15.5029 11.5029 15.1 12 15.1C12.4971 15.1 12.9 15.5029 12.9 16ZM12 8.1C12.4971 8.1 12.9 8.50294 12.9 9V13C12.9 13.4971 12.4971 13.9 12 13.9C11.5029 13.9 11.1 13.4971 11.1 13V9C11.1 8.50294 11.5029 8.1 12 8.1Z"
				fill="currentColor"
			/>
		</svg>
	)
}

export { TriangleWarningFill }
