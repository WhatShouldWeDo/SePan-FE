import { useRef, useState, useEffect } from "react";

/**
 * ResizeObserver 기반 컨테이너 크기 동적 감지 훅
 *
 * @description
 * - contentRect의 width/height를 Math.round 후 상태 저장
 * - 동일값이면 상태 갱신 생략 (불필요한 리렌더 방지)
 * - 마운트 즉시 첫 측정 발생
 */
export function useContainerSize() {
	const containerRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;

		const observer = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (!entry) return;
			const w = Math.round(entry.contentRect.width);
			const h = Math.round(entry.contentRect.height);
			setWidth((prev) => (prev === w ? prev : w));
			setHeight((prev) => (prev === h ? prev : h));
		});

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return { containerRef, width, height };
}
