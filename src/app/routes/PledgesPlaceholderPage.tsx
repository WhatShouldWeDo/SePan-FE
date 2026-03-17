import { useParams } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"

const ELECTION_TYPE_LABELS: Record<string, string> = {
	presidential: "대통령 선거",
	parliamentary: "국회의원 선거",
	local: "지방선거",
}

export function PledgesPlaceholderPage() {
	const { type } = useParams<{ type: string }>()
	const label = ELECTION_TYPE_LABELS[type ?? ""] ?? "선거"

	useBreadcrumb([{ label: "역대공약분석" }, { label }])

	return (
		<div className="flex items-center justify-center p-10">
			<p className="text-title-3 font-bold text-label-alternative">
				{label} 페이지 준비 중입니다.
			</p>
		</div>
	)
}
