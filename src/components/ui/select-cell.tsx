import * as React from "react";

import { cn } from "@/lib/utils";

interface SelectCellProps extends Omit<React.ComponentProps<"div">, "children"> {
	/** 셀 라벨 텍스트 */
	label: string;
	/** 설명 텍스트 */
	description?: string;
	/** 설명 위치 */
	descriptionPosition?: "bottom" | "top";
	/** true: 좌우패딩 없음(기본), false: 좌우패딩 20px */
	fillWidth?: boolean;
	/** Label 타이포그래피 (semibold: 600, md: 500) */
	typography?: "semibold" | "md";
	/** Container 상하패딩 */
	padding?: "12px" | "8px";
	/** 비활성화 상태 (opacity 40%) */
	disabled?: boolean;
	/** 하단 구분선 표시 */
	hasDivider?: boolean;
	/** PressOverlay 인터랙션 활성화 */
	interaction?: boolean;
	/** Leading 영역 ReactNode (Checkbox, Radio, Check 등) */
	leadingContent?: React.ReactNode;
	/** Trailing 영역 ReactNode (Check, Badge, Switch 등) */
	trailingContent?: React.ReactNode;
}

/**
 * SelectCell — Figma Select/Cell/Master
 * 드롭다운/리스트 항목의 기반 셀 컴포넌트.
 * Select/Cell/Selection, SelectionDetail, Menu 등의 Composition 기반.
 */
function SelectCell({
	className,
	label,
	description,
	descriptionPosition = "bottom",
	fillWidth = true,
	typography = "semibold",
	padding = "12px",
	disabled = false,
	hasDivider = false,
	interaction = true,
	leadingContent,
	trailingContent,
	...props
}: SelectCellProps) {
	return (
		<div
			className={cn(
				"flex items-center relative",
				!fillWidth && "px-5",
				disabled && "opacity-[0.40] pointer-events-none",
				className,
			)}
			aria-disabled={disabled || undefined}
			{...props}
		>
			<div className={cn("relative flex flex-1 flex-col items-start min-w-0", interaction && !disabled && "group cursor-pointer")}>
				{/* Interaction overlay */}
				{interaction && !disabled && (
					<div className="absolute inset-y-0 -inset-x-5 px-2 flex flex-col pointer-events-none">
						<div className="flex-1 bg-label-alternative opacity-0 group-hover:opacity-[0.08] group-active:opacity-[0.12] rounded-xl transition-opacity" />
					</div>
				)}

				{/* Divider */}
				{hasDivider && (
					<div className="absolute inset-0 flex flex-col pointer-events-none">
						<div className="flex-1 border-b border-line-alt" />
					</div>
				)}

				{/* Container */}
				<div
					className={cn(
						"flex items-center relative w-full",
						padding === "12px" ? "py-3" : "py-2",
					)}
				>
					<div className="flex flex-1 gap-2 items-start min-w-0">
						{/* Leading Content */}
						{leadingContent && (
							<div className="flex items-start overflow-clip shrink-0">
								{leadingContent}
							</div>
						)}

						{/* Content + Trailing wrapper */}
						<div className="flex flex-1 items-start min-w-0">
							{/* Text Content */}
							<div className="flex flex-1 flex-col items-start min-w-0 overflow-clip">
								{description && descriptionPosition === "top" && (
									<p className="text-body-3 font-normal leading-body-3 text-label-alternative w-full">
										{description}
									</p>
								)}
								<div className="flex items-center min-h-6 w-full">
									<p
										className={cn(
											"text-label-3 leading-label-3 text-label-normal flex-1 min-w-0",
											typography === "semibold"
												? "font-semibold"
												: "font-medium",
										)}
									>
										{label}
									</p>
								</div>
								{description && descriptionPosition === "bottom" && (
									<p className="text-body-3 font-normal leading-body-3 text-label-alternative w-full">
										{description}
									</p>
								)}
							</div>

							{/* Trailing Content */}
							{trailingContent && (
								<div className="flex items-start justify-end overflow-clip shrink-0">
									<div className="flex items-center pl-2">
										{trailingContent}
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export { SelectCell };
export type { SelectCellProps };
