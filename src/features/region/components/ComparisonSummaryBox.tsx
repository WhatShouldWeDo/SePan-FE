// src/features/region/components/ComparisonSummaryBox.tsx
import { cn } from "@/lib/utils";

interface ComparisonSummaryBoxProps {
	text: string;
	className?: string;
}

/** 비교 해석 텍스트 박스 (디자인 추후 Figma 확정) */
export function ComparisonSummaryBox({
	text,
	className,
}: ComparisonSummaryBoxProps) {
	return (
		<div
			className={cn(
				"rounded-2xl border border-primary/10 bg-primary-alpha-5 p-5",
				className,
			)}
		>
			<p className="text-label-3 font-semibold text-primary mb-2">
				비교 분석
			</p>
			<p className="text-body-2 leading-[1.6] text-label-alternative">
				{text}
			</p>
		</div>
	);
}
