# Democrasee — 디자인 토큰 & 스타일 가이드

> 최종 수정: 2026-02-08
> 상태: 초안 (WCAG AA 기준, 장년층 사용자 대상)

---

## 1. 디자인 원칙

1. **가독성 최우선**: 40~60대 사용자가 편안하게 읽을 수 있는 크기와 대비
2. **직관적 인터랙션**: 클릭/탭 영역을 충분히 크게, 애매한 아이콘 대신 텍스트 레이블 병용
3. **일관성**: 화면마다 다른 스타일 금지, 동일한 역할은 동일한 UI
4. **데이터 시각화 중심**: 숫자보다 그래프, 그래프보다 "한 문장 요약 + 그래프"

---

## 2. 컬러 시스템

### 2-1. 기본 팔레트

```
Primary       : #1E40AF (Blue-800)     — 메인 액션, 링크, 강조
Primary Hover : #1E3A8A (Blue-900)     — 호버 상태
Secondary     : #64748B (Slate-500)    — 보조 텍스트, 비활성
Accent        : #0891B2 (Cyan-600)     — 보조 강조, 배지
Success       : #16A34A (Green-600)    — 성공, 증가, 긍정
Warning       : #D97706 (Amber-600)    — 주의, 경고
Error         : #DC2626 (Red-600)      — 에러, 감소, 위험
```

### 2-2. 배경 & 표면

```
Background    : #F8FAFC (Slate-50)     — 전체 배경
Surface       : #FFFFFF (White)        — 카드, 모달 배경
Surface Hover : #F1F5F9 (Slate-100)    — 카드 호버
Border        : #E2E8F0 (Slate-200)    — 구분선, 테두리
Border Focus  : #3B82F6 (Blue-500)     — 포커스 링
```

### 2-3. 텍스트

```
Text Primary  : #0F172A (Slate-900)    — 본문 텍스트 (대비 비율: 15.4:1 ✓ AAA)
Text Secondary: #475569 (Slate-600)    — 보조 텍스트 (대비 비율: 6.4:1 ✓ AA)
Text Disabled : #94A3B8 (Slate-400)    — 비활성 텍스트 (대비 비율: 3.5:1)
Text Inverse  : #FFFFFF (White)        — 어두운 배경 위 텍스트
```

### 2-4. 데이터 시각화 색상

차트에서 서로 구분이 명확한 색상 조합:

```
Chart Blue    : #3B82F6 (Blue-500)     — 내 지역 / 기본
Chart Teal    : #14B8A6 (Teal-500)     — 비교 지역 1
Chart Amber   : #F59E0B (Amber-500)    — 비교 지역 2
Chart Purple  : #8B5CF6 (Violet-500)   — 비교 지역 3
Chart Rose    : #F43F5E (Rose-500)     — 비교 지역 4
Chart Gray    : #6B7280 (Gray-500)     — 전국 평균 / 기준선
```

> 색맹 사용자를 위해 차트에는 색상 외에 패턴(점선, 마커 모양)도 병용할 것을 권장합니다.

---

## 3. 타이포그래피

Tailwind CSS 기반, `font-family: system-ui` (기본 시스템 폰트)

| 역할 | Tailwind 클래스 | 크기 (px) | 줄 높이 | 굵기 | 용도 |
|------|-----------------|-----------|---------|------|------|
| H1 | `text-3xl font-bold` | 30px | 1.33 | 700 | 페이지 제목 |
| H2 | `text-2xl font-semibold` | 24px | 1.33 | 600 | 섹션 제목 |
| H3 | `text-xl font-semibold` | 20px | 1.4 | 600 | 카드 제목 |
| Body Large | `text-lg` | 18px | 1.56 | 400 | 주요 본문, 설명 |
| Body | `text-base` | 16px | 1.5 | 400 | 기본 본문 |
| Caption | `text-sm` | 14px | 1.43 | 400 | 보조 정보, 레이블 |
| Small | `text-xs` | 12px | 1.33 | 400 | 최소 크기 (가능한 사용 자제) |

### 타이포그래피 규칙

- **기본 본문 크기는 16px 이상** (`text-base` 이상)
- 12px 이하 텍스트는 사용하지 않음 (장년층 가독성)
- 주요 숫자/통계는 `text-2xl` 이상으로 강조
- 줄 간격은 1.5 이상 유지 (`leading-relaxed`)

---

## 4. 간격 & 레이아웃

### 간격 스케일

