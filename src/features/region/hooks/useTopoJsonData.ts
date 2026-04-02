import { useState, useEffect } from "react";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { ConstituencyInfo } from "@/types/map";

/** TopoJSON 오브젝트명 (시도) */
const SIDO_TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

/** 시군 TopoJSON 오브젝트명 */
const SIGUN_TOPOJSON_OBJECT_KEY = "sigun";

/** 시군구 TopoJSON 오브젝트명 */
const SIGUNGU_TOPOJSON_OBJECT_KEY = "sigungu";

/** 읍면동 TopoJSON 오브젝트명 */
const EMD_TOPOJSON_OBJECT_KEY = "emd";

/** 선거구 TopoJSON 오브젝트명 */
const CONSTITUENCY_TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";

interface TopoJsonDataState {
	/** 시도 GeoJSON FeatureCollection */
	sidoFeatures: GeoJSON.FeatureCollection | null;
	/** 시군 GeoJSON FeatureCollection (229개, 하위구 시 합쳐짐) */
	sigunFeatures: GeoJSON.FeatureCollection | null;
	/** 시군구 GeoJSON FeatureCollection (255개, 구 레벨) */
	sigunguFeatures: GeoJSON.FeatureCollection | null;
	/** 읍면동 GeoJSON FeatureCollection */
	emdFeatures: GeoJSON.FeatureCollection | null;
	/** 선거구 SGG_Code → ConstituencyInfo 매핑 */
	constituencyInfoMap: Map<string, ConstituencyInfo> | null;
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
 * - 선거구 속성 데이터 추가 로딩 (geometry 변환 불필요)
 */
export function useTopoJsonData(): TopoJsonDataState {
	const [state, setState] = useState<TopoJsonDataState>({
		sidoFeatures: null,
		sigunFeatures: null,
		sigunguFeatures: null,
		emdFeatures: null,
		constituencyInfoMap: null,
		isLoading: true,
		error: null,
	});

	useEffect(() => {
		let cancelled = false;

		async function load() {
			try {
				const [sidoModule, sigunModule, sigunguModule, emdModule, constituencyModule] =
					await Promise.all([
						import("@/features/region/data/sido.topojson.json"),
						import(
							"@/features/region/data/sigun.topojson.json"
						),
						import(
							"@/features/region/data/sigungu.topojson.json"
						),
						import("@/features/region/data/emd.topojson.json"),
						import("@/features/region/data/constituencies.topojson.json"),
					]);

				if (cancelled) return;

				const sidoTopo = sidoModule.default as unknown as Topology;
				const sigunTopo = sigunModule.default as unknown as Topology;
				const sigunguTopo = sigunguModule.default as unknown as Topology;
				const emdTopo = emdModule.default as unknown as Topology;

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

				// 선거구 속성 추출 + GeoJSON geometry 변환
				const constituencyTopo = constituencyModule.default as unknown as Topology;
				const geoms = constituencyTopo.objects[CONSTITUENCY_TOPOJSON_OBJECT_KEY].geometries;
				const constituencyInfoMap = new Map<string, ConstituencyInfo>();
				for (const g of geoms) {
					const p = g.properties;
					constituencyInfoMap.set(p.SGG_Code, {
						sggCode: p.SGG_Code,
						sgg: p.SGG,
						sidoSgg: p.SIDO_SGG,
						sido: p.SIDO,
					});
				}

				setState({
					sidoFeatures,
					sigunFeatures,
					sigunguFeatures,
					emdFeatures,
					constituencyInfoMap,
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
					constituencyInfoMap: null,
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
