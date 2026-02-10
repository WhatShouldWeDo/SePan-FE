// 폴리곤 지도 색상 테마

/**
 * 폴리곤 지도 색상 팔레트
 * @description chart-theme.ts 패턴과 동일. CSS 변수 기반.
 */
export const mapColors = {
	/** 기본 폴리곤 채우기 */
	fill: "oklch(var(--map-fill))",
	/** hover 시 폴리곤 채우기 */
	fillHover: "oklch(var(--map-fill-hover))",
	/** 선택된 폴리곤 채우기 */
	fillSelected: "oklch(var(--map-fill-selected))",
	/** 폴리곤 테두리 */
	stroke: "oklch(var(--map-stroke))",
	/** 라벨 텍스트 */
	label: "oklch(var(--map-label))",
	/** 검색 결과 하이라이트 */
	fillSearchHighlight: "oklch(var(--map-fill-search-highlight))",
} as const;
