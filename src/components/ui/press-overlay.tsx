import { cn } from "@/lib/utils"

type PressOverlayVariant = "default" | "light"

interface PressOverlayProps {
	variant?: PressOverlayVariant
	className?: string
}

/**
 * 인터랙션 오버레이 — 부모 요소에 hover/press 피드백을 제공합니다.
 * 부모에 `group relative` 클래스가 필요합니다.
 */
function PressOverlay({ variant = "default", className }: PressOverlayProps) {
	return (
		<span
			className={cn(
				"pointer-events-none absolute inset-0 rounded-[inherit] bg-label-alternative opacity-0 transition-opacity",
				variant === "default"
					? "group-hover:opacity-[0.08] group-active:opacity-[0.12]"
					: "group-hover:opacity-[0.05] group-active:opacity-[0.08]",
				className,
			)}
			aria-hidden="true"
		/>
	)
}

export { PressOverlay }
