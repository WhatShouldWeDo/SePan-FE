import * as React from "react";

import { cn } from "@/lib/utils";

interface RadioProps extends Omit<React.ComponentProps<"button">, "type"> {
	/** 선택 여부 */
	checked?: boolean;
	/** md (24px) | sm (20px) */
	size?: "md" | "sm";
	/** 비활성화 */
	disabled?: boolean;
	/** 선택 콜백 */
	onCheckedChange?: (checked: boolean) => void;
}

/**
 * Radio — Figma Select/Item/Radio
 * 원형 라디오 버튼. RadioGroup과 별도로 단독 사용 가능.
 */
function Radio({
	className,
	checked = false,
	size = "md",
	disabled = false,
	onCheckedChange,
	...props
}: RadioProps) {
	const isMd = size === "md";
	const boxSize = isMd ? 20 : 16;
	const dotPadding = isMd ? 2 : 1;

	const handleClick = () => {
		if (disabled) return;
		onCheckedChange?.(!checked);
	};

	return (
		<button
			type="button"
			role="radio"
			aria-checked={checked}
			aria-disabled={disabled || undefined}
			disabled={disabled}
			className={cn(
				"relative inline-flex items-center justify-center p-[2px]",
				disabled && "opacity-[0.43] pointer-events-none",
				className,
			)}
			onClick={handleClick}
			{...props}
		>
			{/* Box */}
			<span
				className="flex shrink-0 items-center justify-center rounded-full"
				style={{
					width: boxSize,
					height: boxSize,
					borderWidth: 1.5,
					borderStyle: "solid",
					borderColor: checked
						? "var(--primary)"
						: "var(--line-normal)",
					backgroundColor: checked ? "var(--primary)" : "transparent",
					padding: checked ? dotPadding : 0,
				}}
			>
				{/* Inner dot */}
				{checked && (
					<span
						className="block size-full rounded-full"
						style={{ backgroundColor: "#fff" }}
						aria-hidden="true"
					/>
				)}
			</span>
		</button>
	);
}

export { Radio };
export type { RadioProps };
