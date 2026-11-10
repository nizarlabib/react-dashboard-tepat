import { ApiError } from "./errors";
import type {
  ApiResponse,
  ApiErrorInfo,
  ErrorResponse,
  PaginatedResponse,
  ResponseMeta,
} from "../../types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

let authToken: string | null = null;
let csrfToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setCsrfToken(token: string | null) {
  csrfToken = token;
}

export function getAuthToken(): string | null {
  return authToken;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
  skipAuth?: boolean;
}

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    return null as unknown as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null as unknown as T;
  }
}

function emptyError(status: number): ErrorResponse {
  return {
    message: `Request failed with status ${status}`,
    code: status,
  };
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);

  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    }
  }

  const controller = new AbortController();
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  if (options.timeoutMs !== undefined) {
    timeoutId = setTimeout(() => controller.abort(), options.timeoutMs);
  }

  const externalSignal = options.signal;
  const handleExternalAbort = () => controller.abort();

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", handleExternalAbort, {
        once: true,
      });
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (!options.skipAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  if (csrfToken && options.method !== "GET") {
    headers["X-CSRF-Token"] = csrfToken;
  }

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (externalSignal) {
      externalSignal.removeEventListener("abort", handleExternalAbort);
    }
  }

  if (!response.ok) {
    let error: ErrorResponse;

    try {
      error = (await parseJson<ErrorResponse>(response)) as ErrorResponse;
    } catch {
      error = emptyError(response.status);
    }

    throw new ApiError(error, response.status);
  }

  const envelope = (await parseJson<ApiResponse<unknown>>(response)) as
    | ApiResponse<unknown>
    | undefined;

  const meta: ResponseMeta = (envelope?.meta ?? {}) as ResponseMeta;

  if (!envelope) {
    throw new ApiError(emptyError(response.status), response.status);
  }

  if (meta.code >= 400) {
    throw new ApiError(
      {
        message: meta.message ?? `Request failed with code ${meta.code}`,
        code: meta.code,
        error_code: meta.error_code,
        detail: meta.detail,
        data: envelope.data as ErrorResponse["data"],
      },
      meta.code,
    );
  }

  return envelope.data as T;
}

export const api = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "POST" }),

  put: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PUT" }),

  patch: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "PATCH" }),

  delete: <T>(path: string, options: RequestOptions = {}) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

export type { ApiResponse, PaginatedResponse, ErrorResponse, ApiErrorInfo };
