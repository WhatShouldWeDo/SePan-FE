import { useState, useCallback, useMemo, useEffect } from "react";
import * as topojson from "topojson-client";
import { geoArea } from "d3-geo";
import { useProjection } from "@/hooks/useProjection";
import {
	useMapDrillDown,
	sidoPropsToMapRegion,
} from "@/hooks/useMapDrillDown";
import { RegionPolygon } from "./RegionPolygon";
import { MapTooltip } from "./MapTooltip";
import { MapSkeleton } from "./MapSkeleton";
import { MapBreadcrumb } from "./MapBreadcrumb";
import { cn } from "@/lib/utils";
import type {
	MapRegion,
	MapConfig,
	HoveredRegion,
	SearchSelectedRegion,
} from "@/types/map";
import topojsonData from "@/features/region/data/constituencies.topojson.json";

export interface KoreaConstituencyMapProps {
	/** 지도 설정 */
	config?: MapConfig;
	/** 선택된 지역구 코드 */
	selectedCode?: string | null;
	/** 지역구 클릭 콜백 — API 호출 파라미터로 활용 */
	onRegionSelect?: (region: MapRegion) => void;
	/** 검색 결과로 특정 지역으로 네비게이트 */
	searchNavigation?: SearchSelectedRegion | null;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 추가 className */
	className?: string;
}

/** TopoJSON 오브젝트명 */
const TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

/** 시도 레벨 라벨 면적 임계값 (시도는 크므로 거의 모두 표시) */
const SIDO_LABEL_AREA_THRESHOLD = 1e-5;

/** 선거구 레벨 라벨 면적 임계값 */
const CONSTITUENCY_LABEL_AREA_THRESHOLD = 5e-7;

/**
 * 22대 국회의원 선거구 폴리곤 지도 (시도 드릴다운 지원)
 *
 * @description
 * - enableDrillDown=true (기본): 시도 → 선거구 2단계 드릴다운
 * - enableDrillDown=false: Phase 1.2 호환 단일 뷰
 */
export function KoreaConstituencyMap({
	config,
	selectedCode,
	onRegionSelect,
	searchNavigation,
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

	// --- 드릴다운 모드 ---
	const {
		level,
		selectedSido,
		featureCollection: drillDownFeatureCollection,
		handleSidoSelect,
		handleBackToNational,
		navigateToSearchResult,
	} = useMapDrillDown();

	// 검색 네비게이션 처리
	useEffect(() => {
		if (searchNavigation && enableDrillDown) {
			navigateToSearchResult(searchNavigation);
		}
	}, [searchNavigation, enableDrillDown, navigateToSearchResult]);

	// --- 레거시 모드 (enableDrillDown=false) ---
	const legacyFeatureCollection = useMemo(() => {
		if (enableDrillDown) return null;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const topology = topojsonData as any;
		return topojson.feature(
			topology,
			topology.objects[TOPOJSON_OBJECT_KEY],
		) as unknown as GeoJSON.FeatureCollection;
	}, [enableDrillDown]);

	// 현재 표시할 featureCollection
	const featureCollection = enableDrillDown
		? drillDownFeatureCollection
		: legacyFeatureCollection!;

	// 현재 레벨 (레거시 모드는 항상 constituency)
	const currentLevel = enableDrillDown ? level : "constituency";

	// 레벨별 라벨 면적 임계값
	const effectiveThreshold =
		labelAreaThreshold ??
		(currentLevel === "sido"
			? SIDO_LABEL_AREA_THRESHOLD
			: CONSTITUENCY_LABEL_AREA_THRESHOLD);

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

				// 시도 레벨 vs 선거구 레벨 분기
				const region: MapRegion =
					currentLevel === "sido"
						? sidoPropsToMapRegion({ SIDO: props.SIDO })
						: {
								code: props.SGG_Code,
								sido: props.SIDO,
								name: props.SGG,
								fullName: props.SIDO_SGG,
							};

				return {
					pathD: pathGenerator(f) ?? "",
					centroid: pathGenerator.centroid(f) as [number, number],
					region,
					showLabel:
						showLabels && geoArea(f) > effectiveThreshold,
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
	// https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
	const viewKey = `${currentLevel}-${selectedSido}`;
	const [prevViewKey, setPrevViewKey] = useState(viewKey);
	if (prevViewKey !== viewKey) {
		setPrevViewKey(viewKey);
		setHoveredCode(null);
		setTooltip(null);
	}

	const handleHover = useCallback(
		(region: MapRegion | null, e: React.MouseEvent) => {
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

	const handleClick = useCallback(
		(region: MapRegion) => {
			if (enableDrillDown && currentLevel === "sido") {
				handleSidoSelect(region.sido);
			} else {
				onRegionSelect?.(region);
			}
		},
		[enableDrillDown, currentLevel, handleSidoSelect, onRegionSelect],
	);

	// 검색 결과 하이라이트 코드
	const searchHighlightCode =
		enableDrillDown &&
		currentLevel === "constituency" &&
		searchNavigation?.constituencyCode
			? searchNavigation.constituencyCode
			: null;

	// 로딩 상태
	if (isLoading) {
		return <MapSkeleton width={width} height={height} />;
	}

	const ariaLabel =
		currentLevel === "sido"
			? "시도별 대한민국 지도"
			: `${selectedSido ?? ""} 선거구 지도`;

	return (
		<div className={cn("relative", className)}>
			{enableDrillDown && (
				<MapBreadcrumb
					level={level}
					selectedSido={selectedSido}
					onBackToNational={handleBackToNational}
				/>
			)}
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label={ariaLabel}
			>
				{regionData.map(({ region, pathD, centroid, showLabel }) => (
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
						showLabel={showLabel}
						onHover={handleHover}
						onClick={handleClick}
					/>
				))}
			</svg>
			<MapTooltip hovered={tooltip} />
		</div>
	);
}
