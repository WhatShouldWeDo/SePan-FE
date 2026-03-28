import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { RecommendationDetailModal } from "../RecommendationDetailModal";
import type { AiRecommendationDetail } from "@/features/policy/data/mock-policy";

const mockRecommendation: AiRecommendationDetail = {
  id: "1",
  title: "소상공인 임대료 지원",
  matchRate: 89,
  region: "삼성동",
  categoryId: "economy",
  tags: [{ categoryId: "economy", label: "경제" }],
  aiInsight: "AI 분석 결과입니다.",
  expectedEffect: "예상 효과입니다.",
  description: "상세 설명 텍스트입니다.",
  updatedAt: "2026-03-27",
  isAdopted: false,
};

describe("RecommendationDetailModal", () => {
  it("open=true일 때 모달 내용을 렌더한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("소상공인 임대료 지원")).toBeInTheDocument();
    expect(screen.getByText("상세 설명 텍스트입니다.")).toBeInTheDocument();
  });

  it("미채택 상태에서 채택하기 버튼을 표시한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "채택하기" })).toBeInTheDocument();
  });

  it("채택 완료 상태에서 채택 완료 비활성 버튼을 표시한다", () => {
    render(
      <RecommendationDetailModal
        recommendation={{ ...mockRecommendation, isAdopted: true }}
        open={true}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    const btn = screen.getByRole("button", { name: "채택 완료" });
    expect(btn).toBeDisabled();
  });

  it("채택하기 클릭 시 onAdopt를 호출한다", async () => {
    const onAdopt = vi.fn();
    render(
      <RecommendationDetailModal
        recommendation={mockRecommendation}
        open={true}
        onClose={vi.fn()}
        onAdopt={onAdopt}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "채택하기" }));
    expect(onAdopt).toHaveBeenCalledWith("1");
  });

  it("recommendation이 null이면 DialogContent를 렌더하지 않는다", () => {
    const { container } = render(
      <RecommendationDetailModal
        recommendation={null}
        open={false}
        onClose={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(container.querySelector("[data-slot='dialog-content']")).not.toBeInTheDocument();
  });
});
