import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronUp, ChevronRight, X } from "lucide-react";

import { CategoryNav } from "@/components/ui/category-nav";
import { CardSectionHeader } from "@/components/ui/card-section-header";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BarChart } from "@/components/charts";
import { WantedFillMessage } from "@/components/icons";
import { cn } from "@/lib/utils";
import { KoreaAdminMap } from "@/features/region/components/map";
import { useHeatmapMode } from "@/features/region/hooks/useHeatmapMode";
import type { MapTooltipData } from "@/features/region/components/map/MapTooltip";
import { MetricListRow } from "@/features/region/components/MetricListRow";
import { MetricActionButtons } from "@/features/region/components/MetricActionButtons";
import { MetricComparisonCard } from "@/features/region/components/MetricComparisonCard";
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories";
import { useBreadcrumb, useGnbPanel } from "@/contexts/useNavigation";
import {
	MY_REGION,
	MY_REGION_NAV,
	MY_REGION_METRICS,
	MY_REGION_MONTHLY,
	SELECTED_REGION_METRICS,
	SELECTED_REGION_MONTHLY,
	mergeMonthlyData,
	MOCK_COMPARISON_SUMMARY,
	COMPARE_METRIC_SUMMARIES,
	MY_REGION_INSIGHTS,
	SELECTED_REGION_INSIGHTS,
	COMPARE_BOTTOM_METRICS,
} from "@/features/region/data/mock-comparison";
import type {
	MetricRowData,
	InsightCardData,
	BottomMetricData,
	CompareMetricSummary,
} from "@/features/region/data/mock-comparison";
import type { ChartConfig } from "@/types/chart";
import type { MapRegion, MapLevel } from "@/types/map";

/* ═══════════════════════════════════════════════════════════
   Chart Configs
   ═══════════════════════════════════════════════════════════ */

const SINGLE_CHART_CONFIG: ChartConfig = {
	xKey: "month",
	series: [{ key: "population", label: "인구수", color: "#6B5CFF" }],
	height: 560,
	showLegend: false,
	barSize: 20,
	barGap: 4,
	barRadius: 6,
};

const TEAL_CHART_CONFIG: ChartConfig = {
	...SINGLE_CHART_CONFIG,
	series: [{ key: "population", label: "인구수", color: "#2accd8" }],
};

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

type ChipFilter = "yearly" | "quarterly" | "monthly";

const CHIP_FILTERS: { id: ChipFilter; label: string }[] = [
	{ id: "yearly", label: "연도별" },
	{ id: "quarterly", label: "분기별" },
	{ id: "monthly", label: "월별" },
];

type CompareViewTab = "graph" | "table" | "treemap";

const VIEW_TABS: { id: CompareViewTab; label: string }[] = [
	{ id: "graph", label: "그래프 보기" },
	{ id: "table", label: "표 보기" },
	{ id: "treemap", label: "트리맵 보기" },
];

/* ── 메트릭 요약 카드 (단일 열) ── */

