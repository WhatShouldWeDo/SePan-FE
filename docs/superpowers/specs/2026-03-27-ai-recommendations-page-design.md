# AI 추천 공약 페이지 설계 (P.2.0)

## 개요

정책개발 메인 페이지(`/policy`)의 "추천 공약 전체보기"에서 진입하는 AI 추천 공약 전체 목록 페이지.
지역 분석 데이터와 역대 공약을 기반으로 AI가 추천한 공약을 카드 형태로 보여주며, 채택/상세보기 기능을 제공한다.

- **Figma**: P.2.0.정책개발-AI추천공약
- **라우트**: `/policy/recommendations`
- **진입점**: `AiRecommendationSection`의 "추천 공약 전체보기" 버튼

---

## 페이지 구조

```
AiRecommendationsPage
├── useBreadcrumb([{ label: "정책개발" }, { label: "AI 추천 공약" }])
├── Header (<h1> "AI 추천 공약" + <p> 설명, PolicyPage 패턴과 동일)
├── RegionInfoBar
│   ├── 선거구명 (MapPin 아이콘) + 업데이트 시간
│   └── 지역 특성 뱃지 목록 (6개)
├── Filter Chips (3개: "매칭률순" 동작 + "카테고리" placeholder + "지역" placeholder)
└── RecommendationCard[] (추천 공약 카드 리스트, 4-6개 mock 항목)
    ├── 카테고리 대형 아이콘 (64x64)
    ├── 제목 + Match rate 뱃지 (WantedMagicWand 아이콘)
    ├── 지역 뱃지 (MapPin 아이콘) + 태그 뱃지들
    ├── AI 인사이트 박스 (보라색 배경, WantedMagicWand 아이콘)
    ├── 예상 효과 박스 (회색 배경, CircleCheckFill 아이콘)
    ├── "상세보기" 버튼 → RecommendationDetailModal
    └── "채택하기" 버튼 (미채택 시만 표시, 클릭 시 UI 상태 토글)
```

---

## 파일 구조

```
src/features/policy/
├── components/
│   ├── RecommendationCard.tsx        # 추천 공약 카드
│   ├── RegionInfoBar.tsx             # 지역 정보 + 특성 뱃지 바
│   ├── RecommendationDetailModal.tsx # 상세보기 모달
│   └── index.ts                     # barrel export 업데이트
├── data/
│   └── mock-policy.ts               # 기존 파일에 mock 데이터 추가
src/app/routes/
│   └── AiRecommendationsPage.tsx     # 페이지 컴포넌트
src/app/router.tsx                    # 라우트 추가
src/features/policy/components/AiRecommendationSection.tsx  # 네비게이션 연결
```

---

## 데이터 구조

### AiRecommendationDetail

기존 `AiRecommendation` 인터페이스를 확장하여 상세 정보를 추가한다.

```typescript
// 기존 인터페이스 (mock-policy.ts에 정의됨)
interface AiRecommendation {
  id: string
  title: string
  matchRate: number
}

// 상세 인터페이스 — AiRecommendation 확장
interface AiRecommendationDetail extends AiRecommendation {
  region: string                                 // "삼성동"
  categoryId: string                             // 대표 카테고리 — CATEGORIES에서 대형 아이콘·색상 매핑용
  tags: { categoryId: string; label: string }[]  // 관련 태그 뱃지 목록 (대표 카테고리와 별개, 복수 가능)
  aiInsight: string                              // AI 분석 텍스트
  expectedEffect: string                         // 예상 효과 텍스트
  description: string                            // 모달 상세 설명 (카드보다 풍부한 내용)
  updatedAt: string                              // "2026-03-27" 정렬용 날짜
  isAdopted: boolean                             // 채택 여부 → 버튼 상태
}
```

> **`categoryId` vs `tags` 관계**: `categoryId`는 카드 좌상단 대형 아이콘(64×64)에 매핑되는 **대표 카테고리 1개**이다. `tags`는 카드 뱃지 영역에 표시되는 **관련 태그 목록**으로, 대표 카테고리와 중복될 수 있다.
>
> **참고**: `categoryId`는 `@/features/region/data/categories`의 CATEGORIES에서 색상/아이콘을 매핑한다. 이는 `PledgeRow` 컴포넌트와 동일한 cross-module import 패턴이며, 향후 공통 모듈 분리를 고려할 수 있다.

### RegionInfo

```typescript
interface RegionInfo {
  name: string                                   // "서울특별시 강남구 갑"
  updatedAt: string                              // "오늘 오전 9:23"
  characteristics: { categoryId: string; label: string }[]  // 지역 특성 뱃지
}
```

