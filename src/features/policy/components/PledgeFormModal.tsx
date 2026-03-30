import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, MapPin, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TextArea } from "@/components/ui/text-area";
import { TextField } from "@/components/ui/text-field";
import { CATEGORIES } from "@/features/region/data/categories";
import type { MyPledge, PledgeStatus } from "@/features/policy/data/mock-policy";
import {
	pledgeFormSchema,
	type PledgeFormData,
} from "@/features/policy/schemas/pledgeFormSchema";

/* ── 상수 ── */

const AVAILABLE_REGIONS = [
	"신사동",
	"논현1동",
	"논현2동",
	"압구정동",
	"청담동",
	"역삼1동",
	"역삼2동",
];

const STATUS_OPTIONS: { value: PledgeStatus; label: string }[] = [
	{ value: "drafting", label: "작성중" },
	{ value: "reviewing", label: "검토중" },
	{ value: "approved", label: "승인완료" },
	{ value: "confirmed", label: "확정됨" },
];

/** Figma 기준 짧은 라벨 ("유권자 분석" → "유권자") */
const CATEGORY_DISPLAY_LABELS: Record<string, string> = {
	voter: "유권자",
	economy: "경제",
	housing: "주거·부동산",
	safety: "사회안전",
	welfare: "복지·분배",
	transport: "교통",
	culture: "문화여가",
	aging: "저출산·고령화",
	education: "교육",
};

/* ── CategoryIcon ── */

function CategoryIcon({
	categoryId,
	size,
	color,
}: {
	categoryId: string;
	size: number;
	color?: string;
}) {
	const cat = CATEGORIES.find((c) => c.id === categoryId);
	if (!cat?.iconAsset) return null;
	return (
		<span
			className="inline-block shrink-0 rounded-full"
			style={{
				width: size,
				height: size,
				backgroundColor: color ?? cat.iconColor,
				maskImage: `url('${cat.iconAsset}')`,
				maskSize: `${size}px ${size}px`,
				maskRepeat: "no-repeat",
				maskPosition: "center",
				maskMode: "luminance",
				WebkitMaskImage: `url('${cat.iconAsset}')`,
				WebkitMaskSize: `${size}px ${size}px`,
				WebkitMaskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
			}}
		/>
	);
}

/* ── StatusDropdown ── */

