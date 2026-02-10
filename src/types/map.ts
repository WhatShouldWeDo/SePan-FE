// 지도 공통 타입 정의

/** 지도 드릴다운 레벨 */
export type MapLevel = "sido" | "constituency";

/** 검색으로 선택된 지역 (드릴다운 네비게이션용) */
export interface SearchSelectedRegion {
	/** 시도 약칭 (드릴다운 네비게이션용) */
	sido: string;
	/** 선거구 코드 (하이라이트용, 시도만 선택 시 null) */
	constituencyCode: string | null;
}

/**
 * 지도 위 표시되는 지역 정보
 * @description 폴리곤 클릭 시 외부로 전달되는 데이터. API 호출 파라미터로 활용.
 * @example { code: "2111601", sido: "서울", name: "강서갑", fullName: "서울 강서갑" }
 */
export interface MapRegion {
	/** 선거관리위원회 선거구 코드 */
	code: string;
	/** 시도명 (예: "서울") */
	sido: string;
	/** 선거구명 (예: "종로") */
	name: string;
	/** 시도+선거구 결합명 (예: "서울 종로") */
	fullName: string;
}

/**
 * 지도 설정
 * @description KoreaConstituencyMap 컴포넌트에 전달할 설정 객체
 */
export interface MapConfig {
	/** 지도 너비 (px, 기본값: 600) */
	width?: number;
	/** 지도 높이 (px, 기본값: 800) */
	height?: number;
	/** 여백 (px, 기본값: 20) */
	padding?: number;
	/** 라벨 표시 여부 (기본값: true) */
	showLabels?: boolean;
	/** 라벨 최소 면적 임계값 — 이 값 이하인 폴리곤은 라벨 숨김 */
	labelAreaThreshold?: number;
	/** 드릴다운 활성화 여부 (기본값: true) */
	enableDrillDown?: boolean;
}

/**
 * hover 중인 지역 정보 (툴팁용)
 * @description 마우스 위치와 지역 정보를 함께 전달
 */
export interface HoveredRegion {
	region: MapRegion;
	position: { x: number; y: number };
}

// --- Choropleth (Phase 3-C) ---

/** Choropleth 지도에 사용할 데이터 */
export interface ChoroplethData {
	/** 지역 코드 → 수치 값 매핑 */
	values: Record<string, number>;
	/** 데이터 최솟값 (자동 계산 대신 직접 지정 가능) */
	min?: number;
	/** 데이터 최댓값 (자동 계산 대신 직접 지정 가능) */
	max?: number;
}

/** Choropleth 색상 설정 */
export interface ChoroplethConfig {
	/** 최솟값 색상 (oklch 형식, 예: "0.95 0.02 250") */
	colorMin: string;
	/** 최댓값 색상 (oklch 형식, 예: "0.45 0.2 250") */
	colorMax: string;
	/** 범례 제목 */
	legendTitle: string;
	/** 범례 단위 (예: "명", "%") */
	legendUnit: string;
	/** 범례 단계 수 (기본값: 5) */
	legendSteps?: number;
}

/** 범례 한 단계 */
export interface LegendItem {
	/** 표시할 색상 */
	color: string;
	/** 해당 단계의 라벨 (예: "0~20%") */
	label: string;
}
