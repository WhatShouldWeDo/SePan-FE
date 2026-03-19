# DataTable 페이지네이션 UI 사라짐 + 페이지 이동 미동작

## 날짜
2026-03-19

## 증상
1. rows-per-page 드롭다운에서 데이터 개수 이상의 값(예: 20)을 선택하면 페이지네이션 UI 전체가 사라져 다시 10으로 돌아갈 수 없음
2. 우측 "페이지 이동" 입력 필드에 페이지 번호를 입력해도 동작하지 않고, 현재 페이지 번호도 표시되지 않음

## 원인
1. `showPagination = data.length > rowsPerPage` 조건으로 페이지네이션 전체를 감싸서, rowsPerPage가 데이터 개수 이상이 되면 드롭다운까지 포함한 UI 전체가 숨겨짐
2. 페이지 이동 input이 `defaultValue=""` + `key={currentPage}` 비제어 패턴이라 React의 re-mount 타이밍에 따라 Enter 이벤트가 제대로 처리되지 않고, 현재 페이지 표시도 안 됨

## 해결 방법
1. 페이지네이션 바(rows-per-page 드롭다운 포함)는 항상 표시하고, 페이지 번호 버튼(`< 1 2 >`)만 `totalPages > 1`일 때 조건부 표시
2. 페이지 이동 input을 `value` + `onChange` 제어 컴포넌트로 변경하고, `goToPage()` 헬퍼로 `currentPage`와 `pageInput` 상태를 동기화

```tsx
// before: 비제어 — 비동기적이고 불안정
<input key={currentPage} defaultValue={currentPage} onKeyDown={...} />

// after: 제어 — 항상 동기화
const [pageInput, setPageInput] = useState("1");
const goToPage = (page: number) => { setCurrentPage(page); setPageInput(String(page)); };
<input value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={...} />
```

## 관련 파일
- `src/components/tables/DataTable.tsx`

## 예방책
- 조건부 렌더링으로 UI를 숨길 때, 해당 UI가 자기 자신의 조건을 변경하는 컨트롤을 포함하는지 확인. 포함한다면 컨트롤은 조건 바깥에 두어야 함
- `defaultValue` + `key`를 이용한 비제어 input 리셋보다 `value` + `onChange` 제어 컴포넌트가 React 상태와 확실히 동기화됨
