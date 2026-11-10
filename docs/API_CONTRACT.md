# API Contract

This document describes the API contract between the React Dashboard Starter frontend and the `go-starter-service` Go backend.

## Verification Status

**Source of truth:** `go-starter-service` (at `/var/www/go-starter-service`)
**Verified:** Yes — inspected actual Go HTTP handlers, response DTOs, error handling, pagination, and authentication implementation.
**Repository:** `https://github.com/nizarlabib/go-starter-service.git`

> ⚠️ The previous API contract documented a generic `{ success: true, message, data, meta { timestamp } }` envelope. That format does **not** match the actual Go implementation. The Go backend uses `{ data, meta { message, code, error_code?, detail? } }` with **no top-level `success` field** and **no `timestamp`**.

---

## Base URL

Configured via the `VITE_API_BASE_URL` environment variable. Never hardcode a backend URL inside a page or component.

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

All API routes are mounted under `/api/v1` (see `cmd/api/main.go:179`).

---

## Mock Mode

`VITE_USE_MOCK_API=true` enables the built-in mock API layer. Set it to any other value to call the real backend.

In mock mode, services return locally simulated data and do not contact the backend. In real mode, services call `go-starter-service` through `src/lib/api/client.ts`.

---

## Response Envelope — Success

Every successful response uses this envelope:

```json
{
  "data": null | { ... },
  "meta": {
    "message": "Human-readable message",
    "code": 200,
    "error_code": "SUCCESS",
    "detail": "optional detail"
  }
}
```

### Field reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `any` | Yes | Response payload. `null` when there is no payload. Wrapped as `map[string]any{ "<dataName>": data }` by most helpers. |
| `meta.message` | `string` | Yes | Human-readable status message. |
| `meta.code` | `integer` | Yes | HTTP status code (200, 201, etc.). |
| `meta.error_code` | `string` | No | Machine-readable code. Omitted when empty (`omitempty`). |
| `meta.detail` | `string` | No | Optional detail string. Omitted when empty (`omitempty`). |

### Important: no `success` boolean

The Go backend does **not** include a top-level `success` boolean field. Application-level success is indicated by an HTTP 2xx status code and `meta.code` in the 2xx range.

### Example — single item

```json
{
  "data": {
    "me": {
      "id": 1,
      "fullname": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "role_id": "550e8400-e29b-41d4-a716-446655440000",
      "permissions": "...",
      "permission_mask": "..."
    }
  },
  "meta": {
    "message": "success getting me",
    "code": 200
  }
}
```

