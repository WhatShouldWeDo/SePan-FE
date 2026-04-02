import React from "react";
import { RegionPolygon } from "./RegionPolygon";
import type { MapRegion } from "@/types/map";

export interface RegionDataItem {
	pathD: string;
	centroid: [number, number];
	region: MapRegion;
	area: number;
	showLabel: boolean;
}

export interface MapBaseLayerProps {
	/** 비선택 지역 데이터 */
	regions: ReadonlyArray<RegionDataItem>;
	/** 선거구 색상 맵 (EMD_CD → { sggCode, base, hover }) */
	constituencyColorMap: Map<string, { sggCode: string; base: string; hover: string }> | null;
	/** Choropleth 색상 맵 (code → color) */
	choroplethColorMap: Record<string, string> | null;
	/** 선거구 개요 모드 여부 */
	isConstituencyOverview: boolean;
	/** hover 중인 선거구 코드 */
	hoveredConstituencyCode: string | null;
	/** 선택된 코드 */
	selectedCode: string | null | undefined;
	/** fillOverride 생성 헬퍼 */
	getConstituencyFill: (code: string, hovered: boolean, selected: boolean) => string | null;
	/** hover 콜백 */
	onHover: (region: MapRegion | null, e: React.PointerEvent) => void;
	/** 클릭 콜백 */
	onClick: (region: MapRegion) => void;
}

/**
 * Layer 1: 비선택 폴리곤 path 렌더링 (label 제외)
 * label을 분리하여 인접 폴리곤에 가리지 않도록 함
 */
export const MapBaseLayer = React.memo(function MapBaseLayer({
	regions,
	constituencyColorMap,
	choroplethColorMap,
	isConstituencyOverview,
	hoveredConstituencyCode,
	selectedCode,
	getConstituencyFill,
	onHover,
	onClick,
}: MapBaseLayerProps) {
	return (
		<>
			{regions.map(({ region, pathD, centroid }) => {
				const emdSggCode = constituencyColorMap?.get(region.code)?.sggCode;
				let fillOverride: string | null = choroplethColorMap?.[region.code] ?? null;
				if (!fillOverride && isConstituencyOverview && emdSggCode) {
					const isConstHovered = emdSggCode === hoveredConstituencyCode;
					const isConstSelected = emdSggCode === selectedCode;
					fillOverride = getConstituencyFill(region.code, isConstHovered, isConstSelected);
				} else if (!fillOverride) {
					fillOverride = getConstituencyFill(region.code, false, false);
				}
				return (
					<RegionPolygon
						key={region.code}
						pathD={pathD}
						centroid={centroid}
						region={region}
						isHovered={false}
						isSelected={false}
						showLabel={false}
						fillOverride={fillOverride}
						onHover={onHover}
						onClick={onClick}
					/>
				);
			})}
		</>
	);
});
