import { useState, useCallback, useRef } from "react";
import { select } from "d3-selection";
import "d3-transition"; // Selection.prototype.transition() 활성화

/** 전환 애니메이션 전체 시간 (fade-out 200ms + fade-in 200ms) */
const TRANSITION_DURATION = 200;

interface UseMapTransitionReturn {
	/** 전환 중 여부 (클릭 방지용) */
	isTransitioning: boolean;
	/** fade-out → 콜백 → fade-in 전환 실행 */
	triggerTransition: (
		gElement: SVGGElement | null,
		onMidpoint: () => void,
	) => Promise<void>;
}

/**
 * 지도 레벨 전환 애니메이션 훅
 *
 * @description
 * - fade-out (200ms) → 상태 변경 → fade-in (200ms) = 총 400ms
 * - opacity 애니메이션으로 GPU 가속 활용
 * - 전환 중 클릭 방지 (isTransitioning)
 * - Phase 4-D
 */
export function useMapTransition(): UseMapTransitionReturn {
	const [isTransitioning, setIsTransitioning] = useState(false);
	const transitionRef = useRef(false);

	const triggerTransition = useCallback(
		(gElement: SVGGElement | null, onMidpoint: () => void) => {
			// 이미 전환 중이면 무시
			if (transitionRef.current) return Promise.resolve();

			// <g> 요소가 없으면 애니메이션 없이 즉시 실행
			if (!gElement) {
				onMidpoint();
				return Promise.resolve();
			}

			transitionRef.current = true;
			setIsTransitioning(true);

			return new Promise<void>((resolve) => {
				const g = select(gElement);

				// Phase 1: fade-out
				g.transition()
					.duration(TRANSITION_DURATION)
					.style("opacity", 0)
					.on("end", () => {
						// 중간 지점: 상태 변경 (새 데이터로 교체)
						onMidpoint();

						// Phase 2: fade-in (requestAnimationFrame으로 렌더 후 실행)
						requestAnimationFrame(() => {
							g.transition()
								.duration(TRANSITION_DURATION)
								.style("opacity", 1)
								.on("end", () => {
									transitionRef.current = false;
									setIsTransitioning(false);
									resolve();
								});
						});
					});
			});
		},
		[],
	);

	return { isTransitioning, triggerTransition };
}
