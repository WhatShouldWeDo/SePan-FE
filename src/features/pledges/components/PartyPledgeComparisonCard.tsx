import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { CardSection } from "@/features/dashboard/components/CardSection"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import type { PartyPledgeData } from "../data/mock-local-statistics"

interface PartyPledgeComparisonCardProps {
  data: PartyPledgeData[]
}

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}hr ${mins}m`
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
}) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded bg-[#19213d] px-2 py-2.5 text-sm font-semibold text-white shadow-md">
      {formatTime(payload[0].value)}
    </div>
  )
}

export function PartyPledgeComparisonCard({ data }: PartyPledgeComparisonCardProps) {
  const chartData = data.map((d) => ({
    name: d.partyName,
    fulfillmentTime: d.fulfillmentTime,
    partyColor: d.partyColor,
  }))

  const maxTime = Math.max(...data.map((d) => d.fulfillmentTime))
  const maxHours = Math.ceil(maxTime / 60)
  const ticks = Array.from({ length: maxHours + 1 }, (_, i) => i * 60)

  return (
    <CardSection>
      <CardSectionHeader
        title="정당별 공약 비교"
        description="정당별 공약 이행 소요 시간 비교"
        trailingContent={
          <button
            type="button"
            className="rounded-xl border border-line-neutral px-5 py-3 text-label-3 font-semibold text-label-normal"
            disabled
            title="준비 중"
          >
            버튼
          </button>
        }
      />

      <div className="flex gap-4">
        {/* 정당 아바타 + 이름 (왼쪽) */}
        <div className="flex w-[80px] shrink-0 flex-col gap-3">
          {data.map((party) => (
            <div
              key={party.partyId + party.partyName}
              className="flex h-[62px] flex-col items-center justify-center gap-1.5"
            >
              <div
                className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-line-neutral text-xs font-bold text-white"
                style={{ backgroundColor: party.partyColor }}
              >
                {party.partyName.slice(0, 2)}
              </div>
              <span className="text-caption-2 font-medium text-label-neutral">
                {party.partyName}
              </span>
            </div>
          ))}
        </div>

        {/* 바 차트 (오른쪽) */}
        <div className="min-w-0 flex-1">
          <ResponsiveContainer width="100%" height={data.length * 74}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, bottom: 0, left: 0 }}
              barSize={28}
            >
              <XAxis
                type="number"
                domain={[0, Math.max(...ticks)]}
                ticks={ticks}
                tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 60}h`)}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 14, fill: "#19213d" }}
              />
              <YAxis type="category" dataKey="name" hide />
              <RechartsTooltip
                content={<CustomTooltip />}
                cursor={false}
              />
              <Bar
                dataKey="fulfillmentTime"
                radius={[50, 50, 50, 50]}
                activeBar={{ fill: "#2388ff" }}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill="#e3efff" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CardSection>
  )
}
