import { Plus, Minus, RotateCcw } from "lucide-react";

interface MapZoomControlsProps {
	onZoomIn: () => void;
	onZoomOut: () => void;
	onZoomReset: () => void;
	zoomLevel: number;
}

/**
 * 지도 줌 컨트롤 버튼 (+/-/리셋)
 *
 * @description
 * - 지도 좌하단에 세로 배치
 * - 44×44px 최소 터치 타겟 (CLAUDE.md 4-1)
 * - 현재 줌 레벨 표시
 * - Phase 3-D
 */
export function MapZoomControls({
	onZoomIn,
	onZoomOut,
	onZoomReset,
	zoomLevel,
}: MapZoomControlsProps) {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-border bg-background/90 p-1 shadow-sm backdrop-blur-sm">
			<button
				type="button"
				onClick={onZoomIn}
				className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label="확대"
			>
				<Plus className="h-5 w-5" />
			</button>
			<div className="flex h-8 items-center justify-center text-xs font-medium text-muted-foreground">
				{Math.round(zoomLevel * 100)}%
			</div>
			<button
				type="button"
				onClick={onZoomOut}
				className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label="축소"
			>
				<Minus className="h-5 w-5" />
			</button>
			<div className="h-px bg-border" />
			<button
				type="button"
				onClick={onZoomReset}
				className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
				aria-label="줌 리셋"
			>
				<RotateCcw className="h-4 w-4" />
			</button>
		</div>
	);
}
