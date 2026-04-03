import React from "react";
import { RegionPolygon } from "./RegionPolygon";
import type { MapRegion } from "@/types/map";
import type { RegionDataItem } from "./MapBaseLayer";

export interface MapHoverOverlayProps {
	/** hover 중인 코드 */
	hoveredCode: string | null;
	/** 선택된 코드 (이미 Layer 3에서 렌더링되므로 제외) */
	selectedCode: string | null | undefined;
	/** 검색 하이라이트 코드 (이미 Layer 3에서 렌더링되므로 제외) */
	searchHighlightCode: string | null;
	/** code → regionData item O(1) 룩업 맵 */
	regionDataByCode: Map<string, RegionDataItem>;
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
 * Hovered 폴리곤 (선택되지 않은 경우) — O(1) 룩업으로 성능 최적화
 */
export const MapHoverOverlay = React.memo(function MapHoverOverlay({
	hoveredCode,
	selectedCode,
	searchHighlightCode,
	regionDataByCode,
	choroplethColorMap,
	getConstituencyFill,
	showLabels,
	zoomLevel,
	effectiveThreshold,
	labelPositions,
	isComputingLabels,
	onHover,
	onClick,
}: MapHoverOverlayProps) {
	if (!hoveredCode || hoveredCode === selectedCode || hoveredCode === searchHighlightCode) {
		return null;
	}

	const item = regionDataByCode.get(hoveredCode);
	if (!item) return null;

	const { region, pathD, centroid, showLabel, area } = item;
	const zoomAdjustedShowLabel =
		showLabel ||
		(showLabels &&
			area * zoomLevel * zoomLevel > effectiveThreshold);
	const fillOverride =
		choroplethColorMap?.[region.code]
		?? getConstituencyFill(region.code, true, false)
		?? null;
	const effectiveCentroid = labelPositions?.get(region.code) ?? centroid;

	return (
		<RegionPolygon
			key={`hover-${region.code}`}
			pathD={pathD}
			centroid={effectiveCentroid}
			region={region}
			isHovered={true}
			isSelected={false}
			showLabel={isComputingLabels ? false : zoomAdjustedShowLabel}
			fillOverride={fillOverride}
			onHover={onHover}
			onClick={onClick}
		/>
	);
});
