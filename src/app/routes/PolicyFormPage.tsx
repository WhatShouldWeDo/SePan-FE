import { useParams } from "react-router-dom"

export function PolicyFormPage() {
  const { id } = useParams()
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
