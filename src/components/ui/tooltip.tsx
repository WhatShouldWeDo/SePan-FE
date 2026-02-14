import * as React from "react";

import { cn } from "@/lib/utils";
import { ThinClose } from "@/components/icons";

// ── Arrow Position (12 positions: 4 edges × 3 alignments) ──

export type ArrowPosition =
	| "top-left"
	| "top-center"
	| "top-right"
	| "bottom-left"
	| "bottom-center"
	| "bottom-right"
	| "left-top"
	| "left-center"
	| "left-bottom"
	| "right-top"
	| "right-center"
	| "right-bottom";

/** Arrow가 위치하는 tooltip 경계면 (= arrow가 가리키는 방향) */
type ArrowDirection = "top" | "bottom" | "left" | "right";

function getDirection(position: ArrowPosition): ArrowDirection {
	return position.split("-")[0] as ArrowDirection;
}

/**
 * 마우스 좌표 기반으로 ArrowPosition을 계산한다.
 * 커서의 뷰포트 위치에 따라 4분면 중 해당 방향을 반환.
 */
export function getArrowPositionFromCursor(
	cursorX: number,
	cursorY: number,
	viewportWidth = window.innerWidth,
	viewportHeight = window.innerHeight,
): ArrowPosition {
	const isTop = cursorY < viewportHeight / 2;
	const isLeft = cursorX < viewportWidth / 2;

	if (isTop && isLeft) return "top-left";
	if (isTop && !isLeft) return "top-right";
	if (!isTop && isLeft) return "bottom-left";
	return "bottom-right";
}

// ── Arrow Constants ──

/** 삼각형 밑변 길이 (px) */
const ARROW_BASE = 12;
/** 삼각형 높이 — 밑변에서 꼭짓점까지 (px) */
const ARROW_HEIGHT = 6;
/** 경계면 모서리(rounded corner)로부터의 오프셋 (px) */
const EDGE_OFFSET = 12;

// ── Arrow Clip Paths (4 방향) ──

const arrowClipPaths: Record<ArrowDirection, string> = {
	top: "polygon(50% 0%, 0% 100%, 100% 100%)", // ▲
	bottom: "polygon(0% 0%, 100% 0%, 50% 100%)", // ▼
	left: "polygon(0% 50%, 100% 0%, 100% 100%)", // ◀
	right: "polygon(0% 0%, 100% 50%, 0% 100%)", // ▶
};

// ── Arrow Style Computation ──

function getArrowStyle(position: ArrowPosition): {
	style: React.CSSProperties;
	width: number;
	height: number;
	clipPath: string;
} {
	const direction = getDirection(position);
	const alignment = position.split("-")[1] as string;

	const isHorizontalEdge = direction === "top" || direction === "bottom";
	const width = isHorizontalEdge ? ARROW_BASE : ARROW_HEIGHT;
	const height = isHorizontalEdge ? ARROW_HEIGHT : ARROW_BASE;
	const clipPath = arrowClipPaths[direction];

	const style: React.CSSProperties = {};

	// 경계면에서 바깥으로 돌출 (1px 겹침으로 이음새 제거)
	const protrusion = -(ARROW_HEIGHT - 1);
	switch (direction) {
		case "top":
			style.top = protrusion;
			break;
		case "bottom":
			style.bottom = protrusion;
			break;
		case "left":
			style.left = protrusion;
			break;
		case "right":
			style.right = protrusion;
			break;
	}

	// 경계면 위에서의 정렬
	if (isHorizontalEdge) {
		switch (alignment) {
			case "left":
				style.left = EDGE_OFFSET;
				break;
			case "center":
				style.left = "50%";
				style.transform = "translateX(-50%)";
				break;
			case "right":
				style.right = EDGE_OFFSET;
				break;
		}
	} else {
		switch (alignment) {
			case "top":
				style.top = EDGE_OFFSET;
				break;
			case "center":
				style.top = "50%";
				style.transform = "translateY(-50%)";
				break;
			case "bottom":
				style.bottom = EDGE_OFFSET;
				break;
		}
	}

	return { style, width, height, clipPath };
}

// ── Arrow Component ──

function TooltipArrow({ position }: { position: ArrowPosition }) {
	const { style, width, height, clipPath } = getArrowStyle(position);

	return (
		<div className="absolute z-10" style={{ width, height, ...style }}>
			<div
				className="absolute inset-0 bg-[#1f2937] opacity-[0.88]"
				style={{ clipPath }}
			/>
			<div
				className="absolute inset-0 bg-primary opacity-[0.05]"
				style={{ clipPath }}
			/>
		</div>
	);
}

// ── Tooltip Component ──

interface TooltipProps {
	/** 라벨 텍스트 */
	children: React.ReactNode;
	/** 사이즈 (기본: "md") */
	size?: "md" | "sm";
	/** 화살표 표시 (기본: true) */
	arrow?: boolean;
	/** 화살표 위치 (기본: "top-left") */
	arrowPosition?: ArrowPosition;
	/** 닫기 버튼 표시 (기본: false) */
	closeButton?: boolean;
	/** 닫기 버튼 클릭 콜백 */
	onClose?: () => void;
	/** 하단 액션 슬롯 */
	action?: React.ReactNode;
	/** 라벨 아래 부가 콘텐츠 슬롯 */
	extraContent?: React.ReactNode;
	/** 추가 className */
	className?: string;
}

function Tooltip({
	children,
	size = "md",
	arrow = true,
	arrowPosition = "top-left",
	closeButton = false,
	onClose,
	action,
	extraContent,
	className,
}: TooltipProps) {
	const isMd = size === "md";
	const radius = isMd ? "rounded-[10px]" : "rounded-lg";

	return (
		<div className={cn("inline-flex relative", className)}>
			{/* Arrow — 경계면 바깥으로 돌출 */}
			{arrow && <TooltipArrow position={arrowPosition} />}

			{/*
			 * Content Box
			 * backdrop-blur + overflow-hidden + radius를 같은 요소에 적용해야
			 * 블러 영역이 radius에 맞게 잘린다
			 */}
			<div
				className={cn(
					"relative flex min-w-16 overflow-hidden backdrop-blur-[32px]",
					radius,
					isMd ? "gap-2.5 px-4 py-3.5" : "gap-2.5 p-3",
					closeButton && "gap-1",
				)}
			>
				{/* 2-layer 반투명 배경 */}
				<div className="absolute inset-0 bg-[#1f2937] opacity-[0.88]" />
				<div className="absolute inset-0 bg-primary opacity-[0.05]" />

				{/* Content */}
				<div className="relative flex flex-col gap-1.5 px-0.5">
					<p
						className={cn(
							"max-w-64",
							isMd
								? "text-title-3 font-bold leading-[1.4]"
								: "text-label-3 font-semibold leading-[1.3]",
							closeButton && isMd && "max-w-[228px]",
						)}
						style={{ color: "#ffffff" }}
					>
						{children}
					</p>

					{extraContent}

					{action && (
						<div className="flex h-5 items-center">{action}</div>
					)}
				</div>

				{/* Close Button */}
				{closeButton && (
					<div className="relative flex flex-col items-center justify-center pt-px">
						<button
							type="button"
							onClick={onClose}
							className="flex items-center p-1"
							aria-label="닫기"
						>
							<ThinClose className="size-4 text-white/48" />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export { Tooltip };
export type { TooltipProps };
