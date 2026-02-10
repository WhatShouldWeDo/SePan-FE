import { useRef, useEffect, useCallback, useState } from "react";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { select } from "d3-selection";
import "d3-transition"; // Selection.prototype.transition() 활성화

/** 줌 범위 제한 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 8;

/** 줌 버튼 클릭 시 확대/축소 비율 */
const ZOOM_STEP = 1.5;

/** 줌 리셋 smooth 전환 시간 (ms) */
const SMOOTH_ZOOM_DURATION = 400;

interface UseMapZoomReturn {
	/** SVG 요소에 연결할 callback ref */
	svgRef: (node: SVGSVGElement | null) => void;
	/** 줌 적용 대상 <g> 요소에 연결할 ref */
	gRef: React.RefObject<SVGGElement | null>;
	/** 현재 줌 레벨 */
	zoomLevel: number;
	/** 확대 */
	zoomIn: () => void;
	/** 축소 */
	zoomOut: () => void;
	/** 줌 리셋 (1x, 즉시) */
	zoomReset: () => void;
	/** 줌 리셋 (1x, 부드러운 전환) */
	smoothZoomReset: () => void;
}

/**
 * d3-zoom 기반 SVG 줌/팬 관리 훅
 *
 * @description
 * - SVG 요소에 d3-zoom 바인딩
 * - <g> 요소에 transform 적용
 * - 줌 범위 1x~8x
 * - 더블클릭 줌 비활성화 (드릴다운과 충돌 방지)
 * - Phase 3-D
 *
 * @param enabled - 줌 활성화 여부 (기본값: true)
 */
export function useMapZoom(enabled: boolean = true): UseMapZoomReturn {
	// callback ref: SVG 마운트/언마운트 시 state 갱신 → effect 재실행
	const [svgNode, setSvgNode] = useState<SVGSVGElement | null>(null);
	const svgRef = useCallback((node: SVGSVGElement | null) => {
		setSvgNode(node);
	}, []);

	const gRef = useRef<SVGGElement | null>(null);
	const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(
		null,
	);
	const [zoomLevel, setZoomLevel] = useState(1);

	// d3-zoom 초기화 — svgNode가 바뀔 때(마운트될 때) 다시 실행
	useEffect(() => {
		if (!enabled || !svgNode) return;

		const svgSelection = select(svgNode);

		const zoomBehavior = zoom<SVGSVGElement, unknown>()
			.scaleExtent([MIN_ZOOM, MAX_ZOOM])
			.on("zoom", (event) => {
				if (gRef.current) {
					const { x, y, k } = event.transform;
					gRef.current.setAttribute(
						"transform",
						`translate(${x},${y}) scale(${k})`,
					);
				}
				setZoomLevel(event.transform.k);
			});

		svgSelection.call(zoomBehavior);

		// 더블클릭 줌 비활성화 (드릴다운과 충돌)
		svgSelection.on("dblclick.zoom", null);

		// 터치 줌/팬을 위해 touch-action 비활성화 (Phase 3-E)
		svgNode.style.touchAction = "none";

		zoomBehaviorRef.current = zoomBehavior;

		return () => {
			svgSelection.on(".zoom", null);
			zoomBehaviorRef.current = null;
		};
	}, [enabled, svgNode]);

	// 뷰포트 중심 기준 확대 — smooth transition 적용
	const zoomIn = useCallback(() => {
		if (!svgNode || !zoomBehaviorRef.current) return;
		select(svgNode)
			.transition()
			.duration(SMOOTH_ZOOM_DURATION)
			.call(zoomBehaviorRef.current.scaleBy, ZOOM_STEP);
	}, [svgNode]);

	const zoomOut = useCallback(() => {
		if (!svgNode || !zoomBehaviorRef.current) return;
		select(svgNode)
			.transition()
			.duration(SMOOTH_ZOOM_DURATION)
			.call(zoomBehaviorRef.current.scaleBy, 1 / ZOOM_STEP);
	}, [svgNode]);

	const zoomReset = useCallback(() => {
		if (!svgNode || !zoomBehaviorRef.current) return;
		zoomBehaviorRef.current.transform(select(svgNode), zoomIdentity);
	}, [svgNode]);

	const smoothZoomReset = useCallback(() => {
		if (!svgNode || !zoomBehaviorRef.current) return;
		select(svgNode)
			.transition()
			.duration(SMOOTH_ZOOM_DURATION)
			.call(zoomBehaviorRef.current.transform, zoomIdentity);
	}, [svgNode]);

	return {
		svgRef,
		gRef,
		zoomLevel,
		zoomIn,
		zoomOut,
		zoomReset,
		smoothZoomReset,
	};
}
