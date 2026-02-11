import { toast } from "@/lib/toast/toast"
import { Toast } from "@/components/ui/toast"

const TestPage = () => {
	return (
		<div className="flex flex-col gap-8 p-8">
			{/* 정적 프레젠테이셔널 Toast 미리보기 */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Toast Variants (정적)</h2>
				<div className="flex flex-col gap-3 max-w-sm">
					<Toast variant="info">정보 토스트 메시지입니다.</Toast>
					<Toast variant="error">에러 토스트 메시지입니다.</Toast>
					<Toast variant="success">성공 토스트 메시지입니다.</Toast>
				</div>
			</section>

			{/* 명령형 Toast API 테스트 (애니메이션 + auto-dismiss + 스태킹) */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">
					Toast 알림 테스트 (애니메이션 · auto-dismiss · 스태킹)
				</h2>
				<div className="flex gap-3">
					<button
						type="button"
						className="rounded-lg bg-toast-info-bg px-4 py-2 text-label-3 font-semibold"
						onClick={() => toast.info("정보 토스트 메시지입니다.")}
					>
						Info
					</button>
					<button
						type="button"
						className="rounded-lg bg-status-negative-bg px-4 py-2 text-label-3 font-semibold"
						onClick={() => toast.error("에러 토스트 메시지입니다.")}
					>
						Error
					</button>
					<button
						type="button"
						className="rounded-lg bg-status-positive-bg px-4 py-2 text-label-3 font-semibold"
						onClick={() => toast.success("성공 토스트 메시지입니다.")}
					>
						Success
					</button>
				</div>
			</section>
		</div>
	)
}

export default TestPage
