# 후보자 상세 페이지 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 후보자 카드 클릭 시 진입하는 상세 정보 페이지를 mock 데이터 기반으로 퍼블리싱하여, API 연결만으로 동작 가능하게 만든다.

**Architecture:** 단일 페이지 컴포넌트(`CandidateDetailPage`)가 mock 데이터를 보유하고, 프로필/공약/뉴스 3개 섹션 컴포넌트로 분배. sticky 앵커 탭으로 섹션 간 스크롤 이동 지원. 기존 `CardSectionHeader`, `Chip`, `PARTY_COLOR_MAP` 등 재사용.

**Tech Stack:** React, TypeScript, Tailwind CSS, Recharts (도넛 차트), react-router-dom

**Spec:** `docs/superpowers/specs/2026-03-25-candidate-detail-design.md`

---

## File Structure

### 신규 파일 (10개)

| 파일 | 역할 |
|---|---|
| `src/features/pledges/data/mock-candidate-detail.ts` | 타입 정의 + mock 데이터 + 헬퍼 |
| `src/features/pledges/components/CandidateProfileHeader.tsx` | 프로필 헤더 (사진, 이름, 정당, SNS, 배지, 경력요약) |
| `src/features/pledges/components/SectionAnchorNav.tsx` | sticky 앵커 탭 + IntersectionObserver |
| `src/features/pledges/components/ProfileSection.tsx` | 프로필 카드 (기본정보/학력/경력 + 더보기) |
| `src/features/pledges/components/PledgeRow.tsx` | 공약 행 (아코디언 토글) |
| `src/features/pledges/components/PledgeDonutChart.tsx` | Recharts 도넛 차트 + 중앙 라벨 + 범례 |
| `src/features/pledges/components/PledgesSection.tsx` | 공약 카드 (필터+차트+리스트) |
| `src/features/pledges/components/NewsRow.tsx` | 뉴스 행 (썸네일+제목+메타) |
| `src/features/pledges/components/NewsSection.tsx` | 뉴스 카드 (리스트+더보기) |
| `src/app/routes/CandidateDetailPage.tsx` | 페이지 조합 + 라우트 파라미터 처리 |

### 수정 파일 (8개)

| 파일 | 변경 내용 |
|---|---|
| `src/app/router.tsx` | 라우트 추가 (`:type` catch-all 위에) |
| `src/features/pledges/components/CandidateCard.tsx` | `Link` 조건부 래핑 + `electionCategory` prop |
| `src/features/pledges/components/CandidateGrid.tsx` | `electionCategory` prop 전달 |
| `src/features/pledges/components/CandidateTable.tsx` | 행 클릭 네비게이션 + `electionCategory` prop + hover 스타일 수정 |
| `src/app/routes/PresidentialPledgesPage.tsx` | `CandidateGrid`에 `electionCategory="presidential"` 전달 |
| `src/app/routes/ParliamentaryPledgesPage.tsx` | `CandidateGrid`에 `electionCategory="parliamentary"` 전달 |
| `src/app/routes/LocalElectionPledgesPage.tsx` | `CandidateGrid`/`CandidateTable`에 `electionCategory="local"` 전달 |
| `src/features/pledges/components/index.ts` | 신규 컴포넌트 barrel export 추가 |

**참고:** `recharts@^3.7.0`은 이미 `package.json`에 설치되어 있음. mock 데이터는 candidateId "1"만 포함 — 다른 id 클릭 시 `/pledges`로 리다이렉트됨 (mock 한계).

---

## Task 1: Mock 데이터 & 타입 정의

**Files:**
- Create: `src/features/pledges/data/mock-candidate-detail.ts`

- [ ] **Step 1: 타입 정의 + mock 데이터 작성**

