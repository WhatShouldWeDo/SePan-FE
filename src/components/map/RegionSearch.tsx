import { useState, useCallback, useMemo, useRef, useId } from "react";
import { Search, X, Clock } from "lucide-react";
import { SIDO_NAME_MAP, getSidoFullName } from "@/lib/sido-utils";
import { isChosungQuery, matchChosung } from "@/lib/hangul-utils";
import {
	useRecentSearches,
	type RecentSearch,
} from "@/hooks/useRecentSearches";
import type { SearchSelectedRegion } from "@/types/map";

const MAX_RESULTS = 10;

interface SearchableRegion {
	sido: string;
	constituencyCode: string | null;
	constituencyName: string | null;
	displayName: string;
	searchText: string;
}

interface RegionSearchProps {
	onSelect: (result: SearchSelectedRegion) => void;
	/** 선거구 GeoJSON (동적 로딩 데이터) — null이면 시도만 검색 */
	constituencyFeatures?: GeoJSON.FeatureCollection | null;
}

/** 검색 가능한 시도 + 선거구 목록 빌드 */
function buildSearchData(
	constituencyFeatures: GeoJSON.FeatureCollection | null,
): SearchableRegion[] {
	const items: SearchableRegion[] = [];

	// 시도 17개
	for (const [short, full] of Object.entries(SIDO_NAME_MAP)) {
		items.push({
			sido: short,
			constituencyCode: null,
			constituencyName: null,
			displayName: full,
			searchText: `${short} ${full}`,
		});
	}

	// 선거구 (데이터가 로드된 경우에만)
	if (constituencyFeatures) {
		for (const f of constituencyFeatures.features) {
			const props = f.properties as Record<string, string>;
			items.push({
				sido: props.SIDO,
				constituencyCode: props.SGG_Code,
				constituencyName: props.SGG,
				displayName: props.SIDO_SGG,
				searchText: `${props.SIDO} ${getSidoFullName(props.SIDO)} ${props.SGG} ${props.SIDO_SGG}`,
			});
		}
	}

	return items;
}

/**
 * 지역구 검색 컴포넌트
 *
 * @description
 * - Input + 필터링 드롭다운 (새 패키지 없음)
 * - 시도(17) + 선거구(254) = 271개 항목
 * - includes() + 초성 매칭 (Phase 3-B)
 * - 최근 검색어 표시 (Phase 3-B)
 * - 키보드 네비게이션: ArrowUp/Down, Enter, Escape
 * - ARIA combobox 패턴
 * - h-12 (48px) 인풋, min-h-[44px] 결과 항목 (CLAUDE.md 4-1)
 */
export function RegionSearch({
	onSelect,
	constituencyFeatures = null,
}: RegionSearchProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const { recentSearches, addRecentSearch, clearRecentSearches } =
		useRecentSearches();

	const searchData = useMemo(
		() => buildSearchData(constituencyFeatures),
		[constituencyFeatures],
	);

	const results = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed) return [];

		// 초성 쿼리인 경우 초성 매칭, 아닌 경우 includes 매칭
		const useChosung = isChosungQuery(trimmed);

		return searchData
			.filter((item) =>
				useChosung
					? matchChosung(item.searchText, trimmed)
					: item.searchText.includes(trimmed),
			)
			.slice(0, MAX_RESULTS);
	}, [query, searchData]);

	// 검색어가 없을 때 최근 검색어를 보여줄지 여부
	const showRecent = isOpen && !query.trim() && recentSearches.length > 0;
	const showResults = isOpen && query.trim().length > 0 && results.length > 0;
	const showDropdown = showRecent || showResults;

	// 드롭다운에 표시할 항목 수 (키보드 네비게이션용)
	const dropdownItemCount = showRecent
		? recentSearches.length
		: results.length;

	const handleSelect = useCallback(
		(item: SearchableRegion) => {
			// 최근 검색어에 추가
			addRecentSearch({
				displayName: item.displayName,
				sido: item.sido,
				constituencyCode: item.constituencyCode,
			});

			onSelect({
				sido: item.sido,
				constituencyCode: item.constituencyCode,
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
				constituencyCode: item.constituencyCode,
			});
			// 선택한 항목을 최근 검색 맨 앞으로
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
		// 드롭다운 내 클릭 시 blur → 선택이 무시되는 것 방지
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
					aria-label="지역구 검색"
					aria-autocomplete="list"
					placeholder="지역구를 검색하세요 (초성 검색 가능)"
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
								key={`recent-${item.sido}-${item.constituencyCode ?? "sido"}`}
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
									item.constituencyCode ??
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
								{item.constituencyCode && (
									<span className="text-sm text-muted-foreground">
										{getSidoFullName(item.sido)}
									</span>
								)}
							</li>
						))}
				</ul>
			)}
		</div>
	);
}
