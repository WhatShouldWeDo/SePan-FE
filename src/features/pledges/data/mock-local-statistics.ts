import type { PledgeKeywordStat } from "./mock-candidate-detail"
import type { Party } from "./mock-candidates"

/* ─── Types ─── */

export interface PledgeInsightItem {
	iconName: string
	iconBgColor: string
	label: string
	value: string
	trailing:
		| { type: "badge"; text: string; className?: string }
		| { type: "delta"; label: string; value: string; isPositive: boolean }
}

export interface PledgeInsightData {
	bannerMessage: string
	bannerActionLabel: string
	bannerActionUrl?: string
	items: PledgeInsightItem[]
}

export interface MetricItem {
	label: string
	value: string
	trailing:
		| { type: "badge"; text: string; className?: string }
		| { type: "delta"; label: string; value: string; isPositive: boolean }
}

export interface MetricInsightItem {
	iconName: string
	iconBgColor: string
	label: string
	value: string
	trailingText: string
	trailingColor: string
}

export interface PledgeMetricsData {
	title: string
	description: string
	metrics: MetricItem[]
	insights: MetricInsightItem[]
}

export interface PartyPledgeData {
	partyName: string
	partyId: Party
	partyColor: string
	fulfillmentTime: number
}

export interface LocalElectionStatisticsData {
	categoryDistribution: PledgeKeywordStat[]
	pledgeInsight: PledgeInsightData
	pledgeMetrics: PledgeMetricsData
	partyComparison: PartyPledgeData[]
}

/* ─── Mock Data ─── */

export const MOCK_LOCAL_STATISTICS: LocalElectionStatisticsData = {
	categoryDistribution: [
		{ keyword: "복지·분배", percentage: 53.7, color: "#6B5CFF" },
		{ keyword: "교통", percentage: 28.1, color: "rgba(107, 92, 255, 0.5)" },
		{
			keyword: "주거·부동산",
			percentage: 18.2,
			color: "rgba(107, 92, 255, 0.2)",
		},
	],

	pledgeInsight: {
		bannerMessage: "내 선거구에 새로운 민원 295개가 추가되었어요",
		bannerActionLabel: "보러가기",
		items: [
			{
				iconName: "message",
				iconBgColor: "bg-party-dpk",
				label: "최다 민원 지역",
				value: "삼성동",
				trailing: {
					type: "badge",
					text: "신규",
					className: "bg-status-positive text-white",
				},
			},
			{
				iconName: "warning",
				iconBgColor: "bg-status-cautionary",
				label: "주요 민원 유형",
				value: "교통혼잡",
				trailing: {
					type: "delta",
					label: "전년대비",
					value: "8.4%",
					isPositive: false,
				},
			},
			{
				iconName: "warning",
				iconBgColor: "bg-status-cautionary",
				label: "주요 민원 분류",
				value: "환경·소음",
				trailing: {
					type: "delta",
					label: "전년대비",
					value: "5.2%",
					isPositive: false,
				},
			},
			{
				iconName: "megaphone",
				iconBgColor: "bg-status-negative",
				label: "민원 증가율",
				value: "+14.5%",
				trailing: {
					type: "badge",
					text: "상승",
					className: "bg-status-negative/10 text-status-negative",
				},
			},
		],
	},

	pledgeMetrics: {
		title: "지역 공약 현황",
		description: "선택된 지역구의 공약 관련 주요 지표입니다",
		metrics: [
			{
				label: "총 공약 수",
				value: "735",
				trailing: {
					type: "badge",
					text: "+10.1%",
					className: "bg-party-dpk/10 text-party-dpk",
				},
			},
			{
				label: "평균 이행률",
				value: "21.5%",
				trailing: {
					type: "delta",
					label: "전년대비",
					value: "▲8.4%",
					isPositive: true,
				},
			},
			{
				label: "진행 중 공약",
				value: "735",
				trailing: {
					type: "badge",
					text: "+10.1%",
					className: "bg-party-dpk/10 text-party-dpk",
				},
			},
			{
				label: "미이행 비율",
				value: "21.5%",
				trailing: {
					type: "delta",
					label: "전년대비",
					value: "▲8.4%",
					isPositive: true,
				},
			},
		],
		insights: [
			{
				iconName: "message",
				iconBgColor: "bg-party-dpk",
				label: "가장 많이 다룬 분야",
				value: "복지·분배",
				trailingText: "29%",
				trailingColor: "text-party-dpk",
			},
			{
				iconName: "message",
				iconBgColor: "bg-party-dpk",
				label: "이행률이 가장 높은 분야",
				value: "교통",
				trailingText: "29%",
				trailingColor: "text-party-dpk",
			},
			{
				iconName: "message",
				iconBgColor: "bg-party-dpk",
				label: "미이행이 가장 많은 분야",
				value: "주거·부동산",
				trailingText: "29%",
				trailingColor: "text-party-dpk",
			},
		],
	},

	partyComparison: [
		{
			partyName: "더불어민주당",
			partyId: "dpk",
			partyColor: "#023b95",
			fulfillmentTime: 175,
		},
		{
			partyName: "국민의힘",
			partyId: "ppp",
			partyColor: "#e61e2b",
			fulfillmentTime: 395,
		},
		{
			partyName: "조국혁신당",
			partyId: "justice",
			partyColor: "#6B5CFF",
			fulfillmentTime: 155,
		},
		{
			partyName: "개혁신당",
			partyId: "reform",
			partyColor: "#f47925",
			fulfillmentTime: 250,
		},
		{
			partyName: "진보당",
			partyId: "other",
			partyColor: "#d90720",
			fulfillmentTime: 290,
		},
		{
			partyName: "그 외",
			partyId: "other",
			partyColor: "#9ca3af",
			fulfillmentTime: 330,
		},
	],
}
