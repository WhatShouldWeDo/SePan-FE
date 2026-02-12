import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import type {
	CategoryItem,
	SubcategoryItem,
} from "@/features/region/data/categories";

/* ─── Types ─── */

interface CategoryNavProps {
	categories: CategoryItem[];
	subcategories: Record<string, SubcategoryItem[]>;
	selectedCategoryId?: string;
	selectedSubcategoryId?: string;
	onCategorySelect?: (categoryId: string) => void;
	onSubcategorySelect?: (
		subcategoryId: string,
		categoryId: string,
	) => void;
	className?: string;
}

interface CategoryNavItemProps {
	category: CategoryItem;
	isSelected: boolean;
	onPointerEnter: () => void;
	onClick: () => void;
}

interface SubcategoryPanelProps {
	items: SubcategoryItem[];
	selectedId?: string;
	onSelect: (item: SubcategoryItem) => void;
}

/* ─── CategoryNavItem ─── */

function CategoryNavItem({
	category,
	isSelected,
	onPointerEnter,
	onClick,
}: CategoryNavItemProps) {
	return (
		<button
			type="button"
			className={cn(
				"group/item relative flex w-[108px] shrink-0 flex-col items-center rounded-[20px] pb-2 pt-1",
				"cursor-pointer outline-none",
			)}
			onPointerEnter={onPointerEnter}
			onClick={onClick}
		>
			{/* Interaction overlay */}
			<div
				className={cn(
					"pointer-events-none absolute inset-0 rounded-[20px] bg-label-alternative transition-opacity",
					isSelected
						? "opacity-[0.12]"
						: "opacity-0 group-hover/item:opacity-[0.05]",
				)}
			/>

			{/* Icon — 컬러 원형 + 이니셜 (에셋 확보 전 폴백) */}
			<div
				className="flex size-[72px] shrink-0 items-center justify-center rounded-[18px]"
				style={{ backgroundColor: `${category.iconColor}20` }}
			>
				<div
					className="flex size-[48px] items-center justify-center rounded-full text-[20px] font-bold text-white"
					style={{ backgroundColor: category.iconColor }}
				>
					{category.label.charAt(0)}
				</div>
			</div>

			{/* Label */}
			<span
				className={cn(
					"text-label-2 font-semibold leading-[1.3] transition-colors",
					isSelected ? "text-label-strong" : "text-label-alternative",
				)}
			>
				{category.label}
			</span>
		</button>
	);
}

/* ─── SubcategoryPanel ─── */

function SubcategoryPanel({
	items,
	selectedId,
	onSelect,
}: SubcategoryPanelProps) {
	if (items.length === 0) return null;

	return (
		<div
			className="mt-3 rounded-[24px] border border-line-neutral bg-background px-8 py-4"
			style={{ boxShadow: "var(--shadow-overlay-panel)" }}
		>
			<div className="flex flex-wrap gap-5">
				{items.map((item) => (
					<button
						key={item.id}
						type="button"
						className={cn(
							"group/sub relative flex w-[220px] items-center gap-2 rounded-[12px] py-3 outline-none",
							"cursor-pointer",
						)}
						onClick={() => onSelect(item)}
					>
						{/* Interaction overlay — selected와 hover 동일 크기(inset-x -8px) */}
						<div
							className={cn(
								"pointer-events-none absolute inset-x-[-8px] inset-y-0 rounded-[12px] transition-opacity",
								selectedId === item.id
									? "bg-fill-normal opacity-100"
									: "bg-label-alternative opacity-0 group-hover/sub:opacity-[0.05]",
							)}
						/>

						{/* Subcategory icon */}
						<div className="relative z-10 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-surface-secondary">
							<svg
								className="size-5 opacity-[0.74]"
								viewBox="0 0 20 20"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect
									x="3"
									y="3"
									width="14"
									height="14"
									rx="3"
									stroke="currentColor"
									strokeWidth="1.5"
									className="text-label-alternative"
								/>
							</svg>
						</div>

						{/* Label */}
						<span className="relative z-10 min-h-6 flex-1 text-left text-label-3 font-semibold leading-[1.3] text-label-normal">
							{item.label}
						</span>
					</button>
				))}
			</div>
		</div>
	);
}

/* ─── CategoryNav ─── */

function CategoryNav({
	categories,
	subcategories,
	selectedCategoryId,
	selectedSubcategoryId,
	onCategorySelect,
	onSubcategorySelect,
	className,
}: CategoryNavProps) {
	const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(
		null,
	);

	const handlePointerLeave = useCallback(() => {
		setHoveredCategoryId(null);
	}, []);

	// hover 우선, 없으면 selected 패널, 둘 다 없으면 숨김
	const activePanelCategoryId = hoveredCategoryId ?? selectedCategoryId ?? null;
	const activePanelItems = activePanelCategoryId
		? subcategories[activePanelCategoryId]
		: undefined;

	return (
		<div className={cn("relative", className)} onPointerLeave={handlePointerLeave}>
			{/* 카테고리 아이콘 행 */}
			<div className="flex items-center gap-3">
				{categories.map((cat) => (
					<CategoryNavItem
						key={cat.id}
						category={cat}
						isSelected={selectedCategoryId === cat.id}
						onPointerEnter={() => setHoveredCategoryId(cat.id)}
						onClick={() => onCategorySelect?.(selectedCategoryId === cat.id ? "" : cat.id)}
					/>
				))}
			</div>

			{/* 서브카테고리 패널 */}
			{activePanelCategoryId && activePanelItems && (
				<SubcategoryPanel
					items={activePanelItems}
					selectedId={selectedSubcategoryId}
					onSelect={(item) =>
						onSubcategorySelect?.(item.id, item.categoryId)
					}
				/>
			)}
		</div>
	);
}

export { CategoryNav, CategoryNavItem, SubcategoryPanel };
export type { CategoryNavProps, SubcategoryPanelProps };
