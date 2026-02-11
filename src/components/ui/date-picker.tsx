import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

// ── Types ──

interface DatePickerSingleProps {
	mode: "single";
	value?: Date | null;
	onChange?: (date: Date | null) => void;
}

interface DatePickerRangeProps {
	mode: "range";
	startDate?: Date | null;
	endDate?: Date | null;
	onChange?: (startDate: Date | null, endDate: Date | null) => void;
}

interface DatePickerCommonProps {
	className?: string;
	/** 오늘 날짜 하이라이트 — 사용자가 날짜 선택 전까지 오늘을 검정 원형으로 표시 (default: true) */
	showToday?: boolean;
	minDate?: Date;
	maxDate?: Date;
}

type DatePickerProps = DatePickerCommonProps &
	(DatePickerSingleProps | DatePickerRangeProps);

// ── Helpers ──

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

function startOfDay(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateForDisplay(date: Date): string {
	const yy = String(date.getFullYear()).slice(2);
	const mm = String(date.getMonth() + 1).padStart(2, "0");
	const dd = String(date.getDate()).padStart(2, "0");
	const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
	const dayName = dayNames[date.getDay()];
	return `${yy}.${mm}.${dd}(${dayName})`;
}

/** 해당 월의 달력 그리드(6주 × 7일)를 Date 배열로 생성. 월요일 시작. */
function getCalendarWeeks(year: number, month: number): Date[][] {
	const firstDay = new Date(year, month, 1);
	// 월요일=0, 화=1, ..., 일=6
	const startDayOfWeek = (firstDay.getDay() + 6) % 7;

	const startDate = new Date(year, month, 1 - startDayOfWeek);

	const weeks: Date[][] = [];
	const cursor = new Date(startDate);

	for (let w = 0; w < 6; w++) {
		const week: Date[] = [];
		for (let d = 0; d < 7; d++) {
			week.push(new Date(cursor));
			cursor.setDate(cursor.getDate() + 1);
		}
		weeks.push(week);
	}

	// 마지막 주가 전부 다음 달이면 제거
	const lastWeek = weeks[weeks.length - 1];
	if (lastWeek[0].getMonth() !== month) {
		weeks.pop();
	}

	return weeks;
}

// ── DateCell ──

interface DateCellProps {
	date: Date;
	isSelected: boolean;
	isRangeStart: boolean;
	isRangeEnd: boolean;
	isInRange: boolean;
	isOtherMonth: boolean;
	isSunday: boolean;
	isToday: boolean;
	isDisabled: boolean;
	onClick: () => void;
}

function DateCell({
	date,
	isSelected,
	isRangeStart,
	isRangeEnd,
	isInRange,
	isOtherMonth,
	isSunday,
	isToday,
	isDisabled,
	onClick,
}: DateCellProps) {
	const showSelectedCircle = isSelected || isToday;

	return (
		<button
			type="button"
			className={cn(
				"relative flex h-[44px] flex-1 items-center justify-center",
				isDisabled && "pointer-events-none",
			)}
			onClick={onClick}
			disabled={isDisabled}
		>
			{/* Layer 1: 범위 배경 */}
			{isInRange && (
				<div
					className={cn(
						"absolute inset-y-[2px] left-0 right-0",
						isRangeStart && "left-1/2",
						isRangeEnd && "right-1/2",
					)}
				>
					<div
						className={cn(
							"h-full bg-surface-secondary",
							isRangeStart && "rounded-l-full",
							isRangeEnd && "rounded-r-full",
							!isRangeStart && !isRangeEnd && "rounded-none",
						)}
					/>
				</div>
			)}

			{/* Layer 2: 선택 원형 */}
			{showSelectedCircle && (
				<div className="absolute inset-[2px] rounded-full bg-surface-inverse" />
			)}

			{/* Layer 3: 텍스트 */}
			<span
				className={cn(
					"relative z-10 text-[16px] font-medium leading-normal",
					// 기본: label-strong
					"text-label-strong",
					// 이전/다음 달
					isOtherMonth && "text-label-disabled",
					// 일요일 (선택되지 않았을 때만)
					isSunday && !isOtherMonth && !showSelectedCircle && "text-status-negative",
					// 선택됨 or 오늘
					showSelectedCircle && "text-label-inverse",
				)}
			>
				{date.getDate()}
			</span>
		</button>
	);
}

// ── DatePicker ──

function DatePicker(props: DatePickerProps) {
	const { className, showToday = true, minDate, maxDate } = props;
	const mode = props.mode;

	const today = React.useMemo(() => startOfDay(new Date()), []);

	// ── Controlled / Uncontrolled 지원 (TextField 패턴) ──
	// single 모드
	const singleControlled =
		mode === "single" && (props as DatePickerSingleProps).value !== undefined;
	const [internalSingleValue, setInternalSingleValue] =
		React.useState<Date | null>(null);
	const currentSingleValue = singleControlled
		? ((props as DatePickerSingleProps).value ?? null)
		: internalSingleValue;

	// range 모드
	const rangeControlled =
		mode === "range" &&
		(props as DatePickerRangeProps).startDate !== undefined;
	const [internalStartDate, setInternalStartDate] =
		React.useState<Date | null>(null);
	const [internalEndDate, setInternalEndDate] = React.useState<Date | null>(
		null,
	);
	const currentStartDate = rangeControlled
		? ((props as DatePickerRangeProps).startDate ?? null)
		: internalStartDate;
	const currentEndDate = rangeControlled
		? ((props as DatePickerRangeProps).endDate ?? null)
		: internalEndDate;

	// 초기 표시 월 결정
	const initialDate = React.useMemo(() => {
		if (mode === "single" && currentSingleValue) return currentSingleValue;
		if (mode === "range" && currentStartDate) return currentStartDate;
		return today;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const [displayYear, setDisplayYear] = React.useState(
		initialDate.getFullYear(),
	);
	const [displayMonth, setDisplayMonth] = React.useState(
		initialDate.getMonth(),
	);

	// range 모드: 선택 단계 추적 (false = 다음 클릭이 startDate, true = 다음 클릭이 endDate)
	const [isSelectingEnd, setIsSelectingEnd] = React.useState(false);

	const goToPrevMonth = () => {
		if (displayMonth === 0) {
			setDisplayYear((y) => y - 1);
			setDisplayMonth(11);
		} else {
			setDisplayMonth((m) => m - 1);
		}
	};

	const goToNextMonth = () => {
		if (displayMonth === 11) {
			setDisplayYear((y) => y + 1);
			setDisplayMonth(0);
		} else {
			setDisplayMonth((m) => m + 1);
		}
	};

	const weeks = React.useMemo(
		() => getCalendarWeeks(displayYear, displayMonth),
		[displayYear, displayMonth],
	);

	// 날짜 클릭 핸들러
	const handleDateClick = (date: Date) => {
		const clickedDate = startOfDay(date);
		const isOtherMonth = date.getMonth() !== displayMonth;

		// 이전/다음 달 클릭 시 해당 달로 이동
		if (isOtherMonth) {
			setDisplayYear(date.getFullYear());
			setDisplayMonth(date.getMonth());
		}

		if (mode === "single") {
			if (!singleControlled) {
				setInternalSingleValue(clickedDate);
			}
			(props as DatePickerSingleProps).onChange?.(clickedDate);
		} else {
			const effectiveStart = currentStartDate;

			if (!isSelectingEnd || !effectiveStart) {
				// 첫 번째 클릭: startDate 설정
				if (!rangeControlled) {
					setInternalStartDate(clickedDate);
					setInternalEndDate(null);
				}
				(props as DatePickerRangeProps).onChange?.(clickedDate, null);
				setIsSelectingEnd(true);
			} else {
				// 두 번째 클릭: endDate 설정
				const start = startOfDay(effectiveStart);

				if (isSameDay(clickedDate, start)) {
					// 같은 날 다시 클릭 → 리셋
					if (!rangeControlled) {
						setInternalStartDate(null);
						setInternalEndDate(null);
					}
					(props as DatePickerRangeProps).onChange?.(null, null);
					setIsSelectingEnd(false);
				} else if (clickedDate > start) {
					if (!rangeControlled) {
						setInternalStartDate(start);
						setInternalEndDate(clickedDate);
					}
					(props as DatePickerRangeProps).onChange?.(start, clickedDate);
					setIsSelectingEnd(false);
				} else {
					// 클릭 날짜가 startDate보다 이전 → swap
					if (!rangeControlled) {
						setInternalStartDate(clickedDate);
						setInternalEndDate(start);
					}
					(props as DatePickerRangeProps).onChange?.(clickedDate, start);
					setIsSelectingEnd(false);
				}
			}
		}
	};

	// 셀 상태 계산 헬퍼
	const getCellState = (date: Date) => {
		const d = startOfDay(date);
		const isOtherMonth = date.getMonth() !== displayMonth;
		const isSunday = date.getDay() === 0;
		const isTodayDate = isSameDay(d, today);
		const isDisabled =
			(minDate && d < startOfDay(minDate)) ||
			(maxDate && d > startOfDay(maxDate)) ||
			false;

		let isSelected = false;
		let isRangeStart = false;
		let isRangeEnd = false;
		let isInRange = false;

		if (mode === "single") {
			if (currentSingleValue) {
				isSelected = isSameDay(d, startOfDay(currentSingleValue));
			}
		} else {
			const start = currentStartDate ? startOfDay(currentStartDate) : null;
			const end = currentEndDate ? startOfDay(currentEndDate) : null;

			if (start) isRangeStart = isSameDay(d, start);
			if (end) isRangeEnd = isSameDay(d, end);
			isSelected = isRangeStart || isRangeEnd;

			if (start && end) {
				isInRange = d >= start && d <= end;
			}
		}

		// showToday: single 모드에서 사용자가 아직 날짜를 선택하지 않았을 때만
		const showTodayHighlight =
			showToday && isTodayDate && mode === "single" && !currentSingleValue;

		return {
			isSelected,
			isRangeStart,
			isRangeEnd,
			isInRange,
			isOtherMonth,
			isSunday,
			isToday: showTodayHighlight,
			isDisabled,
		};
	};

	// Bottom 영역 (range 모드)
	const rangeStartDate = mode === "range" ? currentStartDate : null;
	const rangeEndDate = mode === "range" ? currentEndDate : null;

	return (
		<div
			className={cn("flex w-[349px] flex-col items-center gap-5", className)}
		>
			{/* Wrapper */}
			<div className="flex w-full flex-col gap-0.5">
				{/* Header */}
				<div className="flex items-center justify-between">
					<button
						type="button"
						className="flex items-center px-2.5"
						onClick={goToPrevMonth}
						aria-label="이전 달"
					>
						<ChevronLeft className="size-6 text-label-strong" />
					</button>
					<div className="flex h-12 items-center gap-2 px-2 text-[20px] font-bold leading-[1.4] text-label-strong">
						<span>{displayYear}</span>
						<span>{displayMonth + 1}</span>
					</div>
					<button
						type="button"
						className="flex items-center px-2.5"
						onClick={goToNextMonth}
						aria-label="다음 달"
					>
						<ChevronRight className="size-6 text-label-strong" />
					</button>
				</div>

				{/* Calendar */}
				<div className="flex flex-col">
					{/* 요일 라벨 */}
					<div className="flex">
						{DAY_LABELS.map((day) => (
							<div
								key={day}
								className="flex size-[44px] flex-1 items-center justify-center"
							>
								<span
									className={cn(
										"text-[14px] font-medium leading-normal text-label-strong",
										day === "일" && "text-status-negative",
									)}
								>
									{day}
								</span>
							</div>
						))}
					</div>

					{/* 날짜 그리드 */}
					<div className="flex flex-col gap-0.5">
						{weeks.map((week, weekIdx) => (
							<div key={weekIdx} className="flex">
								{week.map((date) => {
									const state = getCellState(date);
									return (
										<DateCell
											key={date.toISOString()}
											date={date}
											{...state}
											onClick={() => handleDateClick(date)}
										/>
									);
								})}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Bottom (range 모드 전용) */}
			{mode === "range" && (
				<div className="flex w-full items-center gap-4">
					<div className="flex flex-1 flex-col gap-1">
						<span className="text-[12px] font-medium leading-[1.3] text-label-alternative">
							시작하는 날
						</span>
						<span
							className={cn(
								"text-[16px] font-bold leading-[1.4]",
								rangeStartDate ? "text-label-strong" : "text-label-alternative",
							)}
						>
							{rangeStartDate
								? formatDateForDisplay(rangeStartDate)
								: "날짜를 선택하세요"}
						</span>
					</div>
					<div className="flex flex-1 flex-col gap-1">
						<span className="text-[12px] font-medium leading-[1.3] text-label-alternative">
							끝나는 날
						</span>
						<span
							className={cn(
								"text-[16px] font-bold leading-[1.4]",
								rangeEndDate ? "text-label-strong" : "text-label-alternative",
							)}
						>
							{rangeEndDate
								? formatDateForDisplay(rangeEndDate)
								: "날짜를 선택하세요"}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}

export { DatePicker };
export type { DatePickerProps };
