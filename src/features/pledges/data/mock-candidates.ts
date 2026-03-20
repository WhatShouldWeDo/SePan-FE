/* ─── Types ─── */

export type Party = "dpk" | "ppp" | "justice" | "reform" | "other"

export interface Candidate {
	id: string
	name: string
	party: Party
	partyName: string
	region: string
	electionInfo: string
	careers: string[]
	photoUrl?: string
	electionTerm: number
	// 국회의원선거 전용 (optional)
	electionType?: "national" | "proportional" | "governor" | "council" | "mayor"
	sido?: string
	sigungu?: string
	regionDetail?: string
}

export interface ElectionTerm {
	value: number
	label: string
}

/* ─── 정당 색상 매핑 ─── */

export const PARTY_COLOR_MAP: Record<Party, { bg: string; text: string }> = {
	dpk: { bg: "bg-party-dpk", text: "text-white" },
	ppp: { bg: "bg-party-ppp", text: "text-white" },
	justice: { bg: "bg-party-justice", text: "text-label-normal" },
	reform: { bg: "bg-party-reform", text: "text-white" },
	other: { bg: "bg-label-neutral", text: "text-white" },
}

/* ─── 선거회차 ─── */

export const ELECTION_TERMS: ElectionTerm[] = [
	{ value: 20, label: "제 20대" },
	{ value: 19, label: "제 19대" },
	{ value: 18, label: "제 18대" },
]

/* ─── 후보자 목록 ─── */

export const MOCK_CANDIDATES: Candidate[] = [
	{
		id: "1",
		name: "김민수",
		party: "dpk",
		partyName: "더불어민주당",
		region: "서울특별시",
		electionInfo: "제 20대 대통령선거",
		careers: [
			"서울대학교 법학과 졸업",
			"(전)국무총리",
			"(전)더불어민주당 대표",
		],
		electionTerm: 20,
	},
	{
		id: "2",
		name: "박정호",
		party: "ppp",
		partyName: "국민의힘",
		region: "부산광역시",
		electionInfo: "제 20대 대통령선거",
		careers: [
			"고려대학교 정치외교학과 졸업",
			"(전)부산광역시장",
			"(현)국민의힘 최고위원",
		],
		electionTerm: 20,
	},
	{
		id: "3",
		name: "이수진",
		party: "justice",
		partyName: "정의당",
		region: "경기도",
		electionInfo: "제 20대 대통령선거",
		careers: [
			"이화여자대학교 사회학과 졸업",
			"(전)정의당 대표",
		],
		electionTerm: 20,
	},
	{
		id: "4",
		name: "최영환",
		party: "reform",
		partyName: "개혁신당",
		region: "대전광역시",
		electionInfo: "제 20대 대통령선거",
		careers: [
			"KAIST 경영대학원 졸업",
			"(전)중소벤처기업부 장관",
			"(현)개혁신당 대표",
		],
		electionTerm: 20,
	},
	{
		id: "5",
		name: "정태준",
		party: "dpk",
		partyName: "더불어민주당",
		region: "광주광역시",
		electionInfo: "제 19대 대통령선거",
		careers: [
			"연세대학교 행정학과 졸업",
			"(전)광주광역시장",
			"(전)국회의원 3선",
		],
		electionTerm: 19,
	},
	{
		id: "6",
		name: "한승우",
		party: "ppp",
		partyName: "국민의힘",
		region: "대구광역시",
		electionInfo: "제 19대 대통령선거",
		careers: [
			"서울대학교 경제학과 졸업",
			"(전)기획재정부 장관",
		],
		electionTerm: 19,
	},
	{
		id: "7",
		name: "오세림",
		party: "other",
		partyName: "무소속",
		region: "제주특별자치도",
		electionInfo: "제 19대 대통령선거",
		careers: [
			"한국외국어대학교 법학과 졸업",
			"(전)헌법재판관",
			"(전)법무법인 대표",
		],
		electionTerm: 19,
	},
	{
		id: "8",
		name: "윤지현",
		party: "dpk",
		partyName: "더불어민주당",
		region: "인천광역시",
		electionInfo: "제 18대 대통령선거",
		careers: [
			"성균관대학교 정치학과 졸업",
			"(전)인천광역시장",
		],
		electionTerm: 18,
	},
	{
		id: "9",
		name: "강도현",
		party: "ppp",
		partyName: "국민의힘",
		region: "울산광역시",
		electionInfo: "제 18대 대통령선거",
		careers: [
			"서울대학교 공과대학 졸업",
			"(전)산업통상자원부 장관",
			"(전)울산광역시 교육감",
		],
		electionTerm: 18,
	},
	{
		id: "10",
		name: "송미래",
		party: "justice",
		partyName: "정의당",
		region: "세종특별자치시",
		electionInfo: "제 18대 대통령선거",
		careers: [
			"중앙대학교 사회복지학과 졸업",
			"(전)정의당 원내대표",
		],
		electionTerm: 18,
	},
]
