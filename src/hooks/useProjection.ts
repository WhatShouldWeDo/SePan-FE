import { geoMercator, geoPath } from "d3-geo";
import type { GeoPermissibleObjects } from "d3-geo";
import { useMemo } from "react";

/**
 * D3 Mercator 투영 + path 생성기를 반환하는 훅
 * @description fitExtent()로 GeoJSON 데이터에 맞게 scale/translate를 자동 설정.
 *   하드코딩된 center/scale 없이 어떤 GeoJSON이든 동작한다.
 * @param featureCollection - GeoJSON FeatureCollection
 * @param width - SVG 너비 (px)
 * @param height - SVG 높이 (px)
 * @param padding - 여백 (px, 기본값 20)
 */
export function useProjection(
	featureCollection: GeoPermissibleObjects,
	width: number,
	height: number,
	padding: number = 20,
) {
	return useMemo(() => {
		const projection = geoMercator().fitExtent(
			[
				[padding, padding],
				[width - padding, height - padding],
			],
			featureCollection,
		);
		const pathGenerator = geoPath().projection(projection);
		return { projection, pathGenerator };
	}, [featureCollection, width, height, padding]);
}
