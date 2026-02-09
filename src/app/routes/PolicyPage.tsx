import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PolicyStatusBadge } from "@/components/PolicyStatusBadge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function PolicyPage() {
	return (
		<div className="container py-6">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">정책개발</h1>
				<p className="text-muted-foreground mt-2">
					우리 지역에 필요한 공약을 개발하고 관리하세요
				</p>
			</div>

			<Tabs defaultValue="overview" className="w-full">
				{/* 탭 목록 (모바일 가로 스크롤) */}
				<div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0 no-scrollbar">
					<TabsList variant="line" className="w-fit justify-start">
						<TabsTrigger value="overview" className="min-w-[120px]">
							개요
						</TabsTrigger>
						<TabsTrigger value="history" className="min-w-[120px]">
							역대공약분석
						</TabsTrigger>
						<TabsTrigger value="confirmed" className="min-w-[120px]">
							확정공약
						</TabsTrigger>
						<TabsTrigger value="ai" className="min-w-[120px]">
							AI 추천
						</TabsTrigger>
					</TabsList>
				</div>

				{/* 탭 내용 */}
				<TabsContent value="overview" className="mt-6">
					<div className="text-center py-12 text-muted-foreground">
						개요 탭 (준비 중)
					</div>
				</TabsContent>

				<TabsContent value="history" className="mt-6">
					<div className="text-center py-12 text-muted-foreground">
						역대공약분석 탭 (준비 중)
					</div>
				</TabsContent>

				<TabsContent value="confirmed" className="mt-6">
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{/* 목업 공약 카드 1 */}
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-lg">교통 체증 완화 프로젝트</CardTitle>
									<PolicyStatusBadge status="confirmed" />
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									주요 도로 신호 체계 개선 및 우회 도로 신설
								</p>
							</CardContent>
						</Card>

						{/* 목업 공약 카드 2 */}
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-lg">환경 보호 종합 대책</CardTitle>
									<PolicyStatusBadge status="draft" />
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									지역 내 녹지 공간 확충 및 친환경 교통 인프라 구축
								</p>
							</CardContent>
						</Card>

						{/* 목업 공약 카드 3 */}
						<Card>
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<CardTitle className="text-lg">청년 일자리 지원</CardTitle>
									<PolicyStatusBadge status="published" />
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									청년 창업 지원 센터 설립 및 취업 지원 프로그램 확대
								</p>
							</CardContent>
						</Card>
					</div>
				</TabsContent>

				<TabsContent value="ai" className="mt-6">
					<div className="text-center py-12 text-muted-foreground">
						AI 추천 탭 (준비 중)
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
