import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckmarkIcon } from "@/components/icons";

interface CheckMultipleProps extends React.ComponentProps<"span"> {
	/** 체크 여부 */
	checked?: boolean;
}

/**
 * CheckMultiple — Figma Select/Item/CheckMultiple
 * 다중선택용 원형 체크 표시기. 원형 배경 + 체크마크.
 */
function CheckMultiple({
	className,
	checked = false,
	...props
}: CheckMultipleProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center p-px",
				className,
			)}
			aria-hidden="true"
			{...props}
		>
			{/* Container (pill) */}
			<span
				className={cn(
					"flex items-center justify-center rounded-full p-px",
					checked ? "bg-primary" : "bg-[#E6E9EF]",
				)}
			>
				<CheckmarkIcon
					className={cn(
						"size-5",
						checked ? "text-white" : "text-[#B0B5BF]",
					)}
				/>
			</span>
		</span>
	);
}

export { CheckMultiple };
export type { CheckMultipleProps };
