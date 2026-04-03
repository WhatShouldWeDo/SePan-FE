import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useProjection } from "@/features/region/hooks/useProjection";
import { usePolylabelPositions } from "@/features/region/hooks/usePolylabelPositions";
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
import { MapTooltip } from "./MapTooltip";
import type { MapTooltipData } from "./MapTooltip";
import { MapSkeleton } from "./MapSkeleton";
import { MapBreadcrumb } from "./MapBreadcrumb";
import { MapZoomControls } from "./MapZoomControls";
import { MapBaseLayer } from "./MapBaseLayer";
import { MapLabelLayer } from "./MapLabelLayer";
import { MapSelectedLayer } from "./MapSelectedLayer";
import { MapHoverOverlay } from "./MapHoverOverlay";
import { MapConstituencyOverlay } from "./MapConstituencyOverlay";
import { cn } from "@/lib/utils";
import { mapColors } from "@/features/region/lib/map-theme";
import { getChoroplethColor, buildLegendItems } from "@/features/region/lib/choropleth-utils";
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

/** 라벨 표시 최소 투영 면적 (px²) — 약 28×28px 이상 폴리곤에 라벨 표시 */
const LABEL_AREA_THRESHOLD_PX = 800;

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

	// --- 선거구 뷰 모드 (useConstituencyMode 훅) ---
	const {
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
	} = useConstituencyMode(currentLevel, featureCollection, choroplethData, searchNavigation);

	// constituencyInfoMap ref (stale closure 방지)
	const constituencyInfoMapRef = useRef(constituencyInfoMap);
	useEffect(() => { constituencyInfoMapRef.current = constituencyInfoMap; }, [constituencyInfoMap]);

	// 선거구 드릴다운 시: 해당 선거구의 EMD만 필터
	const effectiveFeatureCollection = useMemo(() => {
		if (!selectedConstituency || currentLevel !== "eupMyeonDong") return featureCollection;
		return {
			type: "FeatureCollection" as const,
			features: featureCollection.features.filter(
				(f) => f.properties?.SGG_Code === selectedConstituency,
			),
		};
	}, [featureCollection, selectedConstituency, currentLevel]);

	// 레벨 전환 시 줌 리셋 (부드러운 전환)
	useEffect(() => {
		smoothZoomResetRef.current();
	}, [level, selectedSido, selectedCity, selectedGu, selectedConstituency]);

	// 선거구 드릴다운 복귀 핸들러
	const handleBackToConstituencyOverview = useCallback(() => {
		if (isTransitioning) return;
		triggerTransition(gRef.current, () => {
			resetConstituencyDrillDown();
		});
	}, [isTransitioning, triggerTransition, gRef, resetConstituencyDrillDown]);

	const effectiveThreshold = labelAreaThreshold ?? LABEL_AREA_THRESHOLD_PX;

	// D3 projection + path generator (선거구 드릴다운 시 필터된 컬렉션 사용)
	const { projection, pathGenerator } = useProjection(
		effectiveFeatureCollection,
		width,
		height,
		padding,
	);

	// polylabel 라벨 위치 계산 (Web Worker, 비동기)
	const { labelPositions, isComputing: isComputingPolylabel } =
		usePolylabelPositions(effectiveFeatureCollection, projection);
	// 라벨 표시 조건: 전환 애니메이션 + polylabel 계산 모두 완료
	const isComputingLabels = isTransitioning || isComputingPolylabel;

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

				const area = pathGenerator.area(f);

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

	// hover / tooltip 상태
	const [hoveredCode, setHoveredCode] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<HoveredRegion | null>(null);

	// 선거구 모드에서 hoveredConstituencyCode 파생
	const hoveredConstituencyCode = useMemo(() => {
		if (!isConstituencyMode || !hoveredCode || !constituencyColorMap) return null;
		return constituencyColorMap.get(hoveredCode)?.sggCode ?? null;
	}, [isConstituencyMode, hoveredCode, constituencyColorMap]);

	// --- 선거구 경계 오버레이 (선거구 개요 모드에서만) ---
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
		[isConstituencyModeRef, constituencyColorMapRef, constituencyInfoMapRef, selectedConstituencyRef],
	);

	// O(1) 룩업용 code → regionData item Map (I-MAP-5: Long Press + hover 최적화)
	const regionDataByCode = useMemo(() => {
		const map = new Map<string, (typeof regionData)[0]>();
		for (const item of regionData) map.set(item.region.code, item);
		return map;
	}, [regionData]);

	// 롱프레스로 터치 툴팁 표시 (Phase 3-E) — data-code 속성으로 O(1) 룩업
	const handleLongPressCallback = useCallback(
		(x: number, y: number) => {
			const elem = document.elementFromPoint(x, y);
			if (!elem) return;

			const pathElem = elem.closest("path");
			if (!pathElem) return;

			const code = (pathElem as SVGElement).dataset.code;
			const item = code ? regionDataByCode.get(code) : undefined;
			if (item) {
				setTooltip({ region: item.region, position: { x, y } });
				setTimeout(() => setTooltip(null), 3000);
			}
		},
		[regionDataByCode],
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
							enterConstituencyDrillDown(sggCode!, info.sgg);
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
			isConstituencyModeRef,
			constituencyColorMapRef,
			constituencyInfoMapRef,
			selectedConstituencyRef,
			enterConstituencyDrillDown,
		],
	);

	// Choropleth 색상 맵 (Phase 3-C)
	const choroplethColorMap = useMemo(() => {
		if (!choroplethData || !choroplethConfig) return null;
		const map: Record<string, string> = {};
		for (const { region } of regionData) {
			map[region.code] = mapColors.fillDisabled;
		}
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

	// 검색 결과 하이라이트 코드
	const searchHighlightCode = useMemo(() => {
		if (!enableDrillDown || !searchNavigation) return null;
		if (currentLevel === "eupMyeonDong" && searchNavigation.emdCode) {
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

	// regionData를 selected/unselected로 pre-split (I-MAP-2: 3회 순회 → 1회로 최적화)
	const { selectedRegions, unselectedRegions } = useMemo(() => {
		const isConstituencyOverview = isConstituencyMode && !selectedConstituency;
		const selected: typeof regionData = [];
		const unselected: typeof regionData = [];
		for (const item of regionData) {
			const isSelected = isConstituencyOverview
				? false
				: selectedCode === item.region.code || searchHighlightCode === item.region.code;
			if (isSelected) {
				selected.push(item);
			} else {
				unselected.push(item);
			}
		}
		return { selectedRegions: selected, unselectedRegions: unselected };
	}, [regionData, isConstituencyMode, selectedConstituency, selectedCode, searchHighlightCode]);

	// --- 선거구 fillOverride 헬퍼 ---
	const getConstituencyFill = useCallback((code: string, hovered: boolean, selected: boolean): string | null => {
		if (!constituencyColorMap) return null;
		const entry = constituencyColorMap.get(code);
		if (!entry) return null;
		return (hovered && !selected) ? entry.hover : entry.base;
	}, [constituencyColorMap]);

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

	const isConstituencyOverview = isConstituencyMode && !selectedConstituency;

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
					{/* Layer 1: 비선택 폴리곤 path만 */}
					<MapBaseLayer
						regions={unselectedRegions}
						constituencyColorMap={constituencyColorMap}
						choroplethColorMap={choroplethColorMap}
						isConstituencyOverview={isConstituencyOverview}
						hoveredConstituencyCode={hoveredConstituencyCode}
						selectedCode={selectedCode}
						getConstituencyFill={getConstituencyFill}
						onHover={handleHover}
						onClick={handleClick}
					/>
					{/* Layer 2: 비선택 폴리곤 label */}
					<MapLabelLayer
						regions={unselectedRegions}
						showLabels={showLabels}
						zoomLevel={zoomLevel}
						effectiveThreshold={effectiveThreshold}
						labelPositions={labelPositions}
						isComputingLabels={isComputingLabels}
					/>
					{/* Layer 3: hover/selected 폴리곤 */}
					<MapSelectedLayer
						regions={selectedRegions}
						hoveredCode={hoveredCode}
						choroplethColorMap={choroplethColorMap}
						getConstituencyFill={getConstituencyFill}
						showLabels={showLabels}
						zoomLevel={zoomLevel}
						effectiveThreshold={effectiveThreshold}
						labelPositions={labelPositions}
						isComputingLabels={isComputingLabels}
						onHover={handleHover}
						onClick={handleClick}
					/>
					{/* Hovered 폴리곤 (선택되지 않은 경우) */}
					<MapHoverOverlay
						hoveredCode={hoveredCode}
						selectedCode={selectedCode}
						searchHighlightCode={searchHighlightCode}
						regionDataByCode={regionDataByCode}
						choroplethColorMap={choroplethColorMap}
						getConstituencyFill={getConstituencyFill}
						showLabels={showLabels}
						zoomLevel={zoomLevel}
						effectiveThreshold={effectiveThreshold}
						labelPositions={labelPositions}
						isComputingLabels={isComputingLabels}
						onHover={handleHover}
						onClick={handleClick}
					/>
					{/* Layer 4: 선거구 경계 오버레이 */}
					<MapConstituencyOverlay
						overlayPaths={constituencyOverlayPaths}
						hoveredConstituencyCode={hoveredConstituencyCode}
						selectedCode={selectedCode}
						width={width}
						height={height}
					/>
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
