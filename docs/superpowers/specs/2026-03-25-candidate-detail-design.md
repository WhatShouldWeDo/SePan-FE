# 후보자 상세 페이지 설계

> Figma: C.1.1.역대공약분석-후보자상세보기
> 작성일: 2026-03-25

---

## 1. 개요

역대선거공약분석 페이지에서 후보자 카드를 클릭하면 진입하는 후보자 상세 정보 페이지.
프로필, 공약, 관련 뉴스를 하나의 스크롤 페이지에 수직 나열하고, sticky 앵커 탭으로 섹션 간 이동을 지원한다.

**목표**: API 관련 코드만 수정하면 바로 동작할 수 있는 수준의 퍼블리싱.

---

## 2. 라우팅

| 경로 | 페이지 | 비고 |
|---|---|---|
| `/pledges/:electionType/:candidateId` | `CandidateDetailPage` | `electionType`: presidential / parliamentary / local |

- 기존 `/pledges/presidential`, `/pledges/parliamentary`, `/pledges/local` 패턴과 일관
- **라우트 순서**: `router.tsx`에서 반드시 `/pledges/:type` catch-all 라우트 **위에** 삽입해야 함
- 브레드크럼: `역대공약분석 > {선거유형} > {후보자명}`
- 뒤로가기: `< 공약목록` → `navigate(-1)`

### 선거 유형 라벨 매핑

```typescript
const ELECTION_TYPE_LABEL_MAP: Record<string, string> = {
  presidential: '대통령선거',
  parliamentary: '국회의원선거',
  local: '지방선거',
}
```

---

## 3. 데이터 모델

### 3-1. CandidateDetail (Candidate 확장)

```typescript
interface CandidateDetail extends Candidate {
  birthDate?: string              // "1965.04.18"
  age?: number                    // 60
  address?: string                // "서울특별시 강남구 압구정로"
  aides?: string[]                // ["김수경", "박영호"]
  socialLinks?: SocialLink[]
  educationHistory?: HistoryItem[]
  careerHistory?: HistoryItem[]
  pledges?: CandidatePledge[]
  news?: CandidateNews[]
  pledgeKeywordStats?: PledgeKeywordStat[]
}

interface SocialLink {
  type: 'instagram' | 'facebook' | 'linkedin'
  url: string
}

interface HistoryItem {
  period: string                  // "1972 ~ 1984"
  description: string             // "석막초등학교"
}

interface CandidatePledge {
  id: string
  title: string
  description: string
  category: string                // "복지", "교육" 등
  categoryVariant: 'red' | 'orange' | 'blue' | 'green' | 'purple'
}

interface CandidateNews {
  id: string
  title: string
  source: string                  // "조선일보"
  timeAgo: string                 // "1시간 전"
  thumbnailUrl?: string
}

interface PledgeKeywordStat {
  keyword: string
  percentage: number
  color: string                   // hex color for donut chart
}
```

### 3-2. 기존 타입과의 관계

- `Candidate`, `Party`, `PARTY_COLOR_MAP` — `mock-candidates.ts`에서 import
- `ElectionTerm` — 필터용
- **`careers` vs `careerHistory` 구분**: 기존 `Candidate.careers: string[]`은 ProfileHeader의 경력 요약 3줄 표시용. `CandidateDetail.careerHistory: HistoryItem[]`은 ProfileSection의 기간별 구조화 경력 목록용. 동일 데이터의 다른 뷰.
- **`education` vs `educationHistory`**: 동일 패턴. `education`은 카드용 한 줄 요약, `educationHistory`는 상세 타임라인.

---

## 4. 컴포넌트 구조

### 4-1. 페이지 트리

```
CandidateDetailPage
├─ BackButton ("< 공약목록")
├─ CandidateProfileHeader
│  ├─ 프로필 사진 (140×175px, rounded-2xl)
│  ├─ 이름 (Heading 3/Bold, 24px) + 정당 배지 (Small)
│  ├─ SNS 아이콘 (Instagram/Facebook/LinkedIn, 24px)
│  ├─ 위치 배지 + 선거정보 배지
│  └─ 경력 요약 3줄 (Label 4/Medium)
├─ SectionAnchorNav (sticky top-0)
│  ├─ "프로필" 버튼
│  ├─ "공약" 버튼
│  └─ "관련뉴스" 버튼
├─ ProfileSection (ref)
│  └─ CardSection 래퍼
│     ├─ CardSectionHeader title="프로필"
│     ├─ 기본정보 (label w-[72px] + value)
│     ├─ 학력 (label w-[100px] + value)
│     └─ 경력 (label w-[100px] + value + 더보기 토글)
├─ PledgesSection (ref)
│  └─ CardSection 래퍼
│     ├─ CardSectionHeader title="공약"
│     ├─ Chip 필터 (선거 회차)
│     ├─ PledgeDonutChart (Recharts PieChart)
│     └─ PledgeRow[] (아코디언, 다중 열림)
└─ NewsSection (ref)
   └─ CardSection 래퍼
      ├─ CardSectionHeader title="관련 뉴스 이슈" + info 아이콘
      ├─ NewsRow[] (초기 4개)
      └─ "더보기" 버튼
```

