import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { RecommendationCard } from "../RecommendationCard";
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
  description: "상세 설명입니다.",
  updatedAt: "2026-03-27",
  isAdopted: false,
};

describe("RecommendationCard", () => {
  it("제목과 매치율을 렌더한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("소상공인 임대료 지원")).toBeInTheDocument();
    expect(screen.getByText("89% Match")).toBeInTheDocument();
  });

  it("AI 인사이트와 예상 효과를 표시한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByText("AI 분석 결과입니다.")).toBeInTheDocument();
    expect(screen.getByText("예상 효과입니다.")).toBeInTheDocument();
  });

  it("미채택 상태에서 채택하기 버튼을 표시한다", () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "채택하기" })).toBeInTheDocument();
  });

  it("채택 완료 상태에서 채택하기 버튼을 숨긴다", () => {
    render(
      <RecommendationCard
        recommendation={{ ...mockRecommendation, isAdopted: true }}
        onViewDetail={vi.fn()}
        onAdopt={vi.fn()}
      />
    );
    expect(screen.queryByRole("button", { name: "채택하기" })).not.toBeInTheDocument();
  });

  it("상세보기 클릭 시 onViewDetail을 호출한다", async () => {
    const onViewDetail = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={onViewDetail}
        onAdopt={vi.fn()}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "상세보기" }));
    expect(onViewDetail).toHaveBeenCalledWith("1");
  });

  it("채택하기 클릭 시 onAdopt를 호출한다", async () => {
    const onAdopt = vi.fn();
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onViewDetail={vi.fn()}
        onAdopt={onAdopt}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: "채택하기" }));
    expect(onAdopt).toHaveBeenCalledWith("1");
  });
});
