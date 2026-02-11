import { useState, useCallback, useMemo, useEffect } from "react";
import { geoArea } from "d3-geo";
import { useProjection } from "@/hooks/useProjection";
import {
	useMapDrillDown,
	sidoPropsToMapRegion,
	sigunPropsToMapRegion,
	sigunguPropsToMapRegion,
	emdPropsToMapRegion,
} from "@/hooks/useMapDrillDown";
import { useTopoJsonData } from "@/hooks/useTopoJsonData";
import { useMapZoom } from "@/hooks/useMapZoom";
import { useMapTransition } from "@/hooks/useMapTransition";
import { useLongPress } from "@/hooks/useLongPress";
import { RegionPolygon } from "./RegionPolygon";
import { MapTooltip } from "./MapTooltip";
import { MapSkeleton } from "./MapSkeleton";
import { MapBreadcrumb } from "./MapBreadcrumb";
import { MapZoomControls } from "./MapZoomControls";
import { cn } from "@/lib/utils";
import { getChoroplethColor, buildLegendItems } from "@/lib/choropleth-utils";
import { MapLegend } from "./MapLegend";
import type {
	MapRegion,
	MapConfig,
	HoveredRegion,
	SearchSelectedRegion,
	ChoroplethData,
	ChoroplethConfig,
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
 */
export function KoreaAdminMap({
	config,
	selectedCode,
	onRegionSelect,
	searchNavigation,
	choroplethData = null,
	choroplethConfig = null,
	isLoading = false,
	className,
}: KoreaAdminMapProps) {
	const {
		width = 600,
		height = 800,
		padding = 20,
		showLabels = true,
		labelAreaThreshold,
		enableDrillDown = true,
	} = config ?? {};

	// --- TopoJSON 동적 로딩 ---
	const {
		sidoFeatures,
		sigunFeatures,
		sigunguFeatures,
		emdFeatures,
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

	// --- 전환 애니메이션 (Phase 4-D) ---
	const { isTransitioning, triggerTransition } = useMapTransition();

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
	useEffect(() => {
		if (searchNavigation && enableDrillDown) {
			navigateToSearchResult(searchNavigation);
		}
	}, [searchNavigation, enableDrillDown, navigateToSearchResult]);

	// 레벨 전환 시 줌 리셋 (부드러운 전환)
	useEffect(() => {
		smoothZoomReset();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [level, selectedSido, selectedCity, selectedGu]);

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

	// D3 projection + path generator
	const { pathGenerator } = useProjection(
		featureCollection,
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
			featureCollection.features.map((f) => {
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
			featureCollection,
			pathGenerator,
			showLabels,
			effectiveThreshold,
			currentLevel,
		],
	);

	// hover / tooltip 상태
	const [hoveredCode, setHoveredCode] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<HoveredRegion | null>(null);

	// 레벨 전환 시 hover 상태 초기화 (렌더 중 상태 조정 패턴)
	const viewKey = `${currentLevel}-${selectedSido}-${selectedCity}-${selectedGu}`;
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
			setTooltip({ region, position: { x: e.clientX, y: e.clientY } });
		},
		[],
	);

	// 롱프레스로 터치 툴팁 표시 (Phase 3-E)
	const handleLongPressCallback = useCallback(
		(x: number, y: number) => {
			const elem = document.elementFromPoint(x, y);
			if (!elem) return;

			const pathElem = elem.closest("path");
			if (!pathElem) return;

			const d = pathElem.getAttribute("d") ?? "";
			const matched = regionData.find((r) => r.pathD === d);
			if (matched) {
				setTooltip({
					region: matched.region,
					position: { x, y },
				});
				setTimeout(() => setTooltip(null), 3000);
			}
		},
		[regionData],
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
				// 읍면동 레벨 — 외부 콜백으로 전달
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
		const map: Record<string, string> = {};
		for (const code of Object.keys(choroplethData.values)) {
			const color = getChoroplethColor(
				code,
				choroplethData,
				choroplethConfig,
			);
			if (color) map[code] = color;
		}
		return map;
	}, [choroplethData, choroplethConfig]);

	// Choropleth 범례 항목
	const legendItems = useMemo(() => {
		if (!choroplethData || !choroplethConfig) return [];
		return buildLegendItems(choroplethData, choroplethConfig);
	}, [choroplethData, choroplethConfig]);

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
		<div className={cn("relative", className)}>
			{enableDrillDown && (
				<MapBreadcrumb
					level={level}
					selectedSido={selectedSido}
					selectedCityName={selectedCityName}
					selectedGuName={selectedGuName}
					onBackToNational={handleAnimatedBackToNational}
					onBackToSido={handleAnimatedBackToSido}
					onBackToSigun={handleAnimatedBackToSigun}
				/>
			)}
			<svg
				ref={svgRef}
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={ariaLabel}
				style={{ cursor: zoomLevel > 1 ? "grab" : undefined }}
				onPointerDown={longPress.onPointerDown}
				onPointerMove={longPress.onPointerMove}
				onPointerUp={longPress.onPointerUp}
				onPointerCancel={longPress.onPointerUp}
			>
				<g ref={gRef}>
					{regionData.map(
						({ region, pathD, centroid, showLabel, area }) => {
							const zoomAdjustedShowLabel =
								showLabel ||
								(showLabels &&
									zoomLevel >= ZOOM_LABEL_THRESHOLD &&
									area >
										effectiveThreshold /
											(zoomLevel * zoomLevel));

							return (
								<RegionPolygon
									key={region.code}
									pathD={pathD}
									centroid={centroid}
									region={region}
									isHovered={hoveredCode === region.code}
									isSelected={
										selectedCode === region.code ||
										searchHighlightCode === region.code
									}
									showLabel={zoomAdjustedShowLabel}
									fillOverride={
										choroplethColorMap?.[region.code] ??
										null
									}
									onHover={handleHover}
									onClick={handleClick}
								/>
							);
						},
					)}
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
			<MapTooltip hovered={tooltip} />
		</div>
	);
}
