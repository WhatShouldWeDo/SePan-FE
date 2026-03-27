import { MapPin, Pencil } from "lucide-react";

import { PressOverlay } from "@/components/ui/press-overlay";

interface PledgeRowProps {
	category: string;
	categoryColor: string;
	title: string;
	description: string;
	region: string;
	createdAt: string;
	onEdit?: () => void;
}

function PledgeRow({
	category,
	categoryColor,
	title,
	description,
	region,
	createdAt,
	onEdit,
}: PledgeRowProps) {
	return (
		<div className="group relative flex items-center px-5 py-6">
			{/* 분야 */}
			<div className="w-[140px] shrink-0">
				<span
					className={`inline-flex items-center gap-1.5 text-label-4 font-semibold ${categoryColor}`}
				>
					<span className="size-2 rounded-full bg-current" />
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
			<div className="w-[180px] shrink-0 text-center">
				<span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-body-3 font-medium text-primary">
					<MapPin className="size-3.5" />
					{region}
				</span>
			</div>

			{/* 생성일 */}
			<div className="w-[180px] shrink-0 text-center">
				<span className="text-body-3 font-medium text-label-alternative">
					{createdAt}
				</span>
			</div>

			{/* 편집 */}
			<div className="w-[84px] shrink-0 text-center">
				<button
					type="button"
					onClick={onEdit}
					className="inline-flex size-10 items-center justify-center rounded-lg text-label-alternative transition-colors hover:bg-fill-normal"
					aria-label="편집"
				>
					<Pencil className="size-5" />
				</button>
			</div>

			<PressOverlay className="rounded-xl" />
		</div>
	);
}

export { PledgeRow };
export type { PledgeRowProps };
