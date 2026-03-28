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

export interface AiRecommendationDetail extends AiRecommendation {
	region: string;
	categoryId: string;
	tags: { categoryId: string; label: string }[];
	aiInsight: string;
	expectedEffect: string;
	description: string;
	updatedAt: string;
	isAdopted: boolean;
}

export interface RegionInfo {
	name: string;
	updatedAt: string;
	characteristics: { categoryId: string; label: string }[];
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

export const mockRegionInfo: RegionInfo = {
	name: "서울특별시 강남구 갑",
	updatedAt: "오늘 오전 9:23",
	characteristics: [
		{ categoryId: "economy", label: "소상공인 밀집" },
		{ categoryId: "transport", label: "교통 혼잡" },
		{ categoryId: "aging", label: "고령화 진행" },
		{ categoryId: "housing", label: "주거비 상위" },
		{ categoryId: "education", label: "사교육 과열" },
		{ categoryId: "safety", label: "1인가구 증가" },
	],
};

export const mockRecommendationDetails: AiRecommendationDetail[] = [
	{
		id: "rec-1",
		title: "소상공인 임대료 및 공공요금 한시적 지원",
		matchRate: 89,
		region: "삼성동",
		categoryId: "economy",
		tags: [
			{ categoryId: "economy", label: "경제" },
			{ categoryId: "welfare", label: "복지·분배" },
		],
		aiInsight:
			"강남구 갑 지역 소상공인 폐업률이 전년 대비 12.3% 증가하였으며, 임대료 부담이 가장 큰 요인으로 분석됩니다.",
		expectedEffect:
			"소상공인 연간 운영비 약 15% 절감 효과가 예상되며, 폐업률 감소에 기여할 것으로 보입니다.",
		description:
			"강남구 갑 지역은 상가 임대료가 서울시 평균의 1.8배에 달하며, 소상공인들의 경영 부담이 심각한 상황입니다. 본 공약은 공공요금 한시적 감면과 함께 공공임대상가 공급을 확대하여 소상공인의 안정적인 영업 환경을 조성하고자 합니다. 특히 코로나19 이후 매출 회복이 더딘 업종을 우선 지원 대상으로 선정합니다.",
		updatedAt: "2026-03-27",
		isAdopted: false,
	},
	{
		id: "rec-2",
		title: "스마트 경로당 및 디지털 교육 센터 확충",
		matchRate: 78,
		region: "역삼동",
		categoryId: "aging",
		tags: [
			{ categoryId: "aging", label: "저출산·고령화" },
			{ categoryId: "education", label: "교육" },
		],
		aiInsight:
			"65세 이상 인구 비율이 18.7%로 고령화가 빠르게 진행 중이며, 디지털 격차 해소가 시급합니다.",
		expectedEffect:
			"어르신 디지털 역량 강화를 통해 행정 서비스 접근성이 향상되고, 사회 참여율 증가가 기대됩니다.",
		description:
			"기존 경로당을 스마트 경로당으로 전환하여 키오스크 교육, 온라인 민원 처리, 원격 건강 상담 등의 서비스를 제공합니다. 디지털 교육 전담 인력을 배치하고, 주 2회 이상 정기 교육 프로그램을 운영합니다.",
		updatedAt: "2026-03-26",
		isAdopted: true,
	},
	{
		id: "rec-3",
		title: "학교 주변 안심 귀가 인프라 강화",
		matchRate: 72,
		region: "논현동",
		categoryId: "safety",
		tags: [
			{ categoryId: "safety", label: "사회안전" },
			{ categoryId: "education", label: "교육" },
		],
		aiInsight:
			"논현동 일대 야간 범죄 신고 건수가 전년 대비 8.5% 증가하였으며, 학교 주변 CCTV 사각지대가 확인되었습니다.",
		expectedEffect:
			"CCTV 사각지대 해소 및 안심 귀가 서비스 확대로 야간 범죄 발생률 20% 감소가 목표입니다.",
		description:
			"학교 반경 500m 이내 CCTV 사각지대에 스마트 가로등과 비상벨을 설치하고, 야간 귀가 동행 서비스를 시범 운영합니다. 지역 경찰서와 협력하여 순찰 경로를 최적화합니다.",
		updatedAt: "2026-03-25",
		isAdopted: false,
	},
	{
		id: "rec-4",
		title: "친환경 공영주차장 전환 및 교통 체증 완화",
		matchRate: 66,
		region: "청담동",
		categoryId: "transport",
		tags: [
			{ categoryId: "transport", label: "교통" },
			{ categoryId: "housing", label: "주거·부동산" },
		],
		aiInsight:
			"청담동 주요 도로의 평균 통행 속도가 시내 최하위권이며, 공영주차장 부족이 이중주차의 주요 원인입니다.",
		expectedEffect:
			"공영주차장 500면 추가 확보 시 이중주차 40% 감소, 평균 통행 속도 15% 개선이 예상됩니다.",
		description:
			"노후 공영주차장을 친환경 입체 주차장으로 전환하고, 전기차 충전 인프라를 함께 설치합니다. 실시간 주차 정보 시스템을 도입하여 주차 탐색 시간을 줄입니다.",
		updatedAt: "2026-03-24",
		isAdopted: false,
	},
	{
		id: "rec-5",
		title: "사교육비 절감을 위한 공교육 방과후 프로그램 확대",
		matchRate: 58,
		region: "대치동",
		categoryId: "education",
		tags: [
			{ categoryId: "education", label: "교육" },
			{ categoryId: "economy", label: "경제" },
		],
		aiInsight:
			"강남구 가구당 월평균 사교육비가 전국 평균의 2.3배이며, 방과후 프로그램 참여율이 저조합니다.",
		expectedEffect:
			"양질의 방과후 프로그램 제공으로 사교육비 월평균 20만원 절감 효과를 목표로 합니다.",
		description:
			"공교육 기반의 방과후 프로그램을 대폭 확대하고, 우수 강사진을 확보하여 사교육 수요를 공교육으로 흡수합니다. AI 기반 맞춤 학습 시스템을 도입하여 학생별 수준에 맞는 교육을 제공합니다.",
		updatedAt: "2026-03-23",
		isAdopted: false,
	},
];
