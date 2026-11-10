# Backend Integration

This guide explains how to connect this React frontend starter to the `go-starter-service` Go backend.

The authoritative reference for the frontend/backend contract is `docs/API_CONTRACT.md`, which was verified against the actual Go source code (handlers, response DTOs, error handling, pagination, authentication).

---

## 1. Backend Repository

The intended backend is `go-starter-service`:

- Local path: `/var/www/go-starter-service`
- Repository: `https://github.com/nizarlabib/go-starter-service.git`

If the backend repository is unavailable, contract alignment cannot be fully verified. See `docs/API_CONTRACT.md` for the verified contract.

---

## 2. Configure the API Base URL

Create a `.env` file (or set environment variables in your host):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=false
```

Restart the dev server after changing environment variables.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of the Go backend (no trailing slash) | `http://localhost:8080/api/v1` |
| `VITE_USE_MOCK_API` | Set to `true` for mock mode; anything else for real API | `true` |

All Go API routes are mounted under `/api/v1`.

---

## 3. Disable Mock Mode

Set `VITE_USE_MOCK_API` to anything other than `true`. The service layer will then call the real backend through `src/lib/api/client.ts` using endpoint definitions in `src/lib/api/endpoints.ts`.

---

## 4. API Client Configuration

The API client is in `src/lib/api/client.ts`. It:

- Builds URLs from `VITE_API_BASE_URL` + endpoint path
- Sends `Authorization: Bearer <token>` header when `setAuthToken()` has been called
- Sends `X-CSRF-Token` header on non-GET requests when `setCsrfToken()` has been called
- Parses the Go response envelope: `{ data, meta { message, code, error_code?, detail? } }`
- Throws `ApiError` on HTTP non-OK responses OR when `meta.code >= 400`
- Supports query parameters, request headers, JSON serialization, and AbortSignal-based cancellation

### Setting the auth token

After login, call `setAuthToken(accessToken)` so subsequent requests include the Bearer header:

```ts
import { setAuthToken } from "@/lib/api/client";

setAuthToken(response.access_token);
```

### Setting the CSRF token

The Go backend requires `X-CSRF-Token` on state-changing endpoints (login, register, logout, change password, etc.). Fetch a CSRF token first:

```ts
import { setCsrfToken, csrfToken as fetchCsrfToken } from "@/services/auth.service";

const { csrf_token } = await fetchCsrfToken();
setCsrfToken(csrf_token);
```

---

## 5. Authentication Integration

Authentication logic lives in `src/services/auth.service.ts` and session state in `src/contexts/AuthProvider.tsx`.

### Go backend authentication endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/csrf_token` | Get CSRF token |
| POST | `/auth/login` | Login (returns `access_token`, `refresh_token`) |
| POST | `/auth/logout` | Logout (Bearer auth) |
| GET | `/auth/me` | Get current user (Bearer auth) |
| POST | `/auth/register` | Register (multipart form) |
| POST | `/auth/refresh-token` | Refresh access token (Bearer auth) |
| POST | `/auth/forgot-password` | Send reset email |
| POST | `/auth/reset-password` | Reset password |

### Auth flow

1. Client calls `GET /auth/csrf_token` to obtain a CSRF token.
2. Client calls `POST /auth/login` with `{ username, password }` and `X-CSRF-Token` header.
3. Backend returns `{ data: { access_token, refresh_token }, meta: {...} }`.
4. Client stores the access token and sends it as `Authorization: Bearer <token>` on protected requests.
5. Client calls `GET /auth/me` to load the user profile.

### Token storage

Tokens are **not** stored in cookies by the backend. They are returned in the response body. The frontend is responsible for storage (e.g., `localStorage`, memory).

> ⚠️ Frontend mock authentication (`VITE_USE_MOCK_API=true`) is not production security. Do not use mock auth in production.

---

## 6. Replace Mock Services with Real API Calls

Each service toggles between mock and real mode using `VITE_USE_MOCK_API`:

- `src/services/auth.service.ts`
- `src/services/user.service.ts`
- `src/services/product.service.ts`
- `src/services/order.service.ts`
- `src/services/dashboard.service.ts`

### Endpoints implemented in Go

The following endpoints are implemented in `go-starter-service`:

- `GET /auth/csrf_token`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/register`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh-token`
- `GET /users` (list only, requires `ReadUser` permission)
- `POST /files/{path}/bulk-upload`
- `GET /files/{path}/{filename}`
- `DELETE /files/{path}/{filename}`
- System: `GET /ping`, `GET /health`, `GET /ready`

