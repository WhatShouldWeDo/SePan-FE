import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DuoWallet } from "@/components/icons";
import type { CategoryItem, SubcategoryItem } from "@/types/categories";

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

			{/* Icon — CSS mask-luminance로 Figma 에셋 표현, 에셋 없으면 이니셜 폴백 */}
			{category.iconAsset ? (
				<div className="relative size-[50px] shrink-0 overflow-clip rounded-[14px]">
					<div
						className="absolute inset-0"
						style={{
							backgroundColor: category.iconColor,
							maskImage: `url('${category.iconAsset}')`,
							maskMode: "luminance",
							maskSize: "39px 39px",
							maskPosition: "5.5px 5.5px",
							maskRepeat: "no-repeat",
							WebkitMaskImage: `url('${category.iconAsset}')`,
							WebkitMaskSize: "39px 39px",
							WebkitMaskPosition: "5.5px 5.5px",
							WebkitMaskRepeat: "no-repeat",
						}}
					/>
				</div>
			) : (
				<div
					className="flex size-[50px] shrink-0 items-center justify-center rounded-[14px]"
					style={{ backgroundColor: `${category.iconColor}20` }}
				>
					<div
						className="flex size-[34px] items-center justify-center rounded-full text-[14px] font-bold text-white"
						style={{ backgroundColor: category.iconColor }}
					>
						{category.label.charAt(0)}
					</div>
				</div>
			)}

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
			className="absolute left-0 right-0 top-full z-20 rounded-[24px] border border-line-neutral bg-background px-8 py-4"
			style={{ boxShadow: "0px 2px 8px 0px rgba(20, 40, 113, 0.06)" }}
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
						{/* Interaction overlay */}
						<div
							className={cn(
								"pointer-events-none absolute inset-x-[-8px] inset-y-0 rounded-[12px] transition-opacity",
								selectedId === item.id
									? "bg-fill-normal opacity-100"
									: "bg-label-alternative opacity-0 group-hover/sub:opacity-[0.05]",
							)}
						/>

						{/* DuoWallet 아이콘 */}
						<div className="relative z-10 flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-surface-secondary">
							<DuoWallet className="size-5 text-primary opacity-[0.74]" />
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

	// 스크롤 시 서브카테고리 패널 닫기 (GNB 패널 슬라이드와 동기화)
	useEffect(() => {
		function handleScroll() {
			setHoveredCategoryId(null);
		}
		window.addEventListener("scroll", handleScroll, { passive: true });
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handlePointerLeave = useCallback(() => {
		setHoveredCategoryId(null);
	}, []);

	// mouseleave 시 무조건 숨김 — hover 중일 때만 패널 표시
	const activePanelCategoryId = hoveredCategoryId;
	const activePanelItems = activePanelCategoryId
		? subcategories[activePanelCategoryId]
		: undefined;

	return (
		<div className={cn("relative pb-2", className)} onPointerLeave={handlePointerLeave}>
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
