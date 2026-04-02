import { useRef, useState, useEffect, useCallback } from "react";

/**
 * ResizeObserver 기반 컨테이너 크기 동적 감지 훅
 *
 * @description
 * - contentRect의 width/height를 Math.round 후 상태 저장
 * - 동일값이면 상태 갱신 생략 (불필요한 리렌더 방지)
 * - 단일 state 객체로 width/height 동시 업데이트 (double re-render 방지)
 * - 마운트 즉시 첫 측정 발생
 */
export function useContainerSize() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	const updateSize = useCallback((w: number, h: number) => {
		setSize((prev) =>
			prev.width === w && prev.height === h ? prev : { width: w, height: h },
		);
	}, []);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			updateSize(
				Math.round(entry.contentRect.width),
				Math.round(entry.contentRect.height),
			);
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, [updateSize]);

	return { containerRef, width: size.width, height: size.height };
}
