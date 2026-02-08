export function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">대시보드</h1>
      <p className="text-muted-foreground">
        캠프의 현재 상태를 한눈에 파악하세요
      </p>
      {/* TODO: 대시보드 컴포넌트들 추가 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 border rounded-lg">일정 배너</div>
        <div className="p-6 border rounded-lg">D-day</div>
        <div className="p-6 border rounded-lg">지역분석 요약</div>
        <div className="p-6 border rounded-lg">정책개발 요약</div>
        <div className="p-6 border rounded-lg">퀵메뉴</div>
      </div>
    </div>
  )
}
