import * as React from "react";

import { cn } from "@/lib/utils";

interface SwitchProps extends Omit<React.ComponentProps<"button">, "type"> {
	/** On/Off */
	checked?: boolean;
	/** md (52×32) | sm (34×20) */
	size?: "md" | "sm";
	/** 비활성화 */
	disabled?: boolean;
	/** 토글 콜백 */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Switch — Figma Select/Item/Switch
 * 토글 스위치 컴포넌트.
 */
function Switch({
	className,
	checked = false,
	size = "md",
	disabled = false,
	onCheckedChange,
	...props
}: SwitchProps) {
	const isMd = size === "md";

	const trackWidth = isMd ? 52 : 34;
	const trackHeight = isMd ? 32 : 20;
	const thumbSize = isMd ? 24 : 14;
	const thumbMargin = isMd ? 4 : 3;

	const handleClick = () => {
		if (disabled) return;
		onCheckedChange?.(!checked);
	};

	return (
		<button
			type="button"
			role="switch"
			aria-checked={checked}
			aria-disabled={disabled || undefined}
			disabled={disabled}
			className={cn(
				"relative inline-flex shrink-0 items-center",
				disabled && "pointer-events-none opacity-[0.40]",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{/* Track */}
			<span
				className="inline-flex items-center transition-colors duration-200"
				style={{
					width: trackWidth,
					height: trackHeight,
					borderRadius: checked ? 30 : isMd ? 30 : 40,
					backgroundColor: checked
						? "var(--label-strong)"
						: "var(--fill-strong)",
				}}
			>
				{/* Thumb */}
				<span
					className="block rounded-full transition-transform duration-200"
					style={{
						width: thumbSize,
						height: thumbSize,
						marginLeft: thumbMargin,
						backgroundColor: "#fff",
						transform: checked
							? `translateX(${trackWidth - thumbSize - thumbMargin * 2}px)`
							: "translateX(0)",
						boxShadow: isMd
							? "0 2px 6px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.08)"
							: undefined,
					}}
					aria-hidden="true"
				/>
			</span>
		</button>
	);
}

export { Switch };
export type { SwitchProps };
