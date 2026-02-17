import type {
	ChoroplethData,
	ChoroplethConfig,
	LegendItem,
} from "@/types/map";

/**
 * OKLCH 색상 보간
 *
 * @description
 * - oklch(L C H) 형식의 두 색상 사이를 t(0~1) 비율로 보간
 * - 인지적으로 균일한 색상 전환 제공
 *
 * @param colorMin - 최솟값 색상 "L C H" (예: "0.95 0.02 250")
 * @param colorMax - 최댓값 색상 "L C H" (예: "0.45 0.2 250")
 * @param t - 보간 비율 (0 = min, 1 = max)
 * @returns oklch() CSS 색상 문자열
 */
export function interpolateOklch(
	colorMin: string,
	colorMax: string,
	t: number,
): string {
	const [l1, c1, h1] = colorMin.split(" ").map(Number);
	const [l2, c2, h2] = colorMax.split(" ").map(Number);

	const clampedT = Math.max(0, Math.min(1, t));

	const l = l1 + (l2 - l1) * clampedT;
	const c = c1 + (c2 - c1) * clampedT;
	const h = h1 + (h2 - h1) * clampedT;

	return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(1)})`;
}

/**
 * 지역 코드에 대한 Choropleth 색상 계산
 *
 * @param code - 지역 코드
 * @param data - Choropleth 데이터
 * @param config - Choropleth 설정
 * @returns oklch() CSS 색상 문자열, 데이터 없으면 null
 */
export function getChoroplethColor(
	code: string,
	data: ChoroplethData,
	config: ChoroplethConfig,
): string | null {
	const value = data.values[code];
	if (value === undefined) return null;

	const values = Object.values(data.values);
	const min = data.min ?? Math.min(...values);
	const max = data.max ?? Math.max(...values);

	if (max === min) return interpolateOklch(config.colorMin, config.colorMax, 0.5);

	const t = (value - min) / (max - min);
	return interpolateOklch(config.colorMin, config.colorMax, t);
}

/**
 * 범례 항목 생성
 *
 * @param data - Choropleth 데이터
 * @param config - Choropleth 설정
 * @returns 범례 항목 배열
 */
export function buildLegendItems(
	data: ChoroplethData,
	config: ChoroplethConfig,
): LegendItem[] {
	const values = Object.values(data.values);
	const min = data.min ?? Math.min(...values);
	const max = data.max ?? Math.max(...values);
	const steps = config.legendSteps ?? 5;

	const items: LegendItem[] = [];
	const stepSize = (max - min) / steps;

	for (let i = 0; i < steps; i++) {
		const t = i / (steps - 1);
		const rangeStart = min + stepSize * i;
		const rangeEnd = i === steps - 1 ? max : min + stepSize * (i + 1);

		items.push({
			color: interpolateOklch(config.colorMin, config.colorMax, t),
			label: `${formatNumber(rangeStart)}~${formatNumber(rangeEnd)}${config.legendUnit}`,
		});
	}

	return items;
}

/** 숫자를 간결하게 포맷 (소수점 이하가 있으면 1자리) */
function formatNumber(n: number): string {
	if (Number.isInteger(n)) return n.toLocaleString("ko-KR");
	return n.toLocaleString("ko-KR", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1,
	});
}
