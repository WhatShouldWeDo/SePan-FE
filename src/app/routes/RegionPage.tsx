import { useState, useCallback } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { KoreaAdminMap, RegionSearch } from "@/components/map";
import { useTopoJsonData } from "@/hooks/useTopoJsonData";
import type { MapRegion, SearchSelectedRegion } from "@/types/map";

export function RegionPage() {
	const [selected, setSelected] = useState<MapRegion | null>(null);
	const [searchNavigation, setSearchNavigation] =
		useState<SearchSelectedRegion | null>(null);

	// 동적 로딩된 데이터를 RegionSearch에도 전달
	const { sigunFeatures, sigunguFeatures, emdFeatures } = useTopoJsonData();

	const handleRegionSelect = useCallback((region: MapRegion) => {
		setSelected(region);
	}, []);

	const handleSearchSelect = useCallback((result: SearchSelectedRegion) => {
		setSearchNavigation(result);
		setSelected(null);
	}, []);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">지역분석</h1>
				<p className="mt-1 text-muted-foreground">
					지역을 검색하거나 지도에서 직접 선택하세요
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>행정구역 지도</CardTitle>
					<CardDescription>
						시도를 클릭하여 세부 행정구역을 확인하세요
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<RegionSearch
						onSelect={handleSearchSelect}
						sigunFeatures={sigunFeatures}
						sigunguFeatures={sigunguFeatures}
						emdFeatures={emdFeatures}
					/>

					{/* 반응형: max-width 제한 + 중앙 정렬, SVG viewBox로 비율 유지 */}
					<div className="mx-auto w-full max-w-[600px]">
						<KoreaAdminMap
							onRegionSelect={handleRegionSelect}
							selectedCode={selected?.code}
							searchNavigation={searchNavigation}
							className="[&>svg]:h-auto [&>svg]:w-full"
						/>
					</div>

					{selected && (
						<p className="mt-4 text-center text-base text-muted-foreground">
							선택된 지역:{" "}
							<span className="font-semibold text-foreground">
								{selected.fullName}
							</span>
						</p>
					)}
				</CardContent>
			</Card>

			{/* TODO: IndicatorCategoryTabs, CurrentStatusSection, TrendChart 등 추가 */}
		</div>
	);
}
