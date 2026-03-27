import { cn } from "@/lib/utils";
import { PressOverlay } from "@/components/ui/press-overlay";

interface SummaryCardProps {
	label: string;
	value: string;
	icon: React.ReactNode;
	valueClassName?: string;
	className?: string;
}

function SummaryCard({
	label,
	value,
	icon,
	valueClassName,
	className,
}: SummaryCardProps) {
	return (
		<div
			className={cn(
				"group relative flex h-[90px] flex-1 flex-col justify-between overflow-hidden rounded-[16px] border border-line-neutral bg-white px-6 py-4",
				className,
			)}
		>
			<div className="flex items-center justify-between opacity-80">
				<span className="text-label-4 font-semibold text-label-neutral">
					{label}
				</span>
				<span className="size-6 text-label-neutral">{icon}</span>
			</div>
			<div>
				<span
					className={cn(
						"text-title-2 font-bold text-label-normal",
						valueClassName,
					)}
				>
					{value}
				</span>
			</div>
			<PressOverlay className="rounded-[16px]" />
		</div>
	);
}

export { SummaryCard };
export type { SummaryCardProps };
