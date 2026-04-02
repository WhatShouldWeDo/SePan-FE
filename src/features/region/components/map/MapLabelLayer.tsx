import React from "react";
import { mapColors } from "@/features/region/lib/map-theme";
import type { RegionDataItem } from "./MapBaseLayer";

export interface MapLabelLayerProps {
	/** 지역 데이터 */
	regions: ReadonlyArray<RegionDataItem>;
	/** 라벨 표시 여부 (config) */
	showLabels: boolean;
	/** 줌 레벨 */
	zoomLevel: number;
	/** 면적 임계값 */
	effectiveThreshold: number;
	/** 줌 라벨 표시 임계값 */
	zoomLabelThreshold: number;
}

/**
 * Layer 2: 비선택 폴리곤 label — 모든 path 위에 렌더링
 */
export const MapLabelLayer = React.memo(function MapLabelLayer({
	regions,
	showLabels,
	zoomLevel,
	effectiveThreshold,
	zoomLabelThreshold,
}: MapLabelLayerProps) {
	return (
		<>
			{regions.map(({ region, centroid, showLabel, area }) => {
				const zoomAdjustedShowLabel =
					showLabel ||
					(showLabels &&
						zoomLevel >= zoomLabelThreshold &&
						area > effectiveThreshold / (zoomLevel * zoomLevel));
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
		</>
	);
});
