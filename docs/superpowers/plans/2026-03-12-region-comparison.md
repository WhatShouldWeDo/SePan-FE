# 지역 비교분석 기능 구현 계획

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** RegionResultPage에 4가지 뷰 모드(default/preview/analysis/compare)를 추가하여 지도 선택 → 분석 → 비교분석 흐름을 구현한다.

**Architecture:** `ViewMode` 상태를 중심으로 조건부 렌더링. 신규 컴포넌트 3개(MetricActionButtons, MetricComparisonCard, ComparisonSummaryBox)를 features/region/components에 추가. 기존 BarChart는 multi-series config로 Grouped Bar를 지원하므로 추가 수정 불필요.

**Tech Stack:** React, TypeScript, Tailwind CSS, 기존 Button/Switch/CardSectionHeader/BarChart 컴포넌트 활용

**Spec:** `docs/superpowers/specs/2026-03-12-region-comparison-design.md`

---

## 파일 구조

### 신규 생성
- `src/features/region/components/MetricActionButtons.tsx` — "분석 결과 보기" + "비교분석 하기" 버튼 영역
- `src/features/region/components/MetricComparisonCard.tsx` — 비교 모드용 좌우 분할 메트릭 카드
- `src/features/region/components/ComparisonSummaryBox.tsx` — 비교 해석 텍스트 박스
- `src/features/region/data/mock-comparison.ts` — 선택 지역용 Mock 데이터

### 수정
- `src/app/routes/RegionResultPage.tsx` — ViewMode 상태 관리, 조건부 렌더링, 차트 config 분기

---

## Chunk 1: Mock 데이터 + 상태 모델

### Task 1: 선택 지역용 Mock 데이터 추가

**Files:**
- Create: `src/features/region/data/mock-comparison.ts`

- [ ] **Step 1: Mock 데이터 파일 생성**

```typescript
// src/features/region/data/mock-comparison.ts
import type { ChartData } from "@/types/chart";
import type { DeltaInfo } from "@/features/region/components/MetricListRow";

export type { DeltaInfo };

export interface MetricRowData {
	label: string;
	value: string;
	unit?: string;
	subValueBadge?: string;
	deltas?: DeltaInfo[];
}

/** 내 선거구 (강남구 갑) 기본 데이터 */
export const MY_REGION = {
	name: "강남구 갑",
	fullName: "서울 강남구 갑",
	districtName: "강남구",
} as const;

/** 내 선거구 메트릭 */
export const MY_REGION_METRICS: MetricRowData[] = [
	{
		label: "인구수",
		value: "207,018",
		unit: "명",
		deltas: [{ label: "전년대비", value: "4.5%", direction: "up", color: "blue" }],
	},
	{
		label: "중위연령",
		value: "51.3",
		unit: "세",
		deltas: [
			{ label: "전년대비", value: "6.1세", direction: "up", color: "red" },
			{ label: "전국평균 대비", value: "8.4%", direction: "up", color: "red" },
		],
	},
	{
		label: "남녀비율",
		value: "103.00",
		deltas: [{ label: "남성이 많음", value: "4.5%", direction: "up", color: "blue" }],
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

/** 내 선거구 월별 추이 */
export const MY_REGION_MONTHLY: ChartData = [
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

/** 선택 지역 (종로) Mock 메트릭 */
export const SELECTED_REGION_METRICS: MetricRowData[] = [
	{
		label: "인구수",
		value: "152,340",
		unit: "명",
		deltas: [{ label: "전년대비", value: "2.1%", direction: "down", color: "red" }],
	},
	{
		label: "중위연령",
		value: "48.7",
		unit: "세",
		deltas: [
			{ label: "전년대비", value: "3.2세", direction: "up", color: "red" },
			{ label: "전국평균 대비", value: "3.1%", direction: "up", color: "blue" },
		],
	},
	{
		label: "남녀비율",
		value: "97.20",
		deltas: [{ label: "여성이 많음", value: "2.8%", direction: "down", color: "red" }],
	},
	{
		label: "남성인구",
		value: "74,580",
		unit: "명",
		subValueBadge: "49.0%",
	},
	{
		label: "여성인구",
		value: "77,760",
		unit: "명",
		subValueBadge: "51.0%",
	},
];

/** 선택 지역 월별 추이 */
export const SELECTED_REGION_MONTHLY: ChartData = [
	{ month: "Jan", population: 155000 },
	{ month: "Feb", population: 151000 },
	{ month: "Mar", population: 153000 },
	{ month: "Apr", population: 149000 },
	{ month: "May", population: 154000 },
	{ month: "Jun", population: 150000 },
	{ month: "Jul", population: 156000 },
	{ month: "Aug", population: 152000 },
	{ month: "Sep", population: 153000 },
	{ month: "Oct", population: 148000 },
	{ month: "Nov", population: 151000 },
	{ month: "Dec", population: 154000 },
];

/** 비교 모드용 합산 데이터 (Grouped Bar) */
export function mergeMonthlyData(
	myData: ChartData,
	selectedData: ChartData,
): ChartData {
	return myData.map((row, i) => ({
		month: row.month,
		myPopulation: row.population,
		selectedPopulation: selectedData[i]?.population ?? 0,
	}));
}

/** Mock 비교 해석 텍스트 */
export const MOCK_COMPARISON_SUMMARY =
	"강남구 갑은 종로 대비 인구가 36% 많고, 중위연령이 2.6세 높습니다. 남녀비율에서 강남구 갑은 남성 비율이 높은 반면 종로는 여성 비율이 높습니다.";

/** Mock AI 분석 텍스트 */
export const MOCK_AI_ANALYSIS =
	"고학력·고소득 신도시형 선거구로 진보-보수 경합지역. IT 산업 집중으로 청년층 비중 높음.";
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/region/data/mock-comparison.ts
git commit -m "feat: 지역 비교분석용 Mock 데이터 추가"
```