```typescript
// src/features/pledges/data/mock-candidate-detail.ts
import type { Candidate } from "./mock-candidates"

/* ─── Types ─── */

export interface SocialLink {
  type: "instagram" | "facebook" | "linkedin"
  url: string
}

export interface HistoryItem {
  period: string
  description: string
}

export interface CandidatePledge {
  id: string
  title: string
  description: string
  category: string
  categoryVariant: "red" | "orange" | "blue" | "green" | "purple"
}

export interface CandidateNews {
  id: string
  title: string
  source: string
  timeAgo: string
  thumbnailUrl?: string
}

export interface PledgeKeywordStat {
  keyword: string
  percentage: number
  color: string
}

export interface CandidateDetail extends Candidate {
  birthDate?: string
  age?: number
  address?: string
  aides?: string[]
  socialLinks?: SocialLink[]
  educationHistory?: HistoryItem[]
  careerHistory?: HistoryItem[]
  pledges?: CandidatePledge[]
  news?: CandidateNews[]
  pledgeKeywordStats?: PledgeKeywordStat[]
}

/* ─── 선거유형 라벨 매핑 ─── */

export const ELECTION_TYPE_LABEL_MAP: Record<string, string> = {
  presidential: "대통령선거",
  parliamentary: "국회의원선거",
  local: "지방선거",
}

/* ─── Mock 데이터 ─── */

export const MOCK_CANDIDATE_DETAILS: CandidateDetail[] = [
  {
    id: "1",
    name: "김진보",
    party: "dpk",
    partyName: "더불어민주당",
    region: "서울 강남구 갑",
    electionInfo: "제 22대 비례대표국회의원 선거",
    electionTerm: 22,
    careers: [
      "고려대학교 법과대학 법학과 졸업",
      "(현)서울시 수도권 주택시장 전문가 자문위원",
      "(현)한국부동산원 정비사업 자문위원",
    ],
    birthDate: "1965.04.18",
    age: 60,
    address: "서울특별시 강남구 압구정로",
    job: "정당인",
    aides: ["김수경", "박영호"],
    socialLinks: [
      { type: "instagram", url: "#" },
      { type: "facebook", url: "#" },
      { type: "linkedin", url: "#" },
    ],
    educationHistory: [
      { period: "1972 ~ 1984", description: "석막초등학교" },
      { period: "1984~1992", description: "진산중학교" },
      { period: "1992~1998", description: "보문고등학교" },
      { period: "1998~2004", description: "건국대학교 산업공학 학사" },
    ],
    careerHistory: [
      { period: "1972 ~ 1984", description: "고려대학교 법과대학 법학과 졸업" },
      { period: "1984~1992", description: "(현)서울시 수도권 주택시장 전문가 자문위원" },
      { period: "1992~1998", description: "(현)한국부동산원 정비사업 자문위원" },
      { period: "1998~2004", description: "건국대학교 산업공학 학사" },
      { period: "2004~2010", description: "(전)국회 국토교통위원회 전문위원" },
      { period: "2010~2016", description: "(전)서울시 도시계획위원회 위원" },
    ],
    pledgeKeywordStats: [
      { keyword: "복지 정책", percentage: 53.7, color: "#7C3AED" },
      { keyword: "교육", percentage: 28, color: "#3B82F6" },
      { keyword: "주거 개선", percentage: 18.3, color: "#10B981" },
    ],
    pledges: [
      { id: "p1", title: "소상공인 임대료 부담 경감 지원 확대", description: "공공임대상가 공급 확대 및 임대료 상한제 도입 추진", category: "복지", categoryVariant: "red" },
      { id: "p2", title: "노인 요양시설 접근성 개선 및 운영비 지원", description: "지역밀착센터 확충 및 재가요양 서비스 통합 장소 추진", category: "자원산·고령화", categoryVariant: "orange" },
      { id: "p3", title: "공립 유치원 확충 및 보육교사 처우 개선", description: "국공립 어린이집 비율 50% 달성 및 보육료 단계별 인하", category: "교육", categoryVariant: "blue" },
      { id: "p4", title: "공립 유치원 확충 및 보육교사 처우 개선", description: "국공립 어린이집 비율 50% 달성 및 보육료 단계별 인하", category: "교육", categoryVariant: "blue" },
      { id: "p5", title: "공립 유치원 확충 및 보육교사 처우 개선", description: "국공립 어린이집 비율 50% 달성 및 보육료 단계별 인하", category: "교육", categoryVariant: "blue" },
    ],
    news: [
      { id: "n1", title: "국민의힘 \"코로나 '이물질 백신' 접종 사태, 정은경 거취 밝혀야\"", source: "조선일보", timeAgo: "1시간 전" },
      { id: "n2", title: "국민의힘 \"코로나 '이물질 백신' 접종 사태, 정은경 거취 밝혀야\"", source: "조선일보", timeAgo: "1시간 전" },
      { id: "n3", title: "국민의힘 \"코로나 '이물질 백신' 접종 사태, 정은경 거취 밝혀야\"", source: "조선일보", timeAgo: "1시간 전" },
      { id: "n4", title: "국민의힘 \"코로나 '이물질 백신' 접종 사태, 정은경 거취 밝혀야\"", source: "조선일보", timeAgo: "1시간 전" },
      { id: "n5", title: "여당 \"복지 확대 공약 이행률 70% 달성, 추가 재원 확보 필요\"", source: "한겨레", timeAgo: "2시간 전" },
      { id: "n6", title: "교육부 \"공립 유치원 확충 계획 발표, 2027년까지 500개 신설\"", source: "경향신문", timeAgo: "3시간 전" },
      { id: "n7", title: "서울시 \"도시재생 뉴딜사업 성과 보고, 주거 환경 개선 효과\"", source: "서울신문", timeAgo: "4시간 전" },
      { id: "n8", title: "노동부 \"소상공인 지원 정책 평가, 임대료 부담 완화 효과 분석\"", source: "매일경제", timeAgo: "5시간 전" },
    ],
  },
]

/* ─── Getter (추후 API 교체 지점) ─── */

export function getCandidateDetail(id: string): CandidateDetail | undefined {
  return MOCK_CANDIDATE_DETAILS.find((c) => c.id === id)
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공 (사용하지 않는 파일이지만 타입 체크 통과)

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/data/mock-candidate-detail.ts
git commit -m "feat(pledges): 후보자 상세 mock 데이터 및 타입 정의"
```

