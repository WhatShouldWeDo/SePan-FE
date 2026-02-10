import { useState, useCallback, useMemo } from "react";
import type { MapLevel, MapRegion, SearchSelectedRegion } from "@/types/map";
import { getSidoFullName } from "@/lib/sido-utils";

export interface UseMapDrillDownReturn {
	level: MapLevel;
	selectedSido: string | null;
	selectedConstituency: string | null;
	selectedConstituencyName: string | null;
	featureCollection: GeoJSON.FeatureCollection;
	handleSidoSelect: (sido: string) => void;
	handleConstituencySelect: (code: string, name: string) => void;
	handleBackToNational: () => void;
	handleBackToSido: () => void;
	navigateToSearchResult: (result: SearchSelectedRegion) => void;
}

/** 빈 FeatureCollection (데이터 로딩 전 폴백) */
const EMPTY_FC: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

/**
 * 시도 ↔ 선거구 ↔ 읍면동 3단계 드릴다운 상태 관리 훅
 *
 * @description
 * - 시도 뷰: 17개 시도 폴리곤 (dissolve 결과)
 * - 선거구 뷰: 선택된 시도의 선거구만 필터링
 * - 읍면동 뷰: 선택된 선거구의 읍면동만 필터링
 * - useProjection이 featureCollection에 자동 fitExtent하므로 별도 뷰포트 계산 불필요
 * - Phase 4: 3단계 드릴다운 확장
 *
 * @param sidoFeatures - 시도 GeoJSON (null이면 빈 컬렉션 사용)
 * @param constituencyFeatures - 선거구 GeoJSON (null이면 빈 컬렉션 사용)
 * @param emdFeatures - 읍면동 GeoJSON (null이면 빈 컬렉션 사용)
 */
export function useMapDrillDown(
	sidoFeatures: GeoJSON.FeatureCollection | null,
	constituencyFeatures: GeoJSON.FeatureCollection | null,
	emdFeatures: GeoJSON.FeatureCollection | null,
): UseMapDrillDownReturn {
	const [level, setLevel] = useState<MapLevel>("sido");
	const [selectedSido, setSelectedSido] = useState<string | null>(null);
	const [selectedConstituency, setSelectedConstituency] = useState<
		string | null
	>(null);
	const [selectedConstituencyName, setSelectedConstituencyName] = useState<
		string | null
	>(null);

	const sidoFC = sidoFeatures ?? EMPTY_FC;
	const allConstituencyFC = constituencyFeatures ?? EMPTY_FC;
	const allEmdFC = emdFeatures ?? EMPTY_FC;

	// 선택된 시도의 선거구만 필터링
	const filteredConstituencyFC = useMemo(() => {
		if (!selectedSido) return allConstituencyFC;
		return {
			type: "FeatureCollection" as const,
			features: allConstituencyFC.features.filter(
				(f) => f.properties?.SIDO === selectedSido,
			),
		};
	}, [allConstituencyFC, selectedSido]);

	// 선택된 선거구의 읍면동만 필터링
	const filteredEmdFC = useMemo(() => {
		if (!selectedConstituency) return EMPTY_FC;
		return {
			type: "FeatureCollection" as const,
			features: allEmdFC.features.filter(
				(f) => f.properties?.SGG_Code === selectedConstituency,
			),
		};
	}, [allEmdFC, selectedConstituency]);

	// 현재 레벨에 따른 featureCollection
	const featureCollection = useMemo(() => {
		switch (level) {
			case "sido":
				return sidoFC;
			case "constituency":
				return filteredConstituencyFC;
			case "eupMyeonDong":
				return filteredEmdFC;
		}
	}, [level, sidoFC, filteredConstituencyFC, filteredEmdFC]);

	const handleSidoSelect = useCallback((sido: string) => {
		setSelectedSido(sido);
		setSelectedConstituency(null);
		setSelectedConstituencyName(null);
		setLevel("constituency");
	}, []);

	const handleConstituencySelect = useCallback(
		(code: string, name: string) => {
			setSelectedConstituency(code);
			setSelectedConstituencyName(name);
			setLevel("eupMyeonDong");
		},
		[],
	);

	const handleBackToNational = useCallback(() => {
		setSelectedSido(null);
		setSelectedConstituency(null);
		setSelectedConstituencyName(null);
		setLevel("sido");
	}, []);

	const handleBackToSido = useCallback(() => {
		setSelectedConstituency(null);
		setSelectedConstituencyName(null);
		setLevel("constituency");
	}, []);

	const navigateToSearchResult = useCallback(
		(result: SearchSelectedRegion) => {
			setSelectedSido(result.sido);

			if (result.emdCode && result.constituencyCode) {
				// 읍면동까지 드릴다운
				setSelectedConstituency(result.constituencyCode);
				// 읍면동 검색 시 선거구 이름도 필요 — constituencyFeatures에서 조회
				const cstFeature = (
					constituencyFeatures ?? EMPTY_FC
				).features.find(
					(f) => f.properties?.SGG_Code === result.constituencyCode,
				);
				setSelectedConstituencyName(
					(cstFeature?.properties?.SGG as string) ?? null,
				);
				setLevel("eupMyeonDong");
			} else {
				// 선거구까지만 드릴다운
				setSelectedConstituency(null);
				setSelectedConstituencyName(null);
				setLevel("constituency");
			}
		},
		[constituencyFeatures],
	);

	return {
		level,
		selectedSido,
		selectedConstituency,
		selectedConstituencyName,
		featureCollection,
		handleSidoSelect,
		handleConstituencySelect,
		handleBackToNational,
		handleBackToSido,
		navigateToSearchResult,
	};
}

/**
 * 시도 feature의 properties를 MapRegion 호환 형태로 변환
 * @description 시도 폴리곤에서 RegionPolygon이 사용하는 MapRegion 4개 필드를 채운다
 */
export function sidoPropsToMapRegion(props: { SIDO: string }): MapRegion {
	return {
		code: props.SIDO, // 시도에는 선거구 코드가 없으므로 약칭을 code로
		sido: props.SIDO,
		name: getSidoFullName(props.SIDO),
		fullName: getSidoFullName(props.SIDO),
	};
}

/**
 * 읍면동 feature의 properties를 MapRegion 호환 형태로 변환
 * @description EMD_KOR_NM에서 동 이름만 추출하여 MapRegion 4개 필드를 채운다
 */
export function emdPropsToMapRegion(props: {
	EMD_CD: string;
	EMD_KOR_NM: string;
	SIDO: string;
}): MapRegion {
	// EMD_KOR_NM: "서울특별시 종로구 사직동" → name: "사직동"
	const parts = props.EMD_KOR_NM.split(" ");
	const dongName = parts[parts.length - 1];
	return {
		code: props.EMD_CD,
		sido: props.SIDO,
		name: dongName,
		fullName: props.EMD_KOR_NM,
	};
}
