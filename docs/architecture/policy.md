# Policy 모듈 아키텍처

## 개요

정책개발 기능을 담당하는 모듈. AI 추천 공약, 벤치마킹, 나의 공약 관리 기능을 포함한다.

## 페이지 구조

| 라우트 | 페이지 | 설명 |
|---|---|---|
| `/policy` | `PolicyPage` | 정책개발 메인 (AI 추천 + 벤치마크 + 공약 요약) |
| `/policy/recommendations` | `AiRecommendationsPage` | AI 추천 공약 전체 목록 |
| `/policy/my-pledges` | `MyPledgesPage` | 내 공약 전체 관리 (필터/정렬/페이지네이션) |

## 데이터 흐름

- 모든 데이터는 `mock-policy.ts`의 mock 데이터 사용 (API 연동 전)
- `MyPledge` 타입: `regions` (다중 지역), `categoryIds` (다중 카테고리), `status` 필드로 공약 상태 관리
- `PledgeStatus`: 4개 값 (`drafting` | `reviewing` | `approved` | `confirmed`)
- `computePledgeSummary()` 헬퍼로 상태별 집계
- 공약 폼 데이터: `PledgeFormData` (Zod 스키마, `pledgeFormSchema.ts`)

## 주요 컴포넌트

- `MyPledgeCard`: 공약 카드 (지역 배지 + 제목/카테고리 + 상태 배지 + 편집)
- `PledgeFormModal`: 공약 추가/수정 모달 (React Hook Form + Zod 검증, 지역/카테고리 다중선택 칩, 상태 선택, 임시저장). `MyPledgesPage`에서 생성/수정 모드로 사용
- `RecommendationCard`: AI 추천 공약 카드
- `RecommendationDetailModal`: 추천 공약 상세 모달
- `RegionInfoBar`: 지역 정보 + 특성 뱃지 바
- `MyPledgesSection`: PolicyPage 내 공약 요약 테이블
