import { useState } from "react";
import { SelectCell } from "@/components/ui/select-cell";
import { Checkbox, type CheckboxState } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Check } from "@/components/ui/check";
import { CheckMultiple } from "@/components/ui/check-multiple";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

export function SelectCellSection() {
	const [selected, setSelected] = useState<string | null>(null);
	const [checkboxStates, setCheckboxStates] = useState<CheckboxState[]>([
		"unchecked",
		"checked",
		"unchecked",
	]);
	const [radioValue, setRadioValue] = useState("opt1");
	const [switchOn, setSwitchOn] = useState(false);

	const toggleCheckbox = (index: number) => {
		setCheckboxStates((prev) => {
			const next = [...prev];
			next[index] = next[index] === "checked" ? "unchecked" : "checked";
			return next;
		});
	};

	return (
		<section>
			<h2 className="text-heading-3 font-bold mb-4">SelectCell</h2>

			<div className="flex flex-col gap-8">
				{/* 기본 사용 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						기본 (label만)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="텍스트" />
					</div>
				</div>

				{/* Typography 변형 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Typography — semibold / md
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="Semibold (기본)" typography="semibold" />
						<SelectCell label="Medium" typography="md" />
					</div>
				</div>

				{/* Padding 변형 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Padding — 12px / 8px
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="Padding 12px (기본)" padding="12px" />
						<SelectCell label="Padding 8px" padding="8px" />
					</div>
				</div>

				{/* FillWidth */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						FillWidth — true / false
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="FillWidth=true (기본)" fillWidth />
						<SelectCell
							label="FillWidth=false (px-20)"
							fillWidth={false}
						/>
					</div>
				</div>

				{/* Disabled */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Disabled
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="활성 상태" />
						<SelectCell label="비활성 상태" disabled />
					</div>
				</div>

				{/* Divider */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						hasDivider
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="항목 1" hasDivider />
						<SelectCell label="항목 2" hasDivider />
						<SelectCell label="항목 3 (구분선 없음)" />
					</div>
				</div>

				{/* Description */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Description — bottom / top
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell
							label="하단 설명"
							description="설명 텍스트 (bottom)"
							descriptionPosition="bottom"
						/>
						<SelectCell
							label="상단 설명"
							description="설명 텍스트 (top)"
							descriptionPosition="top"
						/>
					</div>
				</div>

				{/* LeadingContent — Checkbox 인터랙티브 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						LeadingContent — Checkbox (인터랙티브)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						{["항목 A", "항목 B", "항목 C"].map((label, i) => (
							<SelectCell
								key={label}
								label={label}
								hasDivider={i < 2}
								leadingContent={
									<Checkbox
										state={checkboxStates[i]}
										onStateChange={() => toggleCheckbox(i)}
									/>
								}
								onClick={() => toggleCheckbox(i)}
							/>
						))}
					</div>
				</div>

				{/* LeadingContent — Radio 인터랙티브 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						LeadingContent — Radio (인터랙티브)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						{["opt1", "opt2", "opt3"].map((opt, i) => (
							<SelectCell
								key={opt}
								label={`옵션 ${i + 1}`}
								hasDivider={i < 2}
								leadingContent={
									<Radio
										checked={radioValue === opt}
										onCheckedChange={() => setRadioValue(opt)}
									/>
								}
								onClick={() => setRadioValue(opt)}
							/>
						))}
					</div>
				</div>

				{/* LeadingContent — Check / CheckMultiple */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						LeadingContent — Check / CheckMultiple
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell
							label="Check (선택됨)"
							leadingContent={<Check checked />}
						/>
						<SelectCell
							label="Check (미선택)"
							leadingContent={<Check checked={false} />}
						/>
						<SelectCell
							label="CheckMultiple (선택됨)"
							leadingContent={<CheckMultiple checked />}
						/>
						<SelectCell
							label="CheckMultiple (미선택)"
							leadingContent={<CheckMultiple checked={false} />}
						/>
					</div>
				</div>

				{/* TrailingContent 변형 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						TrailingContent 변형
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell
							label="Value 텍스트"
							trailingContent={
								<span className="text-body-2 font-medium leading-body-2 text-label-alternative">
									값
								</span>
							}
						/>
						<SelectCell
							label="Check"
							trailingContent={<Check checked />}
						/>
						<SelectCell
							label="Badge"
							trailingContent={<Badge size="sm">New</Badge>}
						/>
						<SelectCell
							label="Switch"
							trailingContent={
								<Switch
									checked={switchOn}
									onCheckedChange={setSwitchOn}
								/>
							}
						/>
					</div>
				</div>

				{/* Leading + Trailing 조합 */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Leading + Trailing 조합 (인터랙티브)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						{["서울특별시", "경기도", "부산광역시"].map(
							(label, i) => (
								<SelectCell
									key={label}
									label={label}
									hasDivider={i < 2}
									leadingContent={
										<Checkbox
											state={
												selected === label
													? "checked"
													: "unchecked"
											}
											onStateChange={() =>
												setSelected(
													selected === label
														? null
														: label,
												)
											}
										/>
									}
									trailingContent={
										<span className="text-body-2 font-medium leading-body-2 text-label-alternative">
											{["9,733,000", "13,511,000", "3,350,000"][i]}
										</span>
									}
									onClick={() =>
										setSelected(
											selected === label ? null : label,
										)
									}
								/>
							),
						)}
					</div>
				</div>

				{/* Description + Leading + Trailing */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						풀 구성 (Description + Leading + Trailing)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell
							label="알림 설정"
							description="푸시 알림을 받습니다"
							descriptionPosition="bottom"
							leadingContent={<Check checked />}
							trailingContent={
								<Switch
									checked={switchOn}
									onCheckedChange={setSwitchOn}
								/>
							}
						/>
						<SelectCell
							label="상세 정보"
							description="카테고리"
							descriptionPosition="top"
							typography="md"
							leadingContent={<Radio checked />}
							trailingContent={
								<Badge size="sm" variant="secondary">
									3건
								</Badge>
							}
						/>
					</div>
				</div>

				{/* Interaction off */}
				<div>
					<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">
						Interaction=false (hover 효과 없음)
					</h3>
					<div className="w-[352px] border border-line-neutral rounded-xl overflow-hidden">
						<SelectCell label="Interaction=true (기본)" />
						<SelectCell
							label="Interaction=false"
							interaction={false}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
