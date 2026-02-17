import { useState } from "react"
import { CategoryNav } from "@/components/ui/category-nav"
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories"

export function CategoryNavSection() {
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>()

	return (
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
	)
}
