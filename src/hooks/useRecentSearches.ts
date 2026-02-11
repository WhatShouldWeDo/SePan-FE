import { useState, useCallback } from "react";

const STORAGE_KEY = "democrasee:recent-region-searches-v3";
const MAX_ITEMS = 5;

interface RecentSearch {
	/** 표시할 텍스트 */
	displayName: string;
	/** 시도 약칭 */
	sido: string;
	/** 시군 코드 (4자리=하위구 시, 5자리=독립 시군구) */
	cityCode: string | null;
	/** 구 코드 (5자리, 하위구 시의 구만 해당) */
	guCode: string | null;
	/** 읍면동 코드 */
	emdCode?: string | null;
}

function loadFromStorage(): RecentSearch[] {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.slice(0, MAX_ITEMS);
	} catch {
		return [];
	}
}

function saveToStorage(items: RecentSearch[]): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// localStorage가 꽉 찼거나 비활성화된 경우 무시
	}
}

/**
 * 최근 검색어 관리 훅
 *
 * @description
 * - localStorage에 최대 5개 저장
 * - 중복 제거 (같은 지역 다시 검색 시 맨 앞으로)
 * - Phase 5.5: cityCode/guCode 필드로 전환 (v3)
 */
export function useRecentSearches() {
	const [recentSearches, setRecentSearches] =
		useState<RecentSearch[]>(loadFromStorage);

	const addRecentSearch = useCallback((item: RecentSearch) => {
		setRecentSearches((prev) => {
			// 중복 제거 (sido + cityCode + guCode + emdCode 기준)
			const filtered = prev.filter(
				(s) =>
					s.sido !== item.sido ||
					s.cityCode !== item.cityCode ||
					s.guCode !== item.guCode ||
					s.emdCode !== item.emdCode,
			);
			const updated = [item, ...filtered].slice(0, MAX_ITEMS);
			saveToStorage(updated);
			return updated;
		});
	}, []);

	const clearRecentSearches = useCallback(() => {
		setRecentSearches([]);
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// 무시
		}
	}, []);

	return { recentSearches, addRecentSearch, clearRecentSearches };
}

export type { RecentSearch };
