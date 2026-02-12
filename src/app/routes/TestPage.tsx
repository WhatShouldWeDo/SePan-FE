import { useState } from "react"
import { toast } from "@/lib/toast/toast"
import { Toast } from "@/components/ui/toast"
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