---

### Task 2: ViewMode 상태 + 지도 클릭 핸들러 리팩토링

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx`

- [ ] **Step 1: import 변경 및 기존 Mock 제거 → mock-comparison.ts에서 import**

RegionResultPage.tsx 상단의 기존 Mock 데이터(MOCK_REGION_NAME, MOCK_DISTRICT_NAME, MOCK_AI_ANALYSIS, MOCK_METRICS, MOCK_MONTHLY_DATA, MetricRowData interface)를 제거하고 `mock-comparison.ts`에서 import:

```typescript
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
```

- [ ] **Step 2: ViewMode 타입 + 상태 추가**

컴포넌트 함수 내부에서 기존 `selectedRegionName` 상태를 제거하고 다음으로 교체:

```typescript
type ViewMode = "default" | "preview" | "analysis" | "compare";

// 기존 selectedRegionName 상태 제거, 아래로 교체
const [viewMode, setViewMode] = useState<ViewMode>("default");
const [selectedRegion, setSelectedRegion] = useState<{
	code: string;
	name: string;
	fullName: string;
} | null>(null);
const [compareChartSplit, setCompareChartSplit] = useState(false);
```

- [ ] **Step 3: 핸들러 업데이트**

```typescript
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
```

- [ ] **Step 4: 파생 값 업데이트**

```typescript
// regionDisplayName 교체
const regionDisplayName =
	viewMode === "default" || !selectedRegion
		? MY_REGION.name
		: selectedRegion.fullName;

// 현재 보여줄 메트릭 결정
const currentMetrics: MetricRowData[] =
	viewMode === "default" ? MY_REGION_METRICS : SELECTED_REGION_METRICS;

// 현재 보여줄 차트 데이터 결정
const currentChartData =
	viewMode === "default" || viewMode === "preview"
		? MY_REGION_MONTHLY
		: SELECTED_REGION_MONTHLY;

// 차트 제목
const chartTitle =
	viewMode === "compare"
		? `인구수 추이 — ${MY_REGION.name} vs ${selectedRegion?.fullName ?? ""}`
		: "인구수 추이";
```

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 6: 커밋**

```bash
git add src/app/routes/RegionResultPage.tsx
git commit -m "refactor: ViewMode 상태 모델 + 핸들러 도입"
```

---

## Chunk 2: 신규 컴포넌트 3개

### Task 3: MetricActionButtons 컴포넌트

**Files:**
- Create: `src/features/region/components/MetricActionButtons.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```typescript
// src/features/region/components/MetricActionButtons.tsx
import { Button } from "@/components/ui/button";

interface MetricActionButtonsProps {
	/** "분석 결과 보기"를 보여줄지 (preview 모드에서만 true) */
	showAnalysis: boolean;
	onAnalysisClick: () => void;
	onCompareClick: () => void;
}

export function MetricActionButtons({
	showAnalysis,
	onAnalysisClick,
	onCompareClick,
}: MetricActionButtonsProps) {
	return (
		<div className="flex gap-3">
			{showAnalysis && (
				<Button variant="default" size="lg" className="flex-1" onClick={onAnalysisClick}>
					분석 결과 보기
				</Button>
			)}
			<Button
				variant="outline"
				size="lg"
				className={showAnalysis ? "flex-1" : "w-full"}
				onClick={onCompareClick}
			>
				내 선거구와 비교분석 하기
			</Button>
		</div>
	);
}
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/region/components/MetricActionButtons.tsx
git commit -m "feat: MetricActionButtons 컴포넌트 추가"
```

