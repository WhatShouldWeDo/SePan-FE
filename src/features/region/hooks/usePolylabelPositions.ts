import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GeoProjection } from "d3-geo";
import type {
  PolylabelFeature,
  PolylabelRequest,
  PolylabelResponse,
} from "../types/polylabel";

/**
 * Web Worker로 polylabel 위치를 비동기 계산하고,
 * projection을 통해 SVG 스크린 좌표로 변환하는 훅.
 *
 * - featureCollection 변경 시 Worker에 계산 요청
 * - projection 변경 시 (리사이즈/줌) Worker 재실행 없이 좌표만 재변환
 * - geoCache로 동일 지역 재방문 시 즉시 반환
 */
export function usePolylabelPositions(
  featureCollection: GeoJSON.FeatureCollection | null,
  projection: GeoProjection | null,
): {
  labelPositions: Map<string, [number, number]> | null;
  isComputing: boolean;
} {
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef(0);
  // featureCollection 참조 추적 — 변경 시 캐시 무효화
  const prevCollectionRef = useRef<GeoJSON.FeatureCollection | null>(null);
  // 지리 좌표 캐시: regionCode → [lng, lat]
  const geoCacheRef = useRef<Map<string, [number, number]>>(new Map());

  const [isComputing, setIsComputing] = useState(false);
  // Worker 완료 시 업데이트 트리거용 (geoCache는 ref이므로 렌더링 트리거 안 됨)
  const [cacheVersion, setCacheVersion] = useState(0);

  // Worker 초기화 + 메시지 핸들러 등록 + 정리
  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/polylabel.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<PolylabelResponse>) => {
      const { requestId, labels } = e.data;

      // stale 응답 무시
      if (requestId !== String(requestIdRef.current)) return;

      // 결과를 geoCache에 저장
      const cache = geoCacheRef.current;
      for (const label of labels) {
        cache.set(label.code, label.point);
      }

      setCacheVersion((v) => v + 1);
      setIsComputing(false);
    };

    worker.onerror = () => {
      // Worker 에러 시 graceful degradation (D3 centroid fallback)
      setIsComputing(false);
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // featureCollection 변경 시 Worker 요청
  const requestComputation = useCallback(
    (collection: GeoJSON.FeatureCollection) => {
      if (!workerRef.current) return;

      // featureCollection 참조가 변경되면 캐시 무효화
      if (prevCollectionRef.current !== collection) {
        geoCacheRef.current = new Map();
        prevCollectionRef.current = collection;
      }

      const cache = geoCacheRef.current;

      // 캐시에 없는 feature만 추출
      const uncached: PolylabelFeature[] = [];
      for (const feature of collection.features) {
        const code = getFeatureCode(feature.properties);
        if (code && !cache.has(code)) {
          const geom = feature.geometry as GeoJSON.Geometry;
          if (geom.type === "Polygon" || geom.type === "MultiPolygon") {
            uncached.push({
              code,
              coordinates: geom.coordinates as
                | number[][][]
                | number[][][][],
              type: geom.type,
            });
          }
        }
      }

      // 모든 feature가 캐시 히트 → Worker 호출 생략
      if (uncached.length === 0) {
        setIsComputing(false);
        return;
      }

      const currentId = ++requestIdRef.current;
      setIsComputing(true);

      const request: PolylabelRequest = {
        requestId: String(currentId),
        features: uncached,
      };

      workerRef.current.postMessage(request);
    },
    [],
  );

  // featureCollection 변경 감지 → 계산 요청
  useEffect(() => {
    if (featureCollection && featureCollection.features.length > 0) {
      requestComputation(featureCollection);
    } else {
      setIsComputing(false);
    }
  }, [featureCollection, requestComputation]);

  // geoCache의 지리 좌표를 projection으로 SVG 스크린 좌표 변환
  const labelPositions = useMemo(() => {
    if (!projection || geoCacheRef.current.size === 0) return null;

    const positions = new Map<string, [number, number]>();
    for (const [code, geoPoint] of geoCacheRef.current) {
      const projected = projection(geoPoint);
      if (projected) {
        positions.set(code, [projected[0], projected[1]]);
      }
    }

    return positions.size > 0 ? positions : null;
    // cacheVersion은 geoCache 변경 시 재계산 트리거용
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projection, cacheVersion]);

  return { labelPositions, isComputing };
}

/**
 * GeoJSON feature의 properties에서 지역 코드를 추출.
 * 가장 세분화된 코드 우선: EMD_CD > SGU_CD > CITY_CD > SIDO
 * (읍면동 feature에는 모든 속성이 있으므로 세분화된 것부터 확인)
 */
function getFeatureCode(
  properties: Record<string, unknown> | null,
): string | null {
  if (!properties) return null;
  return (
    (properties.EMD_CD as string) ??
    (properties.SGU_CD as string) ??
    (properties.CITY_CD as string) ??
    (properties.SIDO as string) ??
    null
  );
}
