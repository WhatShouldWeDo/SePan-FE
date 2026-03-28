import { useState, useRef, useEffect } from "react";

import { useBreadcrumb } from "@/contexts/useNavigation";
import { Chip } from "@/components/ui/chip";
import { RegionInfoBar } from "@/features/policy/components/RegionInfoBar";
import { RecommendationCard } from "@/features/policy/components/RecommendationCard";
import { RecommendationDetailModal } from "@/features/policy/components/RecommendationDetailModal";
import {
  mockRegionInfo,
  mockRecommendationDetails,
  type AiRecommendationDetail,
} from "@/features/policy/data/mock-policy";

type SortOption = "matchRate" | "updatedAt";

const SORT_LABELS: Record<SortOption, string> = {
  matchRate: "매칭률순",
  updatedAt: "최근수정된순",
};

export function AiRecommendationsPage() {
  useBreadcrumb([{ label: "정책개발" }, { label: "AI 추천 공약" }]);

  const [sortBy, setSortBy] = useState<SortOption>("matchRate");
  const [sortOpen, setSortOpen] = useState(false);
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(
    () => new Set(
      mockRecommendationDetails
        .filter((r) => r.isAdopted)
        .map((r) => r.id)
    )
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 정렬 드롭다운 외부 클릭 + Escape 닫기
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sortOpen) return;
    function handlePointerDown(e: PointerEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSortOpen(false);
    }
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sortOpen]);

  // 정렬된 데이터
  const sorted = [...mockRecommendationDetails].sort((a, b) => {
    if (sortBy === "matchRate") return b.matchRate - a.matchRate;
    return b.updatedAt.localeCompare(a.updatedAt);
  });

  // 채택 상태 반영
  const recommendations: AiRecommendationDetail[] = sorted.map((r) => ({
    ...r,
    isAdopted: adoptedIds.has(r.id),
  }));

  // 모달용 데이터
  const selectedRecommendation =
    selectedId
      ? recommendations.find((r) => r.id === selectedId) ?? null
      : null;

  function handleAdopt(id: string) {
    setAdoptedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="flex flex-col gap-8 px-20 py-8">
      {/* 페이지 헤더 */}
      <div className="py-4">
        <h1 className="text-heading-1 font-bold text-label-normal">
          AI 추천 공약
        </h1>
        <p className="mt-2 text-body-1 font-medium text-label-alternative">
          지역 분석 데이터와 역대 공약을 기반으로 AI가 추천한 공약 목록입니다.
        </p>
      </div>

      {/* 지역 정보 바 */}
      <RegionInfoBar
        name={mockRegionInfo.name}
        updatedAt={mockRegionInfo.updatedAt}
        characteristics={mockRegionInfo.characteristics}
      />

      {/* 필터 칩 */}
      <div className="flex gap-3">
        <div ref={sortRef} className="relative">
          <Chip
            label={SORT_LABELS[sortBy]}
            state={sortOpen ? "active" : "default"}
            isOpen={sortOpen}
            onClick={() => setSortOpen((prev) => !prev)}
          />
          {sortOpen && (
            <div
              role="listbox"
              aria-label="정렬 옵션"
              className="absolute top-full left-0 z-10 mt-1 rounded-[10px] border border-line-neutral bg-white py-1 shadow-lg"
            >
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(
                ([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="option"
                    aria-selected={sortBy === key}
                    className={`w-full px-4 py-2.5 text-left text-label-3 font-medium transition-colors hover:bg-fill-normal ${
                      sortBy === key
                        ? "font-semibold text-primary"
                        : "text-label-normal"
                    }`}
                    onClick={() => {
                      setSortBy(key);
                      setSortOpen(false);
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
        <Chip label="카테고리" state="disabled" />
        <Chip label="지역" state="disabled" />
      </div>

      {/* 추천 공약 카드 목록 */}
      {recommendations.length === 0 ? (
        <p className="py-20 text-center text-body-1 text-label-alternative">
          추천 공약이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onViewDetail={(id) => setSelectedId(id)}
              onAdopt={handleAdopt}
            />
          ))}
        </div>
      )}

      {/* 상세보기 모달 */}
      <RecommendationDetailModal
        recommendation={selectedRecommendation}
        open={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onAdopt={handleAdopt}
      />
    </div>
  );
}
