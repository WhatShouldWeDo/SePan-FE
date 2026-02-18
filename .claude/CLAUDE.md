# 프로젝트 가이드

> Claude Code / Cursor가 자동으로 읽는 프로젝트 컨텍스트입니다.
> 다른 프롬프트나 예시 코드가 상충하더라도, 여기 규칙을 우선 적용하세요.

---

## 0. 프로젝트 개요

선거 캠프용 지역분석·정책개발 SaaS (B2B). 주 사용자는 40~60대 장년층 캠프 관계자.

기능 축: 인증(소셜 로그인 없음) · 지역분석(시각화/비교/AI 인사이트) · 정책개발(공약 관리/AI 추천) · 대시보드

| 영역            | 선택                 | 비고                               |
| --------------- | -------------------- | ---------------------------------- |
| Framework       | React + Vite         | TypeScript 필수                    |
| 서버 상태       | TanStack React Query | 서버 상태는 반드시 RQ              |
| 클라이언트 상태 | useState > Zustand   | Context는 테마/인증만              |
| 스타일          | Tailwind CSS         | 다른 CSS 방식 금지                 |
| API             | REST                 | 비즈니스 로직은 프론트에 두지 않기 |

```bash
pnpm run dev      # 개발 서버
pnpm run build    # 빌드
pnpm run lint     # 린트
npx tsc --noEmit  # 타입 체크
```

---

## 1. 작업 방식

"생성은 맡기되, 컨텍스트와 결정은 사람이 주도"하는 예측 가능한 바이브 코딩.

- 코드를 직접 읽고 이해 가능한 수준으로만 생성. 과도한 추상화 금지.
- 한 번에 한 화면(또는 한 기능)만 집중.
- 새 기술·라이브러리 도입은 항상 질문 먼저. 코드에 바로 반영 금지.
- PRD/UX 시나리오의 사용자 플로우 최우선. 불확실하면 "가설" 표시 후 질문.
- 새 화면/퍼널은 **Plan 먼저** → 확인 후 코드. Plan에는 파일 설계, props 설계, 상태 전략, 가설/질문 포함.

---

## 2. 컨텍스트 우선순위

Claude는 아래 순서로 참고:

1. **이 파일** — 전체 규칙
2. **`docs/ARCHITECTURE.md`** — 아키텍처 개요 (항상 최신)
3. **`docs/MODULE_MAP.md`** — 모듈별 파일 위치·역할 (항상 최신)
4. **`docs/prd.md` / `docs/ux-flow.md`** — 유저 플로우, UX 시나리오
5. **`docs/architecture/{module}.md`** — 모듈별 상세 구조 (항상 최신)
6. **`docs/decisions/`** — 의사결정 기록(ADR). append only.
7. **`docs/troubleshooting/`** — 트러블슈팅 기록. append only.
8. **`src/app/router.tsx`** — 라우팅 구조
9. **`TODO.md`** — 현재 작업 범위

---

## 3. 문서 시스템

### 3-1. 문서 성격 구분

| 디렉토리                                            | 업데이트 방식                   |
| --------------------------------------------------- | ------------------------------- |
| `ARCHITECTURE.md`, `MODULE_MAP.md`, `architecture/` | 항상 최신으로 덮어쓰기          |
| `decisions/`, `troubleshooting/`, `plans/archived/` | **추가만 가능, 기존 수정 금지** |
| `plans/active/`                                     | 작업 중 업데이트 가능           |
| `prd.md`, `ux-flow.md`                              | Claude 수정 금지 (사람만 수정)  |

### 3-2. 작업 전 (반드시)

- `ARCHITECTURE.md`와 `MODULE_MAP.md`로 현재 구조 파악
- 대상 모듈의 `architecture/{module}.md` 확인
- 관련 ADR 확인 → 기존 의사결정 존중
- PRD/UX 모순·빈칸 → 추측 구현 금지, "가설" 표시 + 안전한 기본값

### 3-3. 작업 후 (반드시)

- `MODULE_MAP.md` — 변경된 파일/모듈 반영
- `ARCHITECTURE.md` — 아키텍처 영향 있으면 반영
- `architecture/{module}.md` — 최신화 (없으면 생성). **"현재 어떻게"만 작성, "왜"는 ADR로 분리**
- `plans/active/` 완료 계획 → `plans/archived/`로 이동

### 3-4. ADR · 트러블슈팅 작성

- ADR: 기존 패턴과 다른 선택을 했을 때만. 템플릿 → `docs/templates/adr-template.md`
- 트러블슈팅: 예상치 못한 문제 해결 시. 템플릿 → `docs/templates/troubleshooting-template.md`
- `MODULE_MAP.md` 형식 → `docs/templates/module-map-guide.md`
- `ARCHITECTURE.md` 형식 → `docs/templates/architecture-guide.md`

---

## 4. UX 가드레일

- 텍스트: 충분히 큰 글자, 높은 대비 (WCAG AA 이상)
- 클릭 타겟: 최소 44×44px
- 데이터 시각화: "한 문장 요약 + 그래프" 구조
- 새 컴포넌트 생성 시 위 원칙 준수 여부 간단히 언급
- **화면별 상세 UX** → `docs/ux-flow.md` 참조. 작업 전 반드시 확인.

---

## 5. 코드 구조

```
src/
  app/          # 라우팅, 페이지 스켈레톤
  features/     # auth / dashboard / region / policy
  components/   # 재사용 UI
  hooks/        # 공통 훅
  lib/          # 유틸리티, API 클라이언트
  types/        # 공통 타입
```

- 상태 관리: useState → React Query → Zustand (이 순서)
- 컴포넌트 레이어: `Page`(데이터+레이아웃) → `Section`(기능 단위) → `Pure UI`
- 비즈니스 로직은 hooks(`useXxx`)로 분리

---

## 6. 금지 목록

- Redux, MobX 등 미사용 상태관리 도입
- Tailwind 외 스타일링 도입
- 새 라이브러리 질문 없이 추가
- PRD/UX에 없는 기능 추측 구현
- AI 추천 자동 저장/자동 채택
- 소셜 로그인 코드 추가
- 한 번에 여러 화면/기능 동시 구현
- 비즈니스 로직 프론트엔드 배치
- `decisions/`, `troubleshooting/`, `plans/archived/` 기존 파일 수정
- `prd.md`, `ux-flow.md` Claude 직접 수정

---

## 7. Claude 작업 규칙

1. **변경 요약 먼저** — 어떤 파일을 왜 바꾸는지 3~5줄
2. **diff 중심 응답** — 새 파일은 전체 코드
3. **PRD/UX 상충 시** → 즉시 질문
4. **과도한 파일 생성 금지** — 임시 파일은 작업 끝에 정리
5. **커밋 단위 추천**
6. **규칙 참조 명시** — 이 가이드 중 어떤 규칙 참고했는지 언급
7. **문서 업데이트 리마인드** — 기능 완료 시 업데이트 필요 문서 목록 제안

---

## 8. Todo 운영

`TODO.md`를 Claude가 읽고 업데이트. 끝난 작업은 `[x]`, 새 요구사항은 "메모" 섹션에 축적. 수정 시 항상 diff + "이번 턴 완료 항목" 정리.

---

## 9. Serena Usage (MANDATORY)

Always use serena MCP tools: `find_symbol`, `get_symbols_overview`, `find_referencing_symbols`, `insert_after_symbol`, `insert_before_symbol`, `replace_symbol`.
Never use grep/ripgrep when serena can do semantic search. Never read entire files — use serena to get relevant symbols only.

---

_이 CLAUDE.md는 MVP 동안 계속 수정될 예정입니다._
