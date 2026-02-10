import { useState, useCallback, useMemo } from "react";
import * as topojson from "topojson-client";
import type { MapLevel, SearchSelectedRegion } from "@/types/map";
import sidoTopojsonData from "@/features/region/data/sido.topojson.json";
import constituencyTopojsonData from "@/features/region/data/constituencies.topojson.json";
import { getSidoFullName } from "@/lib/sido-utils";

/** TopoJSON 오브젝트명 (시도/선거구 모두 동일) */
const TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

export interface UseMapDrillDownReturn {
	level: MapLevel;
	selectedSido: string | null;
	featureCollection: GeoJSON.FeatureCollection;
	handleSidoSelect: (sido: string) => void;
	handleBackToNational: () => void;
	navigateToSearchResult: (result: SearchSelectedRegion) => void;
}

/**
 * 시도 ↔ 선거구 드릴다운 상태 관리 훅
 *
 * @description
 * - 시도 뷰: 17개 시도 폴리곤 (dissolve 결과)
 * - 선거구 뷰: 선택된 시도의 선거구만 필터링
 * - useProjection이 featureCollection에 자동 fitExtent하므로 별도 뷰포트 계산 불필요
 */
export function useMapDrillDown(): UseMapDrillDownReturn {
	const [level, setLevel] = useState<MapLevel>("sido");
	const [selectedSido, setSelectedSido] = useState<string | null>(null);

	// 시도 GeoJSON (한 번만 변환)
	const sidoFeatureCollection = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const topology = sidoTopojsonData as any;
		return topojson.feature(
			topology,
			topology.objects[TOPOJSON_OBJECT_KEY],
		) as unknown as GeoJSON.FeatureCollection;
	}, []);

	// 선거구 전체 GeoJSON (한 번만 변환)
	const allConstituencyFeatureCollection = useMemo(() => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const topology = constituencyTopojsonData as any;
		return topojson.feature(
			topology,
			topology.objects[TOPOJSON_OBJECT_KEY],
		) as unknown as GeoJSON.FeatureCollection;
	}, []);

	// 선택된 시도의 선거구만 필터링
	const filteredConstituencyFeatureCollection = useMemo(() => {
		if (!selectedSido) return allConstituencyFeatureCollection;
		return {
			type: "FeatureCollection" as const,
			features: allConstituencyFeatureCollection.features.filter(
				(f) => f.properties?.SIDO === selectedSido,
			),
		};
	}, [allConstituencyFeatureCollection, selectedSido]);

	// 현재 레벨에 따른 featureCollection
	const featureCollection =
		level === "sido"
			? sidoFeatureCollection
			: filteredConstituencyFeatureCollection;

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
