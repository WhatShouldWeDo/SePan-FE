import { MapPin, Pencil } from "lucide-react";

import { PressOverlay } from "@/components/ui/press-overlay";
import { CATEGORIES } from "@/features/region/data/categories";

interface PledgeRowProps {
	category: string;
	categoryId: string;
	title: string;
	description: string;
	region: string;
	createdAt: string;
	onEdit?: () => void;
}

function PledgeRow({
	category,
	categoryId,
	title,
	description,
	region,
	createdAt,
	onEdit,
}: PledgeRowProps) {
	const categoryData = CATEGORIES.find((c) => c.id === categoryId);
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
					{category}
				</span>
			</div>

			{/* 공약 */}
			<div className="flex min-w-0 flex-1 flex-col gap-1">
				<span className="text-title-4 font-bold text-label-normal">
					{title}
				</span>
				<span className="truncate text-body-3 font-medium text-label-alternative">
					{description}
				</span>
			</div>

			{/* 지역 */}
			<div className="w-[180px] shrink-0">
				<span className="inline-flex items-center gap-1 rounded-[6px] bg-primary/8 px-2.5 py-1 text-body-3 font-medium text-primary">
					<MapPin className="size-3.5 fill-current" />
					{region}
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

export { PledgeRow };
export type { PledgeRowProps };
