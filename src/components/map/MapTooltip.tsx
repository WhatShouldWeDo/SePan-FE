import type { HoveredRegion } from "@/types/map";

interface MapTooltipProps {
	hovered: HoveredRegion | null;
}

/**
 * hover 시 표시되는 지역구명 툴팁
 * @description position: fixed로 마우스 좌표 기준 표시.
 *   장년층 대상: fontSize 14px, 높은 대비 배경 (WCAG AA).
 */
export function MapTooltip({ hovered }: MapTooltipProps) {
	if (!hovered) return null;

	return (
		<div
			className="pointer-events-none fixed z-50 rounded-md bg-foreground px-3 py-1.5 text-sm text-background shadow-md"
			style={{
				left: hovered.position.x + 12,
				top: hovered.position.y - 8,
			}}
		>
			{hovered.region.fullName}
		</div>
	);
}
