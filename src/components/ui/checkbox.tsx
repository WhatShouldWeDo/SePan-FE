import * as React from "react";

import { cn } from "@/lib/utils";
import { CheckmarkIcon, MinusLineIcon } from "@/components/icons";

type CheckboxState = "unchecked" | "checked" | "indeterminate";

interface CheckboxProps extends Omit<React.ComponentProps<"button">, "type"> {
	/** unchecked | checked | indeterminate */
	state?: CheckboxState;
	/** md (24px) | sm (20px) */
	size?: "md" | "sm";
	/** 비활성화 상태 */
	disabled?: boolean;
	/** 상태 변경 콜백 */
	onStateChange?: (next: CheckboxState) => void;
}

/**
 * Checkbox — Figma Select/Item/Checkbox
 * "보통 위계로 활성화 여부를 제어할 때 사용합니다."
 */
function Checkbox({
	className,
	state = "unchecked",
	size = "md",
	disabled = false,
	onStateChange,
	...props
}: CheckboxProps) {
	const isCheckedOrIndeterminate = state !== "unchecked";

	const handleClick = () => {
		if (disabled) return;
		// indeterminate → checked, checked → unchecked, unchecked → checked
		const next: CheckboxState =
			state === "unchecked" ? "checked" : "unchecked";
		onStateChange?.(next);
	};

	const isMd = size === "md";
	// md: padding 3px, box 18px → total 24px
	// sm: padding 2px, box 16px → total 20px
	const iconSize = isMd ? "size-4" : "size-3.5"; // 16px / 14px

	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={state === "indeterminate" ? "mixed" : state === "checked"}
			aria-disabled={disabled || undefined}
			disabled={disabled}
			className={cn(
				"relative inline-flex items-center justify-center",
				isMd ? "p-[3px]" : "p-[2px]",
				disabled && "opacity-[0.43] pointer-events-none",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{/* Box */}
			<span
				className="flex shrink-0 items-center justify-center rounded-[5px]"
				style={{
					width: isMd ? 18 : 16,
					height: isMd ? 18 : 16,
					borderWidth: 1.5,
					borderStyle: "solid",
					borderColor: isCheckedOrIndeterminate
						? "var(--primary)"
						: "var(--line-normal)",
					backgroundColor: isCheckedOrIndeterminate
						? "var(--primary)"
						: "transparent",
				}}
			>
				{state === "checked" && (
					<CheckmarkIcon
						className={cn(iconSize, "text-white")}
						aria-hidden="true"
					/>
				)}
				{state === "indeterminate" && (
					<MinusLineIcon
						className={cn(iconSize, "text-white")}
						aria-hidden="true"
					/>
				)}
			</span>

			{/* Interaction overlay (press feedback) — non-disabled only */}
			{!disabled && (
				<span
					className="absolute inset-[-4px] rounded-[1000px] opacity-0 active:opacity-[0.08] transition-opacity"
					style={{
						backgroundColor: isCheckedOrIndeterminate
							? "var(--label-normal)"
							: "var(--label-normal)",
					}}
					aria-hidden="true"
				/>
			)}
		</button>
	);
}

export { Checkbox };
export type { CheckboxProps, CheckboxState };
