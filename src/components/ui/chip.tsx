import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChipProps extends Omit<React.ComponentProps<"button">, "type"> {
	/** 칩 라벨 텍스트 */
	label: string;
	/** 칩 크기 */
	size?: "large" | "medium" | "small";
	/** 선택 상태 (default: 미선택, active: 값이 적용됨, disabled) */
	state?: "default" | "active" | "disabled";
	/** 비주얼 변형 */
	variant?: "outlined" | "solid";
	/** 서브 라벨 (예: "항목") — 라벨 앞에 표시 */
	subLabel?: string;
	/** 선택 개수 라벨 (예: "1") — active 상태에서 라벨 뒤에 표시 */
	unitLabel?: string;
	/** 패널/드롭다운 열림 상태 (Caret 방향 제어) */
	isOpen?: boolean;
}

/* ── 사이즈별 치수 ── */
const SIZE_CONFIG = {
	large: {
		padding: { paddingLeft: 12, paddingRight: 10, paddingTop: 10, paddingBottom: 10 },
		rounded: 10,
		fontSize: 18,
		iconSize: 16,
		wrapperGap: 6,
	},
	medium: {
		padding: { paddingLeft: 12, paddingRight: 10, paddingTop: 9, paddingBottom: 9 },
		rounded: 10,
		fontSize: 16,
		iconSize: 16,
		wrapperGap: 4,
	},
	small: {
		padding: { paddingLeft: 10, paddingRight: 8, paddingTop: 7, paddingBottom: 7 },
		rounded: 8,
		fontSize: 14,
		iconSize: 14,
		wrapperGap: 2,
	},
} as const;

/** border/background 스타일 결정 (inline style — twMerge 충돌 방지) */
function getContainerStyle(
	state: NonNullable<ChipProps["state"]>,
	variant: NonNullable<ChipProps["variant"]>,
	rounded: number,
): React.CSSProperties {
	const base: React.CSSProperties = { borderRadius: rounded };

	if (state === "disabled") {
		return {
			...base,
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: "var(--interaction-disabled)",
			backgroundColor: "transparent",
		};
	}

	if (state === "active" && variant === "outlined") {
		return {
			...base,
			borderWidth: 1,
			borderStyle: "solid",
			borderColor: "var(--primary-alpha-50)",
			backgroundColor: "var(--primary-alpha-5)",
		};
	}

	if (state === "active" && variant === "solid") {
		return {
			...base,
			borderWidth: 0,
			backgroundColor: "var(--surface-inverse)",
		};
	}

	// default (outlined & solid 동일)
	return {
		...base,
		borderWidth: 1,
		borderStyle: "solid",
		borderColor: "var(--line-neutral)",
		backgroundColor: "transparent",
	};
}

/** 텍스트/아이콘 색상 결정 */
function getTextColor(
	state: NonNullable<ChipProps["state"]>,
	variant: NonNullable<ChipProps["variant"]>,
): string {
	if (state === "disabled") return "var(--label-disabled)";
	if (state === "active" && variant === "outlined") return "var(--primary)";
	if (state === "active" && variant === "solid") return "var(--label-inverse)";
	return "var(--label-normal)";
}

function Chip({
	className,
	label,
	size = "large",
	state = "default",
	variant = "outlined",
	subLabel,
	unitLabel,
	isOpen = false,
	disabled,
	...buttonProps
}: ChipProps) {
	const isDisabled = state === "disabled" || disabled;
	const config = SIZE_CONFIG[size];
	const containerStyle = getContainerStyle(state, variant, config.rounded);
	const textColor = getTextColor(state, variant);

	const hasMultipleLabels = !!subLabel || (state === "active" && !!unitLabel);

	return (
		<button
			type="button"
			className={cn(
				"relative inline-flex cursor-pointer items-center justify-center transition-colors",
				isDisabled && "pointer-events-none cursor-not-allowed",
				className,
			)}
			style={{
				...containerStyle,
				...config.padding,
				color: textColor,
			}}
			disabled={isDisabled}
			aria-expanded={isOpen}
			{...buttonProps}
		>
			{/* Content */}
			<span className="flex items-center self-stretch">
				{/* Wrapper: labels */}
				<span
					className="flex items-center px-0.5 font-semibold leading-[1.3]"
					style={{
						fontSize: config.fontSize,
						gap: hasMultipleLabels ? config.wrapperGap : 0,
					}}
				>
					{subLabel && (
						<span style={{ color: "var(--label-alternative)" }}>
							{subLabel}
						</span>
					)}
					<span>{label}</span>
					{state === "active" && unitLabel && <span>{unitLabel}</span>}
				</span>

				{/* Trailing: Caret icon */}
				<span className="flex items-center justify-center py-[3px]">
					<ChevronDown
						style={{
							width: config.iconSize,
							height: config.iconSize,
							transition: "transform 200ms ease",
							transform: isOpen ? "rotate(180deg)" : "none",
						}}
						aria-hidden="true"
					/>
				</span>
			</span>
		</button>
	);
}

export { Chip };
export type { ChipProps };
