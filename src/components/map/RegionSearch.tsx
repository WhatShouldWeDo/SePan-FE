import { useState, useCallback, useMemo, useRef, useId } from "react";
import * as topojson from "topojson-client";
import { Search, X } from "lucide-react";
import { SIDO_NAME_MAP, getSidoFullName } from "@/lib/sido-utils";
import type { SearchSelectedRegion } from "@/types/map";
import constituencyTopojsonData from "@/features/region/data/constituencies.topojson.json";

const TOPOJSON_OBJECT_KEY = "2024_22_Elec_simplify";
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
}

/** 검색 가능한 시도 + 선거구 목록을 한 번만 빌드 */
function buildSearchData(): SearchableRegion[] {
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

	// 선거구 254개
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const topology = constituencyTopojsonData as any;
	const fc = topojson.feature(
		topology,
		topology.objects[TOPOJSON_OBJECT_KEY],
	) as unknown as GeoJSON.FeatureCollection;

	for (const f of fc.features) {
		const props = f.properties as Record<string, string>;
		items.push({
			sido: props.SIDO,
			constituencyCode: props.SGG_Code,
			constituencyName: props.SGG,
			displayName: props.SIDO_SGG,
			searchText: `${props.SIDO} ${getSidoFullName(props.SIDO)} ${props.SGG} ${props.SIDO_SGG}`,
		});
	}

	return items;
}

/**
 * 지역구 검색 컴포넌트
 *
 * @description
 * - Input + 필터링 드롭다운 (새 패키지 없음)
 * - 시도(17) + 선거구(254) = 271개 항목
 * - includes() 기반 필터링 (debounce 불필요)
 * - 키보드 네비게이션: ArrowUp/Down, Enter, Escape
 * - ARIA combobox 패턴
 * - h-12 (48px) 인풋, min-h-[44px] 결과 항목 (CLAUDE.md 4-1)
 */
export function RegionSearch({ onSelect }: RegionSearchProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(-1);
	const inputRef = useRef<HTMLInputElement>(null);
	const listboxId = useId();

	const searchData = useMemo(() => buildSearchData(), []);

	const results = useMemo(() => {
		const trimmed = query.trim();
		if (!trimmed) return [];
		return searchData
			.filter((item) => item.searchText.includes(trimmed))
			.slice(0, MAX_RESULTS);
	}, [query, searchData]);

	const handleSelect = useCallback(
		(item: SearchableRegion) => {
			onSelect({
				sido: item.sido,
				constituencyCode: item.constituencyCode,
			});
			setQuery("");
			setIsOpen(false);
			setActiveIndex(-1);
			inputRef.current?.blur();
		},
		[onSelect],
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (!isOpen || results.length === 0) {
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
						prev < results.length - 1 ? prev + 1 : 0,
					);
					break;
				case "ArrowUp":
					e.preventDefault();
					setActiveIndex((prev) =>
						prev > 0 ? prev - 1 : results.length - 1,
					);
					break;
				case "Enter":
					e.preventDefault();
					if (activeIndex >= 0 && activeIndex < results.length) {
						handleSelect(results[activeIndex]);
					}
					break;
				case "Escape":
					e.preventDefault();
					setIsOpen(false);
					setActiveIndex(-1);
					break;
			}
		},
		[isOpen, results, activeIndex, handleSelect],
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
		if (query.trim()) {
			setIsOpen(true);
		}
	}, [query]);

	const handleBlur = useCallback((e: React.FocusEvent) => {
		// 드롭다운 내 클릭 시 blur → 선택이 무시되는 것 방지
		const relatedTarget = e.relatedTarget as HTMLElement | null;
		if (relatedTarget?.closest("[data-region-search-listbox]")) {
			return;
		}
		setIsOpen(false);
		setActiveIndex(-1);
	}, []);

	const showDropdown = isOpen && results.length > 0;

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
					placeholder="지역구를 검색하세요"
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

			{/* 검색 결과 드롭다운 */}
			{showDropdown && (
				<ul
					id={listboxId}
					role="listbox"
					aria-label="검색 결과"
					data-region-search-listbox
					className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-md"
				>
					{results.map((item, index) => (
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
