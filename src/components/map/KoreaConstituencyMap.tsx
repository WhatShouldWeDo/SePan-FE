import { useState, useCallback, useMemo, useEffect } from "react";
import { geoArea } from "d3-geo";
import { useProjection } from "@/hooks/useProjection";
import {
	useMapDrillDown,
	sidoPropsToMapRegion,
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

export interface KoreaConstituencyMapProps {
	/** 지도 설정 */
	config?: MapConfig;
	/** 선택된 지역구 코드 */
	selectedCode?: string | null;
	/** 지역구 클릭 콜백 — API 호출 파라미터로 활용 */
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

/** 시도 레벨 라벨 면적 임계값 (시도는 크므로 거의 모두 표시) */
const SIDO_LABEL_AREA_THRESHOLD = 1e-5;

/** 선거구 레벨 라벨 면적 임계값 */
const CONSTITUENCY_LABEL_AREA_THRESHOLD = 5e-7;

/** 읍면동 레벨 라벨 면적 임계값 */
const EMD_LABEL_AREA_THRESHOLD = 1e-7;

/** 줌 레벨 2x 이상에서만 작은 라벨 표시 */
const ZOOM_LABEL_THRESHOLD = 2;

/**
 * 22대 국회의원 선거구 폴리곤 지도 (시도 → 선거구 → 읍면동 3단계 드릴다운)
 *
 * @description
 * - enableDrillDown=true (기본): 시도 → 선거구 → 읍면동 3단계 드릴다운
 * - enableDrillDown=false: Phase 1.2 호환 단일 뷰
 * - Phase 3-A: TopoJSON 동적 import로 초기 번들 감소
 * - Phase 3-C: Choropleth 색상 매핑 + 범례
 * - Phase 3-D: d3-zoom 기반 줌/팬 (1x~8x)
 * - Phase 4: 읍면동 3단계 드릴다운
 */
export function KoreaConstituencyMap({
	config,
	selectedCode,
	onRegionSelect,
	searchNavigation,
	choroplethData = null,
	choroplethConfig = null,
	isLoading = false,
	className,
}: KoreaConstituencyMapProps) {
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
		constituencyFeatures,
		emdFeatures,
		isLoading: isDataLoading,
		error: dataError,
	} = useTopoJsonData();

	// --- 드릴다운 모드 (3단계) ---
	const {
		level,
		selectedSido,
		selectedConstituency,
		selectedConstituencyName,
		featureCollection: drillDownFeatureCollection,
		handleSidoSelect,
		handleConstituencySelect,
		handleBackToNational,
		handleBackToSido,
		navigateToSearchResult,
	} = useMapDrillDown(sidoFeatures, constituencyFeatures, emdFeatures);

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
	}, [level, selectedSido, selectedConstituency]);

	// --- 레거시 모드 (enableDrillDown=false) ---
	const legacyFeatureCollection = useMemo(() => {
		if (enableDrillDown || !constituencyFeatures) return null;
		return constituencyFeatures;
	}, [enableDrillDown, constituencyFeatures]);

	// 현재 표시할 featureCollection
	const featureCollection = enableDrillDown
		? drillDownFeatureCollection
		: (legacyFeatureCollection ?? drillDownFeatureCollection);

	// 현재 레벨 (레거시 모드는 항상 constituency)
	const currentLevel = enableDrillDown ? level : "constituency";

	// 레벨별 라벨 면적 임계값
	const effectiveThreshold =
		labelAreaThreshold ??
		(currentLevel === "sido"
			? SIDO_LABEL_AREA_THRESHOLD
			: currentLevel === "constituency"
				? CONSTITUENCY_LABEL_AREA_THRESHOLD
				: EMD_LABEL_AREA_THRESHOLD);

	// D3 projection + path generator
	const { pathGenerator } = useProjection(
		featureCollection,
		width,
		height,
		padding,
	);

	// 각 feature의 pathD, centroid, region 미리 계산
	const regionData = useMemo(
		() =>
			featureCollection.features.map((f) => {
				const props = f.properties as Record<string, string>;

				// 시도 / 선거구 / 읍면동 레벨 분기
				let region: MapRegion;
				if (currentLevel === "sido") {
					region = sidoPropsToMapRegion({ SIDO: props.SIDO });
				} else if (currentLevel === "eupMyeonDong") {
					region = emdPropsToMapRegion({
						EMD_CD: props.EMD_CD,
						EMD_KOR_NM: props.EMD_KOR_NM,
						SIDO: props.SIDO,
					});
				} else {
					region = {
						code: props.SGG_Code,
						sido: props.SIDO,
						name: props.SGG,
						fullName: props.SIDO_SGG,
					};
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
	const viewKey = `${currentLevel}-${selectedSido}-${selectedConstituency}`;
	const [prevViewKey, setPrevViewKey] = useState(viewKey);
	if (prevViewKey !== viewKey) {
		setPrevViewKey(viewKey);
		setHoveredCode(null);
		setTooltip(null);
	}

	const handleHover = useCallback(
		(region: MapRegion | null, e: React.PointerEvent) => {
			// 터치에서는 hover 무시 (longpress로 대체, Phase 3-E)
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
				// 3초 후 자동 닫기
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
			} else if (currentLevel === "constituency") {
				triggerTransition(gRef.current, () => {
					handleConstituencySelect(region.code, region.name);
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
			handleConstituencySelect,
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
		if (
			currentLevel === "constituency" &&
			searchNavigation.constituencyCode
		) {
			return searchNavigation.constituencyCode;
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
			: currentLevel === "constituency"
				? `${selectedSido ?? ""} 선거구 지도`
				: `${selectedConstituencyName ?? ""} 읍면동 지도`;

	return (
		<div className={cn("relative", className)}>
			{enableDrillDown && (
				<MapBreadcrumb
					level={level}
					selectedSido={selectedSido}
					selectedConstituencyName={selectedConstituencyName}
					onBackToNational={handleAnimatedBackToNational}
					onBackToSido={handleAnimatedBackToSido}
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
							// 줌 레벨에 따른 라벨 표시 조정:
							// - 기본적으로 숨겨진 작은 폴리곤도 줌 2x 이상이면 표시
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
