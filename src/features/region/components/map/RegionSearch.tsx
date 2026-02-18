import { useState, useCallback, useMemo, useRef, useId } from "react";
import { Search, X, Clock } from "lucide-react";
import { SIDO_NAME_MAP, getSidoFullName } from "@/features/region/lib/sido-utils";
import { isChosungQuery, matchChosung } from "@/lib/hangul-utils";
import {
	useRecentSearches,
	type RecentSearch,
} from "@/hooks/useRecentSearches";
import type { SearchSelectedRegion } from "@/types/map";

const MAX_RESULTS = 10;

interface SearchableRegion {
	sido: string;
	cityCode: string | null;
	guCode: string | null;
	emdCode: string | null;
	displayName: string;
	searchText: string;
	/** 검색 결과 태그: "시도" | "시군" | "구" | "읍면동" */
	tag: string;
}

interface RegionSearchProps {
	onSelect: (result: SearchSelectedRegion) => void;
	/** 시군 GeoJSON (229개, 하위구 시 합쳐짐) */
	sigunFeatures?: GeoJSON.FeatureCollection | null;
	/** 시군구 GeoJSON (255개, 구 레벨) */
	sigunguFeatures?: GeoJSON.FeatureCollection | null;
	/** 읍면동 GeoJSON */
	emdFeatures?: GeoJSON.FeatureCollection | null;
}

/** 검색 가능한 시도 + 시군 + 구 + 읍면동 목록 빌드 */
function buildSearchData(
	sigunFeatures: GeoJSON.FeatureCollection | null,
	sigunguFeatures: GeoJSON.FeatureCollection | null,
	emdFeatures: GeoJSON.FeatureCollection | null,
): SearchableRegion[] {
	const items: SearchableRegion[] = [];

	// 1. 시도 17개
	for (const [short, full] of Object.entries(SIDO_NAME_MAP)) {
		items.push({
			sido: short,
			cityCode: null,
			guCode: null,
			emdCode: null,
			displayName: full,
			searchText: `${short} ${full}`,
			tag: "시도",
		});
	}

	// 2. 시군 (~229개, sigunFeatures에서)
	if (sigunFeatures) {
		for (const f of sigunFeatures.features) {
			const props = f.properties as Record<string, string | boolean>;
			const fullName = `${getSidoFullName(props.SIDO as string)} ${props.CITY_NM as string}`;
			items.push({
				sido: props.SIDO as string,
				cityCode: props.CITY_CD as string,
				guCode: null,
				emdCode: null,
				displayName: fullName,
				searchText: `${props.SIDO} ${getSidoFullName(props.SIDO as string)} ${props.CITY_NM} ${fullName}`,
				tag: "시군",
			});
		}
	}

	// 3. 하위 구 (sigunguFeatures에서, 하위구 시의 구만)
	// sigunFeatures에서 HAS_GU=true인 CITY_CD prefix를 수집
	const hasGuPrefixes = new Set<string>();
	if (sigunFeatures) {
		for (const f of sigunFeatures.features) {
			const props = f.properties as Record<string, string | boolean>;
			if (props.HAS_GU === true) {
				hasGuPrefixes.add(props.CITY_CD as string);
			}
		}
	}

	// CITY_CD(4자리) → CITY_NM 매핑 (검색 표시용)
	const cityNameMap = new Map<string, string>();
	if (sigunFeatures) {
		for (const f of sigunFeatures.features) {
			const props = f.properties as Record<string, string | boolean>;
			if (props.HAS_GU === true) {
				cityNameMap.set(
					props.CITY_CD as string,
					props.CITY_NM as string,
				);
			}
		}
	}

	if (sigunguFeatures) {
		for (const f of sigunguFeatures.features) {
			const props = f.properties as Record<string, string>;
			const sguCd = props.SGU_CD;
			// 하위구 시의 구인지 확인 (SGU_CD 앞 4자리가 hasGuPrefixes에 있는지)
			const prefix4 = sguCd.substring(0, 4);
			if (!hasGuPrefixes.has(prefix4)) continue;

			const cityName = cityNameMap.get(prefix4) ?? "";
			const fullName = `${getSidoFullName(props.SIDO)} ${cityName} ${props.SGU_NM}`;
			items.push({
				sido: props.SIDO,
				cityCode: prefix4,
				guCode: sguCd,
				emdCode: null,
				displayName: fullName,
				searchText: `${props.SIDO} ${getSidoFullName(props.SIDO)} ${cityName} ${props.SGU_NM} ${fullName}`,
				tag: "구",
			});
		}
	}

	// 4. 읍면동
	if (emdFeatures) {
		for (const f of emdFeatures.features) {
			const props = f.properties as Record<string, string>;
			const parts = props.EMD_KOR_NM.split(" ");
			const dongName = parts[parts.length - 1];
			const sguCode = props.EMD_CD.substring(0, 5);

			// cityCode 결정: 하위구 시이면 4자리, 아니면 5자리
			const prefix4 = sguCode.substring(0, 4);
			let cityCode: string;
			let guCode: string | null = null;
			if (hasGuPrefixes.has(prefix4)) {
				cityCode = prefix4;
				guCode = sguCode;
			} else {
				cityCode = sguCode;
			}

			items.push({
				sido: props.SIDO,
				cityCode,
				guCode,
				emdCode: props.EMD_CD,
				displayName: props.EMD_KOR_NM,
				searchText: `${props.SIDO} ${props.EMD_KOR_NM} ${dongName}`,
				tag: "읍면동",
			});
		}
	}

	return items;
}

