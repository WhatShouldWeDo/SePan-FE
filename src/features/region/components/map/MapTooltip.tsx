import type { HoveredRegion } from "@/types/map";
import {
	Tooltip,
	getArrowPositionFromCursor,
} from "@/components/ui/tooltip";

/** 지도 tooltip에 표시할 부가 데이터 */
export interface MapTooltipData {
	/** 유권자수 */
	voterCount?: number;
	/** 전체 대비 비율 (%) */
	totalRatio?: number;
	/** 진보 투표율 (%) */
	progressive?: number;
	/** 보수 투표율 (%) */
	conservative?: number;
}

interface MapTooltipProps {
	hovered: HoveredRegion | null;
	/** 부가 데이터 (선택) */
	data?: MapTooltipData;
}

/** 지도 전용 ExtraContent — 유권자수 + 정당 투표율 */
function MapTooltipContent({ data }: { data: MapTooltipData }) {
	const hasVoter = data.voterCount != null;
	const hasParty = data.progressive != null && data.conservative != null;

	if (!hasVoter && !hasParty) return null;

	return (
		<div className="flex flex-col gap-1 py-1">
			{/* 유권자수 행 */}
			{hasVoter && (
				<div className="flex items-center gap-1">
					<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
						유권자수
					</span>
					<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
						{data.voterCount!.toLocaleString()}명
					</span>
					{data.totalRatio != null && (
						<span className="rounded-md bg-status-positive/8 px-1.5 text-caption-3 font-semibold leading-[1.3] text-status-positive">
							전체대비 {data.totalRatio}%
						</span>
					)}
				</div>
			)}
			{/* 정당 투표율 행 */}
			{hasParty && (
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-1">
						<span className="size-[9px] shrink-0 rounded-full bg-party-dpk" />
						<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
							진보
						</span>
						<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
							{data.progressive}%
						</span>
					</div>
					<div className="flex items-center gap-1">
						<span className="size-[9px] shrink-0 rounded-full bg-party-ppp" />
						<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
							보수
						</span>
						<span className="text-label-3 font-semibold leading-[1.3] text-white/72">
							{data.conservative}%
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

/**
 * 지도 hover 시 표시되는 Tooltip
 * @description position: fixed로 마우스 좌표 기준 표시.
 *   arrow 방향은 마우스 커서 위치에 따라 자동 결정.
 */
export function MapTooltip({ hovered, data }: MapTooltipProps) {
	if (!hovered) return null;

	const { x, y } = hovered.position;
	const arrowPosition = getArrowPositionFromCursor(x, y);

	// arrow 꼭짓점이 커서를 가리키도록 tooltip 배치
	// arrow 중심 = EDGE_OFFSET(12) + ARROW_BASE(12)/2 = 18px (tooltip 경계면에서)
	const isTop = arrowPosition.startsWith("top");
	const isLeft = arrowPosition.endsWith("left");

	const GAP = 8;
	const ARROW_ANCHOR = 18; // arrow 삼각형 중심의 tooltip 경계면으로부터의 거리
	const offsetX = isLeft ? -ARROW_ANCHOR : ARROW_ANCHOR;
	const offsetY = isTop ? GAP : -GAP;
	const translateX = isLeft ? "0%" : "-100%";
	const translateY = isTop ? "0%" : "-100%";

	return (
		<div
			className="pointer-events-none fixed z-50"
			style={{
				left: x + offsetX,
				top: y + offsetY,
				transform: `translate(${translateX}, ${translateY})`,
			}}
		>
			<Tooltip
				size="sm"
				arrow
				arrowPosition={arrowPosition}
				extraContent={data ? <MapTooltipContent data={data} /> : undefined}
			>
				{hovered.region.fullName}
			</Tooltip>
		</div>
	);
}
