import { toast } from "@/lib/toast/toast"
import { Banner } from "@/components/ui/banner"

export function BannerSection() {
	return (
		<>
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner Variants (정적)</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner>인포배너 메시지입니다</Banner>
					<Banner variant="notice">인포배너 메시지입니다</Banner>
					<Banner variant="warning">인포배너 메시지입니다</Banner>
					<Banner variant="error">인포배너 메시지입니다</Banner>
					<Banner variant="success">인포배너 메시지입니다</Banner>
				</div>
			</section>

			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner + Trailing Action</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-label-neutral"
								onClick={() => toast.info("Info 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="notice"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-primary"
								onClick={() => toast.info("Notice 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="warning"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-cautionary"
								onClick={() => toast.info("Warning 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="error"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-negative"
								onClick={() => toast.info("Error 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="success"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-positive"
								onClick={() => toast.info("Success 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
				</div>
			</section>

			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner (아이콘 없음)</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner icon={false}>아이콘 없는 인포배너</Banner>
					<Banner variant="error" icon={false}>아이콘 없는 에러 배너</Banner>
				</div>
			</section>
		</>
	)
}
