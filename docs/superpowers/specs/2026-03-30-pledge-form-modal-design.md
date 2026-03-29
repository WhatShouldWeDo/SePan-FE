# 공약 추가/수정 모달 설계

## 개요

내 공약관리 페이지(`/policy/my-pledges`)에서 "+ 새 공약 추가" 버튼 또는 공약 카드의 편집(✏) 버튼 클릭 시 표시되는 모달.
공약의 제목, 요약, 지역, 카테고리, 상세내용, 상태를 입력/수정할 수 있다.

- **Figma**: P.3.0.정책개발-내공약관리 (공약 추가/수정 모달 3개 State)
- **진입점**: MyPledgesPage의 "새 공약 추가" 버튼, MyPledgeCard의 편집 버튼
- **모드**: 추가(create) / 수정(edit)

---

## Figma 분석 요약

### State 1: 빈 폼 (초기 상태)

- 헤더: "새 공약 추가하기" (Heading 3/Bold, 24px) — 추가 모드 기본 텍스트. 입력 시 실시간 반영.
- X 닫기 버튼 (우측 상단)
- 폼 필드: 공약 제목(\*), 요약내용(\*), 지역선택(\*), 카테고리(\*), 상세내용
- 하단: 상태 드롭다운("작성중") + "임시저장" + "등록" (비활성, opacity-40)

### State 2: 입력 완료

- 헤더: 입력한 제목 반영 + 선택된 지역 Badge + 선택된 카테고리 서브칩
- 글자수 카운터: 24/60, 82/200, 925/2000
- 선택된 지역: `bg-primary` + 흰 텍스트 / 미선택: 테두리만
- 선택된 카테고리: `bg-primary` + 흰 텍스트 + 아이콘 / 미선택: 회색 테두리
- "등록" 버튼 활성 (opacity 없음)

### State 3: 상태 드롭다운 열림

- Overlay/Panel: `w-320px`, `rounded-16px`, 흰 배경, `shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]`
- 4개 옵션: 작성중(선택, 보라색 + ✓), 검토중, 승인완료, 확정됨
- 선택된 항목: `text-primary`, 체크 아이콘 / 미선택: `text-label-normal`

---

## 데이터 모델 변경

### PledgeStatus 확장

```typescript
// 변경 전
export type PledgeStatus = "drafting" | "reviewing" | "confirmed";

// 변경 후
export type PledgeStatus = "drafting" | "reviewing" | "approved" | "confirmed";
```

**근거**: Figma 상태 드롭다운에 "승인완료"(approved)가 추가됨. 워크플로우: 작성중 → 검토중 → 승인완료 → 확정됨.

**영향 범위**:
- `MyPledgesPage`: STATUS_FILTERS에 "승인완료" 칩 추가 필요
- `MyPledgeCard`: 상태 배지에 "approved" 스타일 추가 필요
- `MyPledgesSection`: `PledgeSummary`에 `approved` 카운트 추가

### MyPledge 인터페이스 확장

```typescript
// 변경 전
export interface MyPledge {
  id: string;
  category: string;      // "경제" (단일)
  categoryId: string;    // "economy" (단일)
  title: string;
  description: string;   // 요약내용
  region: string;        // "청담동" (단일)
  createdAt: string;
  status: PledgeStatus;
}

// 변경 후
export interface MyPledge {
  id: string;
  categoryIds: string[];   // ["economy", "welfare"] (복수)
  title: string;
  summary: string;         // 요약내용 (description → summary, API 스펙과 일치)
  content: string;         // 상세내용 (신규)
  regions: string[];       // ["논현1동", "청담동"] (복수)
  createdAt: string;
  status: PledgeStatus;
}
```

**변경 사항**:

| 필드 | 변경 | 이유 |
|------|------|------|
| `category` + `categoryId` → `categoryIds: string[]` | 단일 → 복수 배열 | Figma에서 카테고리 다중선택 |
| `description` → `summary` | 네이밍 변경 | API 스펙(`CreatePolicyRequest.summary`)과 일치 |
| `region` → `regions: string[]` | 단일 → 복수 배열 | Figma에서 지역 다중선택 |
| `content: string` 추가 | 신규 필드 | 상세내용 텍스트 영역 |

