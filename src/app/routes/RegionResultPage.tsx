import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams } from "react-router-dom";

import { CategoryNav } from "@/components/ui/category-nav";
import { CardSectionHeader } from "@/components/ui/card-section-header";
import { Chip } from "@/components/ui/chip";
import { Badge } from "@/components/ui/badge";
import { BarChart } from "@/components/charts";
import { KoreaAdminMap } from "@/features/region/components/map";
import { MetricListRow } from "@/features/region/components/MetricListRow";
import { AiAnalysisBox } from "@/features/region/components/AiAnalysisBox";
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories";
import { useBreadcrumb, useGnbPanel } from "@/contexts/useNavigation";
import {
	MY_REGION,
	MY_REGION_METRICS,
	MY_REGION_MONTHLY,
	SELECTED_REGION_METRICS,
	SELECTED_REGION_MONTHLY,
	MOCK_AI_ANALYSIS,
	mergeMonthlyData,
	MOCK_COMPARISON_SUMMARY,
} from "@/features/region/data/mock-comparison";
import type { MetricRowData } from "@/features/region/data/mock-comparison";
import type { ChartConfig } from "@/types/chart";
import type { MapRegion } from "@/types/map";

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */

const CHART_CONFIG: ChartConfig = {
	xKey: "month",
	// #6B5CFF = --violet-500 = --primary (Recharts는 hex만 허용)
	series: [{ key: "population", label: "인구수", color: "#6B5CFF" }],
	height: 400,
	showLegend: false,
};

type ChipFilter = "yearly" | "quarterly" | "monthly";

const CHIP_FILTERS: { id: ChipFilter; label: string }[] = [
	{ id: "yearly", label: "연도별" },
	{ id: "quarterly", label: "분기별" },
	{ id: "monthly", label: "월별" },
];

/* ═══════════════════════════════════════════════════════════
   Page Component
   ═══════════════════════════════════════════════════════════ */

type ViewMode = "default" | "preview" | "analysis" | "compare";

export function RegionResultPage() {
	const { regionId } = useParams();

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

	const handleRegionSelect = useCallback(
		(region: MapRegion) => {
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
		},
		[],
	);

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
			// 서브카테고리 선택 시 화면 최상단으로 부드럽게 이동
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

	const chartTitle =
		viewMode === "compare"
			? `인구수 추이 — ${MY_REGION.name} vs ${selectedRegion?.fullName ?? ""}`
			: "인구수 추이";

	// TODO: regionId로 API 조회 후 실제 지역명 표시
	void regionId;

	const selectedCategoryLabel =
		CATEGORIES.find((c) => c.id === selectedCategoryId)?.label ??
		selectedCategoryId;

	useBreadcrumb([
		{ label: "지역분석" },
		{ label: regionDisplayName },
		{ label: selectedCategoryLabel },
	]);

	const { panelEl } = useGnbPanel();

	// Suppress unused variable warnings for handlers used in future tasks
	void handleAnalysis;
	void handleCompare;
	void handleReset;
	void compareChartSplit;
	void mergeMonthlyData;
	void MOCK_COMPARISON_SUMMARY;
	void currentChartData;
	void chartTitle;

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
					<p className="text-body-2 font-medium leading-[1.5] text-label-alternative">
						지역 분석 데이터와 역대 공약을 기반으로 최적의 정책을 추천합니다.
					</p>
				</div>

				{/* ── AI 분석 결과 ── */}
				<AiAnalysisBox text={MOCK_AI_ANALYSIS} />

				{/* ── 2열 카드 섹션: 지도 + 지표 ── */}
				<div className="grid grid-cols-2 gap-4 2xl:gap-6">
					{/* 좌측: 폴리곤 지도 */}
					<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={MY_REGION.districtName}
							description="선거구 단위"
						/>
						<div className="flex items-center justify-center">
							<KoreaAdminMap
							onRegionSelect={handleRegionSelect}
							className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full"
						/>
						</div>
					</section>

					{/* 우측: 지표 메트릭 리스트 */}
					<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={regionDisplayName}
							description="행정안전부 2026년 1월"
							trailingContent={
								<Badge
									variant="ghost"
									size="md"
									className="bg-primary-alpha-5 text-primary"
								>
									내 선거구
								</Badge>
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
					</section>
				</div>

				{/* ── 하단: 추이 차트 ── */}
				<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
					<CardSectionHeader
						title="인구수 추이"
						description="월별 인구수 변화 추이"
					/>

					{/* Chip 필터 */}
					<div className="flex gap-2">
						{CHIP_FILTERS.map((chip) => (
							<Chip
								key={chip.id}
								label={chip.label}
								size="medium"
								state={activeChip === chip.id ? "active" : "default"}
								variant="outlined"
								onClick={() => setActiveChip(chip.id)}
							/>
						))}
					</div>

					{/* BarChart */}
					<BarChart data={MY_REGION_MONTHLY} config={CHART_CONFIG} />
				</section>
			</div>
		</>
	);
}
