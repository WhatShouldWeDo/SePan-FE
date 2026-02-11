// 시군(sigun) 레벨 유틸리티
// 하위 구를 가진 시(수원시 등 13개)와 독립 시/군/구 구분 로직

import { getSidoFullName } from "@/lib/sido-utils";
import type { MapRegion } from "@/types/map";

/**
 * EMD_KOR_NM의 두 번째 토큰에서 도시명 추출
 *
 * @example
 * extractCityName("수원시장안구") → "수원시"
 * extractCityName("의정부시") → "의정부시"
 * extractCityName("종로구") → "종로구"
 */
export function extractCityName(sguToken: string): string {
	const si = sguToken.indexOf("시");
	const gu = sguToken.lastIndexOf("구");
	if (si >= 0 && gu > si) {
		return sguToken.substring(0, si + 1);
	}
	return sguToken;
}

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
