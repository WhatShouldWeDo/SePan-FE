import { useState } from "react"
import { toast } from "@/lib/toast/toast"
import { Toast } from "@/components/ui/toast"
import { Banner } from "@/components/ui/banner"
import { CategoryNav } from "@/components/ui/category-nav"
import { CATEGORIES, SUBCATEGORIES } from "@/features/region/data/categories"
import { Checkbox, type CheckboxState } from "@/components/ui/checkbox"
import { Radio } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { Check } from "@/components/ui/check"
import { CheckMultiple } from "@/components/ui/check-multiple"

const TestPage = () => {
	const [selectedCategory, setSelectedCategory] = useState<string>()
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>()

	// Select/Item 테스트 상태
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
		<div className="flex flex-col gap-8 p-8">
			{/* ── Select/Item 컴포넌트 테스트 ── */}

			{/* Checkbox */}
			<section>
				<h2 className="text-heading-3 font-bold mb-4">Checkbox</h2>
				<div className="flex flex-col gap-6">
					{/* md 인터랙티브 */}
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
					{/* sm 인터랙티브 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">sm — 인터랙티브</h3>
						<label className="flex items-center gap-2 cursor-pointer">
							<Checkbox size="sm" state={checkboxSmState} onStateChange={setCheckboxSmState} />
							<span className="text-body-3 text-label-normal">{checkboxSmState}</span>
						</label>
					</div>
					{/* 정적 상태 매트릭스 */}
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
					{/* md 인터랙티브 */}
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
					{/* sm 인터랙티브 */}
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
					{/* 정적 상태 */}
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
					{/* md 인터랙티브 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">md — 인터랙티브</h3>
						<label className="flex items-center gap-3 cursor-pointer">
							<Switch checked={switchOn} onCheckedChange={setSwitchOn} />
							<span className="text-body-2 text-label-normal">{switchOn ? "ON" : "OFF"}</span>
						</label>
					</div>
					{/* sm 인터랙티브 */}
					<div>
						<h3 className="text-title-4 font-semibold mb-2 text-label-neutral">sm — 인터랙티브</h3>
						<label className="flex items-center gap-3 cursor-pointer">
							<Switch size="sm" checked={switchSmOn} onCheckedChange={setSwitchSmOn} />
							<span className="text-body-3 text-label-normal">{switchSmOn ? "ON" : "OFF"}</span>
						</label>
					</div>
					{/* 정적 상태 */}
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

			<hr className="border-line-neutral" />

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

			{/* Banner Variants (정적) */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner Variants (정적)</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner>인포배너 메시지입니다</Banner>
					<Banner variant="notice">인포배너 메시지입니다</Banner>
					<Banner variant="warning">인포배너 메시지입니다</Banner>
					<Banner variant="error">인포배너 메시지입니다</Banner>
					<Banner variant="success">인포배너 메시지입니다</Banner>
				</div>
			</section>

			{/* Banner + Trailing Action */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner + Trailing Action</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-label-neutral"
								onClick={() => toast.info("Info 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="notice"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-primary"
								onClick={() => toast.info("Notice 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="warning"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-cautionary"
								onClick={() => toast.info("Warning 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="error"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-negative"
								onClick={() => toast.info("Error 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
					<Banner
						variant="success"
						action={
							<button
								type="button"
								className="shrink-0 text-label-3 font-semibold text-status-positive"
								onClick={() => toast.info("Success 액션 클릭")}
							>
								텍스트
							</button>
						}
					>
						인포배너 메시지입니다
					</Banner>
				</div>
			</section>

			{/* Banner 아이콘 없음 */}
			<section>
				<h2 className="text-heading-4 font-bold mb-4">Banner (아이콘 없음)</h2>
				<div className="flex flex-col gap-3 max-w-md">
					<Banner icon={false}>아이콘 없는 인포배너</Banner>
					<Banner variant="error" icon={false}>아이콘 없는 에러 배너</Banner>
				</div>
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
