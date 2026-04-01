import type { MapTooltipData } from "@/features/region/components/map/MapTooltip";

/** 시드 기반 mock 데이터 생성 — SGG_Code에서 결정적으로 값 도출 */
function generateMockData(sggCode: string): MapTooltipData {
	// SGG_Code의 숫자를 시드로 사용하여 일관된 mock 값 생성
	const seed = parseInt(sggCode, 10);
	const voterCount = 5000 + (seed % 10000);
	const totalRatio = 20 + (seed % 60);
	const progressive = 15 + ((seed * 7) % 50);
	const conservative = 100 - progressive - (5 + (seed % 15));
	return {
		voterCount,
		totalRatio: Math.round(totalRatio),
		progressive: Math.round(progressive * 10) / 10,
		conservative: Math.round(conservative * 10) / 10,
	};
}

// 주요 지역 하드코딩 + 나머지 팩토리 생성
const HARDCODED: Record<string, MapTooltipData> = {
	"2112301": { voterCount: 9523, totalRatio: 38, progressive: 35.2, conservative: 60.1 },
	"2112302": { voterCount: 8871, totalRatio: 36, progressive: 33.8, conservative: 61.5 },
	"2112303": { voterCount: 9899, totalRatio: 42, progressive: 29.8, conservative: 65.9 },
};

/** 선거구별 mock 툴팁 데이터. 없는 코드는 generateMockData로 폴백. */
export function getConstituencyTooltipData(sggCode: string): MapTooltipData {
	return HARDCODED[sggCode] ?? generateMockData(sggCode);
}

/** Record 형태로 내보내기 (KoreaAdminMap의 constituencyTooltipData prop용) */
export const CONSTITUENCY_TOOLTIP_MOCK: Record<string, MapTooltipData> = new Proxy(
	HARDCODED,
	{
		get: (_target, prop) => {
			if (typeof prop === "symbol") return undefined;
			return HARDCODED[prop] ?? generateMockData(prop);
		},
		has: (_target, prop) => typeof prop === "string",
	},
);
