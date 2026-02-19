import { cn } from "@/lib/utils";

interface WeekStripProps {
	currentDate: Date;
	selectedDate?: Date;
	onDateSelect?: (date: Date) => void;
}

const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"] as const;

function getMonday(date: Date): Date {
	const d = new Date(date);
	const day = d.getDay();
	// getDay(): 0=Sun, 1=Mon, ... 6=Sat → 월요일 시작으로 보정
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	d.setHours(0, 0, 0, 0);
	return d;
}

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getFullYear() === b.getFullYear() &&
		a.getMonth() === b.getMonth() &&
		a.getDate() === b.getDate()
	);
}

export function WeekStrip({
	currentDate,
	selectedDate,
	onDateSelect,
}: WeekStripProps) {
	const monday = getMonday(currentDate);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const weekDates = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(monday);
		d.setDate(monday.getDate() + i);
		return d;
	});

	return (
		<div className="flex flex-col gap-2">
			{/* 요일 헤더 */}
			<div className="grid grid-cols-7 text-center">
				{DAY_LABELS.map((label, i) => (
					<span
						key={label}
						className={cn(
							"text-caption-2 font-medium leading-[1.3]",
							i === 6
								? "text-status-negative"
								: "text-label-alternative",
						)}
					>
						{label}
					</span>
				))}
			</div>

			{/* 날짜 행 */}
			<div className="grid grid-cols-7 text-center">
				{weekDates.map((date) => {
					const isToday = isSameDay(date, today);
					const isSelected =
						selectedDate && isSameDay(date, selectedDate);
					const isSunday = date.getDay() === 0;

					return (
						<button
							key={date.toISOString()}
							type="button"
							onClick={() => onDateSelect?.(date)}
							className={cn(
								"mx-auto flex size-9 items-center justify-center rounded-full text-body-3 font-medium leading-[1.5] transition-colors",
								isToday &&
									"bg-surface-inverse text-white font-semibold",
								isSelected &&
									!isToday &&
									"bg-primary/10 text-primary font-semibold",
								!isToday &&
									!isSelected &&
									isSunday &&
									"text-status-negative",
								!isToday &&
									!isSelected &&
									!isSunday &&
									"text-label-normal hover:bg-fill-normal",
							)}
						>
							{date.getDate()}
						</button>
					);
				})}
			</div>
		</div>
	);
}
