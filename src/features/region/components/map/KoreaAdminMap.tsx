import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { geoArea } from "d3-geo";
import { useProjection } from "@/features/region/hooks/useProjection";
import {
	useMapDrillDown,
	sidoPropsToMapRegion,
	sigunPropsToMapRegion,
	sigunguPropsToMapRegion,
	emdPropsToMapRegion,
} from "@/features/region/hooks/useMapDrillDown";
import { useTopoJsonData } from "@/features/region/hooks/useTopoJsonData";
import { useMapZoom } from "@/features/region/hooks/useMapZoom";
import { useMapTransition } from "@/features/region/hooks/useMapTransition";
import { useConstituencyMode } from "@/features/region/hooks/useConstituencyMode";
import { useLongPress } from "@/hooks/useLongPress";
import { useContainerSize } from "@/hooks/useContainerSize";
import { RegionPolygon } from "./RegionPolygon";
import { MapTooltip } from "./MapTooltip";
import type { MapTooltipData } from "./MapTooltip";
import { MapSkeleton } from "./MapSkeleton";
import { MapBreadcrumb } from "./MapBreadcrumb";
import { MapZoomControls } from "./MapZoomControls";
import { cn } from "@/lib/utils";
import { mapColors } from "@/features/region/lib/map-theme";
import { getChoroplethColor, buildLegendItems } from "@/features/region/lib/choropleth-utils";
import { buildConstituencyColorMap } from "@/features/region/lib/constituency-colors";
import { MapLegend } from "./MapLegend";
import { Switch } from "@/components/ui/switch";
import type {
	MapRegion,
	MapConfig,
	HoveredRegion,
	SearchSelectedRegion,
	ChoroplethData,
	ChoroplethConfig,
	MapLevel,
} from "@/types/map";

export interface KoreaAdminMapProps {
	/** 지도 설정 */
	config?: MapConfig;
	/** 선택된 지역 코드 */
	selectedCode?: string | null;
	/** 지역 클릭 콜백 — API 호출 파라미터로 활용 */
	onRegionSelect?: (region: MapRegion) => void;
	/** 검색 결과로 특정 지역으로 네비게이트 */
	searchNavigation?: SearchSelectedRegion | null;
	/** Choropleth 데이터 (Phase 3-C) */
	choroplethData?: ChoroplethData | null;
	/** Choropleth 설정 (Phase 3-C) */
	choroplethConfig?: ChoroplethConfig | null;
	/** Tooltip 데이터 제공 함수 — 모드 비인지 방식 (Phase heatmap) */
	tooltipDataProvider?: (code: string) => MapTooltipData | undefined;
	/** 선거구 모드 변경 콜백 */
	onConstituencyModeChange?: (isOn: boolean) => void;
	/** 선거구 모드 툴팁 데이터 (SGG_Code → MapTooltipData) */
	constituencyTooltipData?: Record<string, MapTooltipData>;
	/** 드릴다운 레벨 변경 콜백 (Phase heatmap) */
	onLevelChange?: (level: MapLevel) => void;
	/** 현재 보이는 지역 코드 변경 콜백 (Phase heatmap) */
	onVisibleCodesChange?: (codes: string[]) => void;
	/** 지도가 내 선거구 초기 위치에 있는지 여부 콜백 */
	onHomeStateChange?: (isAtHome: boolean) => void;
	/** 지도 전환 애니메이션 진행 여부 콜백 */
	onTransitionStateChange?: (isTransitioning: boolean) => void;
	/** 로딩 상태 (외부 데이터) */
	isLoading?: boolean;
	/** 추가 className */
	className?: string;
}

/** 시도 레벨 라벨 면적 임계값 */
const SIDO_LABEL_AREA_THRESHOLD = 1e-5;

/** 시군 레벨 라벨 면적 임계값 */
const SIGUN_LABEL_AREA_THRESHOLD = 5e-7;

/** 구 레벨 라벨 면적 임계값 */
const GU_LABEL_AREA_THRESHOLD = 5e-7;

