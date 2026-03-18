import { useState } from "react";
import type { ChartData, ChartConfig } from "@/types/chart";

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

  const xLabel = config.xLabel ?? config.xKey;
  const showPagination = data.length > rowsPerPage;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const pageData = showPagination
    ? data.slice(startIdx, startIdx + rowsPerPage)
    : data;

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
      <table className="w-full">
        <thead>
          <tr className="border-b border-line-neutral">
            <th className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-normal">
              {xLabel}
            </th>
            {config.series.map((s) => (
              <th
                key={s.key}
                className="px-4 py-3 text-left text-[14px] font-semibold leading-[1.3] text-label-normal"
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
              <td className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-normal">
                {row[config.xKey]}
              </td>
              {config.series.map((s) => (
                <td
                  key={s.key}
                  className="px-4 py-3 text-[16px] font-medium leading-[1.5] text-label-normal"
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

      {/* 페이지네이션 */}
      {showPagination && (
        <div className="flex items-center justify-between pt-4">
          {/* 좌측: rows-per-page */}
          <div className="flex items-center gap-2">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="min-h-[44px] min-w-[44px] rounded-lg border border-line-neutral px-2 py-1 text-[14px] font-semibold leading-[1.3] text-label-normal"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <span className="text-[12px] leading-[1.3] text-label-alternative">
              씩 보기
            </span>
          </div>

          {/* 중앙: 페이지 번호 */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] text-label-alternative disabled:opacity-30"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] font-semibold ${
                  page === currentPage
                    ? "bg-surface-inverse text-label-inverse"
                    : "text-label-alternative"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[14px] text-label-alternative disabled:opacity-30"
            >
              &gt;
            </button>
          </div>

          {/* 우측: 페이지 이동 */}
          <div className="flex items-center gap-2">
            <span className="text-[12px] leading-[1.3] text-label-alternative">
              페이지 이동
            </span>
            <input
              type="number"
              min={1}
              max={totalPages}
              defaultValue=""
              aria-label="페이지 번호 입력"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = Number((e.target as HTMLInputElement).value);
                  if (val >= 1 && val <= totalPages) {
                    setCurrentPage(val);
                    (e.target as HTMLInputElement).value = "";
                  }
                }
              }}
              className="min-h-[44px] w-[60px] rounded-lg border border-line-neutral px-2 py-1 text-center text-[14px] font-semibold text-label-normal"
            />
          </div>
        </div>
      )}
    </div>
  );
}
