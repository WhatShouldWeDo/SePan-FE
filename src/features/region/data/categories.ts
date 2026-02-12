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
		{ id: "local-economy", label: "지역경제 현황", categoryId: "economy" },
		{ id: "employment", label: "고용 현황", categoryId: "economy" },
		{ id: "business", label: "사업체 현황", categoryId: "economy" },
		{ id: "income", label: "소득 현황", categoryId: "economy" },
	],
	housing: [
		{ id: "housing-status", label: "주거 현황", categoryId: "housing" },
		{ id: "real-estate", label: "부동산 시세", categoryId: "housing" },
		{ id: "development", label: "개발사업 현황", categoryId: "housing" },
		{ id: "public-housing", label: "공공주택 현황", categoryId: "housing" },
	],
	safety: [
		{ id: "crime", label: "범죄 현황", categoryId: "safety" },
		{ id: "disaster", label: "재난·재해 현황", categoryId: "safety" },
		{ id: "traffic-accident", label: "교통사고 현황", categoryId: "safety" },
		{ id: "fire", label: "화재 현황", categoryId: "safety" },
	],
	welfare: [
		{ id: "basic-livelihood", label: "기초생활수급 현황", categoryId: "welfare" },
		{ id: "childcare", label: "보육·돌봄 현황", categoryId: "welfare" },
		{ id: "medical", label: "의료 현황", categoryId: "welfare" },
		{ id: "social-welfare", label: "사회복지시설 현황", categoryId: "welfare" },
	],
	transport: [
		{ id: "public-transport", label: "대중교통 현황", categoryId: "transport" },
		{ id: "road", label: "도로 현황", categoryId: "transport" },
		{ id: "parking", label: "주차 현황", categoryId: "transport" },
		{ id: "commute", label: "통근 현황", categoryId: "transport" },
	],
	culture: [
		{ id: "cultural-facility", label: "문화시설 현황", categoryId: "culture" },
		{ id: "sports-facility", label: "체육시설 현황", categoryId: "culture" },
		{ id: "tourism", label: "관광 현황", categoryId: "culture" },
		{ id: "park", label: "공원·녹지 현황", categoryId: "culture" },
	],
	aging: [
		{ id: "birth-rate", label: "출생률 현황", categoryId: "aging" },
		{ id: "aging-index", label: "고령화 지수", categoryId: "aging" },
		{ id: "senior-facility", label: "노인복지시설 현황", categoryId: "aging" },
		{ id: "senior-activity", label: "노인 활동 현황", categoryId: "aging" },
	],
	education: [
		{ id: "school", label: "학교 현황", categoryId: "education" },
		{ id: "student", label: "학생 현황", categoryId: "education" },
		{ id: "private-education", label: "사교육 현황", categoryId: "education" },
		{ id: "lifelong-education", label: "평생교육 현황", categoryId: "education" },
	],
};
