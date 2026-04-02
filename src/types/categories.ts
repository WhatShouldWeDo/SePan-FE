/** 카테고리 아이템 타입 - 여러 feature에서 공유 */
export interface CategoryItem {
	id: string;
	label: string;
	iconColor: string;
	/** CSS mask-image용 아이콘 에셋 경로 (PNG) */
	iconAsset?: string;
}

/** 서브카테고리 아이템 타입 */
export interface SubcategoryItem {
	id: string;
	label: string;
	categoryId: string;
}
