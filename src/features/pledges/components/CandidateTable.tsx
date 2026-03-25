import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/features/pledges/data/mock-candidates";
import { PARTY_COLOR_MAP } from "@/features/pledges/data/mock-candidates";

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.01164 12.4387C8.43488 12.0998 9.00065 11.6111 9.56823 11.013C10.6801 9.84131 11.8999 8.14466 11.8999 6.27053C11.8999 3.56434 9.7061 1.37053 6.9999 1.37053C4.2937 1.37053 2.09989 3.56434 2.09989 6.27053C2.09989 8.14466 3.3197 9.84131 4.43157 11.013C4.99914 11.6111 5.56491 12.0998 5.98815 12.4387C6.22091 12.6251 6.45784 12.8083 6.70472 12.9758C6.87981 13.0943 7.11874 13.0948 7.29403 12.9765C7.5413 12.8088 7.77856 12.6253 8.01164 12.4387ZM8.60414 6.27048C8.60414 7.15643 7.88593 7.87464 6.99997 7.87464C6.11401 7.87464 5.3958 7.15643 5.3958 6.27048C5.3958 5.38452 6.11401 4.66631 6.99997 4.66631C7.88593 4.66631 8.60414 5.38452 8.60414 6.27048Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface CandidateTableProps {
  candidates: Candidate[];
  electionCategory?: string;
}

export function CandidateTable({ candidates, electionCategory }: CandidateTableProps) {
  const navigate = useNavigate();
  if (candidates.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-body-2 font-medium text-label-alternative">
          검색 결과가 없습니다
        </p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="h-11 border-b border-line-neutral text-label-4 font-semibold text-label-neutral">
          <th className="px-4 text-left">후보자</th>
          <th className="px-4 text-left">정당</th>
          <th className="px-4 text-left">지역</th>
          <th className="px-4 text-left">직업</th>
          <th className="px-4 text-left">학력</th>
          <th className="px-4 text-left">선거</th>
          <th className="w-[60px] px-4 text-center">자료</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate) => {
          const partyColor = PARTY_COLOR_MAP[candidate.party];
          const regionText = candidate.regionDetail
            ? `${candidate.sido} ${candidate.regionDetail}`
            : (candidate.sido ?? candidate.region);

          return (
            <tr
              key={candidate.id}
              className="h-16 border-b border-line-neutral text-body-3 font-medium cursor-pointer hover:bg-fill-normal"
              onClick={() => electionCategory && navigate(`/pledges/${electionCategory}/${candidate.id}`)}
            >
              {/* 후보자 (아바타 + 이름) */}
              <td className="px-4">
                <div className="flex items-center gap-3">
                  {candidate.photoUrl ? (
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fill-normal text-label-3 font-semibold text-label-neutral">
                      {candidate.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-semibold text-label-strong">
                    {candidate.name}
                  </span>
                </div>
              </td>

              {/* 정당 뱃지 */}
              <td className="px-4">
                <span
                  className={`inline-block whitespace-nowrap rounded-[6px] px-1.5 py-1 text-label-4 font-bold ${partyColor.bg} ${partyColor.text}`}
                >
                  {candidate.partyName}
                </span>
              </td>

              {/* 지역 */}
              <td className="px-4">
                <Badge
                  variant="secondary"
                  size="sm"
                  className="rounded-[6px] px-1.5 py-1 text-label-4 text-label-neutral font-semibold"
                >
                  <LocationIcon />
                  {regionText}
                </Badge>
              </td>

              {/* 직업 */}
              <td className="px-4 text-label-normal text-body-3">
                {candidate.job ?? ""}
              </td>

              {/* 학력 */}
              <td className="px-4 text-label-normal text-body-3">
                <span className="line-clamp-1">
                  {candidate.education ?? ""}
                </span>
              </td>

              {/* 선거 */}
              <td className="px-4">
                <Badge
                  variant="secondary"
                  size="sm"
                  className="whitespace-nowrap rounded-[6px] px-1.5 py-1 text-label-4 text-label-neutral font-semibold"
                >
                  {candidate.electionInfo}
                </Badge>
              </td>

              {/* 자료 */}
              <td className="px-4 text-center">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-label-alternative hover:bg-fill-normal"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.5 2C3.67157 2 3 2.67157 3 3.5V12.5C3 13.3284 3.67157 14 4.5 14H11.5C12.3284 14 13 13.3284 13 12.5V5.5L9.5 2H4.5Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 2V5.5H13"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