/**
 * 지역 검색 컴포넌트
 *
 * @description
 * - Input + 필터링 드롭다운 (새 패키지 없음)
 * - 시도(17) + 시군(229) + 구(하위구 시만) + 읍면동(3558) 항목
 * - includes() + 초성 매칭 (Phase 3-B)
 * - 최근 검색어 표시 (Phase 3-B)
 * - Phase 5.5: 시군 레벨 검색 항목 추가, cityCode/guCode 필드
 */
export function RegionSearch({
	onSelect,
	sigunFeatures = null,
	sigunguFeatures = null,
	emdFeatures = null,
}: RegionSearchProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const { recentSearches, addRecentSearch, clearRecentSearches } =
		useRecentSearches();

	const searchData = useMemo(
		() => buildSearchData(sigunFeatures, sigunguFeatures, emdFeatures),
		[sigunFeatures, sigunguFeatures, emdFeatures],
	);

	const results = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed) return [];

		const useChosung = isChosungQuery(trimmed);

		return searchData
			.filter((item) =>
				useChosung
					? matchChosung(item.searchText, trimmed)
					: item.searchText.includes(trimmed),
			)
			.slice(0, MAX_RESULTS);
	}, [query, searchData]);

	const showRecent = isOpen && !query.trim() && recentSearches.length > 0;
	const showResults = isOpen && query.trim().length > 0 && results.length > 0;
	const showDropdown = showRecent || showResults;

	const dropdownItemCount = showRecent
		? recentSearches.length
		: results.length;

	const handleSelect = useCallback(
		(item: SearchableRegion) => {
			addRecentSearch({
				displayName: item.displayName,
				sido: item.sido,
				cityCode: item.cityCode,
				guCode: item.guCode,
				emdCode: item.emdCode,
			});

			onSelect({
				sido: item.sido,
				cityCode: item.cityCode,
				guCode: item.guCode,
				emdCode: item.emdCode,
			});
			setQuery("");
			setIsOpen(false);
			setActiveIndex(-1);
			inputRef.current?.blur();
		},
		[onSelect, addRecentSearch],
	);

	const handleRecentSelect = useCallback(
		(item: RecentSearch) => {
			onSelect({
				sido: item.sido,
				cityCode: item.cityCode,
				guCode: item.guCode,
				emdCode: item.emdCode,
			});
			addRecentSearch(item);
			setQuery("");
			setIsOpen(false);
			setActiveIndex(-1);
			inputRef.current?.blur();
		},
		[onSelect, addRecentSearch],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!showDropdown) {
				if (e.key === "Escape") {
					setQuery("");
					setIsOpen(false);
					inputRef.current?.blur();
				}
				return;
			}

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					setActiveIndex((prev) =>
						prev < dropdownItemCount - 1 ? prev + 1 : 0,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((prev) =>
						prev > 0 ? prev - 1 : dropdownItemCount - 1,
					);
					break;
				case "Enter":
					e.preventDefault();
					if (activeIndex >= 0 && activeIndex < dropdownItemCount) {
						if (showRecent) {
							handleRecentSelect(recentSearches[activeIndex]);
						} else {
							handleSelect(results[activeIndex]);
						}
					}
					break;
				case "Escape":
					e.preventDefault();
					setIsOpen(false);
					setActiveIndex(-1);
					break;
			}
		},
		[
			showDropdown,
			dropdownItemCount,
			activeIndex,
			handleSelect,
			handleRecentSelect,
			results,
			recentSearches,
			showRecent,
		],
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setQuery(e.target.value);
			setIsOpen(true);
			setActiveIndex(-1);
		},
		[],
	);

	const handleClear = useCallback(() => {
		setQuery("");
		setIsOpen(false);
		setActiveIndex(-1);
		inputRef.current?.focus();
	}, []);

	const handleFocus = useCallback(() => {
		setIsOpen(true);
	}, []);

	const handleBlur = useCallback((e: React.FocusEvent) => {
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		if (relatedTarget?.closest("[data-region-search-listbox]")) {
			return;
		}
		setIsOpen(false);
		setActiveIndex(-1);
	}, []);

	return (
		<div className="relative">
			{/* 검색 인풋 */}
			<div className="relative">
				<Search
					className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
					aria-hidden="true"
				/>
				<input
					ref={inputRef}
					type="text"
					role="combobox"
					aria-expanded={showDropdown}
					aria-controls={listboxId}
					aria-activedescendant={
						activeIndex >= 0
							? `${listboxId}-option-${activeIndex}`
							: undefined
					}
					aria-label="지역 검색"
					aria-autocomplete="list"
					placeholder="지역을 검색하세요 (초성 검색 가능)"
					value={query}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-10 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
				/>
				{query && (
					<button
						type="button"
						onClick={handleClear}
						className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
						aria-label="검색어 지우기"
					>
						<X className="h-4 w-4" />
					</button>
				)}
			</div>

			{/* 드롭다운: 최근 검색어 또는 검색 결과 */}
			{showDropdown && (
				<ul
					id={listboxId}
					role="listbox"
					aria-label={showRecent ? "최근 검색" : "검색 결과"}
					data-region-search-listbox
					className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md"
				>
					{/* 최근 검색어 헤더 */}
					{showRecent && (
						<li
							role="presentation"
							className="flex items-center justify-between border-b border-border px-4 py-2"
						>
							<span className="text-sm font-medium text-muted-foreground">
								최근 검색
							</span>
							<button
								type="button"
								onMouseDown={(e) => {
									e.preventDefault();
									clearRecentSearches();
								}}
								className="text-xs text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
							>
								전체 삭제
							</button>
						</li>
					)}

					{/* 최근 검색어 목록 */}
					{showRecent &&
						recentSearches.map((item, index) => (
							<li
								key={`recent-${item.sido}-${item.cityCode ?? "sido"}-${item.guCode ?? ""}`}
								id={`${listboxId}-option-${index}`}
								role="option"
								aria-selected={index === activeIndex}
								onMouseDown={(e) => {
									e.preventDefault();
									handleRecentSelect(item);
								}}
								onMouseEnter={() => setActiveIndex(index)}
								className={`flex min-h-[44px] cursor-pointer items-center gap-2 px-4 py-2 text-base ${
									index === activeIndex
										? "bg-accent text-accent-foreground"
										: "text-popover-foreground"
								}`}
							>
								<Clock
									className="h-4 w-4 shrink-0 text-muted-foreground"
									aria-hidden="true"
								/>
								<span className="font-medium">
									{item.displayName}
								</span>
							</li>
						))}

					{/* 검색 결과 목록 */}
					{showResults &&
						results.map((item, index) => (
							<li
								key={
									item.emdCode ??
									item.guCode ??
									item.cityCode ??
									`sido-${item.sido}`
								}
								id={`${listboxId}-option-${index}`}
								role="option"
								aria-selected={index === activeIndex}
								onMouseDown={(e) => {
									e.preventDefault();
									handleSelect(item);
								}}
								onMouseEnter={() => setActiveIndex(index)}
								className={`flex min-h-[44px] cursor-pointer items-center gap-2 px-4 py-2 text-base ${
									index === activeIndex
										? "bg-accent text-accent-foreground"
										: "text-popover-foreground"
								}`}
							>
								<span className="font-medium">
									{item.displayName}
								</span>
								<span className="text-sm text-muted-foreground">
									{item.tag}
								</span>
							</li>
						))}
				</ul>
			)}
		</div>
	);
}
