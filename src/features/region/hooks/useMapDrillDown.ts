import { useState, useCallback, useMemo } from "react";
import type { MapLevel, MapRegion, SearchSelectedRegion } from "@/types/map";
import { getSidoFullName } from "@/features/region/lib/sido-utils";

export interface UseMapDrillDownReturn {
	level: MapLevel;
	selectedSido: string | null;
	selectedCity: string | null;
	selectedCityName: string | null;
	selectedGu: string | null;
	selectedGuName: string | null;
	featureCollection: GeoJSON.FeatureCollection;
	handleSidoSelect: (sido: string) => void;
	handleSigunSelect: (
		cityCd: string,
		cityName: string,
		hasGu: boolean,
	) => void;
	handleGuSelect: (sguCd: string, sguName: string) => void;
	handleBackToNational: () => void;
	handleBackToSido: () => void;
	handleBackToSigun: () => void;
	navigateToSearchResult: (result: SearchSelectedRegion) => void;
}

/** 빈 FeatureCollection (데이터 로딩 전 폴백) */
const EMPTY_FC: GeoJSON.FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

/**
 * 시도 → 시군 → 구(조건부) → 읍면동 4단계 드릴다운 상태 관리 훅
 *
 * @description
 * - 시도 뷰: 17개 시도 폴리곤
 * - 시군 뷰: 선택된 시도의 시군 (하위구 시는 합쳐진 1개 폴리곤)
 * - 구 뷰: 하위구 시 클릭 시 해당 시의 구만 필터링 (sigunguFeatures에서)
 * - 읍면동 뷰: 선택된 시군구의 읍면동만 필터링
 * - Phase 5.5: 하위 구를 가진 시(수원시 등 13개) 조건부 4단계 지원
 */
