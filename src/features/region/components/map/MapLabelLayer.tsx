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
	/** polylabel 위치 맵 (code → [svgX, svgY]) */
	labelPositions: Map<string, [number, number]> | null;
	/** 라벨 계산 중 여부 (전환 애니메이션 포함) */
	isComputingLabels: boolean;
}

/**
 * Layer 2: 비선택 폴리곤 label — 모든 path 위에 렌더링
 * polylabel 계산 완료 시 fade-in 트랜지션 적용
 */
export const MapLabelLayer = React.memo(function MapLabelLayer({
	regions,
	showLabels,
	zoomLevel,
	effectiveThreshold,
	zoomLabelThreshold,
	labelPositions,
	isComputingLabels,
}: MapLabelLayerProps) {
	return (
		<g style={{ transition: "opacity 200ms ease-in", opacity: isComputingLabels ? 0 : 1 }}>
			{regions.map(({ region, centroid, showLabel, area }) => {
				const zoomAdjustedShowLabel =
					showLabel ||
					(showLabels &&
						zoomLevel >= zoomLabelThreshold &&
						area > effectiveThreshold / (zoomLevel * zoomLevel));
				if (!zoomAdjustedShowLabel) return null;

				const pos = labelPositions?.get(region.code) ?? centroid;
				return (
					<text
						key={region.code}
						x={pos[0]}
						y={pos[1]}
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
		</g>
	);
});
