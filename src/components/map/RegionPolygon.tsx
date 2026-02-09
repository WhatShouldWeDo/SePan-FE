import React from "react";
import type { MapRegion } from "@/types/map";
import { mapColors } from "@/lib/map-theme";

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
	/** hover 이벤트 */
	onHover: (region: MapRegion | null, event: React.MouseEvent) => void;
	/** 클릭 이벤트 */
	onClick: (region: MapRegion) => void;
}

/**
 * 개별 선거구 폴리곤
 * @description React.memo로 감싸서 hover된 폴리곤만 re-render.
 *   pathD와 centroid는 부모에서 미리 계산하여 memo 효과를 극대화한다.
 */
export const RegionPolygon = React.memo(function RegionPolygon({
	pathD,
	centroid,
	region,
	isHovered,
	isSelected,
	showLabel,
	onHover,
	onClick,
}: RegionPolygonProps) {
	// fill 우선순위: selected > hovered > default
	const fill = isSelected
		? mapColors.fillSelected
		: isHovered
			? mapColors.fillHover
			: mapColors.fill;

	return (
		<g>
			<path
				d={pathD}
				fill={fill}
				stroke={mapColors.stroke}
				strokeWidth={0.5}
				cursor="pointer"
				onMouseEnter={(e) => onHover(region, e)}
				onMouseMove={(e) => onHover(region, e)}
				onMouseLeave={(e) => onHover(null, e)}
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
});