export function useMapDrillDown(
	sidoFeatures: GeoJSON.FeatureCollection | null,
	sigunFeatures: GeoJSON.FeatureCollection | null,
	sigunguFeatures: GeoJSON.FeatureCollection | null,
	emdFeatures: GeoJSON.FeatureCollection | null,
): UseMapDrillDownReturn {
	const [level, setLevel] = useState<MapLevel>("sido");
	const [selectedSido, setSelectedSido] = useState<string | null>(null);
	const [selectedCity, setSelectedCity] = useState<string | null>(null);
	const [selectedCityName, setSelectedCityName] = useState<string | null>(
		null,
	);
	const [selectedGu, setSelectedGu] = useState<string | null>(null);
	const [selectedGuName, setSelectedGuName] = useState<string | null>(null);

	const sidoFC = sidoFeatures ?? EMPTY_FC;
	const allSigunFC = sigunFeatures ?? EMPTY_FC;
	const allSigunguFC = sigunguFeatures ?? EMPTY_FC;
	const allEmdFC = emdFeatures ?? EMPTY_FC;

	// 선택된 시도의 시군만 필터링
	const filteredSigunFC = useMemo(() => {
		if (!selectedSido) return EMPTY_FC;
		return {
			type: "FeatureCollection" as const,
			features: allSigunFC.features.filter(
				(f) => f.properties?.SIDO === selectedSido,
			),
		};
	}, [allSigunFC, selectedSido]);

	// 선택된 시(하위구)의 구만 필터링 (SGU_CD prefix 매칭)
	const filteredGuFC = useMemo(() => {
		if (!selectedCity) return EMPTY_FC;
		return {
			type: "FeatureCollection" as const,
			features: allSigunguFC.features.filter((f) =>
				f.properties?.SGU_CD?.startsWith(selectedCity),
			),
		};
	}, [allSigunguFC, selectedCity]);

	// 선택된 시군구의 읍면동만 필터링 (EMD_CD prefix 매칭)
	const filteredEmdFC = useMemo(() => {
		// gu에서 온 경우: selectedGu (5자리)
		// sigun에서 직접 온 경우: selectedCity (5자리, 독립 시군구)
		const prefix = selectedGu ?? selectedCity;
		if (!prefix) return EMPTY_FC;
		return {
			type: "FeatureCollection" as const,
			features: allEmdFC.features.filter((f) =>
				f.properties?.EMD_CD?.startsWith(prefix),
			),
		};
	}, [allEmdFC, selectedGu, selectedCity]);

	// 현재 레벨에 따른 featureCollection
	const featureCollection = useMemo(() => {
		switch (level) {
			case "sido":
				return sidoFC;
			case "sigun":
				return filteredSigunFC;
			case "gu":
				return filteredGuFC;
			case "eupMyeonDong":
				return filteredEmdFC;
		}
	}, [level, sidoFC, filteredSigunFC, filteredGuFC, filteredEmdFC]);

	const handleSidoSelect = useCallback(
		(sido: string) => {
			setSelectedSido(sido);
			setSelectedGu(null);
			setSelectedGuName(null);

			// 시군이 1개뿐인 시도(세종 등)는 바로 읍면동으로 건너뜀
			const sigunForSido = allSigunFC.features.filter(
				(f) => f.properties?.SIDO === sido,
			);
			if (sigunForSido.length === 1) {
				const props = sigunForSido[0].properties as Record<
					string,
					string | boolean
				>;
				setSelectedCity(props.CITY_CD as string);
				setSelectedCityName(props.CITY_NM as string);
				setLevel("eupMyeonDong");
			} else {
				setSelectedCity(null);
				setSelectedCityName(null);
				setLevel("sigun");
			}
		},
		[allSigunFC],
	);

	const handleSigunSelect = useCallback(
		(cityCd: string, cityName: string, hasGu: boolean) => {
			setSelectedCity(cityCd);
			setSelectedCityName(cityName);
			setSelectedGu(null);
			setSelectedGuName(null);
			if (hasGu) {
				setLevel("gu");
			} else {
				setLevel("eupMyeonDong");
			}
		},
		[],
	);

	const handleGuSelect = useCallback(
		(sguCd: string, sguName: string) => {
			setSelectedGu(sguCd);
			setSelectedGuName(sguName);
			setLevel("eupMyeonDong");
		},
		[],
	);

	const handleBackToNational = useCallback(() => {
		setSelectedSido(null);
		setSelectedCity(null);
		setSelectedCityName(null);
		setSelectedGu(null);
		setSelectedGuName(null);
		setLevel("sido");
	}, []);

	const handleBackToSido = useCallback(() => {
		setSelectedCity(null);
		setSelectedCityName(null);
		setSelectedGu(null);
		setSelectedGuName(null);
		setLevel("sigun");
	}, []);

	const handleBackToSigun = useCallback(() => {
		setSelectedGu(null);
		setSelectedGuName(null);
		setLevel("gu");
	}, []);

	const navigateToSearchResult = useCallback(
		(result: SearchSelectedRegion) => {
			setSelectedSido(result.sido);

			if (result.emdCode) {
				// 읍면동까지 드릴다운
				if (result.guCode) {
					// 하위구 시의 읍면동
					setSelectedCity(
						result.cityCode ?? result.guCode.substring(0, 4),
					);
					// 시 이름을 sigunFeatures에서 조회
					const sigunFeature = (
						sigunFeatures ?? EMPTY_FC
					).features.find(
						(f) =>
							f.properties?.CITY_CD === result.cityCode ||
							f.properties?.CITY_CD ===
								result.guCode?.substring(0, 4),
					);
					setSelectedCityName(
						(sigunFeature?.properties?.CITY_NM as string) ?? null,
					);
					setSelectedGu(result.guCode);
					// 구 이름을 sigunguFeatures에서 조회
					const guFeature = (
						sigunguFeatures ?? EMPTY_FC
					).features.find(
						(f) => f.properties?.SGU_CD === result.guCode,
					);
					setSelectedGuName(
						(guFeature?.properties?.SGU_NM as string) ?? null,
					);
				} else {
					// 독립 시군구의 읍면동
					setSelectedCity(result.cityCode);
					const sigunFeature = (
						sigunFeatures ?? EMPTY_FC
					).features.find(
						(f) => f.properties?.CITY_CD === result.cityCode,
					);
					setSelectedCityName(
						(sigunFeature?.properties?.CITY_NM as string) ?? null,
					);
					setSelectedGu(null);
					setSelectedGuName(null);
				}
				setLevel("eupMyeonDong");
			} else if (result.guCode) {
				// 구까지 드릴다운 (하위구 시의 특정 구)
				setSelectedCity(
					result.cityCode ?? result.guCode.substring(0, 4),
				);
				const sigunFeature = (
					sigunFeatures ?? EMPTY_FC
				).features.find(
					(f) =>
						f.properties?.CITY_CD === result.cityCode ||
						f.properties?.CITY_CD ===
							result.guCode?.substring(0, 4),
				);
				setSelectedCityName(
					(sigunFeature?.properties?.CITY_NM as string) ?? null,
				);
				setSelectedGu(null);
				setSelectedGuName(null);
				setLevel("gu");
			} else if (result.cityCode) {
				// 시군까지 드릴다운 — HAS_GU 여부 확인
				const sigunFeature = (
					sigunFeatures ?? EMPTY_FC
				).features.find(
					(f) => f.properties?.CITY_CD === result.cityCode,
				);
				const hasGu = sigunFeature?.properties?.HAS_GU === true;
				setSelectedCity(result.cityCode);
				setSelectedCityName(
					(sigunFeature?.properties?.CITY_NM as string) ?? null,
				);
				setSelectedGu(null);
				setSelectedGuName(null);
				if (hasGu) {
					setLevel("gu");
				} else {
					setLevel("eupMyeonDong");
				}
			} else {
				// 시도만 드릴다운
				setSelectedCity(null);
				setSelectedCityName(null);
				setSelectedGu(null);
				setSelectedGuName(null);
				setLevel("sigun");
			}
		},
		[sigunFeatures, sigunguFeatures],
	);

	return {
		level,
		selectedSido,
		selectedCity,
		selectedCityName,
		selectedGu,
		selectedGuName,
		featureCollection,
		handleSidoSelect,
		handleSigunSelect,
		handleGuSelect,
		handleBackToNational,
		handleBackToSido,
		handleBackToSigun,
		navigateToSearchResult,
	};
}