**하위 호환 헬퍼**: `categoryIds`에서 label 도출 시 `CATEGORIES`를 참조한다. 이 함수는 `mock-policy.ts`에 정의하여 `MyPledgeCard`, `PledgeRow`, `MyPledgesSection` 등에서 공유한다.

```typescript
// mock-policy.ts에 추가
import { CATEGORIES } from "@/features/region/data/categories";

export function getCategoryLabel(categoryId: string): string {
  return CATEGORIES.find(c => c.id === categoryId)?.label ?? categoryId;
}
```

**영향 파일**:
- `MyPledgeCard.tsx` — `pledge.region` → `pledge.regions[0]`, `pledge.categoryId` → `pledge.categoryIds[0]`, `pledge.category` → `getCategoryLabel(pledge.categoryIds[0])`, `pledge.description` → `pledge.summary`
- `PledgeRow.tsx` — `PledgeRowProps` 인터페이스의 `category`, `categoryId`, `description`, `region` 필드를 배열/새 이름으로 변경. `MyPledgesSection`에서 전달하는 props 호출부도 수정 필요
- `MyPledgesSection.tsx` — 필드명 변경 대응 + PledgeRow 호출부 수정 (`pledge.category` → `getCategoryLabel(pledge.categoryIds[0])` 등)
- `mock-policy.ts` — mock 데이터 구조 변경

### PledgeSummary 인터페이스 확장

```typescript
// 변경 전
export interface PledgeSummary {
  total: number;
  drafting: number;
  reviewing: number;
  confirmed: number;
}

// 변경 후
export interface PledgeSummary {
  total: number;
  drafting: number;
  reviewing: number;
  approved: number;    // 신규
  confirmed: number;
}

// computePledgeSummary 함수 업데이트
export function computePledgeSummary(pledges: MyPledge[]): PledgeSummary {
  return {
    total: pledges.length,
    drafting: pledges.filter(p => p.status === "drafting").length,
    reviewing: pledges.filter(p => p.status === "reviewing").length,
    approved: pledges.filter(p => p.status === "approved").length,
    confirmed: pledges.filter(p => p.status === "confirmed").length,
  };
}
```

**영향**: `MyPledgesSection`의 요약 카드가 4개 → 5개로 변경. "승인완료" 카드 추가 (스타일: `text-status-positive`, `bg-status-positive/8` — "검토중"과 유사하되 아이콘 변경).

### 폼 데이터 타입

```typescript
interface PledgeFormData {
  title: string;
  summary: string;
  regions: string[];
  categoryIds: string[];
  content: string;
  status: PledgeStatus;
}
```

### 사용 가능한 지역 목록

모달의 지역 칩 목록은 사용자의 선거구에 속한 행정동(EMD)이다. 현재 mock 데이터 기준:

```typescript
const AVAILABLE_REGIONS = [
  "신사동", "논현1동", "논현2동", "압구정동", "청담동", "역삼1동", "역삼2동"
];
```

향후 API 연동 시 사용자 프로필의 선거구 정보에서 동적으로 가져온다.

> **주의**: 기존 mock 데이터에는 `"대치동"`, `"삼성동"`, `"역삼동"` 등 `AVAILABLE_REGIONS`에 없는 지역이 포함되어 있다. mock 데이터 변환 시 모든 `regions` 값을 `AVAILABLE_REGIONS`의 7개 행정동으로 통일한다. 이는 현재 Figma 기준 서울특별시 강남구 갑 선거구의 행정동 목록이다.

### Mock 데이터 변경 예시

기존 mock 데이터를 새 인터페이스에 맞게 변환:

