import { useState, useCallback, useMemo } from "react";
import type { MapLevel, SearchSelectedRegion } from "@/types/map";
import { getSidoFullName } from "@/lib/sido-utils";

export interface UseMapDrillDownReturn {
	level: MapLevel;
	selectedSido: string | null;
	featureCollection: GeoJSON.FeatureCollection;
	handleSidoSelect: (sido: string) => void;
	handleBackToNational: () => void;
	navigateToSearchResult: (result: SearchSelectedRegion) => void;
}

/** 빈 FeatureCollection (데이터 로딩 전 폴백) */
const EMPTY_FC: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

/**
 * 시도 ↔ 선거구 드릴다운 상태 관리 훅
 *
 * @description
 * - 시도 뷰: 17개 시도 폴리곤 (dissolve 결과)
 * - 선거구 뷰: 선택된 시도의 선거구만 필터링
 * - useProjection이 featureCollection에 자동 fitExtent하므로 별도 뷰포트 계산 불필요
 * - Phase 3-A: 데이터를 외부에서 주입받아 동적 import와 호환
 *
 * @param sidoFeatures - 시도 GeoJSON (null이면 빈 컬렉션 사용)
 * @param constituencyFeatures - 선거구 GeoJSON (null이면 빈 컬렉션 사용)
 */
export function useMapDrillDown(
	sidoFeatures: GeoJSON.FeatureCollection | null,
	constituencyFeatures: GeoJSON.FeatureCollection | null,
): UseMapDrillDownReturn {
	const [level, setLevel] = useState<MapLevel>("sido");
	const [selectedSido, setSelectedSido] = useState<string | null>(null);

	const sidoFC = sidoFeatures ?? EMPTY_FC;
	const allConstituencyFC = constituencyFeatures ?? EMPTY_FC;

	// 선택된 시도의 선거구만 필터링
	const filteredConstituencyFeatureCollection = useMemo(() => {
		if (!selectedSido) return allConstituencyFC;
		return {
			type: "FeatureCollection" as const,
			features: allConstituencyFC.features.filter(
				(f) => f.properties?.SIDO === selectedSido,
			),
		};
	}, [allConstituencyFC, selectedSido]);

	// 현재 레벨에 따른 featureCollection
	const featureCollection =
		level === "sido" ? sidoFC : filteredConstituencyFeatureCollection;

	const handleSidoSelect = useCallback((sido: string) => {
		setSelectedSido(sido);
		setLevel("constituency");
	}, []);

	const handleBackToNational = useCallback(() => {
		setSelectedSido(null);
		setLevel("sido");
	}, []);

	const navigateToSearchResult = useCallback(
		(result: SearchSelectedRegion) => {
			// 시도로 드릴다운 (시도만 선택된 경우든 선거구가 있든)
			setSelectedSido(result.sido);
			setLevel("constituency");
		},
		[],
	);

	return {
		level,
		selectedSido,
		featureCollection,
		handleSidoSelect,
		handleBackToNational,
		navigateToSearchResult,
	};
}

/**
 * 시도 feature의 properties를 MapRegion 호환 형태로 변환
 * @description 시도 폴리곤에서 RegionPolygon이 사용하는 MapRegion 4개 필드를 채운다
 */
export function sidoPropsToMapRegion(props: { SIDO: string }) {
	return {
		code: props.SIDO, // 시도에는 선거구 코드가 없으므로 약칭을 code로
		sido: props.SIDO,
		name: getSidoFullName(props.SIDO),
		fullName: getSidoFullName(props.SIDO),
	};
}
