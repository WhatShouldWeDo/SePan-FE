// src/features/region/components/MetricComparisonCard.tsx
import { CardSectionHeader } from "@/components/ui/card-section-header";
import { MetricListRow } from "@/features/region/components/MetricListRow";
import { ComparisonSummaryBox } from "@/features/region/components/ComparisonSummaryBox";
import type { MetricRowData } from "@/features/region/data/mock-comparison";

interface MetricComparisonCardProps {
	myRegionName: string;
	selectedRegionName: string;
	myMetrics: MetricRowData[];
	selectedMetrics: MetricRowData[];
	summaryText: string;
	onReset: () => void;
}

export function MetricComparisonCard({
	myRegionName,
	selectedRegionName,
	myMetrics,
	selectedMetrics,
	summaryText,
	onReset,
}: MetricComparisonCardProps) {
	return (
		<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
			{/* 헤더: "A vs B" + 초기화 */}
			<CardSectionHeader
				title={`${myRegionName} vs ${selectedRegionName}`}
				description="행정안전부 2026년 1월"
				trailingContent={
					<button
						type="button"
						className="text-label-3 font-medium text-label-alternative hover:text-label-normal transition-colors"
						onClick={onReset}
					>
						초기화
					</button>
				}
			/>

			{/* 좌우 분할 카드 */}
			<div className="grid grid-cols-2 gap-4">
				{/* 내 선거구 */}
				<div className="flex flex-col gap-1 rounded-2xl border border-line-neutral p-5">
					<p className="text-label-3 font-semibold text-primary mb-3">
						{myRegionName}
					</p>
					{myMetrics.map((metric) => (
						<MetricListRow
							key={metric.label}
							label={metric.label}
							value={metric.value}
							unit={metric.unit}
							subValueBadge={metric.subValueBadge}
							deltas={metric.deltas}
						/>
					))}
				</div>

				{/* 선택 지역 */}
				<div className="flex flex-col gap-1 rounded-2xl border border-line-neutral p-5">
					<p className="text-label-3 font-semibold text-status-negative mb-3">
						{selectedRegionName}
					</p>
					{selectedMetrics.map((metric) => (
						<MetricListRow
							key={metric.label}
							label={metric.label}
							value={metric.value}
							unit={metric.unit}
							subValueBadge={metric.subValueBadge}
							deltas={metric.deltas}
						/>
					))}
				</div>
			</div>

			{/* 비교 해석 */}
			<ComparisonSummaryBox text={summaryText} />
		</section>
	);
}
