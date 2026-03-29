import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 9) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 4) {
    pages.push("...");
  }

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 3) {
    pages.push("...");
  }

  if (total > 1) {
    pages.push(total);
  }

  return pages;
}

function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
  className,
}: PaginationProps) {
  const [jumpValue, setJumpValue] = useState("");
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const sizeRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 + Escape 키로 pageSize 드롭다운 닫기
  useEffect(() => {
    if (!isSizeOpen) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (sizeRef.current && !sizeRef.current.contains(e.target as Node)) {
        setIsSizeOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsSizeOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSizeOpen]);

  const pages = getPageNumbers(currentPage, totalPages);

  const handleJump = () => {
    const page = Number(jumpValue);
    if (!Number.isNaN(page) && page >= 1) {
      const clamped = Math.min(Math.max(page, 1), totalPages);
      onPageChange(clamped);
    }
    setJumpValue("");
  };

  if (totalPages <= 0) return null;

  return (
    <nav
      className={cn("relative flex items-center justify-center py-4", className)}
      aria-label="페이지네이션"
    >
      {/* Leading: N씩 보기 */}
      <div className="absolute left-0 flex items-center gap-2">
        <div ref={sizeRef} className="relative">
          <button
            type="button"
            onClick={() => setIsSizeOpen(!isSizeOpen)}
            className="inline-flex items-center gap-px rounded-[8px] border border-line-neutral px-2 py-1"
            aria-label="페이지 크기 선택"
          >
            <span className="px-0.5 text-[14px] font-medium tracking-[0.2px] text-label-normal">
              {pageSize}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-label-alternative transition-transform",
                isSizeOpen && "rotate-180",
              )}
            />
          </button>
          {isSizeOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 rounded-[8px] border border-line-neutral bg-white py-1 shadow-md">
              {pageSizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => {
                    onPageSizeChange(size);
                    setIsSizeOpen(false);
                  }}
                  className={cn(
                    "block w-full px-4 py-1.5 text-left text-[14px] font-medium hover:bg-fill-normal",
                    size === pageSize
                      ? "font-semibold text-primary"
                      : "text-label-normal",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
        <span className="text-[13px] font-medium tracking-[0.25px] text-label-alternative">
          씩 보기
        </span>
      </div>

      {/* Center: 페이지 번호 */}
      <div className="flex h-8 items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center disabled:opacity-30"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="size-4 text-label-alternative" />
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex size-[30px] items-center justify-center text-[15px] text-label-neutral"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              aria-label={`${page}페이지`}
              className={cn(
                "relative flex min-h-[44px] min-w-[30px] items-center justify-center rounded-[6px] text-[15px] tracking-[0.14px]",
                page === currentPage
                  ? "bg-label-normal/[0.09] font-medium text-label-strong"
                  : "font-normal text-label-neutral",
              )}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center disabled:opacity-30"
          aria-label="다음 페이지"
        >
          <ChevronRight className="size-4 text-label-alternative" />
        </button>
      </div>

      {/* Trailing: 페이지 이동 */}
      <div className="absolute right-0 flex items-center gap-2">
        <span className="text-[13px] font-medium tracking-[0.25px] text-label-alternative">
          페이지 이동
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={jumpValue}
          onChange={(e) => setJumpValue(e.target.value.replace(/\D/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && handleJump()}
          aria-label="이동할 페이지 번호"
          className="w-[53px] rounded-[8px] border border-line-neutral px-1.5 py-1 text-center text-[14px] font-medium tracking-[0.2px] text-label-normal shadow-[0px_1px_2px_0px_rgba(0,0,0,0.03)] outline-none focus:border-primary"
        />
      </div>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };
