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
- `VIEW_TABS` (그래프 보기/표 보기/트리맵 보기) 렌더링
- `activeViewTab` 상태에 따른 조건부 렌더링:
  - `"graph"` → 기존 `BarChart`
  - `"table"` → 새 `DataTable` 컴포넌트
  - `"treemap"` → "준비 중" placeholder

**데이터 매핑:**

`currentChartData`와 `SINGLE_CHART_CONFIG`를 DataTable에 그대로 전달.
ChartConfig의 `xKey`와 `series`에서 컬럼 정보를 추출.

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
  pageSize?: number            // 기본 10
  valueFormatter?: (value: number) => string
  className?: string
}
```

**테이블:**
- 헤더 행: `config.xKey` 라벨 + 각 `series[].label`
- 데이터 행: `data` 배열 순회
- 스타일: 행 구분 하단 border (`border-line-neutral`), 헤더 배경 없음

**페이지네이션 (조건부: `data.length > pageSize`):**
- 좌측: rows-per-page 드롭다운 (`[10, 20, 50]`) + "씩 보기"
- 중앙: `< 1 2 3 ... >` 페이지 번호 버튼
- 우측: "페이지 이동" + 숫자 입력 필드

**내부 상태:**
- `currentPage` (1부터 시작)
- `rowsPerPage` (기본 pageSize)

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
