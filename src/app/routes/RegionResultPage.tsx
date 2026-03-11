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
import type { DeltaInfo } from "@/features/region/components/MetricListRow";
import type { ChartData, ChartConfig } from "@/types/chart";

/* ═══════════════════════════════════════════════════════════
   Mock Data — API 연동 전 하드코딩
   ═══════════════════════════════════════════════════════════ */

interface MetricRowData {
	label: string;
	value: string;
	unit?: string;
	subValueBadge?: string;
	deltas?: DeltaInfo[];
}

const MOCK_REGION_NAME = "강남구 갑";
const MOCK_DISTRICT_NAME = "강남구";

const MOCK_AI_ANALYSIS =
	"고학력·고소득 신도시형 선거구로 진보-보수 경합지역. IT 산업 집중으로 청년층 비중 높음.";

const MOCK_METRICS: MetricRowData[] = [
	{
		label: "인구수",
		value: "207,018",
		unit: "명",
		deltas: [
			{ label: "전년대비", value: "4.5%", direction: "up", color: "blue" },
		],
	},
	{
		label: "중위연령",
		value: "51.3",
		unit: "세",
		deltas: [
			{ label: "전년대비", value: "6.1세", direction: "up", color: "red" },
			{
				label: "전국평균 대비",
				value: "8.4%",
				direction: "up",
				color: "red",
			},
		],
	},
	{
		label: "남녀비율",
		value: "103.00",
		deltas: [
			{ label: "남성이 많음", value: "4.5%", direction: "up", color: "blue" },
		],
	},
	{
		label: "남성인구",
		value: "104,949",
		unit: "명",
		subValueBadge: "50.7%",
	},
	{
		label: "여성인구",
		value: "102,069",
		unit: "명",
		subValueBadge: "49.3%",
	},
];

/** 월별 인구수 추이 (BarChart 데이터) */
const MOCK_MONTHLY_DATA: ChartData = [
	{ month: "Jan", population: 195000 },
	{ month: "Feb", population: 188000 },
	{ month: "Mar", population: 190000 },
	{ month: "Apr", population: 185000 },
	{ month: "May", population: 192000 },
	{ month: "Jun", population: 187000 },
	{ month: "Jul", population: 198000 },
	{ month: "Aug", population: 191000 },
	{ month: "Sep", population: 193000 },
	{ month: "Oct", population: 189000 },
	{ month: "Nov", population: 192000 },
	{ month: "Dec", population: 197000 },
];

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

export function RegionResultPage() {
	const { regionId } = useParams();

	const [selectedCategoryId, setSelectedCategoryId] = useState("voter");
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
		string | null
	>("population");
	const [activeChip, setActiveChip] = useState<ChipFilter>("monthly");

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

	// TODO: regionId로 API 조회 후 실제 지역명 표시
	const regionDisplayName = MOCK_REGION_NAME;
	void regionId;

	const selectedCategoryLabel =
		CATEGORIES.find((c) => c.id === selectedCategoryId)?.label ?? selectedCategoryId;

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
					/>,
					panelEl,
				)}

			<div className="flex flex-col gap-6 px-[56px] py-4">
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
							title={MOCK_DISTRICT_NAME}
							description="선거구 단위"
						/>
						<div className="flex items-center justify-center">
							<KoreaAdminMap className="h-[460px] w-full [&>svg]:h-full [&>svg]:w-full" />
						</div>
					</section>

					{/* 우측: 지표 메트릭 리스트 */}
					<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
						<CardSectionHeader
							title={MOCK_REGION_NAME}
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
							{MOCK_METRICS.map((metric) => (
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
					<BarChart data={MOCK_MONTHLY_DATA} config={CHART_CONFIG} />
				</section>
			</div>
		</>
	);
}
