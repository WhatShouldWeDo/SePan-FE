/**
 * 지역분석 카테고리 / 서브카테고리 데이터
 *
 * CategoryNav 컴포넌트에서 사용하는 정적 데이터.
 * 추후 서버 API로 교체될 수 있도록 타입과 이름을 유지한다.
 */

export interface CategoryItem {
	id: string;
	label: string;
	iconColor: string;
}

export interface SubcategoryItem {
	id: string;
	label: string;
	categoryId: string;
}

export const CATEGORIES: CategoryItem[] = [
	{ id: "voter", label: "유권자 분석", iconColor: "#009cfd" },
	{ id: "economy", label: "경제", iconColor: "#fd8b00" },
	{ id: "housing", label: "주거·부동산", iconColor: "#0cc6a1" },
	{ id: "safety", label: "사회안전", iconColor: "#1d36b5" },
	{ id: "welfare", label: "복지·분배", iconColor: "#fd00b1" },
	{ id: "transport", label: "교통", iconColor: "#389d40" },
	{ id: "culture", label: "문화여가", iconColor: "#731db5" },
	{ id: "aging", label: "저출산·고령화", iconColor: "#b51d52" },
	{ id: "education", label: "교육", iconColor: "#fa7d01" },
];

export const SUBCATEGORIES: Record<string, SubcategoryItem[]> = {
	voter: [
		{ id: "population", label: "인구현황", categoryId: "voter" },
		{ id: "residence-type", label: "거주형태", categoryId: "voter" },
		{ id: "household-type", label: "세대형태", categoryId: "voter" },
		{ id: "youth-household", label: "청년가구 현황", categoryId: "voter" },
		{ id: "newlywed", label: "신혼부부 현황", categoryId: "voter" },
		{ id: "middle-aged", label: "중장년층 현황", categoryId: "voter" },
		{ id: "elderly", label: "노인 현황", categoryId: "voter" },
		{ id: "living-alone-elderly", label: "독거노인 현황", categoryId: "voter" },
		{ id: "multicultural", label: "다문화 가구 현황", categoryId: "voter" },
		{ id: "disabled", label: "장애인 현황", categoryId: "voter" },
	],
	economy: [
		{ id: "fiscal-autonomy", label: "재정자주도 현황", categoryId: "economy" },
		{ id: "business-by-industry", label: "업종별 사업체 현황", categoryId: "economy" },
		{ id: "wage-self-employed", label: "임금근로자ㆍ자영업자 현황", categoryId: "economy" },
		{ id: "household-income", label: "가구당 평균 소득", categoryId: "economy" },
		{ id: "commercial-district", label: "상권 현황", categoryId: "economy" },
		{ id: "commercial-rent", label: "상가임대료 현황", categoryId: "economy" },
		{ id: "market-mart", label: "시장ㆍ마트 현황", categoryId: "economy" },
	],
	housing: [
		{ id: "housing-status", label: "주택현황", categoryId: "housing" },
		{ id: "apt-supply", label: "아파트 예정 공급량", categoryId: "housing" },
		{ id: "homeowner", label: "주택소유자 현황", categoryId: "housing" },
		{ id: "homeless-household", label: "무주택자 현황", categoryId: "housing" },
		{ id: "apt-maintenance", label: "아파트 관리비 현황", categoryId: "housing" },
		{ id: "rental-housing", label: "임대주택 현황", categoryId: "housing" },
		{ id: "housing-price-change", label: "월간주택ㆍ아파트 매매 가격상승률", categoryId: "housing" },
	],
	safety: [
		{ id: "crime", label: "범죄현황", categoryId: "safety" },
		{ id: "emergency-bell", label: "비상벨 위치정보", categoryId: "safety" },
		{ id: "security-facility", label: "치안시설 현황", categoryId: "safety" },
		{ id: "child-protection-zone", label: "어린이보호구역 지정 현황", categoryId: "safety" },
	],
	welfare: [
		{ id: "disease-patients", label: "질환유형별 환자현황", categoryId: "welfare" },
		{ id: "hospital", label: "병원 현황", categoryId: "welfare" },
		{ id: "pediatrics", label: "소아청소년과 현황", categoryId: "welfare" },
		{ id: "night-pediatric", label: "야간 어린이병원 현황", categoryId: "welfare" },
		{ id: "basic-livelihood", label: "기초생활수급자 현황", categoryId: "welfare" },
	],
	transport: [
		{ id: "commute-time", label: "통근 시간", categoryId: "transport" },
		{ id: "transit-share", label: "대중교통 수단간 분담률", categoryId: "transport" },
		{ id: "station-escalator", label: "역사 출입구 에스컬레이터 설치 현황", categoryId: "transport" },
		{ id: "bus-stop-supply", label: "정류장 공급도", categoryId: "transport" },
		{ id: "mobility-impaired", label: "교통약자 현황", categoryId: "transport" },
		{ id: "parking", label: "주차장 현황", categoryId: "transport" },
	],
	culture: [
		{ id: "public-library", label: "공공도서관 현황", categoryId: "culture" },
		{ id: "lifelong-learning", label: "평생학습센터·강좌 현황", categoryId: "culture" },
		{ id: "park", label: "공원 현황", categoryId: "culture" },
		{ id: "pet", label: "반려동물 현황", categoryId: "culture" },
	],
	aging: [
		{ id: "fertility-rate", label: "합계 출산율", categoryId: "aging" },
		{ id: "obstetrics", label: "산부인과 현황", categoryId: "aging" },
		{ id: "postpartum-care", label: "산후조리원 현황", categoryId: "aging" },
		{ id: "daycare", label: "어린이집 현황", categoryId: "aging" },
		{ id: "kindergarten", label: "유치원 현황", categoryId: "aging" },
		{ id: "kids-cafe", label: "키즈카페 현황", categoryId: "aging" },
		{ id: "care-center", label: "돌봄센터 현황", categoryId: "aging" },
		{ id: "nursing-home", label: "노인요양시설 현황", categoryId: "aging" },
		{ id: "silver-town", label: "실버타운 현황", categoryId: "aging" },
		{ id: "long-term-care", label: "장기요양 재택 의료센터 현황", categoryId: "aging" },
		{ id: "dementia-center", label: "치매센터 현황", categoryId: "aging" },
		{ id: "senior-center", label: "경로당 현황", categoryId: "aging" },
	],
	education: [
		{ id: "private-education-cost", label: "사교육비 현황", categoryId: "education" },
		{ id: "ai-school", label: "AI 선도학교 현황", categoryId: "education" },
		{ id: "coding-education", label: "코딩교육 현황", categoryId: "education" },
		{ id: "vocational-employment", label: "특성화고 취업현황", categoryId: "education" },
		{ id: "university-scholarship", label: "대학 학비 전액지원 가능가구", categoryId: "education" },
	],
};
