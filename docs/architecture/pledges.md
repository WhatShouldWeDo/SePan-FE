# Pledges (역대공약분석) 모듈

> 최종 업데이트: 2026-03-15

## 개요

역대공약분석 모듈. 사용자가 선거 유형(대통령/국회의원/지방)을 선택해 해당 선거의 공약을 분석할 수 있는 기능. 기존 `/policy` 라우트를 대체.

## 라우트

| 경로 | 컴포넌트 | 상태 |
|------|----------|------|
| `/pledges` | `PledgesOverviewPage` | 완료 |
| `/pledges/presidential` | `PledgesPlaceholderPage` | placeholder |
| `/pledges/parliamentary` | `PledgesPlaceholderPage` | placeholder |
| `/pledges/local` | `PledgesPlaceholderPage` | placeholder |

## 파일 구조

```
src/
├── app/routes/
│   ├── PledgesOverviewPage.tsx    # 개요 랜딩 페이지
│   └── PledgesPlaceholderPage.tsx # 하위 선거 페이지 placeholder
└── assets/pledges/
    └── location-fill.svg          # 위치 배지 아이콘
```

## 컴포넌트 구조

### PledgesOverviewPage

- **브레드크럼**: `useBreadcrumb([{ label: "역대공약분석" }])` — 1 depth
- **선거 유형 카드 (ElectionTypeCard)**: 3개 카드 그리드, 클릭 시 하위 라우트로 이동
  - 상단: 분홍 배경(`rgba(181,29,82,0.08)`) + mask-luminance 아이콘
  - 하단: 선거명 + 설명
- **빠른시작 카드 (QuickStartCard)**: 3개 카드 그리드, 최근 검색 선거회차
  - 좌측: 64px mask-luminance 아이콘
  - 우측: 선거회차명 + 지역구 배지(primary) + 정당 배지(party color)
- 데이터: 하드코딩 (API 연동 전)

### PledgesPlaceholderPage

- URL 파라미터 `type`으로 선거 유형 판별 (`presidential` / `parliamentary` / `local`)
- "페이지 준비 중입니다" 메시지 표시

## 아이콘 렌더링

`src/assets/category-icons/aging.png`을 재사용. CategoryNav과 동일한 CSS mask-luminance 패턴:

```tsx
style={{
  backgroundColor: "#b51d52",
  maskImage: `url('${agingIcon}')`,
  maskMode: "luminance",
  maskSize: "50px 50px",
  maskPosition: "center",
  maskRepeat: "no-repeat",
}}
```

## 에셋

- `aging.png` (`src/assets/category-icons/`): CategoryNav 공유 에셋. mask-luminance로 `#b51d52` 색상 적용
- `location-fill.svg` (`src/assets/pledges/`): 지역구 배지 내 위치 아이콘 (`<img>` 태그로 사용)

## 의존 모듈

- `contexts/useNavigation` — `useBreadcrumb` 훅
- `react-router-dom` — `Link`, `useParams`
- `src/assets/category-icons/aging.png` — 선거 아이콘 (공유 에셋)
