import { useBreadcrumb } from "@/contexts/useNavigation";
import { AiRecommendationSection } from "@/features/policy/components/AiRecommendationSection";
import { BenchmarkSection } from "@/features/policy/components/BenchmarkSection";
import { MyPledgesSection } from "@/features/policy/components/MyPledgesSection";
import {
	mockAiRecommendations,
	mockBenchmarkData,
	computePledgeSummary,
	mockMyPledges,
} from "@/features/policy/data/mock-policy";

export function PolicyPage() {
	useBreadcrumb([{ label: "정책개발" }]);

	return (
		<div className="flex flex-col px-20 py-8">
			{/* 페이지 헤더 */}
			<div className="py-4">
				<h1 className="text-heading-1 font-bold text-label-normal">
					정책 개발
				</h1>
				<p className="mt-2 text-body-1 font-medium text-label-alternative">
					AI 추천과 역대 공약 데이터를 활용하여 우리 지역에 필요한 정책을
					설계하세요.
				</p>
			</div>

			{/* 2-Column Cards */}
			<div className="mt-8 flex gap-6">
				<AiRecommendationSection
					recommendations={mockAiRecommendations}
					updateCount={3}
				/>
				<BenchmarkSection data={mockBenchmarkData} />
			</div>

			{/* 나의 공약 관리 */}
			<div className="mt-8">
				<MyPledgesSection
					summary={computePledgeSummary(mockMyPledges)}
					pledges={mockMyPledges}
				/>
			</div>
		</div>
	);
}
