import { useState, useEffect } from "react";
import * as topojson from "topojson-client";

/** TopoJSON 오브젝트명 (시도/선거구 모두 동일) */
const TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

interface TopoJsonDataState {
	/** 시도 GeoJSON FeatureCollection */
	sidoFeatures: GeoJSON.FeatureCollection | null;
	/** 선거구 GeoJSON FeatureCollection */
	constituencyFeatures: GeoJSON.FeatureCollection | null;
	/** 로딩 중 여부 */
	isLoading: boolean;
	/** 에러 메시지 */
	error: string | null;
}

/**
 * TopoJSON 데이터를 동적 import로 지연 로딩하는 훅
 *
 * @description
 * - 초기 번들에서 ~307KB(시도+선거구 TopoJSON)를 제거
 * - Vite의 dynamic import → 별도 chunk로 분리
 * - 한 번 로드 후 모듈 캐시에 유지 (재요청 없음)
 */
export function useTopoJsonData(): TopoJsonDataState {
	const [state, setState] = useState<TopoJsonDataState>({
		sidoFeatures: null,
		constituencyFeatures: null,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [sidoModule, constituencyModule] = await Promise.all([
					import("@/features/region/data/sido.topojson.json"),
					import(
						"@/features/region/data/constituencies.topojson.json"
					),
				]);

				if (cancelled) return;

				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const sidoTopo = sidoModule.default as any;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const constituencyTopo = constituencyModule.default as any;

				const sidoFeatures = topojson.feature(
					sidoTopo,
					sidoTopo.objects[TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				const constituencyFeatures = topojson.feature(
					constituencyTopo,
					constituencyTopo.objects[TOPOJSON_OBJECT_KEY],
				) as unknown as GeoJSON.FeatureCollection;

				setState({
					sidoFeatures,
					constituencyFeatures,
					isLoading: false,
					error: null,
				});
			} catch (err) {
				if (cancelled) return;
				setState({
					sidoFeatures: null,
					constituencyFeatures: null,
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
