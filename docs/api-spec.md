# Democrasee — API 명세 (프론트엔드 기준)

> 최종 수정: 2026-02-08
> 상태: 초안 (백엔드 API 확정 전, 프론트엔드 mock 데이터 기준으로 작성)

---

## 0. 공통 규칙

### Base URL

```
<!-- TODO: 백엔드 배포 후 실제 URL로 업데이트 -->
개발: http://localhost:8080/api/v1
운영: https://api.democrasee.kr/v1
```

### 인증 헤더

```
Authorization: Bearer <access_token>
```

### 공통 응답 형식

```typescript
// 성공 응답
interface ApiResponse<T> {
  success: true;
  data: T;
}

// 에러 응답
interface ApiError {
  success: false;
  error: {
    code: string;      // 예: "AUTH_001"
    message: string;   // 사용자에게 표시 가능한 메시지
  };
}
```

### 페이지네이션

```typescript
interface PaginatedResponse<T> {
  success: true;
  data: {
    items: T[];
    pagination: {
      page: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    };
  };
}
```

---

## 1. 인증 (Auth)

### POST /auth/login

로그인

```typescript
// Request
interface LoginRequest {
  username: string;
  password: string;
}

// Response 200
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    role: UserRole;
    campId: string;
  };
}

type UserRole = "candidate" | "manager" | "accountant" | "staff";
```

### POST /auth/register

회원가입

```typescript
// Request
interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  phone: string;
  phoneVerificationCode: string;
  approvalCode: string;
  role: UserRole;
  region: {
    sido: string;          // 시·도
    sigungu: string;       // 시·군·구
    dongOrDistrict: string; // 행정동 또는 선거구
  };
}

// Response 201
interface RegisterResponse {
  userId: string;
  message: string;
}
```

### POST /auth/phone/send-code

휴대폰 인증번호 발송

```typescript
// Request
interface SendPhoneCodeRequest {
  phone: string;
}

// Response 200
interface SendPhoneCodeResponse {
  expiresInSeconds: number; // 인증번호 유효 시간 (초)
}
```

### POST /auth/phone/verify

휴대폰 인증번호 확인

```typescript
// Request
interface VerifyPhoneRequest {
  phone: string;
  code: string;
}

// Response 200
interface VerifyPhoneResponse {
  verified: boolean;
}
```

### POST /auth/refresh

토큰 갱신

```typescript
// Request
interface RefreshTokenRequest {
  refreshToken: string;
}

// Response 200
interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
```

---

## 2. 대시보드 (Dashboard)

### GET /dashboard/summary

대시보드 요약 데이터

```typescript
// Response 200
interface DashboardSummary {
  electionDate: string;           // ISO 8601 ("2026-06-03")
  dDay: number;                   // D-day 숫자
  todaySchedule: Schedule[];
  regionSummary: {
    topComplaintRegion: string;   // 최다 민원 지역명
    topComplaintType: string;     // 주요 민원 유형
    changeRate: number;           // 증가율 (%)
  };
  policySummary: {
    totalCount: number;
    inProgressCount: number;
    completedCount: number;
    latestPolicy: {
      id: string;
      title: string;
      updatedAt: string;
    } | null;
  };
}

interface Schedule {
  id: string;
  title: string;
  startTime: string;  // ISO 8601
  endTime: string;
  type: "meeting" | "event" | "deadline" | "other";
}
```

---

## 3. 지역분석 (Region Analysis)

### GET /regions

지역 목록 조회 (선택 UI용)

```typescript
// Query Params
interface RegionsQuery {
  sido?: string;
  sigungu?: string;
}

// Response 200
interface RegionsResponse {
  regions: Region[];
}

interface Region {
  code: string;         // 행정동 코드
  name: string;
  level: "sido" | "sigungu" | "dong";
  parentCode?: string;
}
```

### GET /region-analysis/:regionCode

지역 현황 분석 결과

```typescript
// Query Params
interface RegionAnalysisQuery {
  category: AnalysisCategory;
  year?: number;    // 기본값: 현재 연도
}

type AnalysisCategory = "population" | "complaint" | "budget" | "welfare" | "safety";

// Response 200
interface RegionAnalysisResponse {
  regionCode: string;
  regionName: string;
  category: AnalysisCategory;
  currentYear: number;
  indicators: Indicator[];
  yearlyTrend: YearlyData[];
}

interface Indicator {
  name: string;           // 지표명
  value: number;
  unit: string;           // "명", "%", "건" 등
  yearOverYear: number;   // 전년 대비 변화율 (%)
  nationalAverage: number;
}

interface YearlyData {
  year: number;
  value: number;
}
```