### 4-2. 새로 생성할 파일

| 파일 경로 | 역할 |
|---|---|
| `src/app/routes/CandidateDetailPage.tsx` | 페이지 컴포넌트 (데이터 보유, 섹션 조합) |
| `src/features/pledges/components/CandidateProfileHeader.tsx` | 프로필 헤더 |
| `src/features/pledges/components/SectionAnchorNav.tsx` | sticky 앵커 탭 네비게이션 |
| `src/features/pledges/components/ProfileSection.tsx` | 프로필 카드 섹션 |
| `src/features/pledges/components/PledgesSection.tsx` | 공약 카드 섹션 |
| `src/features/pledges/components/PledgeDonutChart.tsx` | Recharts 도넛 차트 |
| `src/features/pledges/components/PledgeRow.tsx` | 공약 행 (아코디언) |
| `src/features/pledges/components/NewsSection.tsx` | 관련 뉴스 카드 섹션 |
| `src/features/pledges/components/NewsRow.tsx` | 뉴스 행 |
| `src/features/pledges/data/mock-candidate-detail.ts` | CandidateDetail 타입 + mock 데이터 |

### 4-3. 기존 컴포넌트 재사용

| 피그마 요소 | 기존 컴포넌트 | 사용 방식 |
|---|---|---|
| 섹션 헤더 | `CardSectionHeader` | title, trailingContent props |
| 정당 배지 색상 | `PARTY_COLOR_MAP` | CandidateCard과 동일 패턴 |
| 위치/선거 배지 | CandidateCard 배지 패턴 | 동일 클래스 재사용 |
| 선거 회차 필터 | `Chip` | state="active", variant="outlined" |
| location 아이콘 | `location-fill.svg` | 기존 에셋 |

---

## 5. 섹션별 UI 상세

### 5-1. ProfileHeader

흰색 라운드 배경 (`rounded-3xl bg-white py-8`) 안에 가로 배치:

- **좌측**: 프로필 사진 140×175px, `rounded-2xl`, `object-cover`
- **우측** (flex-col gap-3):
  - Row 1: 이름(24px Bold) + 정당배지(Small, 14px) + SNS 아이콘(24px × 3)
  - Row 2: 위치 배지(location icon + 텍스트) + 선거정보 배지
  - Row 3: 경력 요약 최대 3줄 (14px Medium, `text-label-alternative`)

### 5-2. SectionAnchorNav

- `sticky top-0 z-10 bg-background` (CSS 변수 `--background`가 Background/Normal에 해당)
- 3개 버튼: 프로필 | 공약 | 관련뉴스
- 활성 탭: `text-label-normal font-bold` + 하단 2px border
- 비활성 탭: `text-label-assistive font-bold`
- 클릭: `scrollIntoView({ behavior: 'smooth' })`
- `IntersectionObserver` (rootMargin: `'-50% 0px'`)로 뷰포트 중앙 기준 활성 섹션 감지 → 탭 자동 업데이트

### 5-3. ProfileSection

CardSection 래퍼 (`rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]`) 안에 3개 서브섹션 `gap-8`:

**기본정보**:
- 서브 헤더: "기본정보" (Title 4/Bold, 16px)
- 항목: label 고정폭 `w-[72px]` (Label 4/Medium, `text-label-alternative`) + value (Label 4/Semibold, `text-label-normal`)
- 필드: 출생, 거주지, 직업, 보좌관

**학력**:
- 서브 헤더: "학력"
- 항목: label 고정폭 `w-[100px]` (기간) + value (학교명)

**경력**:
- 학력과 동일 패턴
- 초기 4개만 표시 → "더보기 ∨" 클릭 시 전체 표시 (클라이언트 토글)
- "더보기" 버튼: 14px Semibold `text-label-alternative`, 중앙 정렬, chevron-down 아이콘

### 5-4. PledgesSection

CardSection 래퍼 안에:

**Chip 필터**: 기존 `Chip` 컴포넌트를 드롭다운 트리거로 사용 (`size="medium"`, `variant="outlined"`). 기존 `ElectionTermFilter` 컴포넌트 패턴을 참고하여 선거 회차 선택 드롭다운 구현. 선택된 상태에서 `state="active"`, 미선택 시 `state="default"`.

**PledgeDonutChart**:
- Recharts `PieChart` + `Pie` (innerRadius=55, outerRadius=120, 240×240px)
- 중앙 라벨: `absolute`로 차트 위에 오버레이 (`inset-0 flex items-center justify-center`). 아이콘(32px) + 키워드(Heading 3) + 퍼센트(Label 4)
- 하단 범례: 색상 dot(10px) + 카테고리명(Caption, 12px). 커스텀 렌더링 (Recharts Legend 사용하지 않음)
- hover: Recharts `<Tooltip>` 컴포넌트 사용 (Radix Tooltip 아님). 커스텀 content로 피그마 스타일 적용
- `dataKey="percentage"`, `nameKey="keyword"`, animationDuration=300

