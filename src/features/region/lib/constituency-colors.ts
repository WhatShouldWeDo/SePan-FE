/** 선거구 구분 색상 팔레트 — 인접 인덱스 간 hue 차이 극대화 */
export const CONSTITUENCY_PALETTE: ReadonlyArray<{ base: string; hover: string }> = [
	{ base: "oklch(0.65 0.18 280)", hover: "oklch(0.60 0.24 280)" },  // 보라
	{ base: "oklch(0.65 0.15 185)", hover: "oklch(0.60 0.21 185)" },  // 청록
	{ base: "oklch(0.70 0.15 60)",  hover: "oklch(0.65 0.21 60)"  },  // 주황
	{ base: "oklch(0.65 0.15 340)", hover: "oklch(0.60 0.21 340)" },  // 핑크
	{ base: "oklch(0.72 0.12 280)", hover: "oklch(0.67 0.18 280)" },  // 연보라
	{ base: "oklch(0.65 0.15 145)", hover: "oklch(0.60 0.21 145)" },  // 녹색
	{ base: "oklch(0.65 0.15 25)",  hover: "oklch(0.60 0.21 25)"  },  // 코랄
	{ base: "oklch(0.70 0.12 220)", hover: "oklch(0.65 0.18 220)" },  // 하늘
];

export interface ConstituencyColorEntry {
	base: string;
	hover: string;
	sggCode: string;
}

/**
 * 현재 뷰의 EMD FeatureCollection에서 EMD_CD → 선거구 색상 맵을 빌드한다.
 * eupMyeonDong 레벨에서만 호출할 것.
 *
 * @param emdFeatures eupMyeonDong 레벨의 FeatureCollection (EMD_CD, SGG_Code 필수)
 */
export function buildConstituencyColorMap(
	emdFeatures: GeoJSON.FeatureCollection,
): Map<string, ConstituencyColorEntry> {
	// 1. 고유 SGG_Code 추출 + 정렬
	const sggCodes = new Set<string>();
	for (const f of emdFeatures.features) {
		const code = f.properties?.SGG_Code as string | undefined;
		if (code) sggCodes.add(code);
	}
	const sortedSggCodes = [...sggCodes].sort();

	// 2. SGG_Code → 팔레트 인덱스 배정
	const sggToColor = new Map<string, { base: string; hover: string }>();
	sortedSggCodes.forEach((code, i) => {
		sggToColor.set(code, CONSTITUENCY_PALETTE[i % CONSTITUENCY_PALETTE.length]);
	});

	// 3. EMD_CD → 색상 + SGG_Code 매핑
	const result = new Map<string, ConstituencyColorEntry>();
	for (const f of emdFeatures.features) {
		const emdCd = f.properties?.EMD_CD as string;
		const sggCode = f.properties?.SGG_Code as string;
		const colors = sggToColor.get(sggCode);
		if (emdCd && colors) {
			result.set(emdCd, { ...colors, sggCode });
		}
	}
	return result;
}
