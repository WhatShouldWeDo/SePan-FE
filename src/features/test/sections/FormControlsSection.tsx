import { useState } from "react"
import { Checkbox, type CheckboxState } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { Check } from "@/components/ui/check"
import { CheckMultiple } from "@/components/ui/check-multiple"

export function FormControlsSection() {
	const [checkboxState, setCheckboxState] = useState<CheckboxState>("unchecked")
	const [checkboxSmState, setCheckboxSmState] = useState<CheckboxState>("unchecked")
	const [indeterminateState, setIndeterminateState] = useState<CheckboxState>("indeterminate")
	const [radioValue, setRadioValue] = useState<string>("opt1")
	const [radioSmValue, setRadioSmValue] = useState<string>("opt1")
	const [switchOn, setSwitchOn] = useState(false)
	const [switchSmOn, setSwitchSmOn] = useState(false)
	const [checkValues, setCheckValues] = useState([true, false, true, false])
	const [multiChecked, setMultiChecked] = useState([false, true])

	return (
		<>
			{/* Checkbox */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Checkbox</h2>
				<div className="flex flex-col gap-6">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">md — 인터랙티브</h3>
						<div className="flex items-center gap-6">
							<label className="flex items-center gap-2 cursor-pointer">
								<Checkbox state={checkboxState} onStateChange={setCheckboxState} />
								<span className="text-body-2 text-label-normal">{checkboxState}</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<Checkbox state={indeterminateState} onStateChange={setIndeterminateState} />
								<span className="text-body-2 text-label-normal">{indeterminateState}</span>
							</label>
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">sm — 인터랙티브</h3>
						<label className="flex items-center gap-2 cursor-pointer">
							<Checkbox size="sm" state={checkboxSmState} onStateChange={setCheckboxSmState} />
							<span className="text-body-3 text-label-normal">{checkboxSmState}</span>
						</label>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스 (md)</h3>
						<div className="flex items-center gap-4">
							<Checkbox state="unchecked" />
							<Checkbox state="checked" />
							<Checkbox state="indeterminate" />
							<Checkbox state="unchecked" disabled />
							<Checkbox state="checked" disabled />
							<Checkbox state="indeterminate" disabled />
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스 (sm)</h3>
						<div className="flex items-center gap-4">
							<Checkbox size="sm" state="unchecked" />
							<Checkbox size="sm" state="checked" />
							<Checkbox size="sm" state="indeterminate" />
							<Checkbox size="sm" state="unchecked" disabled />
							<Checkbox size="sm" state="checked" disabled />
							<Checkbox size="sm" state="indeterminate" disabled />
						</div>
					</div>
				</div>
			</section>

			{/* Radio */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Radio</h2>
				<div className="flex flex-col gap-6">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">md — 인터랙티브</h3>
						<div className="flex items-center gap-6">
							{["opt1", "opt2", "opt3"].map((opt) => (
								<label key={opt} className="flex items-center gap-2 cursor-pointer">
									<Radio checked={radioValue === opt} onCheckedChange={() => setRadioValue(opt)} />
									<span className="text-body-2 text-label-normal">옵션 {opt.slice(-1)}</span>
								</label>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">sm — 인터랙티브</h3>
						<div className="flex items-center gap-6">
							{["opt1", "opt2", "opt3"].map((opt) => (
								<label key={opt} className="flex items-center gap-2 cursor-pointer">
									<Radio size="sm" checked={radioSmValue === opt} onCheckedChange={() => setRadioSmValue(opt)} />
									<span className="text-body-3 text-label-normal">옵션 {opt.slice(-1)}</span>
								</label>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스</h3>
						<div className="flex items-center gap-4">
							<Radio checked={false} />
							<Radio checked={true} />
							<Radio checked={false} disabled />
							<Radio checked={true} disabled />
							<Radio size="sm" checked={false} />
							<Radio size="sm" checked={true} />
							<Radio size="sm" checked={false} disabled />
							<Radio size="sm" checked={true} disabled />
						</div>
					</div>
				</div>
			</section>

			{/* Switch */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Switch</h2>
				<div className="flex flex-col gap-6">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">md — 인터랙티브</h3>
						<label className="flex items-center gap-3 cursor-pointer">
							<Switch checked={switchOn} onCheckedChange={setSwitchOn} />
							<span className="text-body-2 text-label-normal">{switchOn ? "ON" : "OFF"}</span>
						</label>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">sm — 인터랙티브</h3>
						<label className="flex items-center gap-3 cursor-pointer">
							<Switch size="sm" checked={switchSmOn} onCheckedChange={setSwitchSmOn} />
							<span className="text-body-3 text-label-normal">{switchSmOn ? "ON" : "OFF"}</span>
						</label>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스</h3>
						<div className="flex items-center gap-4">
							<Switch checked={false} />
							<Switch checked={true} />
							<Switch checked={false} disabled />
							<Switch checked={true} disabled />
						</div>
						<div className="flex items-center gap-4 mt-3">
							<Switch size="sm" checked={false} />
							<Switch size="sm" checked={true} />
							<Switch size="sm" checked={false} disabled />
							<Switch size="sm" checked={true} disabled />
						</div>
					</div>
				</div>
			</section>

			{/* Check */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Check</h2>
				<div className="flex flex-col gap-6">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">md — 인터랙티브</h3>
						<div className="flex items-center gap-4">
							{checkValues.map((val, i) => (
								<button
									key={i}
									type="button"
									className="cursor-pointer"
									onClick={() => {
										const next = [...checkValues]
										next[i] = !next[i]
										setCheckValues(next)
									}}
								>
									<Check checked={val} />
								</button>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스</h3>
						<div className="flex items-center gap-4">
							<Check checked={false} />
							<Check checked={true} />
							<Check checked={false} disabled />
							<Check checked={true} disabled />
							<Check size="sm" checked={false} />
							<Check size="sm" checked={true} />
							<Check size="sm" checked={false} disabled />
							<Check size="sm" checked={true} disabled />
						</div>
					</div>
				</div>
			</section>

			{/* CheckMultiple */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">CheckMultiple</h2>
				<div className="flex flex-col gap-6">
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">인터랙티브</h3>
						<div className="flex items-center gap-4">
							{multiChecked.map((val, i) => (
								<button
									key={i}
									type="button"
									className="cursor-pointer"
									onClick={() => {
										const next = [...multiChecked]
										next[i] = !next[i]
										setMultiChecked(next)
									}}
								>
									<CheckMultiple checked={val} />
								</button>
							))}
						</div>
					</div>
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">상태 매트릭스</h3>
						<div className="flex items-center gap-4">
							<CheckMultiple checked={false} />
							<CheckMultiple checked={true} />
						</div>
					</div>
				</div>
			</section>
		</>
	)
}