```
xs  : 4px   (p-1)     — 아이콘과 텍스트 사이 등 최소 간격
sm  : 8px   (p-2)     — 인라인 요소 간
md  : 16px  (p-4)     — 기본 패딩
lg  : 24px  (p-6)     — 카드 내부 패딩
xl  : 32px  (p-8)     — 섹션 간 간격
2xl : 48px  (p-12)    — 주요 영역 간 간격
```

### 레이아웃 규칙

- **최대 콘텐츠 너비**: `max-w-7xl` (1280px)
- **사이드바 너비**: `w-64` (256px), 모바일에서는 숨김
- **카드 패딩**: 최소 `p-6` (24px)
- **그리드**: 대시보드 카드는 `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

---

## 5. 컴포넌트 스타일 가이드

### 5-1. 버튼

| 종류 | 스타일 | 용도 |
|------|--------|------|
| Primary | `bg-blue-800 text-white hover:bg-blue-900` | 주요 액션 (로그인, 저장 등) |
| Secondary | `bg-white text-slate-700 border border-slate-300 hover:bg-slate-100` | 보조 액션 |
| Ghost | `text-blue-800 hover:bg-blue-50` | 텍스트형 액션 (자세히 보기) |
| Danger | `bg-red-600 text-white hover:bg-red-700` | 삭제, 위험 액션 |
| Disabled | `bg-slate-200 text-slate-400 cursor-not-allowed` | 비활성 상태 |

**공통 규칙:**
- 최소 크기: `min-h-[44px] min-w-[44px] px-6 py-3` (44px 터치 타겟)
- 텍스트: `text-base font-medium` (16px)
- 라운딩: `rounded-lg` (8px)
- 포커스: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`

### 5-2. 입력 필드

```
기본     : border border-slate-300 rounded-lg px-4 py-3 text-base
포커스   : border-blue-500 ring-2 ring-blue-500/20
에러     : border-red-500 ring-2 ring-red-500/20
비활성   : bg-slate-100 text-slate-400
```

- 높이: 최소 `py-3` (44px 이상)
- 레이블: 입력 필드 위에 `text-sm font-medium text-slate-700`
- 에러 메시지: 입력 필드 아래에 `text-sm text-red-600`
- 플레이스홀더: `text-slate-400`

### 5-3. 카드

```
기본     : bg-white rounded-xl shadow-sm border border-slate-200 p-6
호버     : hover:shadow-md transition-shadow
클릭 가능: cursor-pointer + 호버 효과
```

### 5-4. 테이블

```
헤더     : bg-slate-50 text-sm font-semibold text-slate-600
셀       : py-4 px-4 text-base border-b border-slate-100
행 호버  : hover:bg-slate-50
```

- 최소 셀 높이: 44px (클릭 가능한 행인 경우)

### 5-5. 배지/태그

```
기본     : inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
상태별:
  진행중  : bg-blue-100 text-blue-800
  완료    : bg-green-100 text-green-800
  대기    : bg-amber-100 text-amber-800
  보관    : bg-slate-100 text-slate-600
```

---

## 6. 접근성 체크리스트

이 프로젝트에서 WCAG AA 기준으로 반드시 지켜야 할 항목:

- [ ] **색상 대비**: 텍스트/배경 간 대비 비율 4.5:1 이상 (큰 텍스트는 3:1)
- [ ] **터치 타겟**: 클릭/탭 가능한 요소는 최소 44×44px
- [ ] **키보드 탐색**: 모든 인터랙티브 요소에 포커스 링 표시
- [ ] **텍스트 크기**: 본문 16px 이상, 12px 미만 사용 금지
- [ ] **차트 접근성**: 색상만으로 정보 전달하지 않기 (패턴, 레이블 병용)
- [ ] **에러 안내**: 색상 + 텍스트로 에러 상태 전달
- [ ] **폼 레이블**: 모든 입력 필드에 연결된 `<label>` 제공
- [ ] **이미지 대체 텍스트**: 의미 있는 이미지에 `alt` 제공

---

## 7. Tailwind 확장 설정 (참고)

프로젝트 초기화 시 `tailwind.config.ts`에 적용할 커스텀 설정:

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#3B82F6",
          600: "#2563EB",
          800: "#1E40AF",
          900: "#1E3A8A",
        },
      },
      fontSize: {
        // 장년층 대상 최소 크기 보장
        "body-lg": ["18px", { lineHeight: "1.56" }],
        body: ["16px", { lineHeight: "1.5" }],
      },
      minHeight: {
        touch: "44px", // 최소 터치 타겟
      },
      minWidth: {
        touch: "44px",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2026-02-08 | 초안 작성 (WCAG AA 기준, Tailwind 기반) | — |
