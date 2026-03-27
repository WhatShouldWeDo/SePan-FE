export interface AiRecommendation {
	id: string;
	title: string;
	matchRate: number;
}

export interface BenchmarkCategory {
	name: string;
	value: number;
	isHighlighted?: boolean;
}

export interface MyPledge {
	id: string;
	category: string;
	categoryId: string;
	title: string;
	description: string;
	region: string;
	createdAt: string;
}

export interface PledgeSummary {
	total: number;
	drafting: number;
	reviewing: number;
	confirmed: number;
}

export const mockAiRecommendations: AiRecommendation[] = [
	{
		id: "1",
		title: "소상공인 임대료 및 공공요금 한시적 지원",
		matchRate: 66,
	},
	{
		id: "2",
		title: "스마트 경로당 및 디지털 교육 센터 확충",
		matchRate: 89,
	},
];

export const mockBenchmarkData: BenchmarkCategory[] = [
	{ name: "복지", value: 36 },
	{ name: "경제", value: 46 },
	{ name: "환경", value: 74 },
	{ name: "교통", value: 104, isHighlighted: true },
	{ name: "교육", value: 70 },
	{ name: "안전", value: 52 },
	{ name: "문화", value: 50 },
];

export const mockPledgeSummary: PledgeSummary = {
	total: 24,
	drafting: 12,
	reviewing: 9,
	confirmed: 3,
};

export const mockMyPledges: MyPledge[] = [
	{
		id: "1",
		category: "경제",
		categoryId: "economy",
		title: "소상공인 임대료 부담 경감 지원 확대",
		description: "공공임대상가 공급 확대 및 임대료 상한제 도입 추진",
		region: "청담동",
		createdAt: "3시간 전",
	},
	{
		id: "2",
		category: "주거·부동산",
		categoryId: "housing",
		title: "강남구 도시숲 조성 및 미세먼지 저감 대책",
		description: "학교 주변 생활환경 개선 및 전기차 충전 인프라 확대",
		region: "논현1동",
		createdAt: "20분 전",
	},
	{
		id: "3",
		category: "복지·분배",
		categoryId: "welfare",
		title: "노인 요양시설 접근성 개선 및 운영비 지원",
		description: "치매안심센터 확충 및 재가요양 서비스 품질 향상 추진",
		region: "신사동",
		createdAt: "2일 전",
	},
	{
		id: "4",
		category: "교육",
		categoryId: "education",
		title: "공립 유치원 확충 및 보육교사 처우 개선",
		description: "국공립 어린이집 비율 50% 달성 및 보육료 단계적 인하",
		region: "논현2동",
		createdAt: "2026.03.05",
	},
];
