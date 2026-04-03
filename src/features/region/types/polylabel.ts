/** Worker 요청 메시지 */
export interface PolylabelRequest {
  requestId: string;
  features: PolylabelFeature[];
  precision?: number;
}

/** Worker에 전달할 폴리곤 정보 */
export interface PolylabelFeature {
  code: string;
  coordinates: number[][][] | number[][][][];
  type: "Polygon" | "MultiPolygon";
}

/** Worker 응답 메시지 */
export interface PolylabelResponse {
  requestId: string;
  labels: PolylabelResult[];
}

/** 개별 라벨 위치 결과 */
export interface PolylabelResult {
  code: string;
  point: [number, number]; // [lng, lat] 지리 좌표
}