---

## Task 2: CandidateProfileHeader 컴포넌트

**Files:**
- Create: `src/features/pledges/components/CandidateProfileHeader.tsx`

**참고 파일:** `src/features/pledges/components/CandidateCard.tsx` (배지 패턴 재사용)

- [ ] **Step 1: 컴포넌트 작성**

```typescript
// src/features/pledges/components/CandidateProfileHeader.tsx
import locationFillIcon from "@/assets/pledges/location-fill.svg"
import type { CandidateDetail } from "@/features/pledges/data/mock-candidate-detail"
import { PARTY_COLOR_MAP } from "@/features/pledges/data/mock-candidates"

interface CandidateProfileHeaderProps {
  candidate: CandidateDetail
}

export function CandidateProfileHeader({ candidate }: CandidateProfileHeaderProps) {
  const partyColor = PARTY_COLOR_MAP[candidate.party]

  return (
    <div className="flex items-center gap-6 overflow-clip rounded-3xl bg-white py-8 pr-6">
      {/* 프로필 사진 */}
      {candidate.photoUrl ? (
        <img
          src={candidate.photoUrl}
          alt={candidate.name}
          className="h-[175px] w-[140px] shrink-0 rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-[175px] w-[140px] shrink-0 items-center justify-center rounded-2xl bg-cool-neutral-5" />
      )}

      {/* 정보 영역 */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Row 1: 이름 + 정당 + SNS */}
        <div className="flex items-center gap-2">
          <span className="text-heading-3 font-bold text-black">
            {candidate.name}
          </span>
          <span
            className={`rounded-[6px] px-1.5 py-1 text-label-4 font-semibold ${partyColor.bg} ${partyColor.text}`}
          >
            {candidate.partyName}
          </span>
          {candidate.socialLinks && candidate.socialLinks.length > 0 && (
            <div className="flex items-center gap-1.5 px-2">
              {candidate.socialLinks.map((link) => (
                <a
                  key={link.type}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-6 items-center justify-center text-label-neutral hover:text-label-normal"
                >
                  <SocialIcon type={link.type} />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Row 2: 위치 + 선거정보 배지 */}
        <div className="flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-[3px] rounded-[6px] bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
            <img src={locationFillIcon} alt="" className="size-3.5" />
            {candidate.region}
          </span>
          <span className="inline-flex items-center rounded-[6px] bg-label-neutral/8 px-1.5 py-1 text-label-4 font-semibold text-label-neutral">
            {candidate.electionInfo}
          </span>
        </div>

        {/* Row 3: 경력 요약 */}
        <div className="flex flex-col gap-1">
          {candidate.careers.slice(0, 3).map((career) => (
            <span
              key={career}
              className="text-label-4 font-medium text-label-alternative"
            >
              {career}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── SNS 아이콘 ─── */

function SocialIcon({ type }: { type: "instagram" | "facebook" | "linkedin" }) {
  const icons: Record<string, React.ReactNode> = {
    instagram: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    facebook: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    linkedin: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  }
  return <>{icons[type]}</>
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/CandidateProfileHeader.tsx
git commit -m "feat(pledges): 후보자 프로필 헤더 컴포넌트"
```

---

## Task 3: SectionAnchorNav 컴포넌트

**Files:**
- Create: `src/features/pledges/components/SectionAnchorNav.tsx`

