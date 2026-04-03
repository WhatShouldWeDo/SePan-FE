import { useState, useMemo, useCallback } from "react";
import type { MapLevel, ChoroplethData, ChoroplethConfig } from "@/types/map";
import {
	HEATMAP_CATEGORY_CONFIGS,
	buildHeatmapChoroplethConfig,
	generateMockHeatmapData,
} from "@/features/region/data/heatmap-configs";

export interface UseHeatmapModeReturn {
	/** 히트맵 모드 활성 여부 */
	isHeatmapActive: boolean;
	/** KoreaAdminMap에 전달할 choropleth 데이터 */
	choroplethData: ChoroplethData | null;
	/** KoreaAdminMap에 전달할 choropleth 설정 */
	choroplethConfig: ChoroplethConfig | null;
	/** 히트맵 데이터 라벨 (예: "교통 혼잡도") */
	heatmapLabel: string | null;
	/** 히트맵 데이터 단위 (예: "점") */
	heatmapUnit: string | null;
	/** 히트맵 끄기 */
	deactivateHeatmap: () => void;
}

/**
 * 히트맵 모드 상태 관리 훅
 *
 * @param categoryId - 현재 선택된 카테고리 ID
 * @param level - 현재 드릴다운 레벨
 * @param visibleCodes - 현재 지도에 보이는 지역 코드 목록
 */
export function useHeatmapMode(
	categoryId: string | undefined,
	level: MapLevel,
	visibleCodes: string[],
): UseHeatmapModeReturn {
	const [forcedOff, setForcedOff] = useState(false);
	const [prevCategoryId, setPrevCategoryId] = useState(categoryId);

	// categoryId 변경 시 forcedOff 리셋
	if (prevCategoryId !== categoryId) {
		setPrevCategoryId(categoryId);
		setForcedOff(false);
	}

	const config = categoryId
		? HEATMAP_CATEGORY_CONFIGS[categoryId] ?? null
		: null;

	const isHeatmapActive = config !== null && !forcedOff;

	const choroplethData = useMemo(() => {
		if (!isHeatmapActive) return null;
		return generateMockHeatmapData(visibleCodes, level);
	}, [isHeatmapActive, visibleCodes, level]);

	const choroplethConfig = useMemo(() => {
		if (!isHeatmapActive || !config) return null;
		return buildHeatmapChoroplethConfig(config);
	}, [isHeatmapActive, config]);

	const deactivateHeatmap = useCallback(() => {
		setForcedOff(true);
	}, []);

	const heatmapLabel = isHeatmapActive && config ? config.label : null;
	const heatmapUnit = isHeatmapActive && config ? config.unit : null;

	return useMemo(() => ({
		isHeatmapActive,
		choroplethData,
		choroplethConfig,
		heatmapLabel,
		heatmapUnit,
		deactivateHeatmap,
	}), [isHeatmapActive, choroplethData, choroplethConfig, heatmapLabel, heatmapUnit, deactivateHeatmap]);
}
