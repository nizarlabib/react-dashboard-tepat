# API Contract

This document describes the frontend's proposed API contract. The frontend is
designed to work against this contract in mock mode and can be switched to a
real backend without changing UI components.

## Base URL

Configured via the `VITE_API_BASE_URL` environment variable. Never hardcode a
backend URL inside a page or component.

```
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Mock Mode

`VITE_USE_MOCK_API=true` enables the built-in mock API layer. Set it to any
other value to call the real backend.

## Response Envelope

Every successful response uses a consistent envelope:

```json
{
  "success": true,
  "message": "Request successful",
  "data": {},
  "meta": {
    "timestamp": "2026-11-05T12:00:00Z"
  }
}
```

- `data` may be `null` when there is no payload.
- `meta.timestamp` is an ISO-8601 UTC timestamp.

### Paginated Response

List endpoints return a paginated envelope:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 100,
    "total_pages": 10
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email field is required."
    ]
  },
  "meta": {
    "code": "VALIDATION_ERROR",
    "timestamp": "2026-11-05T12:00:00Z"
  }
}
```

- `errors` maps field names to arrays of messages (optional).
- `meta.code` is a machine-readable error code (optional).

## Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Sign in |
| POST | `/auth/register` | Create account |
| POST | `/auth/logout` | Sign out |
| GET | `/auth/me` | Get current user |
| POST | `/auth/forgot-password` | Request reset link |
| POST | `/auth/reset-password` | Reset password |

## Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Stat cards |
| GET | `/dashboard/revenue` | Revenue over time |
| GET | `/dashboard/activities` | Recent activity |
| GET | `/dashboard/transactions` | Recent transactions |

## Users Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users (paginated, filterable) |
| GET | `/users/:id` | Single user |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

## Products Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List products (paginated, filterable) |
| GET | `/products/:id` | Single product |
| POST | `/products` | Create product |
| PUT | `/products/:id` | Update product |
| DELETE | `/products/:id` | Delete product |

## Orders Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | List orders (paginated, filterable) |
| GET | `/orders/:id` | Single order |

## Settings Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get settings |
| PUT | `/settings` | Update settings |

## Query Parameter Conventions

Supported parameters (not every endpoint uses all of them):

| Parameter | Description |
|-----------|-------------|
| `page` | Current page (1-based) |
| `per_page` | Items per page |
| `search` | Free-text search |
| `sort_by` | Field to sort by |
| `sort_order` | `asc` or `desc` |
| `status` | Status filter |
| `start_date` | Range start |
| `end_date` | Range end |

Example:

```
GET /users?page=1&per_page=10&search=nizar&status=active&sort_by=created_at&sort_order=desc
```

## TypeScript Types

All response structures are defined in `src/types/api.ts`:

- `ApiResponse<T>` — single item envelope
- `PaginatedResponse<T>` — list envelope with pagination meta
- `ErrorResponse` — error envelope

Domain types live in `src/types/index.ts`, `src/types/auth.ts`,
`src/types/user.ts`, `src/types/product.ts`, and `src/types/order.ts`.

## Error Handling

HTTP errors are thrown as `ApiError` (see `src/lib/api/errors.ts`) with the
parsed `ErrorResponse` on `error.response` and the HTTP status on
`error.status`.
