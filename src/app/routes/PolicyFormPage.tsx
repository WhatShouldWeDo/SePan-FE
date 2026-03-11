import { useParams } from "react-router-dom"
import { useBreadcrumb } from "@/contexts/useNavigation"

export function PolicyFormPage() {
  const { id } = useParams()
  const label = id ? "공약 편집" : "공약 작성"
  useBreadcrumb([{ label: "정책개발" }, { label }])
  const isEditMode = Boolean(id)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {isEditMode ? "공약 수정" : "새 공약 작성"}
      </h1>
      {/* TODO: PolicyForm 추가 */}
    </div>
  )
}
