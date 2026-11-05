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
}
