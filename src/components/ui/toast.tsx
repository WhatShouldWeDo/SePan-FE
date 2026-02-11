import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
	CircleCheckFill,
	CircleExclamationFill,
	TriangleWarningFill,
} from "@/components/icons"

const toastVariants = cva(
	"flex w-full items-center gap-2 rounded-xl px-4 py-3",
	{
		variants: {
			variant: {
				info: "bg-background-alt",
				error: "bg-status-negative-bg",
				success: "bg-status-positive-bg",
			},
		},
		defaultVariants: {
			variant: "info",
		},
	},
)

const iconMap = {
	info: CircleExclamationFill,
	error: TriangleWarningFill,
	success: CircleCheckFill,
} as const

const iconColorMap = {
	info: "text-label-neutral",
	error: "text-status-negative",
	success: "text-status-positive",
} as const

function Toast({
	variant = "info",
	className,
	children,
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof toastVariants>) {
	const Icon = iconMap[variant!]

	return (
		<div
			role="status"
			className={cn(toastVariants({ variant }), className)}
			{...props}
		>
			<Icon
				className={cn("size-6 shrink-0", iconColorMap[variant!])}
				aria-hidden="true"
			/>
			<span className="text-label-4 font-semibold tracking-[-0.5px] text-label-normal">
				{children}
			</span>
		</div>
	)
}

export { Toast, toastVariants }
