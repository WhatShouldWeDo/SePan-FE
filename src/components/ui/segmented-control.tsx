import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SegmentedControlOption<T extends string> {
	value: T
	label: string
	icon?: ReactNode
}

interface SegmentedControlProps<T extends string> {
	options: SegmentedControlOption<T>[]
	value: T
	onChange: (value: T) => void
	className?: string
}

export function SegmentedControl<T extends string>({
	options,
	value,
	onChange,
	className,
}: SegmentedControlProps<T>) {
	return (
		<div
			className={cn(
				"inline-flex rounded-lg bg-fill-normal p-[3px] gap-[2px]",
				className,
			)}
		>
			{options.map((option) => {
				const isActive = option.value === value
				return (
					<button
						key={option.value}
						type="button"
						onClick={() => onChange(option.value)}
						className={cn(
							"inline-flex items-center gap-1.5 rounded-md px-3.5 min-h-11 py-1.5 text-label-4 transition-all",
							isActive
								? "bg-white font-semibold text-label-normal shadow-sm"
								: "bg-transparent font-medium text-label-alternative hover:text-label-neutral",
						)}
					>
						{option.icon && (
							<span className="flex-shrink-0">{option.icon}</span>
						)}
						{option.label}
					</button>
				)
			})}
		</div>
	)
}