```typescript
// 변경 전
{ id: "1", category: "교육", categoryId: "education", title: "...", description: "...", region: "청담동", createdAt: "3시간 전", status: "drafting" }

// 변경 후
{ id: "1", categoryIds: ["education"], title: "...", summary: "...", content: "", regions: ["청담동"], createdAt: "3시간 전", status: "drafting" }

// 복수 지역/카테고리 예시
{ id: "2", categoryIds: ["welfare", "aging"], title: "어르신 맞춤형 돌봄 서비스 확대", summary: "65세 이상 어르신을 위한 개인 맞춤형...", content: "65세 이상 어르신을 위한 개인 맞춤형 돌봄 서비스를...", regions: ["논현1동", "역삼1동"], createdAt: "1일 전", status: "reviewing" }
```

기존 20건 mock 데이터 전체를 새 구조로 변환하며, 일부 데이터에는 복수 `categoryIds`/`regions`를 설정하여 다중선택 UI 테스트가 가능하도록 한다. 또한 `"approved"` 상태의 mock 데이터를 2~3건 추가한다.

---

## Zod 유효성 검증 스키마

```typescript
import { z } from "zod";

export const pledgeFormSchema = z.object({
  title: z
    .string()
    .min(1, "공약 제목을 입력해주세요")
    .max(60, "60자 이내로 입력해주세요"),
  summary: z
    .string()
    .min(1, "요약내용을 입력해주세요")
    .max(200, "200자 이내로 입력해주세요"),
  regions: z
    .array(z.string())
    .min(1, "지역을 1개 이상 선택해주세요"),
  categoryIds: z
    .array(z.string())
    .min(1, "카테고리를 1개 이상 선택해주세요"),
  content: z
    .string()
    .max(2000, "2000자 이내로 입력해주세요")
    .default(""),
  status: z.enum(["drafting", "reviewing", "approved", "confirmed"]),
});

export type PledgeFormData = z.infer<typeof pledgeFormSchema>;
```

**필수 필드** (Figma `*` 표시): title, summary, regions, categoryIds
**선택 필드**: content, status(기본값 "drafting")

**등록 버튼 활성화 조건**: 4개 필수 필드가 모두 유효할 때만 활성. 그 전까지는 `opacity-40` + `pointer-events-none`.

---

## 파일 구조

```
신규 파일:
  src/features/policy/components/PledgeFormModal.tsx     — 모달 컴포넌트
  src/features/policy/schemas/pledgeFormSchema.ts        — Zod 스키마

수정 파일:
  src/features/policy/data/mock-policy.ts                — MyPledge/PledgeSummary 인터페이스 + mock 데이터 변경 + getCategoryLabel 추가
  src/features/policy/components/MyPledgeCard.tsx         — 필드명 변경 대응
  src/features/policy/components/PledgeRow.tsx            — PledgeRowProps 필드명 변경 대응
  src/features/policy/components/MyPledgesSection.tsx     — 필드명 변경 대응 + 요약카드 approved 추가
  src/features/policy/components/index.ts                — PledgeFormModal export 추가
  src/app/routes/MyPledgesPage.tsx                       — 모달 상태 관리 + PledgeFormModal 연결 + STATUS_FILTERS approved 추가
  src/app/routes/PolicyPage.tsx                          — computePledgeSummary 결과 타입 변경 대응

작업 후 업데이트 문서:
  docs/MODULE_MAP.md
  docs/ARCHITECTURE.md
  docs/architecture/policy.md
```

---

## 컴포넌트 상세 설계

### 1. PledgeFormModal

**경로**: `src/features/policy/components/PledgeFormModal.tsx`

**Props**:

```typescript
interface PledgeFormModalProps {
  open: boolean;
  onClose: () => void;
  /** 수정 모드일 때 기존 데이터 전달. null이면 추가 모드 */
  pledge: MyPledge | null;
  onSubmit: (data: PledgeFormData) => void;
  onSaveDraft: (data: PledgeFormData) => void;
}
```

**상태 관리**:
- React Hook Form (`useForm<PledgeFormData>`) + Zod resolver, **`mode: "onChange"`** (등록 버튼의 `isValid` 실시간 업데이트 필요)
- `isStatusOpen: boolean` — 상태 드롭다운 열림/닫힘 (useState)

**모드 판별**:
- `pledge === null` → 추가 모드 (헤더 기본값: "새 공약 추가하기")
- `pledge !== null` → 수정 모드 (기존 값으로 폼 초기화)

