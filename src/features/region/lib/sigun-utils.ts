// 시군(sigun) 레벨 유틸리티
// 하위 구를 가진 시(수원시 등 13개)와 독립 시/군/구 구분 로직

import { getSidoFullName } from "@/features/region/lib/sido-utils";
import type { MapRegion } from "@/types/map";


/**
 * sigun feature의 properties → MapRegion 변환
 */
export function sigunPropsToMapRegion(props: {
	CITY_CD: string;
	CITY_NM: string;
	SIDO: string;
}): MapRegion {
	return {
		code: props.CITY_CD,
		sido: props.SIDO,
		name: props.CITY_NM,
		fullName: `${getSidoFullName(props.SIDO)} ${props.CITY_NM}`,
	};
}
