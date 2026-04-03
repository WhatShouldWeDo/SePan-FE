import polylabel from "@mapbox/polylabel";
import type {
  PolylabelFeature,
  PolylabelRequest,
  PolylabelResponse,
  PolylabelResult,
} from "../types/polylabel";

/**
 * Shoelace formula로 2D 폴리곤 면적 계산 (부호 있는 면적의 절대값).
 * MultiPolygon에서 가장 큰 sub-polygon 선택에 사용.
 */
function polygonArea(ring: number[][]): number {
  let area = 0;
  const n = ring.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    area += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(area / 2);
}

/**
 * MultiPolygon에서 면적이 가장 큰 sub-polygon의 좌표를 반환.
 */
function getLargestPolygon(coordinates: number[][][][]): number[][][] {
  let maxArea = -1;
  let largest = coordinates[0];

  for (const polygon of coordinates) {
    const area = polygonArea(polygon[0]); // 외곽 링으로 면적 계산
    if (area > maxArea) {
      maxArea = area;
      largest = polygon;
    }
  }

  return largest;
}

/**
 * 단일 feature에 대해 polylabel 위치 계산.
 */
function computeLabel(
  feature: PolylabelFeature,
  precision: number,
): PolylabelResult {
  const coords =
    feature.type === "MultiPolygon"
      ? getLargestPolygon(feature.coordinates as number[][][][])
      : (feature.coordinates as number[][][]);

  const point = polylabel(coords, precision);

  return {
    code: feature.code,
    point: [point[0], point[1]],
  };
}

self.onmessage = (e: MessageEvent<PolylabelRequest>) => {
  const { requestId, features, precision = 1.0 } = e.data;

  const labels = features.map((f) => computeLabel(f, precision));

  const response: PolylabelResponse = { requestId, labels };
  self.postMessage(response);
};