**수정 모드 폼 초기화**:
`open`이 `true`로 전환될 때 `useEffect`에서 `reset()`을 호출한다.

```typescript
useEffect(() => {
  if (open && pledge) {
    reset({
      title: pledge.title,
      summary: pledge.summary,
      regions: pledge.regions,
      categoryIds: pledge.categoryIds,
      content: pledge.content,
      status: pledge.status,
    });
  } else if (open && !pledge) {
    reset({
      title: "",
      summary: "",
      regions: [],
      categoryIds: [],
      content: "",
      status: "drafting",
    });
  }
}, [open, pledge, reset]);
```

#### 레이아웃

```
┌─────────────────────────────────────────────────┐
│  [동적 헤더]                              [X]   │
│─────────────────────────────────────────────────│
│  (스크롤 영역)                                  │
│  공약 제목 *     [TextField] _______ 24/60      │
│                                                 │
│  요약내용 *      [TextField] _______ 82/200     │
│                                                 │
│  지역선택 *      [Chip] [Chip] [Chip] ...       │
│                                                 │
│  카테고리 *      [RoundChip] [RoundChip] ...    │
│                                                 │
│  상세내용        [TextArea]                     │
│                                        925/2000 │
│─────────────────────────────────────────────────│
│  [작성중 ▼]              [임시저장] [등록]      │
└─────────────────────────────────────────────────┘
```

#### 모달 컨테이너

기존 `Dialog` / `DialogContent` (Radix UI) 활용.

```tsx
<Dialog open={open} onOpenChange={(v) => !v && onClose()}>
  <DialogContent
    className="flex max-h-[85vh] flex-col gap-0 rounded-[20px] border-0 p-0 sm:max-w-2xl"
    showCloseButton={false}
  >
    {/* 커스텀 헤더 + 스크롤 영역 + 고정 푸터 */}
  </DialogContent>
</Dialog>
```

- `rounded-[20px]`: Figma 스펙 (tailwind-merge가 base의 `rounded-lg`를 덮어씀)
- `gap-0`: base의 `gap-4` 제거
- `border-0`: base의 `border` 제거
- `p-0`: 내부에서 영역별로 별도 패딩
- `showCloseButton={false}`: 커스텀 X 버튼 사용

**모달 외부 클릭 방지**: 폼 데이터 유실 방지를 위해 `onInteractOutside`에서 기본 동작을 막는다. 닫기는 X 버튼으로만 가능.

```tsx
<DialogContent
  ...
  onInteractOutside={(e) => e.preventDefault()}
>
```

> 40~60대 타겟 사용자의 실수 방지를 위한 결정. 향후 `isDirty` 기반 "저장하지 않은 변경사항이 있습니다" 경고 다이얼로그를 X 버튼 클릭 시 추가할 수 있다 (현재 스코프 외).

#### 헤더 (고정)

```tsx
<div className="flex items-start justify-between px-8 pt-8 pb-2">
  <div className="flex flex-col gap-2">
    {/* 제목 + 지역 Badge */}
    <div className="flex items-center gap-2">
      <h2 className="text-heading-3 font-bold text-label-strong">
        {watchedTitle || "새 공약 추가하기"}
      </h2>
      {/* 선택된 지역 중 첫 번째를 Badge로 표시 */}
      {selectedRegions.length > 0 && (
        <span className="inline-flex items-center gap-1 rounded-[8px] bg-primary/8 px-2 py-[5px] text-label-4 font-semibold text-primary">
          <MapPin className="size-4 fill-current" />
          {selectedRegions[0]}
        </span>
      )}
    </div>
    {/* 선택된 카테고리 서브칩 */}
    {selectedCategoryIds.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {selectedCategoryIds.map(id => {
          const cat = CATEGORIES.find(c => c.id === id);
          return cat && (
            <span key={id} className="inline-flex items-center gap-1 text-[14px] font-semibold text-label-alternative">
              <CategoryIcon categoryId={id} size={14} />
              {cat.label}
            </span>
          );
        })}
      </div>
    )}
  </div>
  {/* X 닫기 버튼 */}
  {/* lucide-react의 X 아이콘: import { X } from "lucide-react" */}
  <button type="button" onClick={onClose} className="p-1" aria-label="닫기">
    <X className="size-6 text-label-normal" />
  </button>
</div>
```

