import { Calendar } from "lucide-react";

import { cn } from "@/lib/utils";

type SummaryVariant = "schedule" | "dday-blue" | "dday-purple";

interface SummaryCardProps {
	variant: SummaryVariant;
	title: string;
	value: string;
	subtitle: string;
	subValue?: string;
}

const variantStyles: Record<SummaryVariant, string> = {
	schedule: "bg-primary",
	"dday-blue": "bg-[#5C9AFF]",
	"dday-purple": "bg-primary-strong",
};

export function DashboardSummaryCard({
	variant,
	title,
	value,
	subtitle,
	subValue,
}: SummaryCardProps) {
	return (
		<div
			className={cn(
				"relative flex h-40 flex-1 flex-col justify-between overflow-hidden rounded-[20px] p-6 text-white",
				variantStyles[variant],
			)}
		>
			{/* 장식 원형 */}
			<div className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-white/10" />
			<div className="pointer-events-none absolute -bottom-4 -right-10 size-20 rounded-full bg-white/5" />

			{/* 상단 */}
			<div className="flex items-start justify-between">
				<div>
					<p className="text-caption-1 font-medium leading-[1.3] text-white/80">
						{title}
					</p>
					<p className="mt-1 text-heading-3 font-bold leading-[1.3]">
						{value}
					</p>
				</div>
				<Calendar className="size-6 text-white/60" aria-hidden="true" />
			</div>

			{/* 하단 */}
			<div className="flex items-center justify-between">
				<p className="text-caption-1 font-medium leading-[1.3] text-white/70">
					{subtitle}
				</p>
				{subValue && (
					<p className="text-caption-1 font-semibold leading-[1.3]">
						{subValue}
					</p>
				)}
			</div>
		</div>
	);
}
