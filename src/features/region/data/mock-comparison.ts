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