- 제목: `watch("title")` 값을 실시간 반영. 빈 값이면 "새 공약 추가하기" (추가 모드) 또는 "공약 제목" (수정 모드 — 값이 지워진 경우)
- 지역 Badge: 선택된 지역이 있을 때만 표시. 다수 선택 시 첫 번째만 Badge로 표시.
- 카테고리 서브칩: 선택된 카테고리들을 아이콘+라벨로 표시.

#### 스크롤 영역 (본문)

```tsx
<div className="flex-1 overflow-y-auto px-8 py-6">
  <form className="flex flex-col gap-8">
    {/* 1. 공약 제목 */}
    {/* 2. 요약내용 */}
    {/* 3. 지역선택 */}
    {/* 4. 카테고리 */}
    {/* 5. 상세내용 */}
  </form>
</div>
```

#### 필드 1: 공약 제목

기존 `TextField` 컴포넌트 활용. 단, **글자수 카운터**가 필요한데 현재 `TextField`에는 `maxLength` 카운터가 없다 (`TextArea`에만 있음).

**해결**: `TextField`에 `maxLength` + 카운터 기능 추가 대신, `TextArea`를 `rows={1}`로 사용하는 것은 UX가 어색함. **`TextField`에 글자수 카운터를 표시하는 wrapper를 모달 내부에서 구성**한다.

```tsx
<div className="flex flex-col gap-2">
  <TextField
    label="공약 제목"
    required
    placeholder="텍스트를 입력해주세요."
    maxLength={60}
    status={errors.title ? "error" : "default"}
    helperText={errors.title?.message}
    {...register("title")}
  />
  <div className="flex justify-end px-1">
    <span className="text-[14px] font-medium tracking-[-0.035px] text-label-alternative">
      {watchedTitle.length}/60
    </span>
  </div>
</div>
```

> **참고**: `TextField`는 `Omit<React.ComponentProps<"input">, "size">`를 확장하므로 `maxLength`가 네이티브 HTML `maxLength` 속성으로 전달된다 (rest spread). 이로 인해 입력이 60자에서 하드 블록되며, 아래 카운터가 시각적 피드백을 보완한다. `TextField` 컴포넌트 자체에 카운터 기능을 추가하는 것은 이 스코프에 포함하지 않는다.

#### 필드 2: 요약내용

`TextField`와 동일한 패턴.

```tsx
<div className="flex flex-col gap-2">
  <TextField
    label="요약내용"
    required
    placeholder="텍스트를 입력해주세요."
    maxLength={200}
    status={errors.summary ? "error" : "default"}
    helperText={errors.summary?.message}
    {...register("summary")}
  />
  <div className="flex justify-end px-1">
    <span className="text-[14px] font-medium tracking-[-0.035px] text-label-alternative">
      {watchedSummary.length}/200
    </span>
  </div>
</div>
```

#### 필드 3: 지역선택

행정동 칩 다중선택. Figma에서 `ButtonOutlined` 스타일 (100px 고정폭, rounded-[10px]).

```tsx
<div className="flex flex-col gap-3">
  <div className="flex items-center gap-0.5">
    <span className="text-[16px] font-semibold leading-[1.3] text-label-normal">지역선택</span>
    <span className="text-[18px] font-semibold leading-[1.3] text-primary">*</span>
  </div>
  <div className="flex flex-wrap gap-2">
    {AVAILABLE_REGIONS.map(region => {
      const isSelected = selectedRegions.includes(region);
      return (
        <button
          key={region}
          type="button"
          onClick={() => toggleRegion(region)}
          className={cn(
            "w-[100px] rounded-[10px] border px-5 py-3 text-[16px] font-semibold leading-[1.3] transition-colors",
            isSelected
              ? "border-primary/50 bg-primary text-white"
              : "border-line-neutral bg-white text-label-normal"
          )}
        >
          {region}
        </button>
      );
    })}
  </div>
  {errors.regions && (
    <p className="px-1 text-[12px] font-medium text-status-negative">
      {errors.regions.message}
    </p>
  )}
</div>
```

