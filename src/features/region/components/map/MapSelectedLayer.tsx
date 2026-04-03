import React from "react";
import { RegionPolygon } from "./RegionPolygon";
import type { MapRegion } from "@/types/map";
import type { RegionDataItem } from "./MapBaseLayer";

export interface MapSelectedLayerProps {
	/** 선택된 지역 데이터 */
	regions: ReadonlyArray<RegionDataItem>;
	/** hover 중인 코드 */
	hoveredCode: string | null;
	/** Choropleth 색상 맵 */
	choroplethColorMap: Record<string, string> | null;
	/** 선거구 fill 헬퍼 */
	getConstituencyFill: (code: string, hovered: boolean, selected: boolean) => string | null;
	/** 라벨 표시 여부 */
	showLabels: boolean;
	/** 줌 레벨 */
	zoomLevel: number;
	/** 투영 면적 임계값 (px²) */
	effectiveThreshold: number;
	/** polylabel 위치 맵 (code → [svgX, svgY]) */
	labelPositions: Map<string, [number, number]> | null;
	/** 라벨 계산 중 여부 (전환 애니메이션 포함) */
	isComputingLabels: boolean;
	/** hover 콜백 */
	onHover: (region: MapRegion | null, e: React.PointerEvent) => void;
	/** 클릭 콜백 */
	onClick: (region: MapRegion) => void;
}

/**
 * Layer 3: hover/selected 폴리곤 — path + label 최상위 렌더링
 */
export const MapSelectedLayer = React.memo(function MapSelectedLayer({
	regions,
	hoveredCode,
	choroplethColorMap,
	getConstituencyFill,
	showLabels,
	zoomLevel,
	effectiveThreshold,
	labelPositions,
	isComputingLabels,
	onHover,
	onClick,
}: MapSelectedLayerProps) {
	return (
		<>
			{regions.map(({ region, pathD, centroid, showLabel, area }) => {
				const isHovered = hoveredCode === region.code;
				const isSelected = true;
				const zoomAdjustedShowLabel =
					showLabel ||
					(showLabels &&
						area * zoomLevel * zoomLevel > effectiveThreshold);
				const fillOverride =
					choroplethColorMap?.[region.code]
					?? getConstituencyFill(region.code, isHovered, isSelected)
					?? null;
				const effectiveCentroid = labelPositions?.get(region.code) ?? centroid;
				return (
					<RegionPolygon
						key={region.code}
						pathD={pathD}
						centroid={effectiveCentroid}
						region={region}
						isHovered={isHovered}
						isSelected={isSelected}
						showLabel={isComputingLabels ? false : zoomAdjustedShowLabel}
						fillOverride={fillOverride}
						onHover={onHover}
						onClick={onClick}
					/>
				);
			})}
		</>
	);
});
