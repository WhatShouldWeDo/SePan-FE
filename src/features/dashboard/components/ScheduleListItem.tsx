import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScheduleListItemProps {
	title: string;
	datetime: string;
	description?: string;
	badge?: { text: string; color: string };
	isHighlighted?: boolean;
}

export function ScheduleListItem({
	title,
	datetime,
	description,
	badge,
	isHighlighted = false,
}: ScheduleListItemProps) {
	return (
		<div className="flex gap-3">
			{/* 좌측 컬러바 */}
			<div
				className={cn(
					"w-[3px] shrink-0 self-stretch rounded-full",
					isHighlighted ? "bg-primary" : "bg-label-assistive",
				)}
			/>

			{/* 콘텐츠 */}
			<div className="flex flex-1 flex-col gap-1 py-1">
				<div className="flex items-center gap-2">
					<p
						className={cn(
							"text-body-2 font-semibold leading-[1.5]",
							isHighlighted
								? "text-label-normal"
								: "text-label-neutral",
						)}
					>
						{title}
					</p>
					{badge && (
						<Badge
							size="sm"
							className={cn("border-0", badge.color)}
						>
							{badge.text}
						</Badge>
					)}
				</div>
				<p className="text-caption-1 font-medium leading-[1.3] text-label-alternative">
					{datetime}
				</p>
				{description && (
					<p className="text-caption-1 font-medium leading-[1.3] text-label-alternative">
						{description}
					</p>
				)}
			</div>
		</div>
	);
}
