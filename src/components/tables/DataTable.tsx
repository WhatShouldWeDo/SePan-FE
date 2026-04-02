import { useState, useCallback } from "react";
import type { ChartData, ChartConfig } from "@/types/chart";
import { Pagination } from "@/components/ui/pagination";

export interface DataTableProps {
  data: ChartData;
  config: ChartConfig;
  defaultPageSize?: number;
  valueFormatter?: (value: number) => string;
  className?: string;
}

export function DataTable({
  data,
  config,
  defaultPageSize = 10,
  valueFormatter = (v) => v.toLocaleString(),
  className,
}: DataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultPageSize);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const xLabel = config.xLabel ?? config.xKey;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageData = data.slice(startIdx, startIdx + rowsPerPage);

  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-[16px] font-medium leading-[1.5] text-label-alternative">
          데이터가 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <table className="w-full border-b border-line-neutral">
        <thead>
          <tr className="border-y border-line-neutral bg-cool-neutral-5">
            <th className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-neutral">
              {xLabel}
            </th>
            {config.series.map((s) => (
              <th
                key={s.key}
                className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-neutral"
              >
                {s.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map((row) => (
            <tr
              key={String(row[config.xKey])}
              className="border-b border-line-neutral last:border-b-0"
            >
              <td className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-neutral">
                {row[config.xKey]}
              </td>
              {config.series.map((s) => (
                <td
                  key={s.key}
                  className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-neutral"
                >
                  {typeof row[s.key] === "number"
                    ? valueFormatter(row[s.key] as number)
                    : row[s.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 — Pagination 공유 컴포넌트 사용 (ellipsis 처리 포함) */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={rowsPerPage}
        onPageChange={goToPage}
        onPageSizeChange={(size) => {
          setRowsPerPage(size);
          goToPage(1);
        }}
      />
    </div>
  );
}
