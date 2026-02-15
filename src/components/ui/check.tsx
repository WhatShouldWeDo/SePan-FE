import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckmarkIcon } from "@/components/icons";

interface CheckProps extends React.ComponentProps<"span"> {
	/** 체크 여부 */
	checked?: boolean;
	/** md (24px) | sm (20px) */
	size?: "md" | "sm";
	/** 비활성화 */
	disabled?: boolean;
}

/**
 * Check — Figma Select/Item/Check
 * "낮은 위계로 활성화 여부를 제어할 때 사용합니다."
 * 배경 없이 체크마크만 표시하는 경량 선택 표시기.
 */
function Check({
	className,
	checked = false,
	size = "md",
	disabled = false,
	...props
}: CheckProps) {
	const isMd = size === "md";

	return (
		<span
			className={cn(
				"relative inline-flex items-center justify-center",
				isMd ? "size-6" : "size-5",
				disabled && "opacity-[0.43] pointer-events-none",
				className,
			)}
			aria-hidden="true"
			{...props}
		>
			<CheckmarkIcon
				className={cn(
					"size-full",
					checked ? "text-label-strong" : "text-label-assistive",
				)}
			/>
		</span>
	);
}

export { Check };
export type { CheckProps };
