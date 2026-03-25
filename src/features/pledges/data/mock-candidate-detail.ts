import type { Candidate } from "./mock-candidates"

/* ─── Types ─── */

export interface SocialLink {
	type: "instagram" | "facebook" | "linkedin"
	url: string
}

export interface HistoryItem {
	period: string
	description: string
}

export interface CandidatePledge {
	id: string
	title: string
	description: string
	category: string
	categoryVariant: "red" | "orange" | "blue" | "green" | "purple"
}

export interface CandidateNews {
	id: string
	title: string
	source: string
	timeAgo: string
	thumbnailUrl?: string
}

export interface PledgeKeywordStat {
	keyword: string
	percentage: number
	color: string
}

export interface CandidateDetail extends Candidate {
	birthDate?: string
	age?: number
	address?: string
	aides?: string[]
	socialLinks?: SocialLink[]
	educationHistory?: HistoryItem[]
	careerHistory?: HistoryItem[]
	pledges?: CandidatePledge[]
	news?: CandidateNews[]
	pledgeKeywordStats?: PledgeKeywordStat[]
}

/* ─── 선거 유형 라벨 ─── */

export const ELECTION_TYPE_LABEL_MAP: Record<string, string> = {
	presidential: "대통령선거",
	parliamentary: "국회의원선거",
	local: "지방선거",
}

/* ─── 후보자 상세 목록 ─── */

export const MOCK_CANDIDATE_DETAILS: CandidateDetail[] = [
	{
		id: "1",
		name: "김진보",
		party: "dpk",
		partyName: "더불어민주당",
		region: "서울특별시",
		electionInfo: "제 20대 대통령선거",
		job: "정당인",
		education: "서울대학교 법학과 졸업",
		careers: [
			"서울대학교 법학과 졸업",
			"(전)국무총리",
			"(전)더불어민주당 대표",
		],
		electionTerm: 20,
		birthDate: "1965.04.18",
		age: 60,
		address: "서울특별시 강남구 압구정로",
		aides: ["김수경", "박영호"],
		socialLinks: [
			{ type: "instagram", url: "https://instagram.com/kimjinbo" },
			{ type: "facebook", url: "https://facebook.com/kimjinbo.official" },
			{ type: "linkedin", url: "https://linkedin.com/in/kimjinbo" },
		],
		educationHistory: [
			{ period: "1984 ~ 1988", description: "서울대학교 법학과 학사" },
			{ period: "1988 ~ 1990", description: "서울대학교 법학과 석사" },
			{
				period: "1991 ~ 1994",
				description: "하버드 로스쿨 법학박사 (J.D.)",
			},
			{
				period: "1981 ~ 1984",
				description: "서울 경기고등학교 졸업",
			},
		],
		careerHistory: [
			{
				period: "2022 ~ 현재",
				description: "더불어민주당 상임고문",
			},
			{
				period: "2018 ~ 2022",
				description: "제42대 국무총리",
			},
			{
				period: "2016 ~ 2018",
				description: "더불어민주당 대표",
			},
			{
				period: "2008 ~ 2016",
				description: "제18·19대 국회의원 (서울 강남구)",
			},
			{
				period: "2004 ~ 2008",
				description: "대통령비서실 정책실장",
			},
			{
				period: "1995 ~ 2004",
				description: "법무법인 정의 대표변호사",
			},
		],
		pledgeKeywordStats: [
			{ keyword: "경제", percentage: 45, color: "#7C3AED" },
			{ keyword: "복지", percentage: 30, color: "#3B82F6" },
			{ keyword: "교육", percentage: 25, color: "#10B981" },
		],
		pledges: [
			{
				id: "p1",
				title: "청년 주거 안정 프로젝트",
				description:
					"공공임대주택 50만 호 공급 및 청년 월세 지원 확대를 통한 주거 안정 실현",
				category: "부동산",
				categoryVariant: "blue",
			},
			{
				id: "p2",
				title: "중소기업 디지털 전환 지원",
				description:
					"중소기업 디지털 전환 바우처 지급 및 AI 도입 컨설팅 지원 프로그램 운영",
				category: "경제",
				categoryVariant: "purple",
			},
			{
				id: "p3",
				title: "기초연금 40만원 인상",
				description:
					"기초연금을 현행 대비 인상하여 노인 빈곤율 해소 및 노후 소득 보장 강화",
				category: "복지",
				categoryVariant: "red",
			},
			{
				id: "p4",
				title: "공교육 혁신 및 사교육비 경감",
				description:
					"방과후 프로그램 확대 및 AI 기반 맞춤형 학습 시스템 도입으로 사교육 의존도 축소",
				category: "교육",
				categoryVariant: "green",
			},
			{
				id: "p5",
				title: "탄소중립 2040 로드맵",
				description:
					"재생에너지 비중 60% 달성 및 탄소세 도입을 통한 2040년 탄소중립 실현",
				category: "환경",
				categoryVariant: "orange",
			},
		],
		news: [
			{
				id: "n1",
				title: "김진보 후보, 청년 주거 공약 발표... '50만 호 공급'",
				source: "한겨레",
				timeAgo: "2시간 전",
			},
			{
				id: "n2",
				title: "여론조사 지지율 1위... 김진보 32.5%",
				source: "중앙일보",
				timeAgo: "5시간 전",
			},
			{
				id: "n3",
				title: "김진보-이재명 단일화 논의 본격화",
				source: "조선일보",
				timeAgo: "8시간 전",
			},
			{
				id: "n4",
				title: "기초연금 인상 공약에 복지계 환영 목소리",
				source: "경향신문",
				timeAgo: "1일 전",
			},
			{
				id: "n5",
				title: "탄소중립 2040 로드맵 실현 가능성 분석",
				source: "한국경제",
				timeAgo: "1일 전",
			},
			{
				id: "n6",
				title: "김진보 후보 부산 유세... '지역균형 발전' 강조",
				source: "부산일보",
				timeAgo: "2일 전",
			},
			{
				id: "n7",
				title: "중소기업계, 디지털 전환 공약에 기대감",
				source: "매일경제",
				timeAgo: "3일 전",
			},
			{
				id: "n8",
				title: "공교육 혁신 공약 놓고 교육계 갑론을박",
				source: "동아일보",
				timeAgo: "4일 전",
			},
		],
	},
]

/* ─── 유틸 ─── */

export function getCandidateDetail(
	id: string,
): CandidateDetail | undefined {
	return MOCK_CANDIDATE_DETAILS.find((c) => c.id === id)
}
