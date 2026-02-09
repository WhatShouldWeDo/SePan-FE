// 지도 공통 타입 정의

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
}

/**
 * hover 중인 지역 정보 (툴팁용)
 * @description 마우스 위치와 지역 정보를 함께 전달
 */
export interface HoveredRegion {
	region: MapRegion;
	position: { x: number; y: number };
}
