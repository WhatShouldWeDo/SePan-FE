import * as React from "react";

import { cn } from "@/lib/utils";

interface ChipTagProps extends Omit<React.ComponentProps<"button">, "type"> {
	/** 칩 라벨 텍스트 */
	label: string;
	/** 칩 모양: round(pill) / square(사각) */
	shape?: "round" | "square";
	/** 칩 크기 (xlarge는 round에서만 유효, square는 large로 fallback) */
	size?: "small" | "large" | "xlarge";
	/** 선택 상태 */
	state?: "default" | "active" | "disabled";
	/** 비주얼 변형 */
	variant?: "outlined" | "fullOutlined" | "solid";
	/** 라벨 앞 아이콘 슬롯 */
	leadingIcon?: React.ReactNode;
	/** 라벨 뒤 아이콘 슬롯 */
	trailingIcon?: React.ReactNode;
}

/* ── 사이즈별 치수 ── */
interface SizeConfig {
	paddingX: number;
	paddingY: number;
	rounded: number;
	fontSize: number;
	fontWeight: number;
	iconSize: number;
	gap: number;
}

const ROUND_SIZE_CONFIG: Record<string, SizeConfig> = {
	small: { paddingX: 10, paddingY: 7, rounded: 33, fontSize: 14, fontWeight: 500, iconSize: 14, gap: 2 },
	large: { paddingX: 14, paddingY: 8, rounded: 33, fontSize: 16, fontWeight: 600, iconSize: 16, gap: 3 },
	xlarge: { paddingX: 16, paddingY: 10, rounded: 33, fontSize: 18, fontWeight: 600, iconSize: 16, gap: 3 },
};

const SQUARE_SIZE_CONFIG: Record<string, SizeConfig> = {
	small: { paddingX: 10, paddingY: 8, rounded: 8, fontSize: 16, fontWeight: 600, iconSize: 14, gap: 2 },
	large: { paddingX: 12, paddingY: 10, rounded: 10, fontSize: 18, fontWeight: 600, iconSize: 16, gap: 3 },
};

/** border/background 스타일 결정 (inline style — twMerge 충돌 방지) */
function getContainerStyle(
	state: NonNullable<ChipTagProps["state"]>,
	variant: NonNullable<ChipTagProps["variant"]>,
	rounded: number,
): React.CSSProperties {
	const base: React.CSSProperties = { borderRadius: rounded };

	if (state === "disabled") {
		return {
			...base,
			backgroundColor: "var(--interaction-disabled)",
		};
	}

	if (state === "active") {
		if (variant === "fullOutlined") {
			return {
				...base,
				borderWidth: 1,
				borderStyle: "solid",
				borderColor: "var(--primary-alpha-50)",
				backgroundColor: "var(--primary-alpha-5)",
			};
		}
		// outlined + solid → 동일
		return {
			...base,
			backgroundColor: "var(--surface-inverse)",
		};
	}

	// default
	if (variant === "solid") {
		return {
			...base,
			backgroundColor: "var(--surface-primary)",
		};
	}

	// default + outlined / fullOutlined
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
	state: NonNullable<ChipTagProps["state"]>,
	variant: NonNullable<ChipTagProps["variant"]>,
): string {
	if (state === "disabled") return "var(--label-disabled)";
	if (state === "active" && variant === "fullOutlined") return "var(--primary)";
	if (state === "active") return "var(--label-inverse)";
	return "var(--label-alternative)";
}

function ChipTag({
	className,
	label,
	shape = "round",
	size = "small",
	state = "default",
	variant = "outlined",
	leadingIcon,
	trailingIcon,
	disabled,
	...buttonProps
}: ChipTagProps) {
	const isDisabled = state === "disabled" || disabled;

	// xlarge + square → large fallback
	const effectiveSize = shape === "square" && size === "xlarge" ? "large" : size;

	const sizeConfigs = shape === "round" ? ROUND_SIZE_CONFIG : SQUARE_SIZE_CONFIG;
	const config = sizeConfigs[effectiveSize];
	const containerStyle = getContainerStyle(state, variant, config.rounded);
	const textColor = getTextColor(state, variant);

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
				paddingLeft: config.paddingX,
				paddingRight: config.paddingX,
				paddingTop: config.paddingY,
				paddingBottom: config.paddingY,
				gap: config.gap,
				color: textColor,
			}}
			disabled={isDisabled}
			{...buttonProps}
		>
			{/* Content */}
			<span className="flex items-center self-stretch" style={{ gap: config.gap }}>
				{leadingIcon && (
					<span className="flex items-center justify-center py-[3px]">
						<span
							className="flex items-center justify-center"
							style={{ width: config.iconSize, height: config.iconSize }}
						>
							{leadingIcon}
						</span>
					</span>
				)}

				{/* Label */}
				<span
					className="flex items-center justify-center px-0.5 leading-[1.3]"
					style={{ fontSize: config.fontSize, fontWeight: config.fontWeight }}
				>
					{label}
				</span>

				{trailingIcon && (
					<span className="flex items-center justify-center py-[3px]">
						<span
							className="flex items-center justify-center"
							style={{ width: config.iconSize, height: config.iconSize }}
						>
							{trailingIcon}
						</span>
					</span>
				)}
			</span>
		</button>
	);
}

export { ChipTag };
export type { ChipTagProps };