/**
 * 시도 feature의 properties를 MapRegion 호환 형태로 변환
 */
export function sidoPropsToMapRegion(props: { SIDO: string }): MapRegion {
	return {
		code: props.SIDO,
		sido: props.SIDO,
		name: getSidoFullName(props.SIDO),
		fullName: getSidoFullName(props.SIDO),
	};
}

/**
 * 시군구 feature의 properties를 MapRegion 호환 형태로 변환
 * (gu 레벨에서 사용 — 하위구 시의 개별 구)
 * SGU_NM에서 도시명 접두어 제거: "용인시수지구" → "수지구"
 */
export function sigunguPropsToMapRegion(props: {
	SGU_CD: string;
	SGU_NM: string;
	SIDO: string;
}): MapRegion {
	// "용인시수지구" → "수지구" (도시명 접두어 제거)
	const nm = props.SGU_NM;
	const siIdx = nm.indexOf("시");
	const shortName = siIdx >= 0 && siIdx < nm.length - 1 ? nm.substring(siIdx + 1) : nm;
	return {
		code: props.SGU_CD,
		sido: props.SIDO,
		name: shortName,
		fullName: `${getSidoFullName(props.SIDO)} ${props.SGU_NM}`,
	};
}

/**
 * 읍면동 feature의 properties를 MapRegion 호환 형태로 변환
 */
export function emdPropsToMapRegion(props: {
	EMD_CD: string;
	EMD_KOR_NM: string;
	SIDO: string;
}): MapRegion {
	const parts = props.EMD_KOR_NM.split(" ");
	const dongName = parts[parts.length - 1];
	return {
		code: props.EMD_CD,
		sido: props.SIDO,
		name: dongName,
		fullName: props.EMD_KOR_NM,
	};
}

// Re-export sigunPropsToMapRegion from sigun-utils for convenience
export { sigunPropsToMapRegion } from "@/features/region/lib/sigun-utils";
