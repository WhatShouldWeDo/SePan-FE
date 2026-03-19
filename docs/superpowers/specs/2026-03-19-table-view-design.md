# 지역분석 차트 섹션 "표 보기" 설계

## 개요

지역분석 페이지 하단 차트 섹션에서 "표 보기" 탭을 선택했을 때, 차트 데이터를 테이블로 보여주는 기능.

## 범위

- **대상 모드**: 비교 모드가 아닌 모드(default/preview/analysis)만
- **비교 모드**: 삭제 예정이므로 이번 작업 범위 밖
- **트리맵 보기**: 이번 작업에서 미구현 (placeholder)

## 변경 사항

### 1. RegionResultPage 변경

**CHIP_FILTERS → VIEW_TABS 교체:**

비교 모드가 아닌 차트 섹션에서:
- `CHIP_FILTERS` (연도별/분기별/월별) 상수 및 `activeChip` 상태 제거
  - 참고: CHIP_FILTERS는 UI만 있고 실제 데이터를 전환하지 않으므로 (항상 `MY_REGION_MONTHLY` 사용) 제거해도 안전
- 기존 `VIEW_TABS` 상수와 `activeViewTab` 상태를 재사용 (현재 compare 모드에서만 사용 중인 것을 비교 모드가 아닌 섹션에도 렌더링)
- `activeViewTab`에 따른 조건부 렌더링:
  - `"graph"` → 기존 `BarChart`
  - `"table"` → 새 `DataTable` 컴포넌트
  - `"treemap"` → "준비 중" placeholder (centered, `text-label-alternative`, 섹션 최소 높이 유지)

**데이터 매핑:**

`currentChartData`와 `SINGLE_CHART_CONFIG`를 DataTable에 그대로 전달.
ChartConfig의 `xKey`와 `series`에서 컬럼 정보를 추출.

x축 컬럼 헤더: `config.xLabel`이 있으면 사용, 없으면 `config.xKey`를 fallback으로 표시.

예시:
| 월   | 인구수    |
|------|----------|
| Jan  | 195,000  |
| Feb  | 188,000  |

### 2. DataTable 컴포넌트

**파일**: `src/components/tables/DataTable.tsx`

**Props:**
```typescript
interface DataTableProps {
  data: ChartData              // 차트와 동일한 데이터
  config: ChartConfig          // xKey, series로 컬럼 자동 생성
  defaultPageSize?: number     // 기본 10, rows-per-page 드롭다운 초기값
  valueFormatter?: (value: number) => string
  className?: string
}
```

**테이블:**
- 헤더 행: `config.xLabel ?? config.xKey` + 각 `series[].label`
- 데이터 행: `data` 배열 순회
- series 컬럼(숫자)에만 `valueFormatter` 적용. 미제공 시 `toLocaleString()` 기본 적용
- x축 컬럼(문자열)은 formatter 없이 그대로 표시
- 빈 데이터 시 "데이터가 없습니다" 메시지 표시
- 스타일: 행 구분 하단 border (`border-line-neutral`), 헤더 배경 없음

**페이지네이션 (조건부: `data.length > rowsPerPage`):**
- 좌측: rows-per-page 드롭다운 (`[10, 20, 50]`) + "씩 보기"
- 중앙: `< 1 2 3 ... >` 페이지 번호 버튼
- 우측: "페이지 이동" + 숫자 입력 필드 (Enter로 이동)
- 모든 페이지네이션 버튼과 입력 필드는 44x44px 최소 클릭 타겟 보장

**내부 상태:**
- `currentPage` (1부터 시작)
- `rowsPerPage` (초기값 `defaultPageSize`)

**타이포그래피 (Figma 디자인 토큰):**
- 헤더: Label 4/Semibold (14px, 600)
- 데이터 셀: Body 2/Medium (16px, 500)
- 페이지네이션: Caption 2/Regular (12px) + Label 4/Semibold (14px)

### 3. 파일 구조

**새 파일:**
- `src/components/tables/DataTable.tsx`
- `src/components/tables/index.ts`

**수정 파일:**
- `src/app/routes/RegionResultPage.tsx`

**건드리지 않는 것:**
- `BarChart` 컴포넌트
- `ChartConfig`, `ChartData` 타입
- 비교 모드 코드
