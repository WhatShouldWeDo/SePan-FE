import { useState } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { KoreaConstituencyMap } from "@/components/map";
import type { MapRegion } from "@/types/map";

export function RegionPage() {
	const [selected, setSelected] = useState<MapRegion | null>(null);

	const handleRegionSelect = (region: MapRegion) => {
		setSelected(region);
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-3xl font-bold">지역분석</h1>
				<p className="mt-1 text-muted-foreground">
					지역구를 클릭하여 분석 데이터를 확인하세요
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>선거구 지도</CardTitle>
					<CardDescription>
						22대 국회의원 선거구 254개 지역구
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* 반응형: max-width 제한 + 중앙 정렬, SVG viewBox로 비율 유지 */}
					<div className="mx-auto w-full max-w-[600px]">
						<KoreaConstituencyMap
							onRegionSelect={handleRegionSelect}
							selectedCode={selected?.code}
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
