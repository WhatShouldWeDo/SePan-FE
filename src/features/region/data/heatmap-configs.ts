import type { MapLevel, ChoroplethData, ChoroplethConfig } from "@/types/map";

/** 히트맵 지원 카테고리 설정 (순수 설정, mock 데이터와 분리) */
export interface HeatmapCategoryConfig {
	categoryId: string;
	label: string;
	unit: string;
	/** oklch "L C H" — 최솟값 (연한 색) */
	colorMin: string;
	/** oklch "L C H" — 최댓값 (진한 색) */
	colorMax: string;
}

/** 히트맵 지원 카테고리 설정 맵 — 여기에 등록된 카테고리만 히트맵 활성화 */
export const HEATMAP_CATEGORY_CONFIGS: Record<string, HeatmapCategoryConfig> = {
	transport: {
		categoryId: "transport",
		label: "교통 혼잡도",
		unit: "점",
		colorMin: "0.92 0.03 145",
		colorMax: "0.45 0.16 145",
	},
};

/** HeatmapCategoryConfig → ChoroplethConfig 변환 */
export function buildHeatmapChoroplethConfig(
	config: HeatmapCategoryConfig,
): ChoroplethConfig {
	return {
		colorMin: config.colorMin,
		colorMax: config.colorMax,
		legendTitle: config.label,
		legendUnit: config.unit,
		legendSteps: 5,
	};
}

/**
 * 시드 기반 의사난수 (동일 입력 → 동일 출력)
 * @see https://en.wikipedia.org/wiki/Mulberry32
 */
function mulberry32(seed: number): () => number {
	let s = seed | 0;
	return () => {
		s = (s + 0x6d2b79f5) | 0;
		let t = Math.imul(s ^ (s >>> 15), 1 | s);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** 문자열을 간단한 해시 숫자로 변환 */
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
	}
	return hash;
}

/**
 * 지역 코드 목록으로 mock ChoroplethData 생성
 * @param codes - 현재 레벨에서 보이는 지역 코드 배열
 * @param level - 현재 드릴다운 레벨 (시드 분기용)
 * @param missingRatio - 데이터 미제공 비율 (0~1, 기본 0.15)
 */
export function generateMockHeatmapData(
	codes: string[],
	level: MapLevel,
	missingRatio = 0.15,
): ChoroplethData {
	const seed = hashString(`heatmap-${level}`);
	const rand = mulberry32(seed);

	const values: Record<string, number> = {};
	for (const code of codes) {
		// 일부 지역은 의도적 누락 (데이터 미제공 테스트)
		const codeRand = mulberry32(hashString(code + level));
		if (codeRand() < missingRatio) continue;

		// 0~100 범위의 mock 값
		values[code] = Math.round(rand() * 1000) / 10;
	}

	return { values };
}
