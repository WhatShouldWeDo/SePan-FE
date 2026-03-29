import { MapPin, Pencil } from "lucide-react";

import { PressOverlay } from "@/components/ui/press-overlay";
import { CATEGORIES } from "@/features/region/data/categories";
import type { MyPledge, PledgeStatus } from "@/features/policy/data/mock-policy";
import { getCategoryLabel } from "@/features/policy/data/mock-policy";

interface MyPledgeCardProps {
	pledge: MyPledge;
	onEdit?: (id: string) => void;
}

const STATUS_LABEL: Record<PledgeStatus, string> = {
	drafting: "작성중",
	reviewing: "검토중",
	approved: "승인완료",
	confirmed: "확정됨",
};

const STATUS_STYLE: Record<PledgeStatus, { text: string; bg: string }> = {
	drafting: {
		text: "text-status-cautionary",
		bg: "bg-status-cautionary/8",
	},
	reviewing: {
		text: "text-status-positive",
		bg: "bg-status-positive/8",
	},
	approved: {
		text: "text-status-positive",
		bg: "bg-status-positive/8",
	},
	confirmed: {
		text: "text-primary",
		bg: "bg-primary/8",
	},
};

function MyPledgeCard({ pledge, onEdit }: MyPledgeCardProps) {
	const primaryCategoryId = pledge.categoryIds[0];
	const categoryLabel = getCategoryLabel(primaryCategoryId);
	const categoryData = CATEGORIES.find((c) => c.id === primaryCategoryId);
	const badgeColor = categoryData?.iconColor ?? "#6B7280";
	const badgeStyle = {
		color: badgeColor,
		backgroundColor: `${badgeColor}1A`,
	};
	const statusStyle = STATUS_STYLE[pledge.status];

	return (
		<div className="group relative flex flex-col items-start">
			<div className="flex w-full items-center gap-8 rounded-[16px] bg-white p-6">
				{/* Leading: 지역 배지 */}
				<div className="flex shrink-0 items-center">
					<div className="w-[80px]">
						<span className="inline-flex items-center gap-1 rounded-[6px] bg-primary/8 px-1.5 py-1 text-label-4 font-semibold text-primary">
							<MapPin className="size-3.5 fill-current" />
							{pledge.regions[0]}
						</span>
					</div>
				</div>

				{/* Middle: 제목 + 카테고리 + 설명 */}
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex items-center gap-2">
						<span className="text-title-2 font-bold text-label-normal">
							{pledge.title}
						</span>
						<span
							className="inline-flex shrink-0 items-center gap-1 rounded-[6px] px-1.5 py-1 text-label-4 font-semibold"
							style={badgeStyle}
						>
							{categoryData?.iconAsset && (
								<span className="relative inline-block size-3.5 shrink-0 overflow-hidden rounded-[3px]">
									<span
										className="absolute inset-0"
										style={{
											backgroundColor: badgeColor,
											maskImage: `url('${categoryData.iconAsset}')`,
											maskMode: "luminance",
											maskSize: "11px 11px",
											maskPosition: "1.5px 1.5px",
											maskRepeat: "no-repeat",
											WebkitMaskImage: `url('${categoryData.iconAsset}')`,
											WebkitMaskSize: "11px 11px",
											WebkitMaskPosition: "1.5px 1.5px",
											WebkitMaskRepeat: "no-repeat",
										}}
									/>
								</span>
							)}
							{categoryLabel}
						</span>
					</div>
					<p className="text-body-2 font-medium text-label-neutral">
						{pledge.summary}
					</p>
				</div>

				{/* Trailing: 상태 배지 + 편집 버튼 */}
				<div className="flex shrink-0 items-center gap-6">
					<div className="w-[80px]">
						<span
							className={`inline-flex items-center justify-center rounded-[6px] px-1.5 py-1 text-label-4 font-semibold ${statusStyle.bg} ${statusStyle.text}`}
						>
							{STATUS_LABEL[pledge.status]}
						</span>
					</div>
					<button
						type="button"
						onClick={() => onEdit?.(pledge.id)}
						disabled={!onEdit}
						className="group/edit relative inline-flex items-center justify-center rounded-[10px] border border-line-neutral p-3 disabled:cursor-not-allowed disabled:opacity-50"
						aria-label="편집"
					>
						<Pencil className="size-5" />
						<PressOverlay className="rounded-[10px]" />
					</button>
				</div>
			</div>

			{/* 카드 전체 hover overlay */}
			<PressOverlay className="rounded-[20px]" />
		</div>
	);
}

export { MyPledgeCard };
export type { MyPledgeCardProps };