- 선택: `bg-primary` + `text-white` + `border-primary/50`
- 미선택: `bg-white` + `text-label-normal` + `border-line-neutral`
- 100px 고정폭, `rounded-[10px]`
- 토글 방식: 클릭 시 선택/해제

#### 필드 4: 카테고리

9개 카테고리 칩 다중선택. Figma에서 Round chip 스타일 (아이콘 + 라벨).

```tsx
<div className="flex flex-col gap-3">
  <div className="flex items-center gap-0.5">
    <span className="text-[16px] font-semibold leading-[1.3] text-label-normal">카테고리</span>
    <span className="text-[18px] font-semibold leading-[1.3] text-primary">*</span>
  </div>
  <div className="flex flex-wrap gap-2">
    {CATEGORIES.map(cat => {
      const isSelected = selectedCategoryIds.includes(cat.id);
      return (
        <button
          key={cat.id}
          type="button"
          onClick={() => toggleCategory(cat.id)}
          className={cn(
            "inline-flex items-center gap-[3px] rounded-full px-3.5 py-2 text-[16px] font-semibold leading-[1.3] transition-colors",
            isSelected
              ? "bg-primary text-white"
              : "border border-line-neutral bg-white text-label-normal"
          )}
        >
          <CategoryIcon
            categoryId={cat.id}
            size={16}
            color={isSelected ? "white" : cat.iconColor}
          />
          {cat.label}
        </button>
      );
    })}
  </div>
  {errors.categoryIds && (
    <p className="px-1 text-[12px] font-medium text-status-negative">
      {errors.categoryIds.message}
    </p>
  )}
</div>
```

- 선택: `bg-primary` + `text-white` + 아이콘 흰색
- 미선택: `bg-white` + `border-line-neutral` + `text-label-normal` + 아이콘 원래 색상
- `rounded-full` (pill shape)
- 카테고리 순서: CATEGORIES 배열 순서 (유권자 → 경제 → ... → 교육)

**CategoryIcon 렌더링**: 기존 mask-luminance 패턴 사용.

```tsx
// 기존 MyPledgeCard/PledgeRow의 mask-luminance 패턴과 동일하게 구현
function CategoryIcon({ categoryId, size, color }: { categoryId: string; size: number; color?: string }) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat?.iconAsset) return null;
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color ?? cat.iconColor,
        maskImage: `url(${cat.iconAsset})`,
        maskSize: `${size}px ${size}px`,
        maskRepeat: "no-repeat",
        maskPosition: "center",
        maskMode: "luminance",
        WebkitMaskImage: `url(${cat.iconAsset})`,
        WebkitMaskSize: `${size}px ${size}px`,
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
```

> 기존 `MyPledgeCard`/`PledgeRow`에서 사용하는 mask-luminance 패턴과 동일. 향후 이 로직을 공유 컴포넌트로 추출할 수 있으나 현재 스코프에서는 모달 내부에 정의.

> Figma에서 "유권자"의 label은 "유권자"이고, CATEGORIES에서는 "유권자 분석"이다. 모달에서는 Figma 기준 짧은 라벨 "유권자"를 사용한다. CATEGORIES에 `shortLabel` 추가 또는 모달 전용 라벨 매핑이 필요하다.

**카테고리 표시 라벨 매핑**:

```typescript
const CATEGORY_DISPLAY_LABELS: Record<string, string> = {
  voter: "유권자",
  economy: "경제",
  housing: "주거·부동산",
  safety: "사회안전",
  welfare: "복지·분배",
  transport: "교통",
  culture: "문화여가",
  aging: "저출산·고령화",
  education: "교육",
};
```

"유권자 분석" → "유권자"만 다르고 나머지는 CATEGORIES.label과 동일하다. 이 매핑을 `CATEGORIES`에 `shortLabel` 필드로 추가하거나, 모달 내부에서 하드코딩한다. **모달 내부 하드코딩**으로 결정 — CATEGORIES 인터페이스 변경 범위를 최소화하기 위함.