/** 읍면동 레벨 라벨 면적 임계값 */
const EMD_LABEL_AREA_THRESHOLD = 1e-7;

/** 줌 레벨 2x 이상에서만 작은 라벨 표시 */
const ZOOM_LABEL_THRESHOLD = 2;

/**
 * 행정구역 폴리곤 지도 (시도 → 시군 → 구(조건부) → 읍면동 4단계 드릴다운)
 *
 * @description
 * - enableDrillDown=true (기본): 4단계 드릴다운
 * - enableDrillDown=false: 레거시 단일 뷰
 * - Phase 5.5: 하위 구 보유 시 조건부 4단계 지원
 * - 선거구 뷰 모드: eupMyeonDong 레벨에서 선거구 단위 색상/인터랙션
 */
export function KoreaAdminMap({
	config,
	selectedCode,
	onRegionSelect,
	searchNavigation,
	choroplethData = null,
	choroplethConfig = null,
	tooltipDataProvider,
	onConstituencyModeChange,
	constituencyTooltipData,
	onLevelChange,
	onVisibleCodesChange,
	onHomeStateChange,
	onTransitionStateChange,
	isLoading = false,
	className,
}: KoreaAdminMapProps) {
	const {
		padding = 20,
		showLabels = true,
		labelAreaThreshold,
		enableDrillDown = true,
	} = config ?? {};

	const { containerRef, width: measuredWidth, height: measuredHeight } =
		useContainerSize();
	const width = measuredWidth || (config?.width ?? 600);
	const height = measuredHeight || (config?.height ?? 800);

	// --- TopoJSON 동적 로딩 ---
	const {
		sidoFeatures,
		sigunFeatures,
		sigunguFeatures,
		emdFeatures,
		constituencyInfoMap,
		isLoading: isDataLoading,
		error: dataError,
	} = useTopoJsonData();

	// --- 드릴다운 모드 (4단계) ---
	const {
		level,
		selectedSido,
		selectedCity,
		selectedCityName,
		selectedGu,
		selectedGuName,
		featureCollection: drillDownFeatureCollection,
		handleSidoSelect,
		handleSigunSelect,
		handleGuSelect,
		handleBackToNational,
		handleBackToSido,
		handleBackToSigun,
		navigateToSearchResult,
	} = useMapDrillDown(
		sidoFeatures,
		sigunFeatures,
		sigunguFeatures,
		emdFeatures,
	);

	// --- 줌/팬 (Phase 3-D) ---
	const { svgRef, gRef, zoomLevel, zoomIn, zoomOut, smoothZoomReset } =
		useMapZoom();
	// ref로 최신 함수 참조 유지 (exhaustive-deps 억제 없이 사용하기 위함)
	const smoothZoomResetRef = useRef(smoothZoomReset);
	useEffect(() => {
		smoothZoomResetRef.current = smoothZoomReset;
	}, [smoothZoomReset]);

	// --- 전환 애니메이션 (Phase 4-D) ---
	const { isTransitioning, triggerTransition } = useMapTransition();

	useEffect(() => {
		onTransitionStateChange?.(isTransitioning);
	}, [isTransitioning, onTransitionStateChange]);

	// 브레드크럼 뒤로가기 (애니메이션 포함)
	const handleAnimatedBackToNational = useCallback(() => {
		if (isTransitioning) return;
		triggerTransition(gRef.current, () => {
			handleBackToNational();
		});
	}, [isTransitioning, triggerTransition, gRef, handleBackToNational]);

	const handleAnimatedBackToSido = useCallback(() => {
		if (isTransitioning) return;
		triggerTransition(gRef.current, () => {
			handleBackToSido();
		});
	}, [isTransitioning, triggerTransition, gRef, handleBackToSido]);

	const handleAnimatedBackToSigun = useCallback(() => {
		if (isTransitioning) return;
		triggerTransition(gRef.current, () => {
			handleBackToSigun();
		});
	}, [isTransitioning, triggerTransition, gRef, handleBackToSigun]);

	// 검색 네비게이션 처리
	const hasNavigated = useRef(false);

	useEffect(() => {
		if (searchNavigation && enableDrillDown) {
			if (hasNavigated.current && gRef.current) {
				// 후속 네비게이션 (복귀, 검색 등) — 전환 애니메이션 적용
				triggerTransition(gRef.current, () => {
					navigateToSearchResult(searchNavigation);
				});
			} else {
				// 초기 마운트 네비게이션 — 애니메이션 없이 즉시
				navigateToSearchResult(searchNavigation);
			}
			hasNavigated.current = true;
		}
	}, [searchNavigation, enableDrillDown, navigateToSearchResult, triggerTransition, gRef]);

	// --- 레거시 모드 (enableDrillDown=false) ---
	const legacyFeatureCollection = useMemo(() => {
		if (enableDrillDown || !sigunguFeatures) return null;
		return sigunguFeatures;
	}, [enableDrillDown, sigunguFeatures]);

	// 현재 표시할 featureCollection
	const featureCollection = enableDrillDown
		? drillDownFeatureCollection
		: (legacyFeatureCollection ?? drillDownFeatureCollection);

	// 현재 레벨 (레거시 모드는 항상 sigun)
	const currentLevel = enableDrillDown ? level : "sigun";

	// currentLevel이 변경될 때 onLevelChange 콜백 호출
	useEffect(() => {
		onLevelChange?.(currentLevel);
	}, [currentLevel, onLevelChange]);

	// 내 선거구 위치 판별
	const isAtHome = useMemo(() => {
		if (!searchNavigation) return false;
		return (
			currentLevel === "eupMyeonDong" &&
			selectedSido === searchNavigation.sido &&
			selectedCity === (searchNavigation.cityCode ?? null) &&
			selectedGu === (searchNavigation.guCode ?? null)
		);
	}, [currentLevel, selectedSido, selectedCity, selectedGu, searchNavigation]);

	// 내 선거구 위치 변경을 부모에 전파 (mount 시 첫 호출만 skip)
	const isMountedForHome = useRef(false);

	useEffect(() => {
		if (!isMountedForHome.current) {
			isMountedForHome.current = true;
			return;
		}
		onHomeStateChange?.(isAtHome);
	}, [isAtHome, onHomeStateChange]);

	// --- 선거구 뷰 모드 ---
	// --- 선거구 모드 (useConstituencyMode 훅으로 추출) ---
	const {
		isConstituencyMode,
		setIsConstituencyMode,
		selectedConstituency,
		setSelectedConstituency,
		selectedConstituencyName,
		setSelectedConstituencyName,
		selectedConstituencyRef,
		effectiveFeatureCollection,
	} = useConstituencyMode({
		currentLevel,
		searchNavigation,
		choroplethData,
		featureCollection,
	});

	// 레벨 전환 시 줌 리셋 (부드러운 전환)
	useEffect(() => {
		smoothZoomResetRef.current();
	}, [level, selectedSido, selectedCity, selectedGu, selectedConstituency]);

	// 선거구 드릴다운 복귀 핸들러
	const handleBackToConstituencyOverview = useCallback(() => {
		if (isTransitioning) return;
		triggerTransition(gRef.current, () => {
			setSelectedConstituency(null);
			setSelectedConstituencyName(null);
		});
	}, [isTransitioning, triggerTransition, gRef]);

	// 레벨별 라벨 면적 임계값
	const effectiveThreshold =
		labelAreaThreshold ??
		(currentLevel === "sido"
			? SIDO_LABEL_AREA_THRESHOLD
			: currentLevel === "sigun"
				? SIGUN_LABEL_AREA_THRESHOLD
				: currentLevel === "gu"
					? GU_LABEL_AREA_THRESHOLD
					: EMD_LABEL_AREA_THRESHOLD);

	// D3 projection + path generator (선거구 드릴다운 시 필터된 컬렉션 사용)
	const { pathGenerator } = useProjection(
		effectiveFeatureCollection,
		width,
		height,
		padding,
	);

	// sigun 레벨에서 HAS_GU 판별용 맵 (CITY_CD → boolean)
	const sigunHasGuMap = useMemo(() => {
		if (!sigunFeatures) return new Map<string, boolean>();
		const map = new Map<string, boolean>();
		for (const f of sigunFeatures.features) {
			const props = f.properties;
			if (props?.CITY_CD) {
				map.set(props.CITY_CD as string, props.HAS_GU === true);
			}
		}
		return map;
	}, [sigunFeatures]);

	// 각 feature의 pathD, centroid, region 미리 계산
	const regionData = useMemo(
		() =>
			effectiveFeatureCollection.features.map((f) => {
				const props = f.properties as Record<string, string>;

				let region: MapRegion;
				if (currentLevel === "sido") {
					region = sidoPropsToMapRegion({ SIDO: props.SIDO });
				} else if (currentLevel === "sigun") {
					region = sigunPropsToMapRegion({
						CITY_CD: props.CITY_CD,
						CITY_NM: props.CITY_NM,
						SIDO: props.SIDO,
					});
				} else if (currentLevel === "gu") {
					region = sigunguPropsToMapRegion({
						SGU_CD: props.SGU_CD,
						SGU_NM: props.SGU_NM,
						SIDO: props.SIDO,
					});
				} else {
					region = emdPropsToMapRegion({
						EMD_CD: props.EMD_CD,
						EMD_KOR_NM: props.EMD_KOR_NM,
						SIDO: props.SIDO,
					});
				}

				const area = geoArea(f);

				return {
					pathD: pathGenerator(f) ?? "",
					centroid: pathGenerator.centroid(f) as [number, number],
					region,
					area,
					showLabel: showLabels && area > effectiveThreshold,
				};
			}),
		[
			effectiveFeatureCollection,
			pathGenerator,
			showLabels,
			effectiveThreshold,
			currentLevel,
		],
	);

	// --- 선거구 색상 맵 ---
	const constituencyColorMap = useMemo(() => {
		if (!isConstituencyMode || currentLevel !== "eupMyeonDong") return null;
		// 드릴다운 시에도 전체 featureCollection 기반으로 색상 맵 빌드 (색상 안정성)
		return buildConstituencyColorMap(featureCollection);
	}, [isConstituencyMode, currentLevel, featureCollection]);

	// Ref 패턴 — stale closure 방지 (RegionPolygon의 arePropsEqual이 onHover/onClick 제외)
	const constituencyColorMapRef = useRef(constituencyColorMap);
	constituencyColorMapRef.current = constituencyColorMap;

	const constituencyInfoMapRef = useRef(constituencyInfoMap);
	constituencyInfoMapRef.current = constituencyInfoMap;

	const isConstituencyModeRef = useRef(isConstituencyMode);
	isConstituencyModeRef.current = isConstituencyMode;

	// hover / tooltip 상태
	const [hoveredCode, setHoveredCode] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<HoveredRegion | null>(null);

	// 선거구 모드에서 hoveredConstituencyCode 파생
	const hoveredConstituencyCode = useMemo(() => {
		if (!isConstituencyMode || !hoveredCode || !constituencyColorMap) return null;
		return constituencyColorMap.get(hoveredCode)?.sggCode ?? null;
	}, [isConstituencyMode, hoveredCode, constituencyColorMap]);

	// --- 선거구 경계 오버레이 (선거구 개요 모드에서만) ---
	// 렌더된 EMD SVG path를 SGG_Code별로 합쳐 compound path 생성 → 경계 정확 일치 보장
	const constituencyOverlayPaths = useMemo(() => {
		if (!isConstituencyMode || selectedConstituency || !constituencyColorMap) return [];
		const pathsBySgg = new Map<string, string[]>();
		for (const { region, pathD } of regionData) {
			const entry = constituencyColorMap.get(region.code);
			if (!entry) continue;
			const arr = pathsBySgg.get(entry.sggCode);
			if (arr) {
				arr.push(pathD);
			} else {
				pathsBySgg.set(entry.sggCode, [pathD]);
			}
		}
		return Array.from(pathsBySgg.entries()).map(([sggCode, pathDs]) => ({
			sggCode,
			combinedPathD: pathDs.join(" "),
		}));
	}, [isConstituencyMode, selectedConstituency, constituencyColorMap, regionData]);

	// 보이는 지역 코드 목록 안정화 (참조 비교로 불필요한 리렌더 방지)
	const prevCodesRef = useRef<string[]>([]);
	useEffect(() => {
		const codes = regionData.map((r) => r.region.code);
		const prev = prevCodesRef.current;
		if (codes.length !== prev.length || codes.some((c, i) => c !== prev[i])) {
			prevCodesRef.current = codes;
			onVisibleCodesChange?.(codes);
		}
	}, [regionData, onVisibleCodesChange]);

	// 레벨 전환 시 hover 상태 초기화 (렌더 중 상태 조정 패턴)
	const viewKey = `${currentLevel}-${selectedSido}-${selectedCity}-${selectedGu}-${selectedConstituency}`;
	const [prevViewKey, setPrevViewKey] = useState(viewKey);
	if (prevViewKey !== viewKey) {
		setPrevViewKey(viewKey);
		setHoveredCode(null);
		setTooltip(null);
	}

	const handleHover = useCallback(
		(region: MapRegion | null, e: React.PointerEvent) => {
			if (e.pointerType === "touch") return;

			if (!region) {
				setHoveredCode(null);
				setTooltip(null);
				return;
			}
			setHoveredCode(region.code);

			// 선거구 개요 모드: tooltip region을 선거구 정보로 교체
			// 선거구 드릴다운 모드: 개별 EMD 정보 그대로 표시
			const cMode = isConstituencyModeRef.current;
			const cMap = constituencyColorMapRef.current;
			const cInfo = constituencyInfoMapRef.current;

			let tooltipRegion = region;
			if (cMode && !selectedConstituencyRef.current && cMap && cInfo) {
				const sggCode = cMap.get(region.code)?.sggCode;
				const info = sggCode ? cInfo.get(sggCode) : null;
				if (info) {
					tooltipRegion = { code: info.sggCode, sido: info.sido, name: info.sgg, fullName: info.sidoSgg };
				}
			}
			setTooltip({ region: tooltipRegion, position: { x: e.clientX, y: e.clientY } });
		},
		[],
	);

	// 롱프레스로 터치 툴팁 표시 (Phase 3-E) — data-code 속성으로 O(1) 룩업
	const handleLongPressCallback = useCallback(
		(x: number, y: number) => {
			const elem = document.elementFromPoint(x, y);
			if (!elem) return;

			const pathElem = elem.closest("path");
			if (!pathElem) return;

			const code = (pathElem as HTMLElement).dataset.code;
			const region = code ? regionByCode.get(code) : undefined;
			if (region) {
				setTooltip({ region, position: { x, y } });
				setTimeout(() => setTooltip(null), 3000);
			}
		},
		[regionByCode],
	);

	const longPress = useLongPress(handleLongPressCallback);

	const handleClick = useCallback(
		(region: MapRegion) => {
			if (isTransitioning) return;

			if (!enableDrillDown) {
				onRegionSelect?.(region);
				return;
			}

			if (currentLevel === "sido") {
				triggerTransition(gRef.current, () => {
					handleSidoSelect(region.sido);
				});
			} else if (currentLevel === "sigun") {
				const hasGu = sigunHasGuMap.get(region.code) ?? false;
				triggerTransition(gRef.current, () => {
					handleSigunSelect(region.code, region.name, hasGu);
				});
			} else if (currentLevel === "gu") {
				triggerTransition(gRef.current, () => {
					handleGuSelect(region.code, region.name);
				});
			} else {
				// 읍면동 레벨
				const cMode = isConstituencyModeRef.current;
				const cMap = constituencyColorMapRef.current;
				const cInfo = constituencyInfoMapRef.current;

				if (cMode && cMap && cInfo && !selectedConstituencyRef.current) {
					// 선거구 개요 모드 → 선거구 드릴다운
					const sggCode = cMap.get(region.code)?.sggCode;
					const info = sggCode ? cInfo.get(sggCode) : null;
					if (info) {
						onRegionSelect?.({
							code: info.sggCode,
							sido: info.sido,
							name: info.sgg,
							fullName: info.sidoSgg,
						});
						triggerTransition(gRef.current, () => {
							setSelectedConstituency(sggCode!);
							setSelectedConstituencyName(info.sgg);
						});
						return;
					}
				}
				// 선거구 상세 모드 또는 일반 모드 → EMD 클릭
				onRegionSelect?.(region);
			}
		},
		[
			isTransitioning,
			enableDrillDown,
			currentLevel,
			handleSidoSelect,
			handleSigunSelect,
			handleGuSelect,
			sigunHasGuMap,
			onRegionSelect,
			triggerTransition,
			gRef,
		],
	);

	// Choropleth 색상 맵 (Phase 3-C)
	const choroplethColorMap = useMemo(() => {
		if (!choroplethData || !choroplethConfig) return null;
		// 데이터가 있는 지역: 계산된 색상, 없는 지역: disabled fill
		const map: Record<string, string> = {};
		// 먼저 보이는 모든 지역을 disabled로 설정
		for (const { region } of regionData) {
			map[region.code] = mapColors.fillDisabled;
		}
		// 데이터가 있는 지역만 계산된 색상으로 덮어쓰기
		for (const code of Object.keys(choroplethData.values)) {
			const color = getChoroplethColor(code, choroplethData, choroplethConfig);
			if (color) map[code] = color;
		}
		return map;
	}, [choroplethData, choroplethConfig, regionData]);

	// Choropleth 범례 항목
	const legendItems = useMemo(() => {
		if (!choroplethData || !choroplethConfig) return [];
		return buildLegendItems(choroplethData, choroplethConfig);
	}, [choroplethData, choroplethConfig]);

	// O(1) 룩업용 code → region Map (I-MAP-5: Long Press 히트 디텍션 최적화)
	const regionByCode = useMemo(() => {
		const map = new Map<string, (typeof regionData)[0]["region"]>();
		for (const { region } of regionData) map.set(region.code, region);
		return map;
	}, [regionData]);

	// 검색 결과 하이라이트 코드
	const searchHighlightCode = useMemo(() => {
		if (!enableDrillDown || !searchNavigation) return null;
		if (
			currentLevel === "eupMyeonDong" &&
			searchNavigation.emdCode
		) {
			return searchNavigation.emdCode;
		}
		if (currentLevel === "gu" && searchNavigation.guCode) {
			return searchNavigation.guCode;
		}
		if (currentLevel === "sigun" && searchNavigation.cityCode) {
			return searchNavigation.cityCode;
		}
		return null;
	}, [enableDrillDown, currentLevel, searchNavigation]);

	// regionData를 active/inactive로 pre-split (I-MAP-2: 3회 순회 → 1회로 최적화)
	const { activeRegions, inactiveRegions } = useMemo(() => {
		const isConstituencyOverview = isConstituencyMode && !selectedConstituency;
		const active: typeof regionData = [];
		const inactive: typeof regionData = [];
		for (const item of regionData) {
			const isHovered = isConstituencyOverview ? false : hoveredCode === item.region.code;
			const isSelected = isConstituencyOverview
				? false
				: selectedCode === item.region.code || searchHighlightCode === item.region.code;
			if (isHovered || isSelected) {
				active.push(item);
			} else {
				inactive.push(item);
			}
		}
		return { activeRegions: active, inactiveRegions: inactive };
	}, [regionData, isConstituencyMode, selectedConstituency, hoveredCode, selectedCode, searchHighlightCode]);

	// --- 선거구 fillOverride 헬퍼 ---
	const getConstituencyFill = (code: string, hovered: boolean, selected: boolean): string | null => {
		if (!constituencyColorMap) return null;
		const entry = constituencyColorMap.get(code);
		if (!entry) return null;
		// Figma: "기존 선택된 영역은 색상 그대로 유지"
		// hover만 채도 높은 색상 사용 (selected가 아닐 때만)
		return (hovered && !selected) ? entry.hover : entry.base;
	};

	// 로딩 상태 (외부 + 데이터 로딩)
	if (isLoading || isDataLoading) {
		return <MapSkeleton width={width} height={height} />;
	}

	// 에러 상태
	if (dataError) {
		return (
			<div className="flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-base text-destructive">
				지도 데이터를 불러오지 못했습니다: {dataError}
			</div>
		);
	}

	const ariaLabel =
		currentLevel === "sido"
			? "시도별 대한민국 지도"
			: currentLevel === "sigun"
				? `${selectedSido ?? ""} 시군 지도`
				: currentLevel === "gu"
					? `${selectedCityName ?? ""} 구 지도`
					: `${selectedGuName ?? selectedCityName ?? ""} 읍면동 지도`;

	return (
		<div ref={containerRef} className={cn("relative overflow-hidden", className)}>
			{/* 브레드크럼 + 선거구 토글을 flex row로 배치 */}
			<div className="flex items-center justify-between">
				{enableDrillDown && (
					<MapBreadcrumb
						level={level}
						selectedSido={selectedSido}
						selectedCityName={selectedCityName}
						selectedGuName={selectedGuName}
						selectedConstituencyName={selectedConstituencyName}
						onBackToNational={handleAnimatedBackToNational}
						onBackToSido={handleAnimatedBackToSido}
						onBackToSigun={handleAnimatedBackToSigun}
						onBackToConstituencyOverview={handleBackToConstituencyOverview}
					/>
				)}
				{currentLevel === "eupMyeonDong" && !choroplethData && !selectedConstituency && (
					<label className="flex shrink-0 items-center gap-1.5 text-body-3 font-medium text-label-alternative">
						선거구 보기
						<Switch
							size="sm"
							checked={isConstituencyMode}
							onCheckedChange={(checked) => {
								setIsConstituencyMode(checked);
								onConstituencyModeChange?.(checked);
							}}
						/>
					</label>
				)}
			</div>
			<svg
				ref={svgRef}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				overflow="hidden"
				role="img"
				aria-label={ariaLabel}
				style={{ cursor: zoomLevel > 1 ? "grab" : undefined }}
				onPointerDown={longPress.onPointerDown}
				onPointerMove={longPress.onPointerMove}
				onPointerUp={longPress.onPointerUp}
				onPointerCancel={longPress.onPointerUp}
			>
				<g ref={gRef}>
					{/* Layer 1: 비활성 폴리곤 path만 — label을 분리하여 인접 폴리곤에 가리지 않도록 함 */}
					{inactiveRegions.map(({ region, pathD, centroid }) => {
						const emdSggCode = constituencyColorMap?.get(region.code)?.sggCode;
						const isConstituencyOverview = isConstituencyMode && !selectedConstituency;
						let fillOverride: string | null = choroplethColorMap?.[region.code] ?? null;
						if (!fillOverride && isConstituencyOverview && emdSggCode) {
							const isConstHovered = emdSggCode === hoveredConstituencyCode;
							const isConstSelected = emdSggCode === selectedCode;
							fillOverride = getConstituencyFill(region.code, isConstHovered, isConstSelected);
						} else if (!fillOverride) {
							fillOverride = getConstituencyFill(region.code, false, false);
						}
						return (
							<RegionPolygon
								key={region.code}
								pathD={pathD}
								centroid={centroid}
								region={region}
								isHovered={false}
								isSelected={false}
								showLabel={false}
								fillOverride={fillOverride}
								onHover={handleHover}
								onClick={handleClick}
							/>
						);
					})}
					{/* Layer 2: 비활성 폴리곤 label — 모든 path 위에 렌더링 */}
					{inactiveRegions.map(({ region, centroid, showLabel, area }) => {
						const zoomAdjustedShowLabel =
							showLabel ||
							(showLabels &&
								zoomLevel >= ZOOM_LABEL_THRESHOLD &&
								area >
									effectiveThreshold /
										(zoomLevel * zoomLevel));
						if (!zoomAdjustedShowLabel) return null;
						return (
							<text
								key={region.code}
								x={centroid[0]}
								y={centroid[1]}
								textAnchor="middle"
								dominantBaseline="central"
								fill={mapColors.label}
								fontSize={10}
								pointerEvents="none"
							>
								{region.name}
							</text>
						);
					})}
					{/* Layer 3: hover/selected 폴리곤 — path + label 최상위 렌더링 */}
					{activeRegions.map(({ region, pathD, centroid, showLabel, area }) => {
						const isHovered = hoveredCode === region.code;
						const isSelected = selectedCode === region.code || searchHighlightCode === region.code;
						const zoomAdjustedShowLabel =
							showLabel ||
							(showLabels &&
								zoomLevel >= ZOOM_LABEL_THRESHOLD &&
								area >
									effectiveThreshold /
										(zoomLevel * zoomLevel));
						const fillOverride =
							choroplethColorMap?.[region.code]
							?? getConstituencyFill(region.code, isHovered, isSelected)
							?? null;
						return (
							<RegionPolygon
								key={region.code}
								pathD={pathD}
								centroid={centroid}
								region={region}
								isHovered={isHovered}
								isSelected={isSelected}
								showLabel={zoomAdjustedShowLabel}
								fillOverride={fillOverride}
								onHover={handleHover}
								onClick={handleClick}
							/>
						);
					})}
					{/* Layer 4: 선거구 경계 오버레이 (개요 모드) — clip-path로 외곽선만 표시 */}
					{constituencyOverlayPaths.map(({ sggCode, combinedPathD }) => {
						const isHovered = sggCode === hoveredConstituencyCode;
						const isSelected = sggCode === selectedCode;
						if (!isHovered && !isSelected) return null;
						const clipId = `const-outer-${sggCode}`;
						return (
							<g key={`constituency-${sggCode}`}>
								<defs>
									<clipPath id={clipId}>
										<path
											d={`M0,0 L${width},0 L${width},${height} L0,${height} Z ${combinedPathD}`}
											clipRule="evenodd"
										/>
									</clipPath>
								</defs>
								<path
									d={combinedPathD}
									fill="none"
									stroke={mapColors.strokeHover}
									strokeWidth={6}
									vectorEffect="non-scaling-stroke"
									pointerEvents="none"
									clipPath={`url(#${clipId})`}
									style={{ transition: "stroke 150ms ease-out" }}
								/>
							</g>
						);
					})}
				</g>
			</svg>
			{/* 줌 컨트롤 (Phase 3-D) */}
			<div className="absolute bottom-4 left-4">
				<MapZoomControls
					onZoomIn={zoomIn}
					onZoomOut={zoomOut}
					onZoomReset={smoothZoomReset}
					zoomLevel={zoomLevel}
				/>
			</div>
			{/* Choropleth 범례 (Phase 3-C) */}
			{choroplethConfig && legendItems.length > 0 && (
				<div className="absolute bottom-4 right-4">
					<MapLegend
						title={choroplethConfig.legendTitle}
						items={legendItems}
					/>
				</div>
			)}
			{/* MapTooltip — 선거구 모드 시 constituencyTooltipData 사용 */}
			<MapTooltip
				hovered={tooltip}
				data={
					tooltip
						? (isConstituencyMode && !selectedConstituency && constituencyTooltipData
							? constituencyTooltipData[tooltip.region.code]
							: tooltipDataProvider?.(tooltip.region.code))
						: undefined
				}
			/>
		</div>
	);
}
