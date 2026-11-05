export interface Meta {
  timestamp: string;
  [key: string]: unknown;
}

export interface PaginationMeta extends Meta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T | null;
  meta: Meta;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  meta: Meta & { code?: string };
}