### GET /region-analysis/:regionCode/comparison

인접 지역 비교

```typescript
// Query Params
interface ComparisonQuery {
  category: AnalysisCategory;
  limit?: number;   // 비교 지역 수 (기본: 5)
}

// Response 200
interface ComparisonResponse {
  baseRegion: RegionComparisonData;
  compareRegions: RegionComparisonData[];
}

interface RegionComparisonData {
  regionCode: string;
  regionName: string;
  indicators: {
    name: string;
    value: number;
    unit: string;
    rank: number;
  }[];
}
```

### GET /region-analysis/:regionCode/ai-insight

AI 인사이트 (P1, MVP에서는 mock)

```typescript
// Response 200
interface AiInsightResponse {
  summary: string;        // 핵심 요약 (1~3문장)
  details: string | null; // 상세 분석 (마크다운, 추후 제공)
  generatedAt: string;    // 생성 일시
}
```

---

## 4. 정책개발 (Policy)

### GET /policies

공약 목록 조회

```typescript
// Query Params
interface PoliciesQuery {
  status?: PolicyStatus;
  category?: string;
  page?: number;
  pageSize?: number;
}

type PolicyStatus = "draft" | "in_review" | "confirmed" | "archived";

// Response 200 → PaginatedResponse<Policy>

interface Policy {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: PolicyStatus;
  source: "manual" | "ai_recommended";
  createdAt: string;
  updatedAt: string;
}
```

### GET /policies/:id

공약 상세 조회

```typescript
// Response 200
interface PolicyDetail extends Policy {
  content: string;          // 전체 내용 (마크다운)
  regionContext?: string;   // 관련 지역분석 요약
  aiRecommendation?: {
    reason: string;
    confidence: number;     // 0~1
  };
  history: {
    action: string;
    timestamp: string;
    userId: string;
  }[];
}
```

### POST /policies

공약 생성

```typescript
// Request
interface CreatePolicyRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  status: PolicyStatus;
}

// Response 201
interface CreatePolicyResponse {
  id: string;
}
```

### PUT /policies/:id

공약 수정

```typescript
// Request
interface UpdatePolicyRequest {
  title?: string;
  summary?: string;
  content?: string;
  category?: string;
  status?: PolicyStatus;
}

// Response 200
interface UpdatePolicyResponse {
  id: string;
  updatedAt: string;
}
```

### DELETE /policies/:id

공약 삭제

```typescript
// Response 204 (No Content)
```

### GET /policies/historical

역대 공약 조회

```typescript
// Query Params
interface HistoricalPoliciesQuery {
  electionType?: "presidential" | "legislative" | "local";
  party?: string;
  district?: string;
  candidateName?: string;
  page?: number;
  pageSize?: number;
}

// Response 200 → PaginatedResponse<HistoricalPolicy>

interface HistoricalPolicy {
  id: string;
  title: string;
  summary: string;
  category: string;
  candidateName: string;
  party: string;
  electionType: string;
  electionYear: number;
  district: string;
}
```

### GET /policies/ai-recommendations

AI 추천 공약 (P1, MVP에서는 mock)

```typescript
// Response 200
interface AiRecommendationsResponse {
  recommendations: AiRecommendedPolicy[];
}

interface AiRecommendedPolicy {
  id: string;
  title: string;
  summary: string;
  category: string;
  reason: string;           // 추천 이유
  basedOnRegionData: string; // 근거가 된 지역분석 데이터 요약
  confidence: number;       // 0~1
}
```

---

## 5. 에러 코드 표

| 코드 | HTTP 상태 | 설명 |
|------|-----------|------|
| AUTH_001 | 401 | 아이디 또는 비밀번호가 올바르지 않습니다 |
| AUTH_002 | 401 | 인증 토큰이 만료되었습니다 |
| AUTH_003 | 400 | 휴대폰 인증번호가 올바르지 않습니다 |
| AUTH_004 | 400 | 승인코드가 유효하지 않습니다 |
| AUTH_005 | 409 | 이미 사용 중인 아이디입니다 |
| REGION_001 | 404 | 해당 지역을 찾을 수 없습니다 |
| POLICY_001 | 404 | 해당 공약을 찾을 수 없습니다 |
| POLICY_002 | 403 | 공약 수정 권한이 없습니다 |
| COMMON_001 | 500 | 서버 내부 오류가 발생했습니다 |

<!-- TODO: 백엔드 팀과 에러 코드 협의 후 업데이트 -->

---

## 변경 이력

| 날짜 | 변경 내용 | 작성자 |
|------|-----------|--------|
| 2026-02-08 | 초안 작성 (프론트엔드 기준 mock 인터페이스) | — |
