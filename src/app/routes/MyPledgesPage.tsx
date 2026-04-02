import { useMemo, useState } from "react";
import { Plus, Pencil, Clock, CircleCheck, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast/toast";
import { useBreadcrumb } from "@/contexts/useNavigation";
import { ChipTag } from "@/components/ui/chip-tag";
import { Chip } from "@/components/ui/chip";
import { Pagination } from "@/components/ui/pagination";
import { useDropdown } from "@/hooks/useDropdown";
import { MyPledgeCard } from "@/features/policy/components/MyPledgeCard";
import { PledgeFormModal } from "@/features/policy/components/PledgeFormModal";
import type { PledgeFormData } from "@/features/policy/schemas/pledgeFormSchema";
import {
  mockMyPledges,
  type MyPledge,
  type PledgeStatus,
} from "@/features/policy/data/mock-policy";

type StatusFilter = "all" | PledgeStatus;
type SortOrder = "recent" | "oldest";

const STATUS_FILTERS: {
  value: StatusFilter;
  label: string;
  icon?: React.ReactNode;
}[] = [
  { value: "all", label: "전체" },
  { value: "drafting", label: "작성중", icon: <Pencil className="size-4" /> },
  { value: "reviewing", label: "검토중", icon: <Clock className="size-4" /> },
  {
    value: "approved",
    label: "승인완료",
    icon: <ShieldCheck className="size-4" />,
  },
  {
    value: "confirmed",
    label: "확정됨",
    icon: <CircleCheck className="size-4" />,
  },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "recent", label: "최근수정된순" },
  { value: "oldest", label: "오래된순" },
];

export function MyPledgesPage() {
  useBreadcrumb([{ label: "정책개발" }, { label: "내 공약관리" }]);

  const [activeStatus, setActiveStatus] = useState<StatusFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPledge, setEditingPledge] = useState<MyPledge | null>(null);

  const {
    isOpen: isSortOpen,
    setIsOpen: setIsSortOpen,
    containerRef: sortRef,
  } = useDropdown();

  const filtered = useMemo(
    () =>
      activeStatus === "all"
        ? mockMyPledges
        : mockMyPledges.filter((p) => p.status === activeStatus),
    [activeStatus],
  );

  const sorted = useMemo(
    () => (sortOrder === "recent" ? [...filtered] : [...filtered].reverse()),
    [filtered, sortOrder],
  );

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleOpenCreate = () => {
    setEditingPledge(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (id: string) => {
    const target = mockMyPledges.find((p) => p.id === id) ?? null;
    setEditingPledge(target);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPledge(null);
  };

  const handleFormSubmit = (_data: PledgeFormData) => {
    toast.success(
      editingPledge ? "공약이 수정되었습니다." : "공약이 등록되었습니다.",
    );
    handleCloseModal();
  };

  const handleSaveDraft = (_data: PledgeFormData) => {
    toast.success("임시저장되었습니다.");
  };

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortOrder)?.label ?? "최근수정된순";

  return (
    <div className="flex flex-col px-20 py-8">
      {/* Header */}
      <div className="flex items-start justify-between py-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-1 font-bold text-label-normal">
            내 공약관리
          </h1>
          <p className="text-body-1 font-medium text-label-alternative">
            등록된 공약을 관리하고 이행 현황을 추적합니다
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white"
        >
          <Plus className="size-5" />
          새 공약 추가
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mt-6 flex items-center">
        <div className="flex gap-1">
          {STATUS_FILTERS.map((filter) => (
            <ChipTag
              key={filter.value}
              label={filter.label}
              leadingIcon={filter.icon}
              shape="round"
              size="xlarge"
              variant="solid"
              state={activeStatus === filter.value ? "active" : "default"}
              onClick={() => handleStatusChange(filter.value)}
            />
          ))}
        </div>

        <div className="flex flex-1 items-center justify-end gap-2.5">
          <span className="text-label-3 font-semibold text-label-alternative">
            정렬
          </span>
          <div ref={sortRef} className="relative">
            <Chip
              label={sortLabel}
              size="medium"
              state="default"
              variant="outlined"
              isOpen={isSortOpen}
              onClick={() => setIsSortOpen(!isSortOpen)}
            />
            {isSortOpen && (
              <div className="absolute right-0 top-full z-10 mt-2 min-w-[140px] rounded-[10px] border border-line-neutral bg-white py-1 shadow-md">
                {SORT_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSortOrder(option.value);
                      setCurrentPage(1);
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "block w-full px-4 py-2.5 text-left text-label-3 hover:bg-fill-normal",
                      option.value === sortOrder
                        ? "font-semibold text-primary"
                        : "font-medium text-label-normal",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="mt-6 flex flex-col gap-4">
        {paginated.length > 0 ? (
          paginated.map((pledge) => (
            <MyPledgeCard key={pledge.id} pledge={pledge} onEdit={handleOpenEdit} />
          ))
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-body-1 text-label-alternative">
              해당 상태의 공약이 없습니다.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {paginated.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      )}

      {/* 공약 추가/수정 모달 */}
      <PledgeFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        pledge={editingPledge}
        onSubmit={handleFormSubmit}
        onSaveDraft={handleSaveDraft}
      />
    </div>
  );
}
