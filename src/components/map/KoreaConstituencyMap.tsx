import { useState, useCallback, useMemo } from "react";
import * as topojson from "topojson-client";
import { geoArea } from "d3-geo";
import { useProjection } from "@/hooks/useProjection";
import { RegionPolygon } from "./RegionPolygon";
import { MapTooltip } from "./MapTooltip";
import { MapSkeleton } from "./MapSkeleton";
import { cn } from "@/lib/utils";
import type { MapRegion, MapConfig, HoveredRegion } from "@/types/map";
import topojsonData from "@/features/region/data/constituencies.topojson.json";

export interface KoreaConstituencyMapProps {
	/** 지도 설정 */
	config?: MapConfig;
	/** 선택된 지역구 코드 */
	selectedCode?: string | null;
	/** 지역구 클릭 콜백 — API 호출 파라미터로 활용 */
	onRegionSelect?: (region: MapRegion) => void;
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 추가 className */
	className?: string;
}

/** TopoJSON 오브젝트명 (mapshaper 변환 시 소스 파일명 기반 자동 생성) */
const TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

/**
 * 22대 국회의원 254개 선거구 폴리곤 지도
 *
 * @description
 * - D3-geo 기반 SVG 폴리곤 렌더링
 * - TopoJSON → GeoJSON 변환 (빌드 타임 번들)
 * - hover 툴팁 + 클릭 선택 + 폴리곤 중앙 라벨
 * - 차트 래퍼와 동일한 API 패턴 (config, isLoading, className)
 *
 * @example
 * ```tsx
 * <KoreaConstituencyMap
 *   onRegionSelect={(region) => console.log(region.fullName)}
 *   selectedCode="2111601"
 * />
 * ```
 */
export function KoreaConstituencyMap({
	config,
	selectedCode,
	onRegionSelect,
	isLoading = false,
	className,
}: KoreaConstituencyMapProps) {
	const {
		width = 600,
		height = 800,
		padding = 20,
		showLabels = true,
		labelAreaThreshold,
	} = config ?? {};

	// 1. TopoJSON → GeoJSON 변환 (빌드 타임 데이터, 한 번만 실행)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const featureCollection = useMemo(() => {
		const topology = topojsonData as any;
		const geojson = topojson.feature(topology, topology.objects[TOPOJSON_OBJECT_KEY]);
		// feature()가 GeometryCollection을 받으면 FeatureCollection을 반환
		return geojson as unknown as GeoJSON.FeatureCollection;
	}, []);

	// 2. D3 projection + path generator
	const { pathGenerator } = useProjection(
		featureCollection,
		width,
		height,
		padding,
	);

	// 3. 각 feature의 pathD, centroid 미리 계산 (memo 효과 극대화)
	const regionData = useMemo(
		() =>
			featureCollection.features.map((f) => {
				const props = f.properties as {
					SGG_Code: string;
					SIDO: string;
					SGG: string;
					SIDO_SGG: string;
				};
				return {
					pathD: pathGenerator(f) ?? "",
					centroid: pathGenerator.centroid(f) as [number, number],
					region: {
						code: props.SGG_Code,
						sido: props.SIDO,
						name: props.SGG,
						fullName: props.SIDO_SGG,
					} satisfies MapRegion,
					showLabel:
						showLabels &&
						(labelAreaThreshold != null
							? geoArea(f) > labelAreaThreshold
							: true),
				};
			}),
		[featureCollection, pathGenerator, showLabels, labelAreaThreshold],
	);

	// 4. hover / click 상태
	const [hoveredCode, setHoveredCode] = useState<string | null>(null);
	const [tooltip, setTooltip] = useState<HoveredRegion | null>(null);

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
			onRegionSelect?.(region);
		},
		[onRegionSelect],
	);

	// 5. 로딩 상태
	if (isLoading) {
		return <MapSkeleton width={width} height={height} />;
	}

	// 6. 렌더링
	return (
		<div className={cn("relative", className)}>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				role="img"
				aria-label="22대 국회의원 선거구 지도"
			>
				{regionData.map(({ region, pathD, centroid, showLabel }) => (
					<RegionPolygon
						key={region.code}
						pathD={pathD}
						centroid={centroid}
						region={region}
						isHovered={hoveredCode === region.code}
						isSelected={selectedCode === region.code}
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
