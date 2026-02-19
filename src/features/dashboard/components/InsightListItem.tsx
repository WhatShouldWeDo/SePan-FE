import { ChevronUp } from "lucide-react";

import { cn } from "@/lib/utils";

interface InsightListItemProps {
	icon: React.ReactNode;
	iconBg: string;
	label: string;
	value: string;
	valueColor?: string;
	trailing: React.ReactNode;
}

export function InsightListItem({
	icon,
	iconBg,
	label,
	value,
	valueColor,
	trailing,
}: InsightListItemProps) {
	return (
		<div className="flex items-center gap-4 rounded-2xl bg-fill-alt p-6">
			{/* 아이콘 */}
			<div
				className={cn(
					"flex size-12 shrink-0 items-center justify-center rounded-xl",
					iconBg,
				)}
			>
				{icon}
			</div>

			{/* 라벨 + 값 */}
			<div className="flex flex-1 flex-col gap-0.5">
				<p className="text-caption-1 font-medium leading-[1.3] text-label-alternative">
					{label}
				</p>
				<p
					className={cn(
						"text-title-2 font-bold leading-[1.4]",
						valueColor ?? "text-label-normal",
					)}
				>
					{value}
				</p>
			</div>

			{/* 트레일링 */}
			<div className="shrink-0">{trailing}</div>
		</div>
	);
}

/* ── InsightDelta 서브컴포넌트 ── */

interface InsightDeltaProps {
	label: string;
	isPositive?: boolean;
}

export function InsightDelta({ label, isPositive = true }: InsightDeltaProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-0.5 text-caption-1 font-semibold leading-[1.3]",
				isPositive ? "text-status-positive" : "text-status-negative",
			)}
		>
			<ChevronUp
				className={cn("size-4", !isPositive && "rotate-180")}
				aria-hidden="true"
			/>
			{label}
		</span>
	);
}