---

### Task 4: ComparisonSummaryBox 컴포넌트

**Files:**
- Create: `src/features/region/components/ComparisonSummaryBox.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```typescript
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
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/region/components/ComparisonSummaryBox.tsx
git commit -m "feat: ComparisonSummaryBox 컴포넌트 추가"
```

---

### Task 5: MetricComparisonCard 컴포넌트

**Files:**
- Create: `src/features/region/components/MetricComparisonCard.tsx`

- [ ] **Step 1: 컴포넌트 생성**

```typescript
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
```

- [ ] **Step 2: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 3: 커밋**

```bash
git add src/features/region/components/MetricComparisonCard.tsx
git commit -m "feat: MetricComparisonCard 비교 모드 카드 추가"
```

---

## Chunk 3: RegionResultPage 조건부 렌더링

### Task 6: 메트릭 카드 섹션 조건부 렌더링

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx`

- [ ] **Step 1: 신규 컴포넌트 import 추가**

```typescript
import { MetricActionButtons } from "@/features/region/components/MetricActionButtons";
import { MetricComparisonCard } from "@/features/region/components/MetricComparisonCard";
```

- [ ] **Step 2: 우측 메트릭 카드 섹션 교체**

기존 우측 `<section>` ("우측: 지표 메트릭 리스트" 주석이 있는 섹션)을 교체:

```tsx
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
			title={viewMode === "default" ? MY_REGION.name : (selectedRegion?.fullName ?? MY_REGION.name)}
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
		{/* 액션 버튼 (preview, analysis 모드) */}
		{viewMode !== "default" && (
			<MetricActionButtons
				showAnalysis={viewMode === "preview"}
				onAnalysisClick={handleAnalysis}
				onCompareClick={handleCompare}
			/>
		)}
	</section>
)}
```

- [ ] **Step 3: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 4: 개발 서버에서 동작 확인**

Run: `pnpm run dev`
확인 사항:
- 페이지 진입 → "강남구 갑" 데이터 표시, 버튼 없음 (default)
- 지도에서 타 지역 클릭 → 선택 지역 메트릭 + 버튼 2개 (preview)
- "분석 결과 보기" 클릭 → 버튼 1개만 (analysis)
- "비교분석" 클릭 → 좌우 카드 + 해석 박스 (compare)
- "초기화" 클릭 → preview로 복귀

- [ ] **Step 5: 커밋**

```bash
git add src/app/routes/RegionResultPage.tsx
git commit -m "feat: 메트릭 카드 ViewMode별 조건부 렌더링"
```

---

### Task 7: 하단 차트 섹션 조건부 렌더링 + Switch 토글

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx`

- [ ] **Step 1: Switch import 추가**

```typescript
import { Switch } from "@/components/ui/switch";
```

- [ ] **Step 2: 차트 config 파생 값 추가**

핸들러/파생 값 영역에 추가:

```typescript
// 비교 모드 Grouped Bar config
const compareChartConfig: ChartConfig = {
	xKey: "month",
	series: [
		{ key: "myPopulation", label: MY_REGION.name, color: "#6B5CFF" },
		{ key: "selectedPopulation", label: selectedRegion?.fullName ?? "", color: "#FF6B6B" },
	],
	height: 400,
	showLegend: true,
};

// 단일 지역 차트 config
const singleChartConfig: ChartConfig = {
	xKey: "month",
	series: [{ key: "population", label: "인구수", color: "#6B5CFF" }],
	height: 400,
	showLegend: false,
};
```

- [ ] **Step 3: 하단 차트 섹션 교체**

기존 하단 `<section>` (차트 섹션)을 교체:

```tsx
{/* ── 하단: 추이 차트 ── */}
{viewMode === "compare" && selectedRegion ? (
	<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
		<CardSectionHeader
			title={chartTitle}
			description="월별 인구수 변화 추이"
			trailingContent={
				<div className="flex items-center gap-2">
					<span className="text-label-4 text-label-alternative">
						분리 보기
					</span>
					<Switch
						size="sm"
						checked={compareChartSplit}
						onCheckedChange={setCompareChartSplit}
					/>
				</div>
			}
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

		{/* 차트: Grouped Bar or 좌우 분리 */}
		{compareChartSplit ? (
			<div className="grid grid-cols-2 gap-6">
				<div>
					<p className="text-label-3 font-semibold text-primary mb-4">
						{MY_REGION.name}
					</p>
					<BarChart data={MY_REGION_MONTHLY} config={singleChartConfig} />
				</div>
				<div>
					<p className="text-label-3 font-semibold text-status-negative mb-4">
						{selectedRegion.fullName}
					</p>
					<BarChart
						data={SELECTED_REGION_MONTHLY}
						config={{
							...singleChartConfig,
							series: [{ key: "population", label: "인구수", color: "#FF6B6B" }],
						}}
					/>
				</div>
			</div>
		) : (
			<BarChart
				data={mergeMonthlyData(MY_REGION_MONTHLY, SELECTED_REGION_MONTHLY)}
				config={compareChartConfig}
			/>
		)}
	</section>
) : (
	<section className="flex flex-col gap-8 rounded-3xl border border-line-neutral p-8">
		<CardSectionHeader
			title={chartTitle}
			description="월별 인구수 변화 추이"
		/>
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
		<BarChart data={currentChartData} config={singleChartConfig} />
	</section>
)}
```

- [ ] **Step 4: 기존 CHART_CONFIG 상수 제거**

`CHART_CONFIG` 상수를 제거 (이제 `singleChartConfig`/`compareChartConfig`로 대체됨).

- [ ] **Step 5: 타입 체크**

Run: `npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 6: 개발 서버에서 동작 확인**