### Example — created resource (201)

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "message": "Login Sucessfull",
    "code": 200
  }
}
```

---

## Response Envelope — Pagination

List endpoints return data in a `data` map plus a separate `page` block:

```json
{
  "data": {
    "users": [ ... ]
  },
  "page": {
    "current_page": 1,
    "total_data": 100,
    "limit": 10,
    "total_page": 10
  },
  "meta": {
    "message": "success find all",
    "code": 200
  }
}
```

### Pagination block fields

| Field | Type | Description |
|-------|------|-------------|
| `page.current_page` | `integer` | Current page (1-based) |
| `page.total_data` | `integer` | Total number of records |
| `page.limit` | `integer` | Items per page |
| `page.total_page` | `integer` | Total number of pages |

### Query parameters

| Parameter | Default | Max | Description |
|-----------|---------|-----|-------------|
| `page` | `1` | — | Current page (1-based) |
| `limit` | `10` | `50` | Items per page |

The backend caps `limit` at 50.

**Important:** The Go backend uses `limit`, **not** `per_page`. The frontend previously sent `per_page`, which does not match the Go contract.

### Example request

```
GET /api/v1/users?page=1&limit=10&name=john&status=verified&role_id=550e8400-...&order_by=created_at
```

### Supported users list filters

| Parameter | Description |
|-----------|-------------|
| `name` | Filter by full name |
| `email` | Filter by email |
| `phone` | Filter by phone |
| `status` | `pending` \| `suspended` \| `verified` \| `rejected` \| `deleted` |
| `role_id` | UUID of role |
| `order_by` | Field to sort by |
| `is_deleted` | `true`\|`1` to include deleted |
| `has_perms` | Permission filter |

---

## Response Envelope — Error

Error responses use the same envelope, with `meta.code` in the 4xx/5xx range:

```json
{
  "data": null,
  "meta": {
    "message": "Validation failed",
    "code": 400,
    "error_code": "ERR_VALIDATION_ERROR"
  }
}
```

When field-level validation error data is present:

```json
{
  "data": {
    "error": {
      "email": ["The email field is required."]
    }
  },
  "meta": {
    "message": "Validation failed",
    "code": 400,
    "error_code": "ERR_VALIDATION_ERROR"
  }
}
```

### Field reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `data` | `any` | No | May contain `{ "error": {...} }` for field-level validation errors. |
| `meta.message` | `string` | Yes | Human-readable error message. |
| `meta.code` | `integer` | Yes | HTTP status code (400, 401, 403, 404, 409, 429, 500). |
| `meta.error_code` | `string` | No | Machine-readable application error code. |
| `meta.detail` | `string` | No | Optional detail. |

### HTTP status code mapping

| Status | Meaning | Typical error_code |
|--------|---------|-------------------|
| 400 | Bad request / validation | `ERR_VALIDATION_ERROR`, `ERR_BAD_REQUEST` |
| 401 | Unauthorized | `ERR_UNAUTHORIZED`, `ERR_TOKEN_EXPIRED` |
| 403 | Forbidden | `ERR_FORBIDDEN` |
| 404 | Not found | `ERR_RECORD_NOT_FOUND` |
| 409 | Conflict | `ERR_EMAIL_EXISTS`, `ERR_PHONE_EXISTS` |
| 429 | Too many requests | `ERR_TOO_MANY_REQUESTS` |
| 500 | Internal server error | `ERR_INTERNAL_SERVER_ERROR` |

### Application error codes

Defined in `internal/value_object/v1/constant/app_errors.go`:

- `ERR_INVALID_CREDENTIALS` — Invalid login credentials
- `ERR_SESSION_CONFLICT` — Session used in another location
- `ERR_EMAIL_EXISTS` — Email already registered
- `ERR_PHONE_EXISTS` — Phone already registered
- `ERR_NIK_EXISTS` — NIK already registered
- `ERR_USER_INACTIVE` — User account inactive
- `ERR_USER_SUSPENDED` — User account suspended
- `ERR_LOGIN_ATTEMPT_LIMIT` — Login attempt limit exceeded
- `ERR_USER_SESSION_LIMIT` — User session limit
- `ERR_USER_SESSION_ACTIVE` — Active session conflict
- `ERR_PASSWORD_MUST_NEW` — Password must be new
- `ERR_NEW_PASSWORD_SAME` — New password same as old
- `ERR_PASSWORD_INCORRECT` — Incorrect password
- `ERR_OTP_INVALID` — Invalid OTP
- `ERR_USER_ROLE_MISSED` — User role missing
- `ERR_REQUEST_TIMEOUT` — Request timed out
- `ERR_UNKNOWN` — Unknown error
- `ERR_JSON_BODY` — Invalid JSON body
- `ERR_VALIDATION_ERROR` — Validation error
- `ERR_INTERNAL_SERVER_ERROR` — Internal server error
- `ERR_BAD_REQUEST` — Bad request
- `ERR_UNAUTHORIZED` — Unauthorized
- `ERR_FORBIDDEN` — Forbidden
- `ERR_TOKEN_EXPIRED` — Token expired
- `ERR_RECORD_NOT_FOUND` — Record not found
- `ERR_USER_FROZEN` — User account frozen
- `ERR_USER_QUOTA_EXCEEDED` — User quota exceeded
- `ERR_TOO_MANY_REQUESTS` — Rate limit exceeded
- `ERR_INVALID_FILE_FORMAT` — Invalid file format
- `ERR_FILE_SIZE_TOO_BIG` — File too big

---

## Authentication

### Mechanism

JWT-based authentication with access tokens and refresh tokens.

- **Access token**: Short-lived (default 15 minutes), used for API authentication.
- **Refresh token**: Long-lived (default 7 days), used to obtain new access tokens.
- Token revocation via Redis-based JTI blocklist.

### Authorization header

```
Authorization: Bearer <access_token>
```

### CSRF protection

State-changing endpoints (login, register, logout, change password, etc.) require a CSRF token in the `X-CSRF-Token` header. Obtain a CSRF token first via `GET /auth/csrf_token`.

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/csrf_token` | None | Generate CSRF token |
| POST | `/auth/check-existing-user-by-email` | None | Check if email exists |
| POST | `/auth/check-existing-user-by-phone` | None | Check if phone exists |
| POST | `/auth/register` | None + CSRF | Register new user (multipart form) |
| POST | `/auth/login` | None + CSRF | Login, returns access + refresh tokens |
| POST | `/auth/forgot-password` | None + CSRF | Send reset email |
| POST | `/auth/forgot-password/phone` | None + CSRF | Send reset SMS |
| POST | `/auth/reset-password` | None + CSRF | Reset password with token |
| POST | `/auth/logout` | Bearer + CSRF | Logout, revoke token |
| GET | `/auth/me` | Bearer | Get current user profile |
| DELETE | `/auth/me/delete-account` | Bearer + CSRF | Delete account |
| PUT | `/auth/profile` | Bearer + CSRF | Update profile |
| PUT | `/auth/profile/photo` | Bearer + CSRF | Update profile photo |
| GET | `/auth/profile/download/{filename}` | Bearer | Download profile file |
| PUT | `/auth/change-password` | Bearer + CSRF | Change password |
| POST | `/auth/verify-user-password` | Bearer | Verify password |
| GET | `/auth/activity-logs` | Bearer | Get activity logs (paginated) |
| POST | `/auth/switch_role` | Bearer + CSRF | Switch active role |
| POST | `/auth/impersonate/{user_id}` | Bearer + Super Admin | Impersonate user |
| POST | `/auth/release_impersonation/{user_id}` | Bearer | Release impersonation |
| POST | `/auth/refresh-token` | Bearer + Refresh Token | Refresh access token |

