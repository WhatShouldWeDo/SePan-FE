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
	/** 면적 임계값 */
	effectiveThreshold: number;
	/** 줌 라벨 임계값 */
	zoomLabelThreshold: number;
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
	zoomLabelThreshold,
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
						zoomLevel >= zoomLabelThreshold &&
						area > effectiveThreshold / (zoomLevel * zoomLevel));
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
						onHover={onHover}
						onClick={onClick}
					/>
				);
			})}
		</>
	);
});
