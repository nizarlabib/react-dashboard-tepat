export interface ResponseMeta {
  message: string;
  code: number;
  error_code?: string;
  detail?: string;
}

export interface PageMeta {
  current_page: number;
  total_data: number;
  limit: number;
  total_page: number;
}

export interface ApiResponse<T> {
  data: T | null;
  meta: ResponseMeta;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  page: PageMeta;
}

export interface ErrorResponse {
  message: string;
  code: number;
  error_code?: string;
  detail?: string;
  data?: { error?: unknown } | null;
}

export interface ApiErrorInfo {
  status: number;
  response: ErrorResponse;
}