### Endpoints NOT implemented in Go (frontend placeholders)

The following endpoints exist in the frontend as integration placeholders but are **not** implemented in `go-starter-service`:

- `GET /dashboard/overview`, `GET /dashboard/revenue`, `GET /dashboard/activities`, `GET /dashboard/transactions`
- `GET /products`, `GET /products/:id`, `POST /products`, `PUT /products/:id`, `DELETE /products/:id`
- `GET /orders`, `GET /orders/:id`
- `GET /settings`, `PUT /settings`
- `GET /users/:id`, `POST /users`, `PUT /users/:id`, `DELETE /users/:id`

When mock mode is disabled, calling these endpoints will throw an error indicating they are not implemented. Implement them in your backend or remove them from the frontend.

---

## 7. Handling API Errors

The API client throws `ApiError` on non-OK HTTP responses and on application-level errors (`meta.code >= 400`). The error carries:

- `error.status` — HTTP status code
- `error.response.message` — human-readable message
- `error.response.code` — application code (HTTP status)
- `error.response.error_code` — machine-readable error code (e.g. `ERR_VALIDATION_ERROR`)
- `error.firstFieldError` — first field-level validation error message
- `error.errorData` — raw error data object

Example:

```ts
import { ApiError } from "@/lib/api/errors";

try {
  await userService.getUsers({ page: 1, limit: 10 });
} catch (error) {
  if (error instanceof ApiError) {
    console.log(error.status);      // 400
    console.log(error.response.message); // "Validation failed"
    console.log(error.response.error_code); // "ERR_VALIDATION_ERROR"
    console.log(error.firstFieldError); // "The email field is required."
  }
}
```

---

## 8. Search, Pagination & Filtering

The Go backend uses `page` and `limit` query parameters (not `per_page`). Maximum `limit` is 50.

Frontend query parameters sent to the backend:

| Parameter | Description |
|-----------|-------------|
| `page` | Current page (1-based) |
| `limit` | Items per page (max 50) |
| `name` | Filter by name (users) |
| `email` | Filter by email (users) |
| `phone` | Filter by phone (users) |
| `status` | `pending`, `suspended`, `verified`, `rejected`, `deleted` |
| `role_id` | UUID role filter (users) |
| `order_by` | Sort field |

Response pagination block:

```json
{
  "page": {
    "current_page": 1,
    "total_data": 100,
    "limit": 10,
    "total_page": 10
  }
}
```

The frontend debounces free-text search at 300ms before triggering a request (see `src/hooks/useDebounce.ts`).

---

## 9. CORS Requirements

The Go backend uses the `security.CORS` middleware (see `cmd/api/main.go:123`). Configure `CORS_ALLOWED_ORIGINS` in the backend `.env` to allow your frontend origin:

```
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
```

If the frontend is served from a different origin than the backend, CORS must be configured on the backend, or you will see CORS errors in the browser.

---

## 10. File Upload Considerations

File uploads use `multipart/form-data`:

- `POST /files/{path}/bulk-upload` — Upload one or more files
- Request body field `fields` — comma-separated list of form field names for files
- Each file field is sent as a separate form field
- Response: `{ "data": { "uploaded_files": { "<field>": { "filename": "...", "filesize": ... } } }, "meta": {...} }`

The frontend does not currently include a file upload service. Implement one following the pattern in `src/services/auth.service.ts` if needed.

---

## 11. Mock Mode vs Real API Mode

| Aspect | Mock Mode (`VITE_USE_MOCK_API=true`) | Real API Mode (`VITE_USE_MOCK_API=false`) |
|--------|--------------------------------------|---------------------------------------------|
| Data source | Local mock data in `src/mocks/` | `go-starter-service` at `VITE_API_BASE_URL` |
| Network calls | No (simulated with `setTimeout`) | Yes (HTTP fetch) |
| Auth token | Stored in localStorage as mock session | Sent as `Authorization: Bearer` header |
| CSRF token | Not required | Required on state-changing endpoints |
| Endpoints | All mock endpoints available | Only endpoints implemented in Go |
| Errors | Simulated `ApiError` | Real HTTP/API errors from Go |
| Latency | Simulated (300–800ms) | Real network latency |

---

## 12. Going Live

1. Set `VITE_USE_MOCK_API=false`.
2. Point `VITE_API_BASE_URL` at the production backend.
3. Configure `CORS_ALLOWED_ORIGINS` on the backend for your frontend domain.
4. Verify each service endpoint returns the documented envelope.
5. Implement any frontend placeholder endpoints in your backend, or remove them.
6. Do not store secrets in frontend environment variables.
