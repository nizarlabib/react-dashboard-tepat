import { ApiError } from "./errors";
import type { ApiResponse, ErrorResponse } from "../../types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
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
    success: false,
    message: `Request failed with status ${status}`,
    meta: { timestamp: new Date().toISOString() },
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
  const timeoutId =
    options.timeoutMs !== undefined
      ? setTimeout(() => controller.abort(), options.timeoutMs)
      : null;

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

  let response: Response;

  try {
    response = await fetch(url.toString(), {
      method: options.method ?? "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
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

  const envelope = (await parseJson<ApiResponse<T>>(response)) as ApiResponse<T>;

  if (!envelope || !envelope.success) {
    throw new ApiError(
      (envelope ?? emptyError(response.status)) as unknown as ErrorResponse,
      response.status,
    );
  }

  return envelope.data ?? (null as unknown as T);
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
