// 공통 타입 정의

export type UserRole = "candidate" | "manager" | "accountant" | "staff"

export interface User {
  id: string
  username: string
  name: string
  email?: string
  phone: string
  role: UserRole
  regionId?: string
  createdAt: string
}

export interface Region {
  id: string
  name: string
  type: "sido" | "sigungu" | "dong" | "electoral"
  parentId?: string
}

// 페이지네이션
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