#### 필드 5: 상세내용

기존 `TextArea` 컴포넌트 활용. `maxLength={2000}` 설정 시 자동으로 글자수 카운터가 표시된다.

```tsx
<TextArea
  label="상세내용"
  placeholder="메시지를 입력해주세요."
  maxLength={2000}
  rows={5}
  status={errors.content ? "error" : "default"}
  helperText={errors.content?.message}
  {...register("content")}
/>
```

- 필수 아님 (Figma에서 `*` 표시 없음)
- `rows={5}`: 약 4줄 높이 (Figma 스펙과 일치)
- 카운터: TextArea 내장 기능으로 "925/2000" 형식 자동 표시

#### 하단 액션 바 (고정)

```tsx
<div className="flex items-center justify-between border-t border-line-neutral px-8 py-4">
  {/* 좌: 상태 드롭다운 */}
  <StatusDropdown
    value={watchedStatus}
    onChange={(v) => setValue("status", v)}
  />

  {/* 우: 임시저장 + 등록 */}
  <div className="flex items-center gap-3">
    {/* size prop 미사용 — Figma 기준 커스텀 사이징으로 직접 지정 */}
    <Button
      variant="outline"
      onClick={handleSaveDraft}
      className="h-auto rounded-[12px] border-line-neutral px-7 py-[15px] text-label-2 font-semibold"
    >
      임시저장
    </Button>
    <Button
      disabled={!isValid}
      onClick={handleSubmit(onSubmit)}
      className={cn(
        "h-auto rounded-[12px] bg-primary px-7 py-[15px] text-label-2 font-semibold text-white",
        !isValid && "pointer-events-none opacity-40"
      )}
    >
      등록
    </Button>
  </div>
</div>
```

- "임시저장": `Button variant="outline"` — 현재 폼 상태를 저장 (유효성 검사 없이)
- "등록": `Button` primary — 필수 필드 모두 유효할 때만 활성
- 비활성 상태: `opacity-40` + `pointer-events-none` (Figma 스펙)

#### 상태 드롭다운 (StatusDropdown)

하단 좌측에 위치하는 상태 선택 컴포넌트. 기존 `Chip` 컴포넌트를 트리거로 사용.

```typescript
interface StatusDropdownProps {
  value: PledgeStatus;
  onChange: (status: PledgeStatus) => void;
}
```

**트리거**: `Chip` (label="작성중", isOpen, variant="outlined", size="large")

**드롭다운 패널** (Overlay/Panel):

```tsx
<div className="absolute bottom-full left-0 mb-2 w-[320px] min-w-[140px] rounded-[16px] border border-line-alt bg-white py-2 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.04)]">
  <div className="flex flex-col gap-1 px-5 py-2">
    {STATUS_OPTIONS.map(option => (
      <button
        key={option.value}
        type="button"
        onClick={() => { onChange(option.value); close(); }}
        className="flex w-full items-center justify-between py-3"
      >
        <span className={cn(
          "text-[16px] font-semibold leading-[1.3]",
          option.value === value ? "text-primary" : "text-label-normal"
        )}>
          {option.label}
        </span>
        {option.value === value && (
          <Check className="size-5 text-primary" />
        )}
      </button>
    ))}
  </div>
</div>
```

**상태 옵션**:

```typescript
const STATUS_OPTIONS: { value: PledgeStatus; label: string }[] = [
  { value: "drafting", label: "작성중" },
  { value: "reviewing", label: "검토중" },
  { value: "approved", label: "승인완료" },
  { value: "confirmed", label: "확정됨" },
];
```

- 드롭다운은 트리거 **위쪽**으로 열림 (`bottom-full`)
- 선택된 항목: `text-primary` + 체크 아이콘
- 미선택 항목: `text-label-normal`
- 패널: `rounded-[16px]`, `w-[320px]`, 흰 배경, 미세 그림자
- 바깥 클릭 + Escape로 닫힘 (기존 정렬 드롭다운과 동일 패턴)

---

