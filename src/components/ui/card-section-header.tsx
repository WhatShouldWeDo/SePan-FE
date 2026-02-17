import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface CardSectionHeaderProps {
	/** 제목 텍스트 */
	title: string;
	/** 설명 텍스트 (없으면 설명 영역 숨김) */
	description?: string;
	/** 설명 위치 */
	descriptionPosition?: "bottom" | "top";
	/** 제목 변형: text(순수 텍스트) / textButton(클릭 가능 드롭다운) */
	titleVariant?: "text" | "textButton";
	/** TextButton 변형 시 클릭 핸들러 */
	onTitleClick?: () => void;
	/** 후행 콘텐츠 슬롯 (버튼, 텍스트, 아이콘 등 자유롭게 전달) */
	trailingContent?: React.ReactNode;
	/** 루트 요소 추가 클래스 */
	className?: string;
}

function CardSectionHeader({
	title,
	description,
	descriptionPosition = "bottom",
	titleVariant = "text",
	onTitleClick,
	trailingContent,
	className,
}: CardSectionHeaderProps) {
	const hasDescription = !!description;
	const isTop = descriptionPosition === "top";

	return (
		<div className={cn("flex flex-col gap-1", className)}>
			{/* Description Top */}
			{hasDescription && isTop && (
				<p className="text-body-2 font-medium leading-[1.5] text-label-alternative">
					{description}
				</p>
			)}

			{/* Content row */}
			<div className="flex items-start gap-2">
				{/* Heading */}
				<div className="flex flex-1 flex-col gap-1 min-w-0">
					{/* Title */}
					{titleVariant === "text" ? (
						<h3 className="text-heading-3 font-bold leading-[1.3] text-label-normal">
							{title}
						</h3>
					) : (
						<button
							type="button"
							onClick={onTitleClick}
							className="group relative inline-flex w-fit items-center gap-1.5 text-heading-3 font-bold leading-[1.3] text-label-normal"
						>
							{/* PressOverlay — 확장된 hit area */}
							<span className="pointer-events-none absolute -inset-x-4 -inset-y-[32%] rounded-xl bg-label-alternative opacity-0 transition-opacity group-hover:opacity-[0.04] group-active:opacity-[0.08]" />
							<span>{title}</span>
							<ChevronDown className="size-5 shrink-0" />
						</button>
					)}

					{/* Description Bottom */}
					{hasDescription && !isTop && (
						<p className="text-body-2 font-medium leading-[1.5] text-label-alternative">
							{description}
						</p>
					)}
				</div>

				{/* Trailing Content */}
				{trailingContent && (
					<div className="flex shrink-0 items-end">
						{trailingContent}
					</div>
				)}
			</div>
		</div>
	);
}

export { CardSectionHeader };
export type { CardSectionHeaderProps };
