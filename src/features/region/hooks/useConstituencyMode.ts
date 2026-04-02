import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { buildConstituencyColorMap } from "@/features/region/lib/constituency-colors";
import type { ConstituencyColorEntry } from "@/features/region/lib/constituency-colors";
import type { MapLevel, ChoroplethData, SearchSelectedRegion } from "@/types/map";

export interface UseConstituencyModeReturn {
	/** 선거구 모드 활성 여부 */
	isConstituencyMode: boolean;
	/** 선거구 모드 토글 */
	setIsConstituencyMode: (value: boolean) => void;
	/** 선택된 선거구 코드 (드릴다운 시) */
	selectedConstituency: string | null;
	/** 선택된 선거구 이름 */
	selectedConstituencyName: string | null;
	/** 선거구 드릴다운 진입 */
	enterConstituencyDrillDown: (sggCode: string, sggName: string) => void;
	/** 선거구 드릴다운 복귀 */
	resetConstituencyDrillDown: () => void;
	/** 선거구 색상 맵 (EMD_CD → color entry) */
	constituencyColorMap: Map<string, ConstituencyColorEntry> | null;
	/** Ref: 최신 selectedConstituency (stale closure 방지) */
	selectedConstituencyRef: React.RefObject<string | null>;
	/** Ref: 최신 constituencyColorMap */
	constituencyColorMapRef: React.RefObject<Map<string, ConstituencyColorEntry> | null>;
	/** Ref: 최신 isConstituencyMode */
	isConstituencyModeRef: React.RefObject<boolean>;
}

/**
 * 선거구 뷰 모드 상태 관리 훅
 *
 * React Compiler 호환: setState-in-effect 대신 render-time state reset 패턴 사용.
 * currentLevel/searchNavigation/choroplethData 변경 시 render phase에서 상태를 동기 리셋.
 *
 * @param currentLevel 현재 드릴다운 레벨
 * @param featureCollection 현재 표시 중인 FeatureCollection (선거구 색상 맵 빌드용)
 * @param choroplethData 히트맵 데이터 (활성 시 선거구 모드 비활성화)
 * @param searchNavigation 검색 네비게이션 (변경 시 드릴다운 리셋)
 */
export function useConstituencyMode(
	currentLevel: MapLevel,
	featureCollection: GeoJSON.FeatureCollection,
	choroplethData: ChoroplethData | null,
	searchNavigation: SearchSelectedRegion | null | undefined,
): UseConstituencyModeReturn {
	const [isConstituencyMode, setIsConstituencyMode] = useState(true);
	const [selectedConstituency, setSelectedConstituency] = useState<string | null>(null);
	const [selectedConstituencyName, setSelectedConstituencyName] = useState<string | null>(null);

	// --- React Compiler-safe render-time state reset ---
	// useHeatmapMode의 prevCategoryId 패턴과 동일한 방식.
	// setState-in-effect 대신 render phase에서 이전 값과 비교 후 동기 리셋.

	// 1. 레벨 변경 → 읍면동 이외에서는 OFF, 읍면동 진입 시 ON
	const [prevLevel, setPrevLevel] = useState(currentLevel);
	if (prevLevel !== currentLevel) {
		setPrevLevel(currentLevel);
		if (currentLevel !== "eupMyeonDong") {
			if (isConstituencyMode) setIsConstituencyMode(false);
			if (selectedConstituency !== null) setSelectedConstituency(null);
			if (selectedConstituencyName !== null) setSelectedConstituencyName(null);
		} else {
			if (!isConstituencyMode) setIsConstituencyMode(true);
		}
	}

	// 2. searchNavigation 변경 → 드릴다운 리셋
	const [prevSearchNav, setPrevSearchNav] = useState(searchNavigation);
	if (prevSearchNav !== searchNavigation) {
		setPrevSearchNav(searchNavigation);
		if (selectedConstituency !== null) setSelectedConstituency(null);
		if (selectedConstituencyName !== null) setSelectedConstituencyName(null);
	}

	// 3. choroplethData 활성화 → 선거구 모드 OFF
	const [prevChoropleth, setPrevChoropleth] = useState(choroplethData);
	if (prevChoropleth !== choroplethData) {
		setPrevChoropleth(choroplethData);
		if (choroplethData) {
			if (isConstituencyMode) setIsConstituencyMode(false);
			if (selectedConstituency !== null) setSelectedConstituency(null);
			if (selectedConstituencyName !== null) setSelectedConstituencyName(null);
		}
	}

	// 4. 선거구 모드 OFF → 드릴다운 리셋
	const [prevMode, setPrevMode] = useState(isConstituencyMode);
	if (prevMode !== isConstituencyMode) {
		setPrevMode(isConstituencyMode);
		if (!isConstituencyMode) {
			if (selectedConstituency !== null) setSelectedConstituency(null);
			if (selectedConstituencyName !== null) setSelectedConstituencyName(null);
		}
	}

	// --- 선거구 색상 맵 ---
	const constituencyColorMap = useMemo(() => {
		if (!isConstituencyMode || currentLevel !== "eupMyeonDong") return null;
		return buildConstituencyColorMap(featureCollection);
	}, [isConstituencyMode, currentLevel, featureCollection]);

	// --- Refs (stale closure 방지) ---
	// ref.current 할당은 useEffect에서 수행 — React Compiler는 ref 할당을 경고하지 않음
	const selectedConstituencyRef = useRef<string | null>(selectedConstituency);
	useEffect(() => { selectedConstituencyRef.current = selectedConstituency; }, [selectedConstituency]);

	const constituencyColorMapRef = useRef<Map<string, ConstituencyColorEntry> | null>(constituencyColorMap);
	useEffect(() => { constituencyColorMapRef.current = constituencyColorMap; }, [constituencyColorMap]);

	const isConstituencyModeRef = useRef<boolean>(isConstituencyMode);
	useEffect(() => { isConstituencyModeRef.current = isConstituencyMode; }, [isConstituencyMode]);

	// --- Callbacks ---
	const enterConstituencyDrillDown = useCallback((sggCode: string, sggName: string) => {
		setSelectedConstituency(sggCode);
		setSelectedConstituencyName(sggName);
	}, []);

	const resetConstituencyDrillDown = useCallback(() => {
		setSelectedConstituency(null);
		setSelectedConstituencyName(null);
	}, []);

	return {
		isConstituencyMode,
		setIsConstituencyMode,
		selectedConstituency,
		selectedConstituencyName,
		enterConstituencyDrillDown,
		resetConstituencyDrillDown,
		constituencyColorMap,
		selectedConstituencyRef,
		constituencyColorMapRef,
		isConstituencyModeRef,
	};
}