function StatusDropdown({
	value,
	onChange,
}: {
	value: PledgeStatus;
	onChange: (status: PledgeStatus) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const currentLabel =
		STATUS_OPTIONS.find((o) => o.value === value)?.label ?? "작성중";

	// 외부 클릭 감지
	useEffect(() => {
		if (!isOpen) return;

		function handlePointerDown(e: PointerEvent) {
			if (
				containerRef.current &&
				!containerRef.current.contains(e.target as Node)
			) {
				setIsOpen(false);
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setIsOpen(false);
			}
		}

		document.addEventListener("pointerdown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen]);

	return (
		<div ref={containerRef} className="relative">
			<Chip
				label={currentLabel}
				size="large"
				state="default"
				variant="outlined"
				isOpen={isOpen}
				onClick={() => setIsOpen((prev) => !prev)}
			/>

			{isOpen && (
				<div className="absolute bottom-full left-0 mb-2 w-[320px] rounded-[16px] border border-line-alt bg-white py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
					<div className="flex flex-col gap-1 px-5 py-2">
						{STATUS_OPTIONS.map((option) => {
							const isSelected = option.value === value;
							return (
								<button
									key={option.value}
									type="button"
									className={cn(
										"flex w-full items-center justify-between py-3",
										isSelected
											? "text-primary"
											: "text-label-normal",
									)}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
								>
									<span className="text-[16px] font-semibold leading-[1.3]">
										{option.label}
									</span>
									{isSelected && (
										<Check className="size-5" aria-hidden="true" />
									)}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}

/* ── PledgeFormModal ── */

interface PledgeFormModalProps {
	open: boolean;
	onClose: () => void;
	/** null = 생성 모드, non-null = 수정 모드 */
	pledge: MyPledge | null;
	onSubmit: (data: PledgeFormData) => void;
	onSaveDraft: (data: PledgeFormData) => void;
}

function PledgeFormModal({
	open,
	onClose,
	pledge,
	onSubmit,
	onSaveDraft,
}: PledgeFormModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		getValues,
		reset,
		formState: { errors, isValid },
	} = useForm<PledgeFormData>({
		resolver: zodResolver(pledgeFormSchema),
		mode: "onChange",
	});

	// open 변경 시 폼 초기화
	useEffect(() => {
		if (!open) return;

		if (pledge) {
			reset({
				title: pledge.title,
				summary: pledge.summary,
				regions: pledge.regions,
				categoryIds: pledge.categoryIds,
				content: pledge.content,
				status: pledge.status,
			});
		} else {
			reset({
				title: "",
				summary: "",
				regions: [],
				categoryIds: [],
				content: "",
				status: "drafting",
			});
		}
	}, [open, pledge, reset]);

	/* Watched values */
	const watchedTitle = watch("title");
	const watchedSummary = watch("summary");
	const selectedRegions = watch("regions");
	const selectedCategoryIds = watch("categoryIds");
	const watchedStatus = watch("status");

	/* Toggle helpers */
	function toggleRegion(region: string) {
		const current = getValues("regions");
		const next = current.includes(region)
			? current.filter((r) => r !== region)
			: [...current, region];
		setValue("regions", next, { shouldValidate: true });
	}

	function toggleCategory(categoryId: string) {
		const current = getValues("categoryIds");
		const next = current.includes(categoryId)
			? current.filter((c) => c !== categoryId)
			: [...current, categoryId];
		setValue("categoryIds", next, { shouldValidate: true });
	}

	/* Draft handler */
	const handleDraft = () => {
		onSaveDraft(getValues() as PledgeFormData);
	};

	return (
		<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
			<DialogContent
				className="flex max-h-[85vh] flex-col gap-0 rounded-[20px] border-0 p-0 sm:max-w-2xl"
				showCloseButton={false}
				onInteractOutside={(e) => e.preventDefault()}
			>
				{/* ── Header (fixed top) ── */}
				<div className="px-8 pt-8 pb-2">
					<div className="flex items-start justify-between">
						<div className="flex flex-col gap-2">
							{/* 제목 */}
							<h2 className="text-heading-3 font-bold text-label-strong">
								{watchedTitle ||
									(pledge ? "공약 제목" : "새 공약 추가하기")}
							</h2>

							{/* 지역 뱃지 + 카테고리 서브칩 */}
							<div className="flex flex-wrap items-center gap-2">
								{selectedRegions?.length > 0 && (
									<span className="inline-flex items-center gap-1 rounded-[8px] bg-primary/8 px-2 py-[5px] text-label-4 font-semibold text-primary">
										<MapPin className="size-3.5" />
										{selectedRegions[0]}
									</span>
								)}

								{selectedCategoryIds?.map((catId) => (
									<span
										key={catId}
										className="inline-flex items-center gap-1 text-[14px] font-semibold text-label-alternative"
									>
										<CategoryIcon
											categoryId={catId}
											size={16}
										/>
										{CATEGORY_DISPLAY_LABELS[catId] ?? catId}
									</span>
								))}
							</div>
						</div>

						{/* 닫기 버튼 */}
						<button
							type="button"
							className="shrink-0 p-1"
							onClick={onClose}
							aria-label="닫기"
						>
							<X className="size-6 text-label-normal" />
						</button>
					</div>
				</div>

				{/* ── Scrollable form area ── */}
				<div className="flex-1 overflow-y-auto px-8 py-6">
					<form
						id="pledge-form"
						className="flex flex-col gap-8"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Field 1: 공약 제목 */}
						<div className="flex flex-col gap-1">
							<TextField
								label="공약 제목"
								required
								placeholder="텍스트를 입력해주세요."
								maxLength={60}
								status={errors.title ? "error" : "default"}
								helperText={errors.title?.message}
								{...register("title")}
							/>
							<p className="text-right text-[12px] font-medium text-label-alternative">
								{watchedTitle?.length ?? 0}/60
							</p>
						</div>

						{/* Field 2: 요약내용 */}
						<div className="flex flex-col gap-1">
							<TextField
								label="요약내용"
								required
								placeholder="텍스트를 입력해주세요."
								maxLength={200}
								status={errors.summary ? "error" : "default"}
								helperText={errors.summary?.message}
								{...register("summary")}
							/>
							<p className="text-right text-[12px] font-medium text-label-alternative">
								{watchedSummary?.length ?? 0}/200
							</p>
						</div>

						{/* Field 3: 지역선택 */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-0.5">
								<span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.07px] text-label-normal">
									지역선택
								</span>
								<span className="text-[14px] font-semibold leading-[1.3] text-status-negative">
									*
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{AVAILABLE_REGIONS.map((region) => {
									const isSelected =
										selectedRegions?.includes(region);
									return (
										<button
											key={region}
											type="button"
											className={cn(
												"w-[100px] rounded-[10px] border px-3 py-2.5 text-[14px] font-semibold transition-colors",
												isSelected
													? "border-primary/50 bg-primary text-white"
													: "border-line-neutral bg-white text-label-normal",
											)}
											onClick={() => toggleRegion(region)}
										>
											{region}
										</button>
									);
								})}
							</div>
							{errors.regions && (
								<p className="text-[12px] font-medium text-status-negative">
									{errors.regions.message}
								</p>
							)}
						</div>

						{/* Field 4: 카테고리 */}
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-0.5">
								<span className="text-[14px] font-semibold leading-[1.3] tracking-[-0.07px] text-label-normal">
									카테고리
								</span>
								<span className="text-[14px] font-semibold leading-[1.3] text-status-negative">
									*
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{CATEGORIES.map((cat) => {
									const isSelected =
										selectedCategoryIds?.includes(cat.id);
									return (
										<button
											key={cat.id}
											type="button"
											className={cn(
												"inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[14px] font-semibold transition-colors",
												isSelected
													? "border-transparent bg-primary text-white"
													: "border-line-neutral bg-white text-label-normal",
											)}
											onClick={() =>
												toggleCategory(cat.id)
											}
										>
											<CategoryIcon
												categoryId={cat.id}
												size={16}
												color={
													isSelected
														? "#ffffff"
														: undefined
												}
											/>
											{CATEGORY_DISPLAY_LABELS[cat.id] ??
												cat.label}
										</button>
									);
								})}
							</div>
							{errors.categoryIds && (
								<p className="text-[12px] font-medium text-status-negative">
									{errors.categoryIds.message}
								</p>
							)}
						</div>

						{/* Field 5: 상세내용 */}
						<TextArea
							label="상세내용"
							placeholder="메시지를 입력해주세요."
							maxLength={2000}
							rows={5}
							status={errors.content ? "error" : "default"}
							helperText={errors.content?.message}
							{...register("content")}
						/>
					</form>
				</div>

				{/* ── Footer action bar (fixed bottom) ── */}
				<div className="flex items-center justify-between border-t border-line-neutral px-8 py-4">
					{/* Left: 상태 드롭다운 */}
					<StatusDropdown
						value={watchedStatus ?? "drafting"}
						onChange={(status) =>
							setValue("status", status, { shouldValidate: true })
						}
					/>

					{/* Right: 임시저장 + 등록 */}
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							className="h-auto rounded-[12px] border-line-neutral px-7 py-[15px] text-label-2 font-semibold"
							onClick={handleDraft}
						>
							임시저장
						</Button>
						<button
							type="submit"
							form="pledge-form"
							disabled={!isValid}
							className={cn(
								"h-auto rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white",
								!isValid && "pointer-events-none opacity-40",
							)}
						>
							등록
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export { PledgeFormModal };
export type { PledgeFormModalProps };
