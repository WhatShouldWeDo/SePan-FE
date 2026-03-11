import { cn } from "@/lib/utils";
import { WantedCaretUp } from "@/components/icons";

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
		<div className="@container rounded-2xl bg-fill-alt p-6">
			<div className="flex items-center gap-4">
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
				<div className="flex min-w-0 flex-1 flex-col gap-0.5">
					<p className="text-caption-1 font-medium leading-[1.3] text-label-alternative">
						{label}
					</p>
					<p
						className={cn(
							"truncate text-title-2 font-bold leading-[1.4]",
							valueColor ?? "text-label-normal",
						)}
					>
						{value}
					</p>
				</div>
				{/* 트레일링 — 넓을 때 인라인 */}
				<div className="hidden shrink-0 @[16rem]:block">
					{trailing}
				</div>
			</div>
			{/* 트레일링 — 좁을 때 label/value 아래 */}
			<div className="mt-2 pl-16 @[16rem]:hidden">{trailing}</div>
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
			<WantedCaretUp
				className={cn("size-5", !isPositive && "rotate-180")}
				aria-hidden="true"
			/>
			{label}
		</span>
	);
}