**PledgeRow**:
- 행 구조: 제목(16px Semibold) + 카테고리 배지(색상별) + 설명 1줄(14px Medium, `text-label-alternative`) + chevron
- 아코디언: 다중 열림 가능, `useState<Set<string>>` 관리. 토글 시 항상 새 Set 생성: `new Set(prev).add(id)` / `new Set([...prev].filter(x => x !== id))`
- 펼침 영역: placeholder ("상세 공약 내용은 추후 디자인이 제공됩니다")

### 5-5. NewsSection

CardSection 래퍼 안에:

- `CardSectionHeader` title="관련 뉴스 이슈", `trailingContent`에 `CircleInfoFill` 아이콘(24px, 기존 `components/icons/CircleInfoFill.tsx`)

**NewsRow**:
- 썸네일: 80×60px, `rounded-[10px]`, `object-cover`, 테두리(`border border-line-neutral`)
- 제목: Label 3/Semibold(16px), `text-label-normal`, 1줄 ellipsis
- 메타: Caption 2/Medium(12px), `text-label-neutral`, "1시간 전 · 조선일보"

**더보기**: 초기 4개 표시, "더보기" 클릭 시 추가 4개씩 표시 (mock에서는 전체 데이터 슬라이스)

### 5-6. CardSection 래퍼

각 섹션(프로필/공약/뉴스)을 감싸는 카드 컨테이너. 대시보드 `CardSection`과 유사하지만 shadow 값이 다르므로, 인라인 Tailwind 클래스로 직접 적용:

```
rounded-[20px] bg-white p-8 shadow-[0px_2px_32px_0px_rgba(8,31,116,0.06)]
```

별도 컴포넌트로 추출하지 않고, 각 섹션 컴포넌트의 최외곽 div에 적용.

### 5-7. 에러/빈 상태

- **잘못된 candidateId**: mock 데이터에서 찾지 못하면 `<Navigate to="/pledges" replace />` 로 리다이렉트
- **빈 공약/뉴스**: 해당 섹션에 "등록된 데이터가 없습니다" 텍스트 표시 (14px Medium, `text-label-alternative`, 중앙 정렬)
- **로딩 상태**: mock 단계에서는 불필요. API 전환 시 스켈레톤 추가 예정

---

## 6. 상태 관리

| 상태 | 관리 위치 | 방식 |
|---|---|---|
| 후보자 상세 데이터 | CandidateDetailPage | mock → 추후 React Query |
| 활성 앵커 탭 | SectionAnchorNav | useState + IntersectionObserver |
| 경력 더보기 토글 | ProfileSection | useState<boolean> |
| 공약 아코디언 열림 | PledgesSection | useState<Set<string>> |
| 뉴스 표시 개수 | NewsSection | useState<number> (초기 4) |

---

## 7. API 전환 전략

현재 mock 데이터를 사용하며, API 전환 시 변경 포인트:

1. `mock-candidate-detail.ts`의 `getCandidateDetail(id)` 함수 → React Query `useQuery` 훅으로 교체
2. `CandidateDetailPage`에서 `useParams()`의 `candidateId`로 API 호출
3. 뉴스 "더보기"는 offset 기반 페이지네이션 API로 전환 가능
4. 도넛 차트 데이터도 API 응답에 포함

---

## 8. 파일 매니페스트

### 신규 파일 (10개)

```
src/app/routes/CandidateDetailPage.tsx
src/features/pledges/components/CandidateProfileHeader.tsx
src/features/pledges/components/SectionAnchorNav.tsx
src/features/pledges/components/ProfileSection.tsx
src/features/pledges/components/PledgesSection.tsx
src/features/pledges/components/PledgeDonutChart.tsx
src/features/pledges/components/PledgeRow.tsx
src/features/pledges/components/NewsSection.tsx
src/features/pledges/components/NewsRow.tsx
src/features/pledges/data/mock-candidate-detail.ts
```

### 수정 파일 (4개)

```
src/app/router.tsx                                    — 라우트 추가 (/:type catch-all 위에 삽입)
src/features/pledges/components/CandidateCard.tsx      — Link 래핑 추가 (상세 페이지 네비게이션)
src/features/pledges/components/CandidateTable.tsx     — 행 클릭 네비게이션 추가
docs/MODULE_MAP.md                                    — 모듈 맵 업데이트
```

### CandidateCard/CandidateTable 네비게이션

기존 `CandidateCard`와 `CandidateTable`에 클릭 시 상세 페이지 이동 기능 추가:
- `CandidateCard`: react-router-dom `<Link to={/pledges/${electionCategory}/${candidate.id}}>` 로 래핑. `electionCategory`(presidential/parliamentary/local)는 새로운 prop으로 전달. **주의**: 기존 `Candidate.electionType`(national/proportional 등)과 혼동하지 않도록 prop 이름을 `electionCategory`로 구분.
- `CandidateTable`: 행 클릭 시 `useNavigate`로 동일 URL 이동.