### Login request

```json
{
  "username": "user@example.com",
  "password": "securePassword123"
}
```

The `email` field is deprecated but accepted; `username` is the primary field. CSRF token required.

### Login response

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "meta": {
    "message": "Login Sucessfull",
    "code": 200
  }
}
```

### CSRF token response

```json
{
  "data": {
    "csrf_token": "a1b2c3d4..."
  },
  "meta": {
    "message": "CSRF token generated",
    "code": 200
  }
}
```

### Refresh token response

```json
{
  "data": {
    "access_token": "...",
    "refresh_token": "..."
  },
  "meta": {
    "message": "refresh token sucessfull",
    "code": 200
  }
}
```

### Logout response

```json
{
  "data": null,
  "meta": {
    "message": "success logout",
    "code": 200
  }
}
```

### No cookies

Tokens are returned in the response body, not in cookies. The client is responsible for storing and sending the access token in the `Authorization: Bearer` header.

---

## Endpoints Not Yet Implemented in Backend

The following endpoints exist in the frontend as **integration placeholders** but are **not implemented** in `go-starter-service`:

| Endpoint | Status |
|----------|--------|
| `GET /dashboard/overview` | Not implemented |
| `GET /dashboard/revenue` | Not implemented |
| `GET /dashboard/activities` | Not implemented |
| `GET /dashboard/transactions` | Not implemented |
| `GET /products` | Not implemented |
| `GET /products/:id` | Not implemented |
| `POST /products` | Not implemented |
| `PUT /products/:id` | Not implemented |
| `DELETE /products/:id` | Not implemented |
| `GET /orders` | Not implemented |
| `GET /orders/:id` | Not implemented |
| `GET /settings` | Not implemented |
| `PUT /settings` | Not implemented |
| `GET /users/:id` | Not implemented (only list exists) |
| `POST /users` | Not implemented (only list exists) |
| `PUT /users/:id` | Not implemented (only list exists) |
| `DELETE /users/:id` | Not implemented (only list exists) |

The only users endpoint implemented in Go is `GET /users` (list, with RBAC permission `ReadUser`).

---

## Data Types

### UUID

Role IDs are UUIDs (e.g. `550e8400-e29b-41d4-a716-446655440000`). User IDs are unsigned integers (`uint`).

### Date and timestamp format

Go `time.Time` serialized as RFC3339 / ISO-8601 UTC (e.g. `2026-11-05T12:00:00Z`).

### Nullable fields

Optional pointer fields are omitted from JSON when null (`omitempty`).

### Empty collections

Empty arrays are returned as `[]`.

### JSON field naming

Snake_case (e.g. `access_token`, `refresh_token`, `error_code`, `fullname`, `profile_picture_url`, `permission_mask`).

### Query parameter naming

Snake_case (e.g. `page`, `limit`, `order_by`, `role_id`, `is_deleted`, `has_perms`).

---

## TypeScript Types

All response structures are defined in `src/types/api.ts`:

- `ResponseMeta` — `message`, `code`, `error_code?`, `detail?`
- `PageMeta` — `current_page`, `total_data`, `limit`, `total_page`
- `ApiResponse<T>` — `data`, `meta`
- `PaginatedResponse<T>` — extends `ApiResponse<T>` with `page: PageMeta`
- `ErrorResponse` — `message`, `code`, `error_code?`, `detail?`, `data?`

Auth types live in `src/types/auth.ts`:
- `LoginRequest` — `username`, `password`
- `LoginResponse` — `access_token`, `refresh_token`
- `MeResponse` — current user profile fields
- `CsrfTokenResponse` — `csrf_token`

Domain types live in `src/types/index.ts`, `src/types/user.ts`, `src/types/product.ts`, `src/types/order.ts`.

---

## Error Handling

HTTP errors are thrown as `ApiError` (see `src/lib/api/errors.ts`) with the parsed `ErrorResponse` on `error.response` and the HTTP status on `error.status`.

The API client checks both:
1. HTTP-level success (`response.ok`)
2. Application-level success (`meta.code < 400`)

If `meta.code >= 400`, an `ApiError` is thrown even when HTTP status is 2xx.

### Accessing error details

```ts
try {
  await api.get(...);
} catch (error) {
  if (error instanceof ApiError) {
    // error.status — HTTP status code
    // error.response.message — human-readable message
    // error.response.code — application code
    // error.response.error_code — machine-readable code
    // error.firstFieldError — first validation error message
    // error.errorData — raw error data object
  }
}
```