### Mock 데이터 가이드

- 4-6개의 추천 공약 항목 생성
- 다양한 카테고리 포함 (유효한 `categoryId` 값: `voter`, `economy`, `housing`, `safety`, `welfare`, `transport`, `culture`, `aging`, `education`)
- matchRate 50-90% 범위로 다양하게
- 최소 1개 항목은 `isAdopted: true`로 설정

---

## 컴포넌트 설계

### 1. AiRecommendationsPage

- `useBreadcrumb([{ label: "정책개발" }, { label: "AI 추천 공약" }])`
- `useState`로 정렬 상태, 채택 상태 목록, 선택된 카드(모달용) 관리
- mock 데이터 import하여 렌더
- 페이지 헤더: `<h1>` + `<p>` (PolicyPage 패턴과 동일, `CardSectionHeader` 아님)
- 빈 상태: 추천 공약이 없을 때 "추천 공약이 없습니다" 안내 텍스트 표시

### 2. RegionInfoBar

**Props:**
```typescript
interface RegionInfoBarProps {
  name: string
  updatedAt: string
  characteristics: { categoryId: string; label: string }[]
}
```

**디자인 스펙:**
- 배경: `bg-cool-neutral-5` (#f7f8fa), `rounded-[24px]`, `p-8`
- 선거구명: `MapPin` (lucide-react) 아이콘 + `text-primary font-bold text-title-2`
- 업데이트 시간: `text-label-alternative text-label-3 font-semibold`
- 특성 뱃지: CATEGORIES 아이콘 + 텍스트, `rounded-[8px]`, neutral 색상 배경 8% opacity

### 3. RecommendationCard

**Props:**
```typescript
interface RecommendationCardProps {
  recommendation: AiRecommendationDetail
  onViewDetail: (id: string) => void
  onAdopt: (id: string) => void
}
```

**아이콘 매핑:**
- Match 뱃지: `WantedMagicWand` (`@/components/icons`)
- 지역 뱃지: `MapPin` (lucide-react)
- AI 인사이트: `WantedMagicWand` (`@/components/icons`)
- 예상 효과: `CircleCheckFill` (`@/components/icons`)
- 카테고리 대형 아이콘: CATEGORIES 매핑

**디자인 스펙:**
- 카드: `bg-white border border-line-neutral rounded-[24px] p-8`
- 상단 행: 카테고리 아이콘(64×64 컨테이너, rounded-12, 카테고리 색상 8% 배경, 내부 아이콘은 `mask-image` 기법으로 32×32 렌더) + 제목/뱃지 + 버튼
  - 제목: `text-title-1 font-bold text-label-normal`
  - Match 뱃지: WantedMagicWand 아이콘 + "66% Match", primary 색상, `rounded-[6px]`
  - 지역 뱃지: MapPin 아이콘 + 지역명, primary 색상
  - 태그 뱃지: CATEGORIES 아이콘 + 라벨, neutral 색상
- 하단 영역:
  - AI 인사이트: `bg-primary/8 rounded-[12px] px-4 py-3`, WantedMagicWand 아이콘 + 텍스트 (primary 색상)
  - 예상 효과: `bg-fill-normal rounded-[12px] px-4 py-3`, CircleCheckFill 아이콘 + 텍스트 (neutral 색상)
- 버튼:
  - 상세보기: Button variant="outline" (Assistive 스타일, `border-line-neutral`)
  - 채택하기: Button variant="default" (Primary Solid 스타일), `isAdopted === false`일 때만 표시

### 4. RecommendationDetailModal

**Props:**
```typescript
interface RecommendationDetailModalProps {
  recommendation: AiRecommendationDetail | null
  open: boolean
  onClose: () => void
  onAdopt: (id: string) => void
}
```

**디자인 스펙:**
- 기존 `Dialog` 컴포넌트 활용, `DialogContent`에 `className="sm:max-w-2xl"`로 너비 확장 (`cn()` 유틸이 기본 `sm:max-w-lg`를 올바르게 병합)
- 단일 컬럼 레이아웃, `p-8 flex flex-col gap-6`
- 상단: 카테고리 아이콘 + 제목 + Match 뱃지 (카드와 동일)
- 중단: `description` 필드 표시 (카드에는 없는 상세 설명)
- 하단: AI 인사이트 + 예상 효과 박스 (카드와 동일 패턴)
- 푸터: 미채택 시 "채택하기" 버튼, 채택 완료 시 "채택 완료" 비활성 표시

---

## 재사용 컴포넌트

| 기존 컴포넌트 | 용도 |
|---|---|
| `Badge` | 매치율, 지역, 카테고리 뱃지 |
| `Button` | 상세보기/채택하기 버튼 |
| `Chip` | 필터 칩 |
| `Dialog` | 상세보기 모달 |
| `PressOverlay` | 카드/버튼 호버 인터랙션 |
| `useBreadcrumb` | GNB 브레드크럼 설정 |
| CATEGORIES (region/data) | 카테고리 색상/아이콘 매핑 (cross-module, PledgeRow 패턴과 동일) |
| `WantedMagicWand` (icons) | AI 관련 아이콘 |
| `CircleCheckFill` (icons) | 예상 효과 아이콘 |
| `MapPin` (lucide-react) | 지역 위치 아이콘 |

---

## 상태 관리

- `useState` — 정렬 옵션, 채택 상태 토글, 모달 open/close, 선택된 카드
- API 없으므로 React Query 불필요
- "채택하기" 클릭 시 로컬 상태만 변경 (mock)

---

## 라우팅

```typescript
// router.tsx에 추가 (flat route, pledges 패턴과 동일)
{ path: "/policy/recommendations", element: <AiRecommendationsPage /> }
```

### AiRecommendationSection 수정

`AiRecommendationSection.tsx`의 "추천 공약 전체보기" 버튼에 네비게이션 연결:

```typescript
// 변경 사항:
// 1. import { useNavigate } from "react-router-dom" 추가
// 2. const navigate = useNavigate() 추가
// 3. <button> 에 onClick={() => navigate("/policy/recommendations")} 추가
```

---

## 필터

- **칩 1 "매칭률순"**: 실제 동작하는 정렬 드롭다운
  - 기본값: "매칭률순"
  - Chip 클릭 시 소형 드롭다운(popover) 표시: "매칭률순" / "최근수정된순" 옵션
  - 선택 시 Chip label이 선택된 옵션으로 변경되고, `isOpen` 상태로 캐럿 방향 제어
  - "매칭률순": matchRate 내림차순, "최근수정된순": updatedAt 내림차순
  - **구현**: Chip의 `isOpen` prop + 커스텀 popover (Radix `Popover` 또는 간단한 absolute positioned div)
- **칩 2 "카테고리"**: `state="disabled"`, placeholder
- **칩 3 "지역"**: `state="disabled"`, placeholder

---

## UX 플로우 대비 Deviations

`docs/ux-flow.md` 섹션 5-5에서 정의된 AI 추천 탭의 상호작용 중 아래 항목은 이번 MVP mock 단계에서 **의도적으로 제외**한다.

| UX 플로우 명세 | 이번 스펙 반영 | 미반영 사유 |
|---|---|---|
| `[상세 보기]` → 상세 모달 | ✅ 반영 | — |
| `[수정 후 채택]` → 편집 폼 | ❌ 미반영 | 편집 폼 디자인 미완성. 향후 P.2.1에서 별도 설계 |
| `[건너뛰기]` → 다음 추천 | ❌ 미반영 | 리스트 관리 로직 필요. API 연동 시 함께 구현 |
| 채택 시 확정공약으로 이동 | ❌ 미반영 | 확정공약 모듈 미구현. 현재는 로컬 상태 토글만 |

> "자동 저장/자동 채택 없음" 원칙은 준수: 모든 채택은 사용자 명시적 클릭에 의해서만 발생한다.

---

## 로딩·에러·빈 상태

현재 mock 데이터를 동기 import하므로 로딩 상태가 발생하지 않지만, API 연동 시를 대비하여 다음 패턴을 따른다.

| 상태 | 표현 | 참고 |
|---|---|---|
| 로딩 | 카드 영역에 스켈레톤 표시 (`DashboardCardSkeleton` 패턴 참고) | API 연동 시 구현 |
| 에러 | "데이터를 불러올 수 없습니다" + 재시도 버튼 | API 연동 시 구현 |
| 빈 상태 | "추천 공약이 없습니다" 안내 텍스트 | mock 단계에서도 조건부 렌더 코드 포함 |

---

## 구현 시 문서 업데이트

이 페이지 구현 완료 후 다음 문서를 업데이트해야 한다:

- `docs/ARCHITECTURE.md` — 라우팅 테이블에 `/policy/recommendations` 추가
- `docs/MODULE_MAP.md` — 새 파일/컴포넌트 반영

---

## UX 가드레일 확인

- 클릭 타겟: 버튼 최소 44x44px (Button 컴포넌트 기본 충족)
- 텍스트 대비: WCAG AA 이상 (기존 디자인 토큰 사용)
- 카드 구조: "AI 인사이트 한 문장 + 예상효과" 요약 구조
- 빈 상태: 추천 공약이 없을 때 안내 텍스트 표시
