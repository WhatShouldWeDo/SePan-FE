import React from "react";
import type { MapRegion } from "@/types/map";
import { mapColors } from "@/features/region/lib/map-theme";

interface RegionPolygonProps {
	/** SVG path d 속성 (미리 계산됨) */
	pathD: string;
	/** 폴리곤 센트로이드 [x, y] (미리 계산됨) */
	centroid: [number, number];
	/** 지역 정보 */
	region: MapRegion;
	/** hover 상태 */
	isHovered: boolean;
	/** 선택 상태 */
	isSelected: boolean;
	/** 라벨 표시 여부 */
	showLabel: boolean;
	/** Choropleth 색상 오버라이드 (Phase 3-C) */
	fillOverride?: string | null;
	/** hover 이벤트 (pointer 이벤트로 마이그레이션, Phase 3-E) */
	onHover: (region: MapRegion | null, event: React.PointerEvent) => void;
	/** 클릭 이벤트 */
	onClick: (region: MapRegion) => void;
}

/**
 * 커스텀 비교 함수: onHover/onClick 콜백은 비교에서 제외하여
 * hover 상태 변경 시 관련 없는 폴리곤의 re-render를 방지한다.
 * 부모에서 useCallback으로 안정된 참조를 보장하므로 안전하다.
 */
function arePropsEqual(prev: RegionPolygonProps, next: RegionPolygonProps) {
	return (
		prev.pathD === next.pathD &&
		prev.centroid[0] === next.centroid[0] &&
		prev.centroid[1] === next.centroid[1] &&
		prev.region.code === next.region.code &&
		prev.isHovered === next.isHovered &&
		prev.isSelected === next.isSelected &&
		prev.showLabel === next.showLabel &&
		prev.fillOverride === next.fillOverride
	);
}

export const RegionPolygon = React.memo(function RegionPolygon({
	pathD,
	centroid,
	region,
	isHovered,
	isSelected,
	showLabel,
	fillOverride,
	onHover,
	onClick,
}: RegionPolygonProps) {
	// fill 우선순위: selected > hovered > fillOverride > default
	const fill = isSelected
		? mapColors.fillSelected
		: isHovered
			? mapColors.fillHover
			: (fillOverride ?? mapColors.fill);

	return (
		<g>
			<path
				d={pathD}
				fill={fill}
				stroke={mapColors.stroke}
				strokeWidth={0.5}
				vectorEffect="non-scaling-stroke"
				cursor="pointer"
				style={{ transition: "fill 150ms ease-out" }}
				onPointerEnter={(e) => onHover(region, e)}
				onPointerMove={(e) => onHover(region, e)}
				onPointerLeave={(e) => onHover(null, e)}
				onClick={() => onClick(region)}
			/>
			{showLabel && (
				<text
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
			)}
		</g>
	);
}, arePropsEqual);
