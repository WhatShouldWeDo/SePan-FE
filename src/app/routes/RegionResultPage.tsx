import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { CategoryNav } from "@/components/ui/category-nav";
import { CardSectionHeader } from "@/components/ui/card-section-header";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts";
import { DataTable } from "@/components/tables";
import { cn } from "@/lib/utils";
import { KoreaAdminMap } from "@/features/region/components/map";
import { useHeatmapMode } from "@/features/region/hooks/useHeatmapMode";
import type { MapTooltipData } from "@/features/region/components/map/MapTooltip";
import { MetricListRow } from "@/features/region/components/MetricListRow";
import { MetricActionButtons } from "@/features/region/components/MetricActionButtons";
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories";
import { useBreadcrumb, useGnbPanel } from "@/contexts/useNavigation";
import {
	MY_REGION,
	MY_REGION_NAV,
	MY_REGION_METRICS,
	MY_REGION_MONTHLY,
	SELECTED_REGION_METRICS,
	SELECTED_REGION_MONTHLY,
} from "@/features/region/data/mock-comparison";
import type { MetricRowData } from "@/features/region/data/mock-comparison";
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

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

type ViewTab = "graph" | "table" | "treemap";

const VIEW_TABS: { id: ViewTab; label: string }[] = [
	{ id: "graph", label: "그래프 보기" },
	{ id: "table", label: "표 보기" },
	{ id: "treemap", label: "트리맵 보기" },
];

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */

type ViewMode = "default" | "preview" | "analysis";

export function RegionResultPage() {
	const [selectedCategoryId, setSelectedCategoryId] = useState("voter");
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
		string | null
	>("population");
	const [viewMode, setViewMode] = useState<ViewMode>("default");
	const [selectedRegion, setSelectedRegion] = useState<{
		code: string;
		name: string;
		fullName: string;
	} | null>(null);
	const [activeViewTab, setActiveViewTab] = useState<ViewTab>("graph");

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
	}, []);

	const handleAnalysis = useCallback(() => {
		setViewMode("analysis");
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

	// 히트맵 모드에서 선택된 지역의 데이터 미제공 여부
	const isHeatmapDataMissing =
		heatmap.isHeatmapActive &&
		selectedRegion &&
		heatmap.choroplethData &&
		heatmap.choroplethData.values[selectedRegion.code] === undefined;

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

					{/* 우측: 지표 메트릭 리스트 */}
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
						{isHeatmapDataMissing ? (
							<div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
								<div className="flex size-12 items-center justify-center rounded-full bg-fill-alt">
									<X className="size-5 text-label-assistive" />
								</div>
								<div className="flex flex-col items-center gap-1">
									<p className="text-body-1 font-semibold text-label-normal">
										데이터 미제공
									</p>
									<p className="text-body-2 text-label-alternative">
										해당 지역의 {heatmap.heatmapLabel ?? "카테고리"} 데이터가 제공되지 않습니다.
									</p>
								</div>
							</div>
						) : (
							<>
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
								{viewMode === "preview" && (
									<MetricActionButtons
										showAnalysis
										onAnalysisClick={handleAnalysis}
									/>
								)}
							</>
						)}
					</section>
				</div>

				{/* ── 하단: 추이 차트 ── */}
				<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
					<CardSectionHeader
						title={chartRegionLabel}
						description="월별 인구수 변화 추이"
					/>
					<div className="flex gap-2">
						{VIEW_TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								className={cn(
									"min-h-[44px] rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
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

					{activeViewTab === "graph" && (
						<BarChart data={currentChartData} config={SINGLE_CHART_CONFIG} />
					)}

					{activeViewTab === "table" && (
						<DataTable data={currentChartData} config={SINGLE_CHART_CONFIG} />
					)}

					{activeViewTab === "treemap" && (
						<div className="flex min-h-[200px] items-center justify-center">
							<p className="text-[16px] font-medium leading-[1.5] text-label-alternative">
								준비 중입니다
							</p>
						</div>
					)}
				</section>
			</div>
		</>
	);
}
