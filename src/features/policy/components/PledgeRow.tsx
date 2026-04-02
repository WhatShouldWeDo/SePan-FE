import { MapPin, Pencil } from "lucide-react";

import { PressOverlay } from "@/components/ui/press-overlay";
import { CategoryIcon } from "@/components/ui/category-icon";
import { CATEGORIES } from "@/features/region/data/categories";
import { getCategoryLabel } from "@/features/policy/data/mock-policy";

interface MyPledgeRowProps {
	categoryIds: string[];
	title: string;
	summary: string;
	regions: string[];
	createdAt: string;
	onEdit?: () => void;
}

function MyPledgeRow({
	categoryIds,
	title,
	summary,
	regions,
	createdAt,
	onEdit,
}: MyPledgeRowProps) {
	const primaryCategoryId = categoryIds[0];
	const categoryLabel = getCategoryLabel(primaryCategoryId);
	const categoryData = CATEGORIES.find((c) => c.id === primaryCategoryId);
	const badgeColor = categoryData?.iconColor ?? "#6B7280";
	const badgeStyle = {
		color: badgeColor,
		backgroundColor: `${badgeColor}1A`,
	};

	return (
		<div className="group relative flex items-center px-5 py-6">
			{/* 분야 */}
			<div className="w-[140px] shrink-0">
				<span
					className="inline-flex shrink-0 items-center gap-1 rounded-[6px] px-1.5 py-0.5 text-caption-1 font-semibold"
					style={badgeStyle}
				>
					{categoryData?.iconAsset && (
						<CategoryIcon
							iconUrl={categoryData.iconAsset}
							color={badgeColor}
							size="sm"
						/>
					)}
					{categoryLabel}
				</span>
			</div>

			{/* 공약 */}
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<span className="text-title-4 font-bold text-label-normal">
					{title}
				</span>
				<span className="truncate text-body-3 font-medium text-label-alternative">
					{summary}
				</span>
			</div>

			{/* 지역 */}
			<div className="w-[180px] shrink-0">
				<span className="inline-flex items-center gap-1 rounded-[6px] bg-primary/8 px-2.5 py-1 text-body-3 font-medium text-primary">
					<MapPin className="size-3.5 fill-current" />
					{regions[0]}
				</span>
			</div>

			{/* 생성일 */}
			<div className="w-[180px] shrink-0">
				<span className="text-body-3 font-medium text-label-alternative">
					{createdAt}
				</span>
			</div>

			{/* 편집 */}
			<div className="w-[84px] shrink-0">
				<button
					type="button"
					onClick={onEdit}
					disabled={!onEdit}
					className="inline-flex size-8 items-center justify-center rounded-lg border border-line-neutral text-[#000000] transition-colors hover:bg-fill-normal disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="편집"
				>
					<Pencil className="size-4" />
				</button>
			</div>

			<PressOverlay className="rounded-xl" />
		</div>
	);
}

export { MyPledgeRow };
export type { MyPledgeRowProps };