확인 사항:
- default 모드: 내 선거구 차트, Switch 없음
- preview 모드: 내 선거구 차트 유지
- analysis 모드: 선택 지역 차트로 변경
- compare 모드: Grouped Bar + Switch 표시
- Switch On: 좌우 분리 차트
- Switch Off: Grouped Bar

- [ ] **Step 7: 커밋**

```bash
git add src/app/routes/RegionResultPage.tsx
git commit -m "feat: 비교 모드 차트 + Switch 토글 (Grouped/분리)"
```

---

## Chunk 4: 정리 + 최종 확인

### Task 8: RegionResultPage 정리 및 최종 검증

**Files:**
- Modify: `src/app/routes/RegionResultPage.tsx`

- [ ] **Step 1: 검증 — Task 2, 7에서 제거한 항목 확인**

Task 2에서 기존 Mock 상수/인터페이스가 제거되었는지, Task 7에서 CHART_CONFIG이 제거되었는지 확인.
남은 미사용 import가 있으면 정리.

- [ ] **Step 2: 좌측 지도 카드의 제목도 동적으로**

지도 카드의 `CardSectionHeader` title을 동적으로:

```tsx
<CardSectionHeader
	title={viewMode === "default" ? MY_REGION.districtName : (selectedRegion?.name ?? MY_REGION.districtName)}
	description="선거구 단위"
/>
```

- [ ] **Step 3: 린트 + 타입 체크**

Run: `pnpm run lint && npx tsc --noEmit`
Expected: 에러 없음

- [ ] **Step 4: 전체 빌드 확인**

Run: `pnpm run build`
Expected: 빌드 성공 (기존 pre-existing 에러 제외)

- [ ] **Step 5: 개발 서버 전체 플로우 테스트**

Run: `pnpm run dev`
전체 시나리오 테스트:
1. 페이지 진입 → 강남구 갑 데이터 (default)
2. 지도 타 지역 클릭 → 선택 지역 미리보기 + 버튼 2개 (preview)
3. "분석 결과 보기" → 선택 지역 단독 + 차트 변경 (analysis)
4. "비교분석" → 좌우 카드 + Grouped Bar (compare)
5. Switch 토글 → 분리 차트
6. "초기화" → preview 복귀
7. 지도 새 지역 클릭 → preview (새 지역)
8. 지도에서 강남구 갑 클릭 → default

- [ ] **Step 6: 최종 커밋**

```bash
git add -A
git commit -m "refactor: RegionResultPage Mock 데이터 정리 및 최종 검증"
```

---

### Task 9: 문서 업데이트

**Files:**
- Modify: `docs/MODULE_MAP.md` (있다면)
- Move: `docs/superpowers/plans/2026-03-12-region-comparison.md` → archived (완료 시)

- [ ] **Step 1: MODULE_MAP.md에 신규 컴포넌트 반영**

```markdown
- `src/features/region/components/MetricActionButtons.tsx` — 분석/비교 액션 버튼
- `src/features/region/components/MetricComparisonCard.tsx` — 비교 모드 좌우 메트릭 카드
- `src/features/region/components/ComparisonSummaryBox.tsx` — 비교 해석 텍스트 박스
- `src/features/region/data/mock-comparison.ts` — 비교분석 Mock 데이터
```

- [ ] **Step 2: 커밋**

```bash
git add docs/
git commit -m "docs: 지역 비교분석 컴포넌트 MODULE_MAP 반영"
```