### 2. MyPledgesPage 수정

**모달 상태 추가**:

```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingPledge, setEditingPledge] = useState<MyPledge | null>(null);
```

**"새 공약 추가" 버튼 연결**:

```tsx
<button onClick={() => { setEditingPledge(null); setIsModalOpen(true); }}>
  <Plus className="size-5" />
  새 공약 추가
</button>
```

**편집 버튼 연결**:

```tsx
<MyPledgeCard
  pledge={pledge}
  onEdit={(id) => {
    const target = mockMyPledges.find(p => p.id === id) ?? null;
    setEditingPledge(target);
    setIsModalOpen(true);
  }}
/>
```

**모달 렌더링**:

```tsx
<PledgeFormModal
  open={isModalOpen}
  onClose={() => { setIsModalOpen(false); setEditingPledge(null); }}
  pledge={editingPledge}
  onSubmit={handleSubmit}
  onSaveDraft={handleSaveDraft}
/>
```

**`handleSubmit` / `handleSaveDraft`**: MVP에서는 toast 알림만 표시. 실제 데이터 변경은 API 연동 시 구현.

```typescript
// import { toast } from "@/lib/toast/toast" — 프로젝트 커스텀 toast 래퍼 사용 (sonner 직접 import 금지)
const handleSubmit = (data: PledgeFormData) => {
  toast.success(editingPledge ? "공약이 수정되었습니다." : "공약이 등록되었습니다.");
  setIsModalOpen(false);
  setEditingPledge(null);
};

const handleSaveDraft = (data: PledgeFormData) => {
  toast.success("임시저장되었습니다.");
};
```

---

## UX 가드레일 체크

| 항목 | 충족 여부 |
|------|----------|
| 텍스트: 충분히 큰 글자 | 제목 24px, 라벨 16px, 입력 16~18px — WCAG AA 이상 |
| 클릭 타겟: 최소 44×44px | 지역 칩 100×48px, 카테고리 칩 ~46px 높이, 버튼 54px 높이 |
| 40~60대 사용자 | 큰 텍스트, 명확한 필수 표시(\*), 직관적인 칩 토글 |
| 키보드 접근성 | Dialog의 focus trap, Escape로 닫기, Tab 순서 자연스러움 |
| 에러 표시 | Zod 검증 실패 시 필드 아래 빨간 텍스트 |
| 로딩/성공 피드백 | 등록/저장 시 Sonner toast |

---

## 기존 코드 영향 분석

| 파일 | 변경 유형 | 설명 |
|------|----------|------|
| `mock-policy.ts` | **Breaking** | `MyPledge`, `PledgeSummary` 인터페이스 변경 + `computePledgeSummary` 업데이트 + mock 데이터 구조 변경 |
| `MyPledgeCard.tsx` | 수정 | 필드명 변경 대응 (`region→regions[0]`, `categoryId→categoryIds[0]`, `category→getCategoryLabel(categoryIds[0])`, `description→summary`) |
| `PledgeRow.tsx` | 수정 | `PledgeRowProps` 인터페이스 필드 변경 (`category`, `categoryId`, `description`, `region` → 새 필드명). 호출부(`MyPledgesSection`)도 함께 수정 |
| `MyPledgesSection.tsx` | 수정 | 필드명 변경 대응 + PledgeRow 호출부 수정 + 요약카드 5개로 확장 (approved 추가) |
| `MyPledgesPage.tsx` | 수정 | 모달 상태 추가, STATUS_FILTERS에 "승인완료" 추가 |
| `PolicyPage.tsx` | 수정 | `computePledgeSummary` 결과에 `approved` 카운트 반영 |
| `router.tsx` | 변경 없음 | 라우트는 이미 존재 |

---

## 스코프 외 (향후 작업)

- API 연동 (POST/PUT /policies)
- 이미지/파일 첨부
- 공약 삭제 기능
- 다른 사용자 공약 조회
- AI 추천 공약 → 내 공약으로 채택 시 모달 자동 채움
- TextField 컴포넌트 자체에 maxLength 카운터 내장 (현재는 모달 내부에서 별도 렌더링)