function MetricSummaryCard({ metric }: { metric: CompareMetricSummary }) {
	return (
		<div className="flex flex-col gap-1 px-2 py-4">
			<p className="text-[14px] font-semibold leading-[1.3] text-label-alternative">
				{metric.label}
			</p>
			<div className="flex items-end justify-between">
				<div className="flex items-end gap-2">
					<p className="text-[20px] font-bold leading-[1.4] text-label-normal">
						{metric.value}
					</p>
					{metric.badge && (
						<span
							className={cn(
								"mb-0.5 rounded-[6px] px-1.5 py-1 text-[14px] font-semibold leading-[1.3]",
								metric.badge.color === "blue"
									? "bg-party-dpk/8 text-party-dpk"
									: "bg-status-negative/8 text-status-negative",
							)}
						>
							{metric.badge.text}
						</span>
					)}
				</div>
				{metric.delta && (
					<div className="flex items-end">
						<ChevronUp className="size-6 text-status-negative" />
						<p className="text-[20px] font-bold leading-[1.4] text-status-negative">
							{metric.delta.value}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

/* ── 인사이트 카드 (hover 시 "이 정책 채택하기" 버튼 출현) ── */

function InsightCard({
	data,
	iconColor,
}: {
	data: InsightCardData;
	iconColor: "blue" | "red";
}) {
	const bgColor = iconColor === "blue" ? "bg-party-dpk" : "bg-party-ppp";
	const textColor = iconColor === "blue" ? "text-party-dpk" : "text-party-ppp";

	return (
		<div className="group flex items-start rounded-2xl bg-fill-alt p-6">
			<div className="flex flex-1 flex-col gap-4">
				<div className="flex items-center gap-4">
					<div
						className={cn(
							"flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl",
							bgColor,
						)}
					>
						<WantedFillMessage className="size-8 text-white" />
					</div>
					<div className="flex min-w-0 flex-1 flex-col">
						<p className="text-[14px] font-semibold leading-[1.3] text-label-alternative">
							{data.label}
						</p>
						<div className="flex min-h-[31px] items-center gap-2">
							<p className="min-w-0 flex-1 truncate text-[18px] font-bold leading-[1.4] text-label-normal">
								{data.value}
							</p>
							<p
								className={cn(
									"shrink-0 text-[20px] font-bold leading-[1.4]",
									textColor,
								)}
							>
								{data.trailing}
							</p>
						</div>
					</div>
				</div>
				{/* Hover 시 노출되는 정책 채택 버튼 */}
				<button
					type="button"
					className="hidden w-full cursor-pointer rounded-[10px] bg-primary px-5 py-3 text-[16px] font-semibold leading-[1.3] text-white transition-colors hover:bg-primary/90 group-hover:block"
				>
					이 정책 채택하기
				</button>
			</div>
		</div>
	);
}

/* ── 하단 메트릭 셀 ── */

function BottomMetricCell({ data }: { data: BottomMetricData }) {
	return (
		<div className="flex flex-1 flex-col gap-1 px-4">
			<p className="text-[16px] font-semibold leading-[1.3] text-label-alternative">
				{data.label}
			</p>
			<div className="flex min-h-[31px] items-center gap-2">
				<p className="text-[20px] font-bold leading-[1.4] text-label-normal">
					{data.value}
				</p>
				{data.trailing.type === "badge" ? (
					<span
						className={cn(
							"rounded-[6px] px-1.5 py-1 text-[14px] font-semibold leading-[1.3]",
							data.trailing.color === "blue"
								? "bg-party-dpk/8 text-party-dpk"
								: "bg-party-ppp/8 text-party-ppp",
						)}
					>
						{data.trailing.text}
					</span>
				) : (
					<div className="flex items-end gap-1 pt-1">
						<span
							className={cn(
								"text-[14px] font-semibold leading-[1.3]",
								data.trailing.color === "red"
									? "text-party-ppp"
									: "text-party-dpk",
							)}
						>
							{data.trailing.label}
						</span>
						<div className="flex items-end">
							<ChevronUp
								className={cn(
									"size-5",
									data.trailing.color === "red"
										? "text-party-ppp"
										: "text-party-dpk",
								)}
							/>
							<span
								className={cn(
									"text-[14px] font-semibold leading-[1.3]",
									data.trailing.color === "red"
										? "text-party-ppp"
										: "text-party-dpk",
								)}
							>
								{data.trailing.value}
							</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */

type ViewMode = "default" | "preview" | "analysis" | "compare";

export function RegionResultPage() {
	const [selectedCategoryId, setSelectedCategoryId] = useState("voter");
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
		string | null
	>("population");
	const [activeChip, setActiveChip] = useState<ChipFilter>("monthly");

	const [viewMode, setViewMode] = useState<ViewMode>("default");
	const [selectedRegion, setSelectedRegion] = useState<{
		code: string;
		name: string;
		fullName: string;
	} | null>(null);
	const [compareChartSplit, setCompareChartSplit] = useState(false);
	const [activeViewTab, setActiveViewTab] = useState<CompareViewTab>("graph");

	const [mapLevel, setMapLevel] = useState<MapLevel>("sido");
	const [visibleCodes, setVisibleCodes] = useState<string[]>([]);

	const heatmap = useHeatmapMode(selectedCategoryId, mapLevel, visibleCodes);

	const tooltipDataProvider = useCallback(
		(code: string): MapTooltipData | undefined => {
			if (!heatmap.isHeatmapActive || !heatmap.choroplethData) return undefined;
			const { heatmapLabel, heatmapUnit } = heatmap;
			if (!heatmapLabel || !heatmapUnit) return undefined;
			const value = heatmap.choroplethData.values[code];
			if (value === undefined) return undefined;
			return {
				heatmap: {
					label: heatmapLabel,
					value,
					unit: heatmapUnit,
				},
			};
		},
		[heatmap.isHeatmapActive, heatmap.choroplethData, heatmap.heatmapLabel, heatmap.heatmapUnit],
	);

	const handleRegionSelect = useCallback((region: MapRegion) => {
		if (region.fullName === MY_REGION.fullName) {
			setViewMode("default");
			setSelectedRegion(null);
		} else {
			setViewMode("preview");
			setSelectedRegion({
				code: region.code,
				name: region.name,
				fullName: region.fullName,
			});
		}
		setCompareChartSplit(false);
	}, []);

	const handleAnalysis = useCallback(() => {
		setViewMode("analysis");
	}, []);

	const handleCompare = useCallback(() => {
		setViewMode("compare");
	}, []);

	const handleReset = useCallback(() => {
		setViewMode("preview");
		setCompareChartSplit(false);
	}, []);

	const handleCategorySelect = useCallback((categoryId: string) => {
		setSelectedCategoryId(categoryId);
		setSelectedSubcategoryId(null);
	}, []);

	const handleSubcategorySelect = useCallback(
		(subcategoryId: string, categoryId: string) => {
			setSelectedCategoryId(categoryId);
			setSelectedSubcategoryId(subcategoryId);
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[],
	);

	// 선택된 서브카테고리 라벨
	const selectedSubcategory = selectedSubcategoryId
		? SUBCATEGORIES[selectedCategoryId]?.find(
				(s) => s.id === selectedSubcategoryId,
			)
		: null;
	const subcategoryLabel = selectedSubcategory?.label ?? "인구현황";

	// 파생 값
	const regionDisplayName =
		viewMode === "default" || !selectedRegion
			? MY_REGION.name
			: selectedRegion.fullName;

	const currentMetrics: MetricRowData[] =
		viewMode === "default" ? MY_REGION_METRICS : SELECTED_REGION_METRICS;

	const currentChartData =
		viewMode === "default" || viewMode === "preview"
			? MY_REGION_MONTHLY
			: SELECTED_REGION_MONTHLY;

	const chartRegionLabel =
		viewMode === "default" || viewMode === "preview"
			? MY_REGION.name
			: (selectedRegion?.fullName ?? MY_REGION.name);

	const chartTitle =
		viewMode === "compare"
			? `${MY_REGION.name} vs ${selectedRegion?.fullName ?? ""}`
			: chartRegionLabel;

	const compareChartConfig: ChartConfig = {
		xKey: "month",
		series: [
			{ key: "myPopulation", label: MY_REGION.name, color: "#6B5CFF" },
			{
				key: "selectedPopulation",
				label: selectedRegion?.fullName ?? "",
				color: "#2accd8",
			},
		],
		height: 560,
		showLegend: false,
		barSize: 20,
		barGap: 4,
		barRadius: 6,
	};

	const selectedCategoryLabel =
		CATEGORIES.find((c) => c.id === selectedCategoryId)?.label ??
		selectedCategoryId;

	useBreadcrumb([
		{ label: "지역분석" },
		{ label: regionDisplayName },
		{ label: selectedCategoryLabel },
	]);

	const { panelEl } = useGnbPanel();

	return (
		<>
			{/* CategoryNav를 GnbPanel portal 타겟에 렌더링 */}
			{panelEl &&
				createPortal(
					<CategoryNav
						categories={CATEGORIES}
						subcategories={SUBCATEGORIES}
						selectedCategoryId={selectedCategoryId}
						selectedSubcategoryId={selectedSubcategoryId ?? undefined}
						onCategorySelect={handleCategorySelect}
						onSubcategorySelect={handleSubcategorySelect}
						className="px-[80px] py-4"
					/>,
					panelEl,
				)}

			<div className="flex flex-col gap-6 px-[56px]">
				{/* ── CategoryNav (페이지 상단 고정) ── */}
				<CategoryNav
					categories={CATEGORIES}
					subcategories={SUBCATEGORIES}
					selectedCategoryId={selectedCategoryId}
					selectedSubcategoryId={selectedSubcategoryId ?? undefined}
					onCategorySelect={handleCategorySelect}
					onSubcategorySelect={handleSubcategorySelect}
				/>
				{/* ── Heading ── */}
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<h1 className="text-heading-2 font-bold leading-[1.3] text-label-normal">
							{subcategoryLabel}
						</h1>
						<Badge
							variant="ghost"
							size="md"
							className="bg-primary-alpha-5 text-primary"
						>
							{regionDisplayName}
						</Badge>
					</div>
					<p className="text-body-2 font-medium leading-normal text-label-alternative">
						지역 분석 데이터와 역대 공약을 기반으로 최적의 정책을 추천합니다.
					</p>
				</div>

				{/* ── 2열 카드 섹션: 지도 + 지표 ── */}
				<div className="grid grid-cols-2 gap-4 2xl:gap-6">
					{/* 좌측: 폴리곤 지도 */}
					<section className="flex flex-col rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={MY_REGION.districtName}
							description="선거구 단위"
						/>
						{heatmap.isHeatmapActive && (
							<div className="flex justify-end">
								<button
									type="button"
									onClick={heatmap.deactivateHeatmap}
									className="flex min-h-[44px] items-center gap-1 rounded-full bg-surface-primary px-3 py-2.5 text-label-3 font-semibold text-label-alternative transition-colors hover:bg-surface-primary/80"
								>
									<X className="size-3.5" />
									히트맵 끄기
								</button>
							</div>
						)}
						<div className="flex items-center justify-center">
							<KoreaAdminMap
								searchNavigation={MY_REGION_NAV}
								onRegionSelect={handleRegionSelect}
								choroplethData={heatmap.choroplethData}
								choroplethConfig={heatmap.choroplethConfig}
								tooltipDataProvider={heatmap.isHeatmapActive ? tooltipDataProvider : undefined}
								onLevelChange={setMapLevel}
								onVisibleCodesChange={setVisibleCodes}
								className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full"
							/>
						</div>
					</section>

					{/* 우측: 지표 메트릭 리스트 (모드별 분기) */}
					{viewMode === "compare" && selectedRegion ? (
						<MetricComparisonCard
							myRegionName={MY_REGION.name}
							selectedRegionName={selectedRegion.fullName}
							myMetrics={MY_REGION_METRICS}
							selectedMetrics={SELECTED_REGION_METRICS}
							summaryText={MOCK_COMPARISON_SUMMARY}
							onReset={handleReset}
						/>
					) : (
						<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
							<CardSectionHeader
								title={
									viewMode === "default"
										? MY_REGION.name
										: (selectedRegion?.fullName ?? MY_REGION.name)
								}
								description="행정안전부 2026년 1월"
								trailingContent={
									viewMode === "default" ? (
										<Badge
											variant="ghost"
											size="md"
											className="bg-primary-alpha-5 text-primary"
										>
											내 선거구
										</Badge>
									) : undefined
								}
							/>
							<div className="flex flex-col gap-1">
								{currentMetrics.map((metric) => (
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
							{viewMode !== "default" && (
								<MetricActionButtons
									showAnalysis={viewMode === "preview"}
									onAnalysisClick={handleAnalysis}
									onCompareClick={handleCompare}
								/>
							)}
						</section>
					)}
				</div>

				{/* ── 하단: 추이 차트 ── */}
				{viewMode === "compare" && selectedRegion ? (
					<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={chartTitle}
							description="행정안전부 2026년 1월"
						/>

						{/* 뷰 탭 + 통합 보기 토글 */}
						<div className="flex items-center justify-between">
							<div className="flex gap-2">
								{VIEW_TABS.map((tab) => (
									<button
										key={tab.id}
										type="button"
										className={cn(
											"rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
											activeViewTab === tab.id
												? "bg-surface-inverse text-label-inverse"
												: "bg-surface-primary text-label-alternative",
										)}
										onClick={() => setActiveViewTab(tab.id)}
									>
										{tab.label}
									</button>
								))}
							</div>
							<div className="flex items-center gap-2">
								<span className="text-[18px] font-semibold leading-[1.3] text-label-alternative">
									통합 보기
								</span>
								<Switch
									size="sm"
									checked={!compareChartSplit}
									onCheckedChange={(val) => setCompareChartSplit(!val)}
								/>
							</div>
						</div>

						{/* ── 통합 보기 (Grouped Bar) ── */}
						{!compareChartSplit && (
							<>
								{/* 메트릭 요약 (중위연령) — 2열 */}
								<div className="flex gap-8">
									{COMPARE_METRIC_SUMMARIES.map((metric, i) => (
										<div key={i} className="flex-1">
											<MetricSummaryCard metric={metric} />
										</div>
									))}
								</div>

								<BarChart
									data={mergeMonthlyData(
										MY_REGION_MONTHLY,
										SELECTED_REGION_MONTHLY,
									)}
									config={compareChartConfig}
									darkTooltip
								/>

								{/* 인사이트 카드 그리드 (2열 × 3행) */}
								<div className="flex gap-6">
									<div className="flex flex-1 flex-col gap-3">
										{MY_REGION_INSIGHTS.map((insight, i) => (
											<InsightCard key={i} data={insight} iconColor="blue" />
										))}
									</div>
									<div className="flex flex-1 flex-col gap-3">
										{SELECTED_REGION_INSIGHTS.map((insight, i) => (
											<InsightCard key={i} data={insight} iconColor="red" />
										))}
									</div>
								</div>

								{/* 하단 메트릭 요약 행 */}
								<div className="flex flex-col gap-4">
									{COMPARE_BOTTOM_METRICS.map((row, i) => (
										<div key={i} className="flex gap-6">
											{row.map((metric, j) => (
												<BottomMetricCell key={j} data={metric} />
											))}
										</div>
									))}
								</div>
							</>
						)}

						{/* ── 분리 보기 (좌우 독립 컬럼) ── */}
						{compareChartSplit && (
							<div className="flex">
								{/* 좌측 컬럼: 내 선거구 */}
								<div className="flex flex-1 flex-col gap-8">
									<MetricSummaryCard metric={COMPARE_METRIC_SUMMARIES[1]} />
									<BarChart
										data={MY_REGION_MONTHLY}
										config={SINGLE_CHART_CONFIG}
										darkTooltip
									/>
									<div className="flex flex-col gap-3">
										{MY_REGION_INSIGHTS.map((insight, i) => (
											<InsightCard key={i} data={insight} iconColor="blue" />
										))}
									</div>
									{/* 인사이트 카드 (bordered) */}
									<div className="flex flex-col gap-8 rounded-[20px] border border-line-normal p-6">
										<div className="flex items-start justify-between">
											<p className="text-[22px] font-bold leading-[1.4] text-label-normal">
												인사이트
											</p>
											<button
												type="button"
												className="flex items-center gap-1 py-1 text-[18px] font-semibold leading-[1.3] text-label-alternative"
											>
												전체보기
												<ChevronRight className="size-5" />
											</button>
										</div>
										<div className="flex flex-col gap-4">
											{COMPARE_BOTTOM_METRICS.map((row, i) => (
												<div key={i} className="flex gap-[82px]">
													{row.map((metric, j) => (
														<BottomMetricCell key={j} data={metric} />
													))}
												</div>
											))}
										</div>
									</div>
								</div>

								{/* 세로 구분선 */}
								<div className="mx-8 flex shrink-0 items-stretch">
									<div className="my-4 w-px bg-line-neutral" />
								</div>

								{/* 우측 컬럼: 비교 선거구 */}
								<div className="flex flex-1 flex-col gap-8">
									<MetricSummaryCard metric={COMPARE_METRIC_SUMMARIES[0]} />
									<BarChart
										data={SELECTED_REGION_MONTHLY}
										config={TEAL_CHART_CONFIG}
										darkTooltip
									/>
									<div className="flex flex-col gap-3">
										{SELECTED_REGION_INSIGHTS.map((insight, i) => (
											<InsightCard key={i} data={insight} iconColor="red" />
										))}
									</div>
									{/* 하단 메트릭 (카드 없이) */}
									<div className="flex flex-col gap-4 pt-4">
										{COMPARE_BOTTOM_METRICS.map((row, i) => (
											<div key={i} className="flex gap-[82px]">
												{row.map((metric, j) => (
													<BottomMetricCell key={j} data={metric} />
												))}
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{/* 하단 캡션 */}
						<div className="flex items-center justify-end">
							<p className="text-[12px] leading-[1.3] text-label-alternative">
								인구수[단위:천], 인구비율[단위:%]
							</p>
						</div>
					</section>
				) : (
					<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={chartTitle}
							description="월별 인구수 변화 추이"
						/>
						<div className="flex gap-2">
							{CHIP_FILTERS.map((chip) => (
								<button
									key={chip.id}
									type="button"
									className={cn(
										"rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
										activeChip === chip.id
											? "bg-surface-inverse text-label-inverse"
											: "bg-surface-primary text-label-alternative",
									)}
									onClick={() => setActiveChip(chip.id)}
								>
									{chip.label}
								</button>
							))}
						</div>
						<BarChart data={currentChartData} config={SINGLE_CHART_CONFIG} />
					</section>
				)}
			</div>
		</>
	);
}
