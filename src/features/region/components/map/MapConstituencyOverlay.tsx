import React from "react";
import { mapColors } from "@/features/region/lib/map-theme";

export interface ConstituencyOverlayPath {
	sggCode: string;
	combinedPathD: string;
}

export interface MapConstituencyOverlayProps {
	/** 선거구별 합성 SVG path */
	overlayPaths: ReadonlyArray<ConstituencyOverlayPath>;
	/** hover 중인 선거구 코드 */
	hoveredConstituencyCode: string | null;
	/** 선택된 코드 */
	selectedCode: string | null | undefined;
	/** SVG 너비 (clip-path용) */
	width: number;
	/** SVG 높이 (clip-path용) */
	height: number;
}

/**
 * Layer 4: 선거구 경계 오버레이 (개요 모드)
 * clip-path로 외곽선만 표시
 */
export const MapConstituencyOverlay = React.memo(function MapConstituencyOverlay({
	overlayPaths,
	hoveredConstituencyCode,
	selectedCode,
	width,
	height,
}: MapConstituencyOverlayProps) {
	return (
		<>
			{overlayPaths.map(({ sggCode, combinedPathD }) => {
				const isHovered = sggCode === hoveredConstituencyCode;
				const isSelected = sggCode === selectedCode;
				if (!isHovered && !isSelected) return null;
				const clipId = `const-outer-${sggCode}`;
				return (
					<g key={`constituency-${sggCode}`}>
						<defs>
							<clipPath id={clipId}>
								<path
									d={`M0,0 L${width},0 L${width},${height} L0,${height} Z ${combinedPathD}`}
									clipRule="evenodd"
								/>
							</clipPath>
						</defs>
						<path
							d={combinedPathD}
							fill="none"
							stroke={mapColors.strokeHover}
							strokeWidth={6}
							vectorEffect="non-scaling-stroke"
							pointerEvents="none"
							clipPath={`url(#${clipId})`}
							style={{ transition: "stroke 150ms ease-out" }}
						/>
					</g>
				);
			})}
		</>
	);
});
