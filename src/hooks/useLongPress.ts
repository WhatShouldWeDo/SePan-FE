import { useRef, useCallback } from "react";

/** 롱프레스 인식 시간 (ms) */
const LONG_PRESS_DURATION = 300;

/** 터치 이동 허용 거리 (px) — 이 이상 움직이면 롱프레스 취소 */
const MOVE_THRESHOLD = 10;

interface UseLongPressReturn {
	/** pointerdown 핸들러 */
	onPointerDown: (e: React.PointerEvent) => void;
	/** pointermove 핸들러 */
	onPointerMove: (e: React.PointerEvent) => void;
	/** pointerup/pointercancel 핸들러 */
	onPointerUp: () => void;
}

/**
 * 롱프레스 감지 훅 (모바일 터치용)
 *
 * @description
 * - 300ms 이상 누르고 있으면 콜백 실행
 * - 손가락 이동 시 자동 취소 (10px 이상)
 * - 터치 전용 (mouse 제외) — pointerType === "touch"만 처리
 * - Phase 3-E
 *
 * @param onLongPress - 롱프레스 시 실행할 콜백 (마우스 좌표 전달)
 */
export function useLongPress(
	onLongPress: (x: number, y: number) => void,
): UseLongPressReturn {
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const startPosRef = useRef<{ x: number; y: number } | null>(null);

	const clear = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		startPosRef.current = null;
	}, []);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			// 터치만 처리 (마우스는 기존 hover 사용)
			if (e.pointerType !== "touch") return;

			startPosRef.current = { x: e.clientX, y: e.clientY };

			timerRef.current = setTimeout(() => {
				onLongPress(e.clientX, e.clientY);
				timerRef.current = null;
			}, LONG_PRESS_DURATION);
		},
		[onLongPress],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (e.pointerType !== "touch" || !startPosRef.current) return;

			const dx = e.clientX - startPosRef.current.x;
			const dy = e.clientY - startPosRef.current.y;
			if (Math.sqrt(dx * dx + dy * dy) > MOVE_THRESHOLD) {
				clear();
			}
		},
		[clear],
	);

	const onPointerUp = useCallback(() => {
		clear();
	}, [clear]);

	return { onPointerDown, onPointerMove, onPointerUp };
}
