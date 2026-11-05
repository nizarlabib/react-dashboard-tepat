# Backend Integration

This guide explains how to connect a real backend (Go or Laravel) to the
frontend starter.

## 1. Configure the API Base URL

Create a `.env` file (or set environment variables in your host):

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=false
```

Restart the dev server after changing env variables.

## 2. Disable Mock Mode

Set `VITE_USE_MOCK_API` to anything other than `true`. The service layer will
then call the real backend through `src/lib/api/client.ts` using the endpoint
definitions in `src/lib/api/endpoints.ts`.

## 3. Implement Authentication

Authentication logic lives in `src/services/auth.service.ts` and uses
`src/contexts/AuthProvider.tsx` for session state. The backend should implement
these endpoints:

- `POST /auth/login` — returns `{ user, token }`
- `POST /auth/register` — creates an account
- `POST /auth/logout` — invalidates the session
- `GET /auth/me` — returns the current user
- `POST /auth/forgot-password` — sends a reset link
- `POST /auth/reset-password` — resets the password

The frontend stores the session in `localStorage` under
`admin_starter_session` in mock mode only. In real mode, the auth service
delegates to the backend and the provider keeps the user/token in React state.

Do not store plaintext passwords on the frontend. Token handling is isolated in
the authentication layer so the backend strategy (JWT, cookies, refresh tokens)
can be selected later.

## 4. Replace Mock Services with Real API Calls

Each service file toggles between mock and real mode using `VITE_USE_MOCK_API`:

- `src/services/auth.service.ts`
- `src/services/user.service.ts`
- `src/services/product.service.ts`
- `src/services/order.service.ts`
- `src/services/dashboard.service.ts`

When mock mode is disabled, the service calls `api.get/post/put/patch/delete`
from `src/lib/api/client.ts`. Endpoint URLs are built via
`src/lib/api/endpoints.ts`, so no URL strings are scattered across components.

Example (users service, real mode):

```ts
return api.get<User[]>(endpoints.users.list(), {
  query: { page, per_page, search, status },
});
```

## 5. Handling API Errors

The API client throws `ApiError` on non-OK responses. The error carries:

- `error.status` — HTTP status code
- `error.response` — parsed `ErrorResponse` envelope
- `error.response.message` — human-readable message
- `error.response.errors` — field-level validation errors (optional)
- `error.response.meta.code` — machine-readable code (optional)

Pages and services can catch `ApiError` and display validation or generic
messages through the toast context.

## 6. Search, Pagination & Filtering

The frontend sends these query parameters:

- `page`, `per_page`
- `search`
- `sort_by`, `sort_order` (`asc`/`desc`)
- `status`
- `start_date`, `end_date`

The backend should honor them and return a `PaginatedResponse<T>` envelope.
The frontend debounces free-text search at 300ms before triggering a request
or mock filter (see `src/hooks/useDebounce.ts`).

## 7. Expected Backend Responsibilities

- Accept and return JSON with the envelopes described in `docs/API_CONTRACT.md`.
- Implement pagination, filtering, and sorting consistently across list endpoints.
- Return ISO-8601 UTC timestamps in `meta.timestamp`.
- Validate input and return `400` with field-level `errors` on validation failure.
- Return `404` for missing resources and `401`/`403` for auth failures.
- Expose CORS headers if the frontend is served from a different origin.

## 8. Going Live

1. Set `VITE_USE_MOCK_API=false`.
2. Point `VITE_API_BASE_URL` at the production backend.
3. Verify each service endpoint returns the documented envelope.
4. Remove or disable the `src/mocks/` layer if desired (it is only used in mock mode).
