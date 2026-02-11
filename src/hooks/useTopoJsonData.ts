import { useState, useEffect } from "react";
import * as topojson from "topojson-client";

/** TopoJSON 오브젝트명 (시도) */
const SIDO_TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

/** 시군 TopoJSON 오브젝트명 */
const SIGUN_TOPOJSON_OBJECT_KEY = "sigun";

/** 시군구 TopoJSON 오브젝트명 */
const SIGUNGU_TOPOJSON_OBJECT_KEY = "sigungu";

/** 읍면동 TopoJSON 오브젝트명 */
const EMD_TOPOJSON_OBJECT_KEY = "emd";

interface TopoJsonDataState {
	/** 시도 GeoJSON FeatureCollection */
	sidoFeatures: GeoJSON.FeatureCollection | null;
	/** 시군 GeoJSON FeatureCollection (229개, 하위구 시 합쳐짐) */
	sigunFeatures: GeoJSON.FeatureCollection | null;
	/** 시군구 GeoJSON FeatureCollection (255개, 구 레벨) */
	sigunguFeatures: GeoJSON.FeatureCollection | null;
	/** 읍면동 GeoJSON FeatureCollection */
	emdFeatures: GeoJSON.FeatureCollection | null;
	/** 로딩 중 여부 */
	isLoading: boolean;
	/** 에러 메시지 */
	error: string | null;
}

/**
 * TopoJSON 데이터를 동적 import로 지연 로딩하는 훅
 *
 * @description
 * - 초기 번들에서 TopoJSON 데이터를 제거
 * - Vite의 dynamic import → 별도 chunk로 분리
 * - 한 번 로드 후 모듈 캐시에 유지 (재요청 없음)
 * - Phase 5.5: 시군 데이터 추가 (4파일 동시 로딩)
 */
export function useTopoJsonData(): TopoJsonDataState {
	const [state, setState] = useState<TopoJsonDataState>({
		sidoFeatures: null,
		sigunFeatures: null,
		sigunguFeatures: null,
		emdFeatures: null,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [sidoModule, sigunModule, sigunguModule, emdModule] =
					await Promise.all([
						import("@/features/region/data/sido.topojson.json"),
						import(
							"@/features/region/data/sigun.topojson.json"
						),
						import(
							"@/features/region/data/sigungu.topojson.json"
						),
						import("@/features/region/data/emd.topojson.json"),
					]);

				if (cancelled) return;

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const sidoTopo = sidoModule.default as any;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const sigunTopo = sigunModule.default as any;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const sigunguTopo = sigunguModule.default as any;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const emdTopo = emdModule.default as any;

				const sidoFeatures = topojson.feature(
					sidoTopo,
					sidoTopo.objects[SIDO_TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				const sigunFeatures = topojson.feature(
					sigunTopo,
					sigunTopo.objects[SIGUN_TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				const sigunguFeatures = topojson.feature(
					sigunguTopo,
					sigunguTopo.objects[SIGUNGU_TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				const emdFeatures = topojson.feature(
					emdTopo,
					emdTopo.objects[EMD_TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				setState({
					sidoFeatures,
					sigunFeatures,
					sigunguFeatures,
					emdFeatures,
					isLoading: false,
					error: null,
				});
			} catch (err) {
				if (cancelled) return;
				setState({
					sidoFeatures: null,
					sigunFeatures: null,
					sigunguFeatures: null,
					emdFeatures: null,
					isLoading: false,
					error:
						err instanceof Error
							? err.message
							: "지도 데이터 로드 실패",
				});
			}
		}

		load();
		return () => {
			cancelled = true;
		};
	}, []);

	return state;
}
