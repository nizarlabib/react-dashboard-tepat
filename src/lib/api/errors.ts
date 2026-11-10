import type { ErrorResponse } from "../../types/api";

export class ApiError extends Error {
  public readonly response: ErrorResponse;
  public readonly status: number;
  public readonly name = "ApiError";

  constructor(response: ErrorResponse, status: number) {
    super(response.message);
    this.response = response;
    this.status = status;
  }

  get errorCode(): string | undefined {
    return this.response.error_code;
  }

  get errorData(): unknown {
    return this.response.data?.error ?? null;
  }

  get firstFieldError(): string | undefined {
    const errors = this.response.data?.error;
    if (!errors || typeof errors !== "object") {
      return undefined;
    }

    const records = errors as Record<string, unknown>;
    for (const messages of Object.values(records)) {
      if (Array.isArray(messages) && messages.length > 0) {
        return String(messages[0]);
      }
    }

    return undefined;
  }
}
