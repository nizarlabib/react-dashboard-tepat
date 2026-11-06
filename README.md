# React Dashboard Starter

A reusable React dashboard foundation built with React, Vite, TypeScript, and Tailwind CSS. Designed to be cloned and customized as the starting point for multiple admin dashboards and SaaS applications.

> This is a **reusable frontend dashboard foundation**, not a complete business application. It provides UI components, layout, routing, authentication scaffolding, and API integration preparation. Business-specific logic, data models, and backend integration are left for you to implement.

## Table of Contents

- [Project Introduction](#project-introduction)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [How to Customize This Starter for a New Project](#how-to-customize-this-starter-for-a-new-project)
- [API Integration Guide](#api-integration-guide)
- [Mock Data Guide](#mock-data-guide)
- [Theme Customization](#theme-customization)
- [Reusable Component Guide](#reusable-component-guide)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Production Build & Deployment](#production-build--deployment)
- [Documentation Index](#documentation-index)

---

## Project Introduction

### What this project is

React Dashboard Starter is a front-end application template that gives you a complete, working dashboard shell out of the box. It includes a responsive sidebar layout, authentication pages (login, register, forgot password), dashboard overview and analytics pages, data tables, charts, stat cards, theme switching (light/dark/system), and a mock API layer for development without a backend.

### Why this starter exists

Building a new admin dashboard from scratch means repeating the same setup work on every project: routing, layout, theme system, component library, form handling, API client, mock data, and navigation. This starter consolidates that foundation so you can start building your actual product features on day one.

### What problems it solves

- No need to wire up React Router, Tailwind, and TypeScript from scratch
- Pre-built, reusable UI components (Button, Input, Card, Modal, DataTable, Pagination, etc.)
- Consistent light/dark/system theme system with persistence
- Protected routes and authentication scaffolding
- Mock API layer for frontend development without a running backend
- Centralized navigation and configuration

### Who should use it

Frontend developers and teams starting a new admin dashboard, SaaS application, or internal tool who want a solid, typed, responsive foundation instead of starting from a blank Vite template.

### Features included

See the [Features](#features) section for a complete list.

### How it can be reused

Clone this repository, rename it, update the branding and navigation, and connect it to your backend. The architecture is intentionally generic so it can serve as the foundation for many different applications without modifying its core structure.

---

## Features

The following features are implemented in this repository:

- **React + Vite + TypeScript** — Modern frontend stack with strict type checking
- **Tailwind CSS v4** — Utility-first styling with CSS variables for design tokens
- **Reusable UI components** — Button, Input, Card, Badge, Modal, Dropdown, DataTable, Pagination, StatCard, EmptyState, Skeleton, Avatar, LoadingState
- **Dashboard layout** — Responsive sidebar layout with header, navigation, and page container
- **Authentication UI** — Login, register, and forgot password pages with form validation
- **Mock authentication** — Simulated login flow for development (not production security)
- **Protected routes** — Route guards that require authentication
- **Dark mode** — Manual dark theme
- **Light mode** — Manual light theme
- **System theme preference** — Automatically follows OS preference
- **Responsive navigation** — Sidebar on desktop, collapsible navigation on mobile
- **Dashboard analytics** — Stat cards, revenue charts, activity feed, recent transactions
- **Data tables** — Sortable, filterable table component with pagination
- **Search and debounce** — Debounced search input hook (300ms default)
- **Filtering and pagination** — Client-side pagination hook and UI pagination component
- **API client** — Fetch-based client with request cancellation, timeouts, query params, auth headers, CSRF headers, and error handling
- **Mock API services** — Simulated service layer matching real API interfaces
- **REST API integration preparation** — Service layer ready to connect to a Go backend

Features that are **not** implemented:
- Real backend integration (mock mode is the default)
- Products, orders, dashboard stats, and settings API endpoints (placeholders only; the connected Go backend only implements auth, users list, and files)

---

## Technology Stack

The following dependencies are installed in `package.json`:

| Dependency | Version | Purpose |
|------------|---------|---------|
| React | ^19.3.1 | UI library |
| React DOM | ^19.3.1 | DOM rendering |
| React Router DOM | ^7.18.5 | Client-side routing |
| Recharts | ^3.10.1 | Charting |
| Lucide React | ^1.69.0 | Icons |
| Tailwind CSS | ^4.3.4 | Styling |
| @tailwindcss/vite | ^4.3.4 | Tailwind Vite plugin |

Dev dependencies:

| Dependency | Version | Purpose |
|------------|---------|---------|
| TypeScript | ~6.0.3 | Static type checking |
| Vite | ^8.3.6 | Build tool and dev server |
| @vitejs/plugin-react | ^6.1.2 | React plugin for Vite |
| ESLint | ^10.14.0 | Linting |
| typescript-eslint | ^8.72.1 | TypeScript-aware ESLint |
| @eslint/js | ^10.0.1 | ESLint JS config |
| eslint-plugin-react-hooks | ^7.1.1 | React hooks lint rules |
| eslint-plugin-react-refresh | ^0.5.7 | React refresh lint rules |
| globals | ^17.13.0 | Global variables for ESLint |
| @types/node | ^24.19.2 | Node.js type definitions |
| @types/react | ^19.3.0 | React type definitions |
| @types/react-dom | ^19.3.0 | React DOM type definitions |

No additional libraries beyond those listed above are installed.

---

## Prerequisites

You need the following development tools:

- **Node.js** — Required for running the dev server and building
- **npm** — Package manager (comes with Node.js)
- **Git** — For cloning and version control
- **Code editor** — VS Code or similar with TypeScript support

Verify your installations:

```bash
node --version
npm --version
git --version
```

There is no enforced minimum Node.js version in `package.json`, but a modern LTS version (18+) is recommended.

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create environment configuration

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# API base URL for the backend (never hardcode backend URLs in components)
VITE_API_BASE_URL=http://localhost:8080/api/v1

# Set to "true" to use the built-in mock API layer instead of a real backend.
# Set to "false" (or anything else) to call the real API at VITE_API_BASE_URL.
VITE_USE_MOCK_API=true
```

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Base URL of your backend API. All service requests are prefixed with this value. |
| `VITE_USE_MOCK_API` | `true` to use the built-in mock API layer. Any other value calls the real backend. |

### 4. Run development mode

```bash
npm run dev
```

This starts the Vite dev server (typically at `http://localhost:5173`) with hot module replacement.

### 5. Build for production

```bash
npm run build
```

This runs TypeScript type checking (`tsc -b`) and then builds the production bundle with Vite. Output goes to the `dist/` directory.

### 6. Preview production build

```bash
npm run preview
```

Serves the production build locally so you can verify it before deploying.

### 7. Linting and type checks

```bash
npm run lint     # Run ESLint
npm run build    # Runs tsc -b (type check) + vite build
```

There is no separate `typecheck` script; type checking is part of `npm run build`.

---

## Project Structure

```
src/
├── App.tsx                 — Application root (providers + router)
├── main.tsx                — Entry point
├── index.css               — Tailwind imports, CSS variables, base styles
├── components/
│   ├── ui/                 — Base UI components (Button, Input, Card, Badge, Modal, Dropdown, etc.)
│   ├── data-display/       — Data-focused components (DataTable, StatCard, ActivityFeed, EmptyState, Skeleton, Avatar)
│   ├── feedback/           — Feedback components (LoadingState, ToastProvider)
│   ├── layout/             — Layout components (PageContainer, Header, Sidebar)
│   └── auth/               — Authentication UI (LoginPage, RegisterPage, ForgotPasswordPage, AuthLayout, AuthBranding)
├── layouts/
│   └── DashboardLayout.tsx — Main dashboard layout (sidebar + header + content)
├── pages/
│   ├── auth/               — Authentication pages (login, register, forgot password)
│   ├── dashboard/          — Dashboard overview page
│   ├── analytics/          — Analytics page
│   ├── users/              — Users list page
│   ├── products/           — Products page
│   ├── orders/             — Orders page
│   ├── settings/           — Settings page
│   └── not-found/          — 404 page
├── routes/
│   ├── index.tsx           — Router definition (createBrowserRouter)
│   ├── guards.tsx          — Auth route guards (RequireAuth, GuestRoute, RootRedirect)
│   └── lazy-pages.ts       — Lazy-loaded page components
├── hooks/
│   ├── useDebounce.ts      — Debounce hook for search inputs
│   └── usePagination.ts    — Client-side pagination hook
├── contexts/
│   ├── auth.ts             — Auth context types
│   ├── AuthProvider.tsx    — Authentication state provider
│   ├── theme.ts            — Theme context types
│   ├── ThemeProvider.tsx   — Theme provider (light/dark/system)
│   └── toast.ts / ToastProvider.tsx — Toast notification provider
├── services/
│   ├── auth.service.ts     — Authentication service (login, logout, me, register, etc.)
│   ├── user.service.ts     — Users service
│   ├── product.service.ts  — Products service (placeholder)
│   ├── order.service.ts    — Orders service (placeholder)
│   └── dashboard.service.ts— Dashboard service (placeholder)
├── mock/
│   └── data.ts             — Centralized mock data (stats, users, products, transactions, etc.)
├── mocks/
│   ├── auth.mock.ts        — Mock authentication service
│   ├── users.mock.ts       — Mock users service
│   ├── products.mock.ts    — Mock products service
│   ├── orders.mock.ts      — Mock orders service
│   └── dashboard.mock.ts   — Mock dashboard service
├── lib/
│   ├── api/
│   │   ├── client.ts       — Fetch-based API client (auth headers, CSRF, error handling)
│   │   ├── endpoints.ts    — Centralized API endpoint definitions
│   │   ├── errors.ts       — ApiError class
│   │   └── mock.ts         — mockResponse helper
│   ├── chart.ts            — Chart utilities
│   ├── csv.ts              — CSV utilities
│   ├── status.ts           — Status badge configuration
│   └── utils.ts            — General utilities (copyToClipboard, formatDate, etc.)
├── types/
│   ├── api.ts              — API response types (ResponseMeta, PageMeta, ApiResponse, ErrorResponse)
│   ├── auth.ts             — Auth types (LoginRequest, LoginResponse, MeResponse, etc.)
│   ├── index.ts            — UI/domain types (User, Product, Transaction, Stat, Activity, NavItem, etc.)
│   ├── user.ts             — User query params
│   ├── product.ts          — Product query params
│   └── order.ts            — Order query params
├── config/
│   └── app.config.ts       — Centralized application configuration (name, description, etc.)
├── constants/
│   └── navigation.ts       — Navigation configuration (navigationGroups, routeLabels, chartRangeOptions)
└── assets/                 — Static assets (images, icons, etc.)
```

Other important files at the project root:

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, dependencies, npm scripts |
| `vite.config.ts` | Vite configuration (React + Tailwind plugins) |
| `tsconfig.json` | TypeScript configuration |
| `tsconfig.app.json` | TypeScript app configuration |
| `tsconfig.node.json` | TypeScript node configuration |
| `eslint.config.js` | ESLint configuration |
| `.env.example` | Example environment variables |
| `.gitignore` | Git ignore rules |
| `index.html` | HTML entry point |
| `AGENTS.md` | Instructions for AI coding agents |
| `DESIGN_BRIEF.md` | Design specifications |
| `docs/API_CONTRACT.md` | API contract with Go backend |
| `docs/BACKEND_INTEGRATION.md` | Backend integration guide |
| `docs/UI_UX_AUDIT.md` | UI/UX audit (if present) |

### Where to put new features

- **New pages** → `src/pages/` and register in `src/routes/index.tsx`
- **New UI components** → `src/components/ui/`
- **New data-display components** → `src/components/data-display/`
- **New layout components** → `src/components/layout/`
- **New API services** → `src/services/`
- **New API endpoints** → `src/lib/api/endpoints.ts`
- **New types** → `src/types/` (API types in `api.ts`, domain types in `index.ts`)
- **New hooks** → `src/hooks/`
- **New context providers** → `src/contexts/`
- **Mock data** → `src/mock/data.ts` or `src/mocks/*.mock.ts`

---

## How to Customize This Starter for a New Project

This section walks through turning this starter into a new application.

### A. Rename the Project

1. **Rename the project directory** — rename the folder to your project name.
2. **`package.json` name** — update the `name` field:

   ```bash
   npm pkg set name="my-new-dashboard"
   ```

3. **README title** — update the `#` heading in `README.md`.
4. **Browser document title** — update the `<title>` tag in `index.html`.
5. **Application name** — update `src/config/app.config.ts`:

   ```ts
   export const appConfig = {
     name: "My Application",
     description: "My Application Dashboard",
     shortName: "MyApp",
   } as const;
   ```

6. **Vite-related configuration** — check `vite.config.ts` for any project-specific settings (currently only plugins are configured).
7. **Git repository remote** — update the remote:

   ```bash
   git remote set-url origin <new-repository-url>
   ```

Verify the changes by running `npm run dev` and confirming the app loads with the new name.

### B. Change Branding

Identify and update the following files:

| What | File(s) |
|------|---------|
| Application name | `src/config/app.config.ts`, `index.html` |
| Sidebar branding | `src/components/auth/AuthBranding.tsx` |
| Login page branding | `src/pages/auth/LoginPage.tsx`, `src/components/auth/AuthBranding.tsx` |
| Authentication promotional content | `src/components/auth/AuthFooter.tsx` |
| Favicon | `public/` directory (replace `public/vite.svg` or update `index.html`) |
| Browser title | `index.html` `<title>` tag |

Prefer centralized application configuration in `src/config/app.config.ts` rather than hardcoding branding in multiple components.

If not already implemented, create a reusable configuration such as `src/config/app.config.ts` (already provided) and import it wherever branding is needed.

### C. Change Theme Colors

Theme colors are defined as CSS variables in `src/index.css`:

```css
@theme {
  --color-primary: #4f46e5;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-foreground: #0f172a;
  --color-muted-foreground: #64748b;
  --color-border: #e2e8f0;
  --color-success: #16a34a;
  --color-warning: #d97706;
  --color-danger: #dc2626;
  --color-info: #0284c7;
  --color-ring: #6366f1;
  /* ... */
}
```

Dark mode overrides are in the `.dark` block in the same file.

To customize:

1. Change the light mode values in the `@theme` block.
2. Change the dark mode values in the `.dark` block.
3. Keep consistency across both modes by updating corresponding pairs (e.g. `background` and `surface`).

Theme tokens are consumed by components via Tailwind classes like `bg-background`, `text-foreground`, `border-border`, `text-primary`, etc.

### D. Change Navigation

Navigation is centralized in `src/constants/navigation.ts`.

#### Add a navigation item

```ts
export const navigationGroups: NavGroup[] = [
  {
    title: "General",
    items: [
      { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
      { label: "Invoices", to: "/invoices", icon: FileText }, // new item
    ],
  },
  // ...
];
```

#### Remove a navigation item

Delete the item from the appropriate group in `navigationGroups`.

#### Rename a navigation item

Change the `label` property.

#### Change its icon

Import a different icon from `lucide-react` and assign it to the `icon` property.

#### Add a new route

1. Create the page component in `src/pages/`.
2. Register the route in `src/routes/index.tsx`.
3. Add the navigation item in `src/constants/navigation.ts`.

#### Group navigation items

Navigation is organized into `NavGroup` objects, each with a `title` and `items` array.

#### Role-based navigation

Role-based navigation is not yet implemented. You can add it in the future by filtering `navigationGroups` based on the user's role from the auth context.

### E. Add a New Page

Example: adding an `/invoices` page.

1. **Create the page component** — `src/pages/invoices/InvoicesPage.tsx`
2. **Register the route** — `src/routes/index.tsx`:

   ```tsx
   { path: "invoices", element: withSuspense(<InvoicesPage />) },
   ```

3. **Add navigation configuration** — `src/constants/navigation.ts`:

   ```ts
   { label: "Invoices", to: "/invoices", icon: FileText },
   ```

4. **Create page-specific types** — add to `src/types/index.ts` or a new file `src/types/invoice.ts`.
5. **Create a service module** — `src/services/invoice.service.ts` following the pattern in `user.service.ts`.
6. **Add mock data if needed** — add to `src/mock/data.ts` or create `src/mocks/invoices.mock.ts`.
7. **Connect the page to the API** — import the service in your page component.
8. **Test the page** — run `npm run dev` and navigate to `/invoices`.

### F. Remove Unused Features

You can safely remove:

- **Demo pages** — delete from `src/pages/` and remove routes from `src/routes/index.tsx`
- **Mock data** — delete entries from `src/mock/data.ts` and/or `src/mocks/*.mock.ts`
- **Unused navigation** — remove items from `src/constants/navigation.ts`
- **Unused UI components** — delete from `src/components/`
- **Unnecessary dependencies** — remove from `package.json` and run `npm install`

**Do not remove without checking usage:**
- `src/lib/api/client.ts` — used by all services
- `src/lib/api/endpoints.ts` — used by all services
- `src/contexts/AuthProvider.tsx` — used by `App.tsx`
- `src/contexts/ThemeProvider.tsx` — used by `App.tsx`
- `src/components/ui/Button.tsx` — widely used
- `src/constants/navigation.ts` — used by the sidebar layout

### G. Customize Authentication

#### How mock authentication works

When `VITE_USE_MOCK_API=true`, `authService.login()` returns a simulated response from `src/mocks/auth.mock.ts`. The `AuthProvider` stores the user and token in `localStorage` under the key `admin_starter_session`.

#### How to change authentication UI

Edit the files in `src/pages/auth/`:
- `LoginPage.tsx` — login form
- `RegisterPage.tsx` — registration form
- `ForgotPasswordPage.tsx` — forgot password form
- `src/components/auth/AuthLayout.tsx` — auth page layout
- `src/components/auth/AuthBranding.tsx` — branding on auth pages

#### How to replace mock authentication with a Go backend

1. Set `VITE_USE_MOCK_API=false` in `.env`.
2. Set `VITE_API_BASE_URL` to your Go backend URL.
3. The `authService` in `src/services/auth.service.ts` will call the real backend endpoints:
   - `POST /auth/login` — returns `{ access_token, refresh_token }`
   - `GET /auth/me` — returns current user profile
   - `POST /auth/logout` — revokes token
   - `GET /auth/csrf_token` — obtain CSRF token
4. Configure CSRF token handling — the Go backend requires `X-CSRF-Token` on state-changing endpoints.
5. Configure token storage — tokens are returned in the response body, not cookies. Store them in `localStorage` or memory and send as `Authorization: Bearer <token>`.

#### Where to configure login and logout

- `src/services/auth.service.ts` — API calls for login, logout, me, register
- `src/contexts/AuthProvider.tsx` — session state, login/logout actions, localStorage persistence

#### Where to implement the current-user request

- `src/services/auth.service.ts` — `me()` method calls `GET /auth/me`

#### Where to configure token or cookie handling

- `src/lib/api/client.ts` — `setAuthToken()`, `setCsrfToken()`, automatic `Authorization` and `X-CSRF-Token` headers

> ⚠️ Frontend mock authentication is **not production security**. It is a development convenience only. Always replace it with real backend authentication before deploying to production.

---

## API Integration Guide

This section explains how to connect a new backend to the frontend starter. Use `docs/API_CONTRACT.md` as the authoritative frontend/backend integration reference.

### 1. Configure `VITE_API_BASE_URL`

Set the backend URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 2. Disable Mock Mode

Set `VITE_USE_MOCK_API=false` in `.env`.

### 3. Update Service Modules

Review each service in `src/services/` and replace mock calls with real API calls through the `api` client from `src/lib/api/client.ts`.

Example pattern:

```ts
import { api } from "../lib/api/client";
import { endpoints } from "../lib/api/endpoints";

export const myService = {
  getItems: async (params?: MyParams): Promise<Item[]> => {
    return api.get<Item[]>(endpoints.myItems.list(), {
      query: params,
    });
  },
};
```

### 4. Define Request and Response Types

Define types in `src/types/api.ts` (response envelopes) and `src/types/auth.ts` (auth types) that match your backend's response structure. Keep API response types separate from UI component types.

### 5. Handle API Errors

The API client throws `ApiError` on HTTP errors and application-level errors. Catch and handle in your services or pages:

```ts
import { ApiError } from "@/lib/api/errors";

try {
  await service.getItems();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle error
  }
}
```

### 6. Configure Authentication

- Set the auth token via `setAuthToken(token)` after login so the API client includes `Authorization: Bearer <token>`.
- If your backend requires CSRF tokens, fetch one and set it via `setCsrfToken(token)`.
- Configure CORS on your backend to allow your frontend origin.

### 7. Configure CORS on the Backend

Your backend must allow requests from your frontend origin. In `go-starter-service`, set `CORS_ALLOWED_ORIGINS` in the backend `.env`.

### 8. Adapting the Contract for a Different Backend

If a future project uses a different backend:

1. Update `src/types/api.ts` to match the new backend's response envelopes.
2. Update `src/lib/api/client.ts` if the new backend uses a different envelope or error format.
3. Update service modules to map backend responses to UI types.
4. Update `docs/API_CONTRACT.md` with the new contract.
5. Do not hardcode backend-specific assumptions in UI components.

---

## Mock Data Guide

### Where mock data lives

- Centralized mock data: `src/mock/data.ts`
- Mock service implementations: `src/mocks/*.mock.ts`

### How to add new mock records

Add new entries to the appropriate array in `src/mock/data.ts` (e.g. `users`, `products`, `transactions`) or create a new mock file in `src/mocks/`.

### How mock services work

Each mock service in `src/mocks/` exports functions matching the real service interface (e.g. `getUsers`, `getUser`). They simulate network latency with `mockResponse()` from `src/lib/api/mock.ts` and can throw `ApiError` for validation or not-found cases.

The service layer checks `VITE_USE_MOCK_API` and delegates to either the mock service or the real API client.

### How search and pagination work

Mock services support client-side filtering and pagination. Search is debounced at 300ms via `useDebounce()`.

### How to replace mock services with real services

1. Set `VITE_USE_MOCK_API=false`.
2. Update the service module to call `api.get/post/etc()` instead of the mock.
3. Remove or keep the mock file (it will no longer be used).

> ⚠️ UI pages should **not** import mock data directly. They should go through the service layer so mock and real modes remain interchangeable.

---

## Theme Customization

### How to enable or disable theme options

Theme options (`light`, `dark`, `system`) are defined in `src/contexts/theme.ts`:

```ts
export type Theme = "light" | "dark" | "system";
```

### How theme persistence works

`ThemeProvider` stores the selected theme in `localStorage` under the key `theme`. On load, it reads the stored value and applies it, falling back to `"system"`.

### How to customize light mode

Edit the `@theme` block in `src/index.css` for light mode CSS variables.

### How to customize dark mode

Edit the `.dark` block in `src/index.css` for dark mode CSS variable overrides.

### How to customize system preference

The `ThemeProvider` listens to `window.matchMedia("(prefers-color-scheme: dark)")` and applies the dark class when the theme is `"system"` and the OS prefers dark.

### How to add new theme tokens

1. Add a CSS variable in the `@theme` block of `src/index.css` (e.g. `--color-brand: #...`).
2. Add the corresponding override in the `.dark` block.
3. Use the token in components via Tailwind (e.g. `text-brand`, `bg-brand`).

---

## Reusable Component Guide

### Button

- **Location**: `src/components/ui/Button.tsx`
- **Purpose**: Primary action button with loading and disabled states
- **Usage**: `<Button onClick={handler}>Click</Button>`
- **Important props**: `onClick`, `loading`, `disabled`, `fullWidth`, `leftIcon`, `variant`

### Input

- **Location**: `src/components/ui/Input.tsx`
- **Purpose**: Form text input with label, error message, and leading icon support
- **Usage**: `<Input label="Email" value={value} onChange={handler} error={error} />`
- **Important props**: `label`, `value`, `onChange`, `error`, `type`, `placeholder`, `containerClassName`

### Card

- **Location**: `src/components/ui/Card.tsx`
- **Purpose**: Container component with header, title, description, and body sections
- **Usage**: `<Card><CardTitle>Title</CardTitle><CardDescription>Desc</CardDescription>...</Card>`
- **Important props**: `className`

### Badge

- **Location**: `src/components/ui/Badge.tsx`
- **Purpose**: Status label with color variants
- **Usage**: `<Badge variant="success">Active</Badge>`
- **Important props**: `variant` (maps to status colors in `src/lib/status.ts`)

### Modal

- **Location**: `src/components/ui/Modal.tsx`
- **Purpose**: Accessible dialog overlay
- **Usage**: `<Modal open={open} onClose={close} title="Title">Content</Modal>`
- **Important props**: `open`, `onClose`, `title`, `description`, `size`, `footer`

### Dropdown

- **Location**: `src/components/ui/Dropdown.tsx`
- **Purpose**: Trigger-based dropdown menu
- **Usage**: `<Dropdown trigger={<Button>...</Button>}><DropdownItem .../></Dropdown>`
- **Important props**: `trigger`, `children`, `ariaLabel`

### DataTable

- **Location**: `src/components/data-display/DataTable.tsx`
- **Purpose**: Render tabular data with columns, rows, and loading state
- **Usage**: `<DataTable columns={columns} data={rows} getRowKey={row => row.id} loading={loading} />`
- **Important props**: `columns`, `data`, `getRowKey`, `loading`, `emptyTitle`, `emptyDescription`

### Pagination

- **Location**: `src/components/ui/Pagination.tsx`
- **Purpose**: Pagination controls for navigating pages
- **Usage**: `<Pagination page={1} totalPages={10} onPageChange={setPage} ... />`
- **Important props**: `page`, `totalPages`, `onPageChange`, `startItem`, `endItem`, `totalItems`, `itemLabel`

### StatCard

- **Location**: `src/components/data-display/StatCard.tsx`
- **Purpose**: Dashboard statistic card with value, change, and trend
- **Usage**: `<StatCard label="Revenue" value="$1,234" change={12.5} trend="up" />`
- **Important props**: `label`, `value`, `change`, `period`, `trend`, `icon`

### EmptyState

- **Location**: `src/components/data-display/EmptyState.tsx`
- **Purpose**: Displayed when there is no data to show
- **Usage**: `<EmptyState title="No users found" description="..." />`
- **Important props**: `title`, `description`, `emptyAction`

### Skeleton

- **Location**: `src/components/data-display/Skeleton.tsx`
- **Purpose**: Loading placeholder while data is fetching
- **Usage**: `<Skeleton />`
- **Important props**: `className`

---

## Development Guidelines

Follow these conventions when working with this starter:

- **Reuse existing components** — Check `src/components/ui/` and `src/components/data-display/` before creating new UI.
- **Keep business logic separate from presentation** — Put API calls and data transformation in `src/services/`, not in page components.
- **Use TypeScript** — All files should be `.ts` or `.tsx` with proper types. Avoid `any`.
- **Keep API calls inside services** — Pages should not call `fetch` directly. Use the service layer.
- **Keep mock data separated** — Mock data lives in `src/mock/data.ts` and `src/mocks/`. Do not import mock data directly from pages.
- **Follow the existing design system** — Use Tailwind CSS variables from `src/index.css` rather than arbitrary values.
- **Use the reusable debounce hook** — `src/hooks/useDebounce.ts` for search inputs.
- **Maintain dark and light mode compatibility** — Test both themes when changing colors.
- **Keep components focused** — Each component should have a single responsibility.
- **Avoid unnecessary dependencies** — Do not add libraries without a clear requirement.

Refer to `AGENTS.md` for AI coding agent instructions.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `npm install` failures | Delete `node_modules` and `package-lock.json`, then run `npm install` again. Verify Node.js and npm versions. |
| Port already in use | The Vite dev server defaults to port 5173. If occupied, Vite will prompt to use another port or you can set `--port`. |
| Environment variables not loading | Ensure `.env` exists and variables start with `VITE_`. Restart the dev server after changing `.env`. |
| API connection failures | Verify `VITE_API_BASE_URL` is correct, the backend is running, and CORS is configured. Check browser DevTools Network tab. |
| CORS errors | Configure `CORS_ALLOWED_ORIGINS` on the backend to include your frontend origin. |
| Authentication redirect issues | Check that `VITE_USE_MOCK_API` is set correctly and that `setAuthToken()` is called after login. |
| Dark mode not persisting | Theme is stored in `localStorage` under key `theme`. Clear localStorage or verify the value is `light`/`dark`/`system`. |
| Build failures | Run `npm run build` which includes `tsc -b`. Fix any TypeScript errors first. |
| TypeScript errors | Run `npx tsc --noEmit` to see all type errors. Ensure types match the API contract in `docs/API_CONTRACT.md`. |

---

## Production Build & Deployment

### Production build

```bash
npm run build
```

Output directory: `dist/`

### Environment configuration

Set environment variables in your hosting platform (not in `.env`, which is for local development):

```
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_USE_MOCK_API=false
```

### Static hosting

The `dist/` directory contains static HTML, JS, and CSS assets. Deploy to any static host (Vercel, Netlify, S3, etc.).

### Nginx deployment considerations

- Serve the `dist/` directory as static files.
- Configure SPA fallback routing: all routes should fall back to `index.html` so React Router can handle client-side routing.
- Example Nginx config:

  ```nginx
  location / {
    root /path/to/dist;
    try_files $uri $uri/ /index.html;
  }
  ```

### API URL configuration

Configure `VITE_API_BASE_URL` at build time or runtime to point to your production backend. Do not include secrets in frontend environment variables — they are bundled into the JavaScript and visible to users.

---

## Documentation Index

- [`AGENTS.md`](./AGENTS.md) — Instructions for AI coding agents working on this project.
- [`DESIGN_BRIEF.md`](./DESIGN_BRIEF.md) — Design specifications and visual language.
- [`docs/API_CONTRACT.md`](./docs/API_CONTRACT.md) — API contract verified against the `go-starter-service` Go backend.
- [`docs/BACKEND_INTEGRATION.md`](./docs/BACKEND_INTEGRATION.md) — Guide for connecting to a Go backend.
- [`docs/UI_UX_AUDIT.md`](./docs/UI_UX_AUDIT.md) — UI/UX audit (if present).