- [ ] **Step 1: 컴포넌트 작성**

```typescript
// src/features/pledges/components/SectionAnchorNav.tsx
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  label: string
  ref: React.RefObject<HTMLDivElement | null>
}

interface SectionAnchorNavProps {
  sections: Section[]
}

export function SectionAnchorNav({ sections }: SectionAnchorNavProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "")
  // sections 배열은 매 렌더마다 새로 생성되므로 ref에 저장하여 effect 안정화
  const sectionsRef = useRef(sections)
  sectionsRef.current = sections

  // IntersectionObserver로 현재 보이는 섹션 감지
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    const currentSections = sectionsRef.current

    for (const section of currentSections) {
      if (!section.ref.current) continue

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(section.id)
          }
        },
        { rootMargin: "-50% 0px" },
      )

      observer.observe(section.ref.current)
      observers.push(observer)
    }

    return () => {
      for (const observer of observers) observer.disconnect()
    }
  }, []) // 빈 deps — ref를 통해 sections 접근, 무한 루프 방지

  function handleClick(section: Section) {
    section.ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-10 flex items-center gap-6 bg-background">
      {sections.map((section) => (
        <button
          key={section.id}
          type="button"
          onClick={() => handleClick(section)}
          className={cn(
            "relative flex h-11 items-center justify-center px-0 text-title-4 font-bold transition-colors",
            activeId === section.id
              ? "text-label-normal"
              : "text-label-assistive hover:text-label-neutral",
          )}
        >
          {section.label}
          {activeId === section.id && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-label-normal" />
          )}
        </button>
      ))}
    </nav>
  )
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/SectionAnchorNav.tsx
git commit -m "feat(pledges): sticky 앵커 탭 네비게이션 컴포넌트"
```

---

## Task 4: ProfileSection 컴포넌트

**Files:**
- Create: `src/features/pledges/components/ProfileSection.tsx`

**참고:** 피그마 기본정보 label `w-[72px]`, 학력/경력 label `w-[100px]`. `CardSectionHeader` 재사용.

- [ ] **Step 1: 컴포넌트 작성**

```typescript
// src/features/pledges/components/ProfileSection.tsx
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import type { CandidateDetail, HistoryItem } from "@/features/pledges/data/mock-candidate-detail"

interface ProfileSectionProps {
  candidate: CandidateDetail
}

export function ProfileSection({ candidate }: ProfileSectionProps) {
  const [showAllCareers, setShowAllCareers] = useState(false)
  const visibleCareers = showAllCareers
    ? candidate.careerHistory
    : candidate.careerHistory?.slice(0, 4)

  return (
    <div className="flex flex-col gap-8 rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
      <CardSectionHeader title="프로필" />

      {/* 기본정보 */}
      <div className="flex flex-col gap-4">
        <h4 className="text-title-4 font-bold text-label-normal">기본정보</h4>
        <div className="flex flex-col gap-3">
          <InfoRow label="출생" value={candidate.birthDate ? `${candidate.birthDate} (${candidate.age}세)` : undefined}  />
          <InfoRow label="거주지" value={candidate.address}  />
          <InfoRow label="직업" value={candidate.job}  />
          <InfoRow label="보좌관" value={candidate.aides?.join(", ")}  />
        </div>
      </div>

      {/* 학력 */}
      {candidate.educationHistory && candidate.educationHistory.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="text-title-4 font-bold text-label-normal">학력</h4>
          <HistoryList items={candidate.educationHistory} />
        </div>
      )}

      {/* 경력 */}
      {candidate.careerHistory && candidate.careerHistory.length > 0 && (
        <div className="flex flex-col gap-4">
          <h4 className="text-title-4 font-bold text-label-normal">경력</h4>
          <HistoryList items={visibleCareers ?? []} />

          {/* 더보기 버튼 */}
          {(candidate.careerHistory.length > 4) && (
            <button
              type="button"
              onClick={() => setShowAllCareers((prev) => !prev)}
              className="flex items-center justify-center gap-0.5 text-label-4 font-semibold text-label-alternative"
            >
              {showAllCareers ? "접기" : "더보기"}
              <ChevronDown
                className={`size-4 transition-transform ${showAllCareers ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Sub-components ─── */

function InfoRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null
  return (
    <div className="flex items-center gap-1">
      <span className="w-[72px] shrink-0 text-label-4 font-medium text-label-alternative">
        {label}
      </span>
      <span className="text-label-4 font-semibold text-label-normal">{value}</span>
    </div>
  )
}

function HistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <span className="w-[100px] shrink-0 text-label-4 font-medium text-label-alternative">
            {item.period}
          </span>
          <span className="text-label-4 font-semibold text-label-normal">
            {item.description}
          </span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/ProfileSection.tsx
git commit -m "feat(pledges): 프로필 섹션 컴포넌트 (기본정보/학력/경력+더보기)"
```

---

## Task 5: PledgeRow + PledgeDonutChart 컴포넌트

**Files:**
- Create: `src/features/pledges/components/PledgeRow.tsx`
- Create: `src/features/pledges/components/PledgeDonutChart.tsx`

- [ ] **Step 1: PledgeRow 작성**

```typescript
// src/features/pledges/components/PledgeRow.tsx
import { ChevronDown } from "lucide-react"
import type { CandidatePledge } from "@/features/pledges/data/mock-candidate-detail"

const CATEGORY_VARIANT_STYLES: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  orange: "bg-orange-100 text-orange-700",
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  purple: "bg-violet-100 text-violet-700",
}

interface PledgeRowProps {
  pledge: CandidatePledge
  isOpen: boolean
  onToggle: () => void
}

export function PledgeRow({ pledge, isOpen, onToggle }: PledgeRowProps) {
  return (
    <div className="border-b border-line-neutral">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-0 py-4 text-left"
      >
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-label-3 font-semibold text-label-normal">
              {pledge.title}
            </span>
            <span className={`shrink-0 rounded-[6px] px-1.5 py-0.5 text-caption-1 font-semibold ${CATEGORY_VARIANT_STYLES[pledge.categoryVariant]}`}>
              {pledge.category}
            </span>
          </div>
          <span className="text-label-4 font-medium text-label-alternative">
            {pledge.description}
          </span>
        </div>
        <ChevronDown
          className={`mt-1 size-5 shrink-0 text-label-alternative transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* 아코디언 펼침 영역 (placeholder) */}
      {isOpen && (
        <div className="px-0 pb-4">
          <div className="rounded-xl bg-fill-normal p-4">
            <p className="text-label-4 font-medium text-label-alternative">
              상세 공약 내용은 추후 디자인이 제공됩니다
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: PledgeDonutChart 작성**

```typescript
// src/features/pledges/components/PledgeDonutChart.tsx
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import type { PledgeKeywordStat } from "@/features/pledges/data/mock-candidate-detail"

interface PledgeDonutChartProps {
  stats: PledgeKeywordStat[]
}

export function PledgeDonutChart({ stats }: PledgeDonutChartProps) {
  if (stats.length === 0) return null

  const topStat = stats.reduce((a, b) => (a.percentage > b.percentage ? a : b))

  return (
    <div className="flex flex-col items-center gap-6">
      {/* 차트 + 중앙 라벨 */}
      <div className="relative size-[240px]">
        <PieChart width={240} height={240}>
          <Pie
            data={stats}
            dataKey="percentage"
            nameKey="keyword"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={120}
            animationDuration={300}
            strokeWidth={0}
          >
            {stats.map((stat) => (
              <Cell key={stat.keyword} fill={stat.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>

        {/* 중앙 라벨 */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-heading-3 font-bold text-label-normal">
            {topStat.keyword}
          </span>
          <span className="text-label-4 font-medium text-label-alternative">
            {topStat.percentage}%
          </span>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {stats.map((stat) => (
          <div key={stat.keyword} className="flex items-center gap-1.5">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: stat.color }}
            />
            <span className="text-caption-2 font-medium text-label-neutral">
              {stat.keyword}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── 커스텀 Tooltip ─── */

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.[0]) return null
  return (
    <div className="rounded-lg bg-surface-inverse px-3 py-1.5 text-caption-1 font-semibold text-label-inverse shadow-md">
      {payload[0].value}%
    </div>
  )
}
```

- [ ] **Step 3: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/components/PledgeRow.tsx src/features/pledges/components/PledgeDonutChart.tsx
git commit -m "feat(pledges): 공약 행(아코디언) + 도넛 차트 컴포넌트"
```

---

## Task 6: PledgesSection 컴포넌트

**Files:**
- Create: `src/features/pledges/components/PledgesSection.tsx`

**참고:** `ElectionTermFilter` 패턴을 참고하여 Chip 드롭다운 구현.

- [ ] **Step 1: 컴포넌트 작성**

```typescript
// src/features/pledges/components/PledgesSection.tsx
import { useState } from "react"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { Chip } from "@/components/ui/chip"
import { PledgeDonutChart } from "./PledgeDonutChart"
import { PledgeRow } from "./PledgeRow"
import type { CandidateDetail } from "@/features/pledges/data/mock-candidate-detail"

interface PledgesSectionProps {
  candidate: CandidateDetail
}

export function PledgesSection({ candidate }: PledgesSectionProps) {
  const [openPledges, setOpenPledges] = useState<Set<string>>(new Set())

  function togglePledge(id: string) {
    setOpenPledges((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const pledges = candidate.pledges ?? []
  const stats = candidate.pledgeKeywordStats ?? []

  return (
    <div className="flex flex-col gap-8 rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
      <CardSectionHeader title="공약" />

      {/* Chip 필터 (static for mock) */}
      <Chip
        label={candidate.electionInfo}
        size="medium"
        state="active"
        variant="outlined"
      />

      {/* 도넛 차트 */}
      {stats.length > 0 && <PledgeDonutChart stats={stats} />}

      {/* 공약 리스트 */}
      {pledges.length > 0 ? (
        <div className="flex flex-col">
          {pledges.map((pledge) => (
            <PledgeRow
              key={pledge.id}
              pledge={pledge}
              isOpen={openPledges.has(pledge.id)}
              onToggle={() => togglePledge(pledge.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-10">
          <p className="text-label-4 font-medium text-label-alternative">
            등록된 데이터가 없습니다
          </p>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/features/pledges/components/PledgesSection.tsx
git commit -m "feat(pledges): 공약 섹션 컴포넌트 (필터+차트+아코디언 리스트)"
```

---

## Task 7: NewsRow + NewsSection 컴포넌트

**Files:**
- Create: `src/features/pledges/components/NewsRow.tsx`
- Create: `src/features/pledges/components/NewsSection.tsx`

- [ ] **Step 1: NewsRow 작성**

```typescript
// src/features/pledges/components/NewsRow.tsx
import type { CandidateNews } from "@/features/pledges/data/mock-candidate-detail"

interface NewsRowProps {
  news: CandidateNews
}

export function NewsRow({ news }: NewsRowProps) {
  return (
    <div className="flex gap-3 items-center">
      {/* 썸네일 */}
      {news.thumbnailUrl ? (
        <img
          src={news.thumbnailUrl}
          alt=""
          className="h-[60px] w-[80px] shrink-0 rounded-[10px] border border-line-neutral object-cover"
        />
      ) : (
        <div className="flex h-[60px] w-[80px] shrink-0 items-center justify-center rounded-[10px] border border-line-neutral bg-fill-normal" />
      )}

      {/* 콘텐츠 */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-label-3 font-semibold text-label-normal">
          {news.title}
        </p>
        <div className="flex items-center gap-1 text-caption-2 font-medium text-label-neutral">
          <span>{news.timeAgo}</span>
          <span>·</span>
          <span>{news.source}</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: NewsSection 작성**

```typescript
// src/features/pledges/components/NewsSection.tsx
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { CardSectionHeader } from "@/components/ui/card-section-header"
import { CircleInfoFill } from "@/components/icons"
import { NewsRow } from "./NewsRow"
import type { CandidateNews } from "@/features/pledges/data/mock-candidate-detail"

interface NewsSectionProps {
  news: CandidateNews[]
}

const INITIAL_COUNT = 4
const LOAD_MORE_COUNT = 4

export function NewsSection({ news }: NewsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT)
  const visibleNews = news.slice(0, visibleCount)
  const hasMore = visibleCount < news.length

  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
      <CardSectionHeader
        title="관련 뉴스 이슈"
        trailingContent={
          <CircleInfoFill className="size-6 text-label-alternative" />
        }
      />

      {visibleNews.length > 0 ? (
        <div className="flex flex-col gap-3">
          {visibleNews.map((item) => (
            <NewsRow key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-10">
          <p className="text-label-4 font-medium text-label-alternative">
            등록된 데이터가 없습니다
          </p>
        </div>
      )}

      {/* 더보기 */}
      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount((prev) => prev + LOAD_MORE_COUNT)}
          className="flex items-center justify-center gap-0.5 text-label-4 font-semibold text-label-alternative"
        >
          더보기
          <ChevronDown className="size-4" />
        </button>
      )}
    </div>
  )
}
```

- [ ] **Step 3: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/features/pledges/components/NewsRow.tsx src/features/pledges/components/NewsSection.tsx
git commit -m "feat(pledges): 관련 뉴스 섹션 컴포넌트 (뉴스 행+더보기)"
```

---

## Task 8: CandidateDetailPage 페이지 조합

**Files:**
- Create: `src/app/routes/CandidateDetailPage.tsx`

- [ ] **Step 1: 페이지 컴포넌트 작성**

```typescript
// src/app/routes/CandidateDetailPage.tsx
import { useRef } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { ChevronLeft } from "lucide-react"
import { useBreadcrumb } from "@/contexts/useNavigation"
import {
  getCandidateDetail,
  ELECTION_TYPE_LABEL_MAP,
} from "@/features/pledges/data/mock-candidate-detail"
import { CandidateProfileHeader } from "@/features/pledges/components/CandidateProfileHeader"
import { SectionAnchorNav } from "@/features/pledges/components/SectionAnchorNav"
import { ProfileSection } from "@/features/pledges/components/ProfileSection"
import { PledgesSection } from "@/features/pledges/components/PledgesSection"
import { NewsSection } from "@/features/pledges/components/NewsSection"

export function CandidateDetailPage() {
  const { electionType = "", candidateId = "" } = useParams()
  const navigate = useNavigate()
  const candidate = getCandidateDetail(candidateId)
  const electionLabel = ELECTION_TYPE_LABEL_MAP[electionType] ?? electionType

  useBreadcrumb([
    { label: "역대공약분석" },
    { label: electionLabel },
    { label: candidate?.name ?? "" },
  ])

  const profileRef = useRef<HTMLDivElement>(null)
  const pledgesRef = useRef<HTMLDivElement>(null)
  const newsRef = useRef<HTMLDivElement>(null)

  // 잘못된 candidateId → 리다이렉트
  if (!candidate) {
    return <Navigate to="/pledges" replace />
  }

  const sections = [
    { id: "profile", label: "프로필", ref: profileRef },
    { id: "pledges", label: "공약", ref: pledgesRef },
    { id: "news", label: "관련뉴스", ref: newsRef },
  ]

  return (
    <div className="min-w-[1040px] space-y-4 px-20 py-4">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-title-4 font-bold text-label-alternative"
      >
        <ChevronLeft className="size-4" />
        공약목록
      </button>

      {/* 프로필 헤더 */}
      <CandidateProfileHeader candidate={candidate} />

      {/* 앵커 탭 */}
      <SectionAnchorNav sections={sections} />

      {/* 프로필 섹션 */}
      <div ref={profileRef}>
        <ProfileSection candidate={candidate} />
      </div>

      {/* 공약 섹션 */}
      <div ref={pledgesRef}>
        <PledgesSection candidate={candidate} />
      </div>

      {/* 뉴스 섹션 */}
      <div ref={newsRef}>
        <NewsSection news={candidate.news ?? []} />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공

- [ ] **Step 3: 커밋**

```bash
git add src/app/routes/CandidateDetailPage.tsx
git commit -m "feat(pledges): 후보자 상세 페이지 컴포넌트 조합"
```

---

## Task 9: 라우터 & 카드 네비게이션 연결

**Files:**
- Modify: `src/app/router.tsx:37` — 라우트 추가
- Modify: `src/features/pledges/components/CandidateCard.tsx` — Link 래핑
- Modify: `src/features/pledges/components/CandidateGrid.tsx` — electionCategory prop 전달
- Modify: `src/features/pledges/components/CandidateTable.tsx` — 행 클릭 네비게이션

- [ ] **Step 1: router.tsx에 라우트 추가**

`router.tsx` line 37 (`/pledges/:type` 위)에 추가:

```typescript
// import 추가
import { CandidateDetailPage } from "@/app/routes/CandidateDetailPage";

// children 배열에서 /pledges/:type 위에 삽입
{ path: "/pledges/:electionType/:candidateId", element: <CandidateDetailPage /> },
```

- [ ] **Step 2: CandidateCard에 Link 래핑 + electionCategory prop**

```typescript
// CandidateCard.tsx — props에 electionCategory 추가, 조건부 Link 래핑
import { Link } from "react-router-dom"

interface CandidateCardProps {
  candidate: Candidate
  electionCategory?: string  // "presidential" | "parliamentary" | "local"
}

export function CandidateCard({ candidate, electionCategory }: CandidateCardProps) {
  const partyColor = PARTY_COLOR_MAP[candidate.party]

  const card = (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]">
      {/* ... 기존 내용 동일 ... */}
    </div>
  )

  // electionCategory가 있을 때만 Link로 래핑 (없으면 기존처럼 비클릭)
  if (electionCategory) {
    return (
      <Link to={`/pledges/${electionCategory}/${candidate.id}`} className="block">
        {card}
      </Link>
    )
  }

  return card
}
```

- [ ] **Step 3: CandidateGrid에 electionCategory prop 전달**

```typescript
// CandidateGrid.tsx — props에 electionCategory 추가
interface CandidateGridProps {
  candidates: Candidate[]
  hideHeader?: boolean
  electionCategory?: string
}

export function CandidateGrid({ candidates, hideHeader = false, electionCategory }: CandidateGridProps) {
  // ... grid 내에서 CandidateCard에 electionCategory 전달
  <CandidateCard
    key={candidate.id}
    candidate={candidate}
    electionCategory={electionCategory}
  />
}
```

- [ ] **Step 4: CandidateTable 행 클릭 네비게이션 추가**

```typescript
// CandidateTable.tsx — props에 electionCategory 추가, useNavigate 사용
import { useNavigate } from "react-router-dom"

interface CandidateTableProps {
  candidates: Candidate[]
  electionCategory?: string
}

export function CandidateTable({ candidates, electionCategory }: CandidateTableProps) {
  const navigate = useNavigate()

  // tr에 onClick 추가:
  <tr
    key={candidate.id}
    onClick={() => electionCategory && navigate(`/pledges/${electionCategory}/${candidate.id}`)}
    // 기존 hover:bg-label-alternative → hover:bg-fill-normal로 수정 (label 토큰이 아닌 fill 토큰이 hover 배경에 적합)
    className="h-16 cursor-pointer border-b border-line-neutral text-body-3 font-medium hover:bg-fill-normal"
  >
```

- [ ] **Step 5: 기존 페이지에 electionCategory prop 전달 확인**

기존 3개 페이지에서 `CandidateGrid`/`CandidateTable` 호출 시 `electionCategory` 전달:
- `PresidentialPledgesPage.tsx`: `<CandidateGrid ... electionCategory="presidential" />`
- `ParliamentaryPledgesPage.tsx`: `<CandidateGrid ... electionCategory="parliamentary" />`
- `LocalElectionPledgesPage.tsx`: `<CandidateGrid ... electionCategory="local" />` 및 `<CandidateTable ... electionCategory="local" />`

- [ ] **Step 6: 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공, 타입 에러 없음

- [ ] **Step 7: 커밋**

```bash
git add src/app/router.tsx src/features/pledges/components/CandidateCard.tsx src/features/pledges/components/CandidateGrid.tsx src/features/pledges/components/CandidateTable.tsx src/app/routes/PresidentialPledgesPage.tsx src/app/routes/ParliamentaryPledgesPage.tsx src/app/routes/LocalElectionPledgesPage.tsx
git commit -m "feat(pledges): 라우터 연결 + 카드/테이블 클릭 네비게이션"
```

---

## Task 10: Barrel export + MODULE_MAP 업데이트

**Files:**
- Modify: `src/features/pledges/components/index.ts`
- Modify: `docs/MODULE_MAP.md`

- [ ] **Step 1: index.ts에 신규 컴포넌트 추가**

```typescript
// src/features/pledges/components/index.ts 에 추가
export { CandidateProfileHeader } from "./CandidateProfileHeader"
export { SectionAnchorNav } from "./SectionAnchorNav"
export { ProfileSection } from "./ProfileSection"
export { PledgesSection } from "./PledgesSection"
export { PledgeDonutChart } from "./PledgeDonutChart"
export { PledgeRow } from "./PledgeRow"
export { NewsSection } from "./NewsSection"
export { NewsRow } from "./NewsRow"
```

- [ ] **Step 2: MODULE_MAP.md 업데이트**

Pledges 섹션에 추가:
- `CandidateDetailPage.tsx` — 후보자 상세 페이지
- 신규 컴포넌트 9개 목록
- `mock-candidate-detail.ts` — 상세 mock 데이터

라우팅 테이블에 추가:
- `/pledges/:electionType/:candidateId` | CandidateDetailPage | 필요

- [ ] **Step 3: 최종 빌드 검증**

Run: `pnpm run build`
Expected: 빌드 성공, 경고 없음

- [ ] **Step 4: 최종 lint 검증**

Run: `pnpm run lint`
Expected: 에러 없음

- [ ] **Step 5: 커밋**

```bash
git add src/features/pledges/components/index.ts docs/MODULE_MAP.md
git commit -m "docs: MODULE_MAP 업데이트 + barrel export 추가"
```
