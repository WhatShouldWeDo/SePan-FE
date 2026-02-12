import { useState } from "react"
import { toast } from "@/lib/toast/toast"
import { Toast } from "@/components/ui/toast"
import { Banner } from "@/components/ui/banner"
import { CategoryNav } from "@/components/ui/category-nav"
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories"

const TestPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>()

	return (
		<div className="flex flex-col gap-8 p-8">
			{/* CategoryNav 테스트 */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">CategoryNav</h2>
				<CategoryNav
					categories={CATEGORIES}
					subcategories={SUBCATEGORIES}
					selectedCategoryId={selectedCategory}
					selectedSubcategoryId={selectedSubcategory}
					onCategorySelect={setSelectedCategory}
					onSubcategorySelect={(subId, catId) => {
						setSelectedCategory(catId)
						setSelectedSubcategory(subId)
					}}
				/>
				<p className="mt-4 text-label-4 text-label-alternative">
					선택: 카테고리={selectedCategory ?? "없음"} / 서브카테고리={selectedSubcategory ?? "없음"}
				</p>
			</section>

			{/* Banner Variants (정적) */}
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

			{/* Banner + Trailing Action */}
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

			{/* Banner 아이콘 없음 */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner (아이콘 없음)</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner icon={false}>아이콘 없는 인포배너</Banner>
					<Banner variant="error" icon={false}>아이콘 없는 에러 배너</Banner>
				</div>
			</section>

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
