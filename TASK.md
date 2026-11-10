# Task: Align API Contract with Go Starter Service & Create Complete Project Documentation

Act as a Senior Software Architect, Senior Go Backend Engineer, and Senior Frontend Engineer.

Your task is to improve the documentation of this React Dashboard Starter so it can be reused as the foundation for multiple future projects.

There are two primary objectives:

1. Align the frontend API contract with the actual implementation of `go-starter-service`.
2. Create comprehensive README documentation explaining how to install, configure, customize, rename, and reuse this starter for future projects.

This is a documentation and architecture alignment task. Inspect the actual source code before changing any contract definitions.

Do not blindly follow previously proposed API response examples if they differ from the actual Go implementation.

---

# PART A — GO STARTER SERVICE INSPECTION

## 1. Locate the Backend Repository

Find the existing Go starter service repository.

Look for:
- A sibling directory named `go-starter-service`.
- Existing local Go repositories.
- Git remote configuration.
- Repository references in existing documentation.

A previously referenced source directory was:

`/var/www/go-starter-service`

The intended reusable repository was also referenced as:

`https://github.com/nizarlabib/go-starter-service.git`

Verify the actual repository and its current source code before proceeding.

If the backend repository is unavailable:
- Do not invent its response structure.
- Do not assume previous generic API examples are correct.
- Document which information is missing.
- Ask for the backend repository location before claiming contract alignment is complete.

## 2. Inspect Actual Go Implementation

Inspect the backend source code and identify:

### Response Structure
- Standard success response.
- Standard error response.
- Response envelope.
- Data structure.
- Message structure.
- Metadata structure.
- Status and application code conventions.

### Pagination
- Pagination metadata.
- Current page field.
- Page size or limit field.
- Total records.
- Total pages.
- Pagination response format.
- Filtering and sorting conventions.

### Error Handling
- Validation errors.
- Unauthorized errors.
- Forbidden errors.
- Not found errors.
- Conflict errors.
- Internal server errors.
- Application-specific error codes.
- HTTP status code mapping.

### Authentication
- Login request and response.
- Logout behavior.
- Current user endpoint.
- Access token handling.
- Refresh token behavior, if implemented.
- Authorization header conventions.
- Cookie handling, if implemented.

### Other Conventions
- Date and timestamp formats.
- UUID representation.
- Nullable fields.
- Empty collections.
- JSON field naming.
- Query parameter naming.
- File upload and download conventions, if implemented.

Inspect the actual:
- Response DTOs.
- Entity and model definitions.
- HTTP handlers.
- Middleware.
- Error handling utilities.
- Pagination utilities.
- Authentication implementation.
- Router definitions.

Do not infer the API contract solely from database entities.

The HTTP handler and response DTO are the primary sources of truth for the frontend contract.

---

# PART B — API CONTRACT ALIGNMENT

## 3. Update API_CONTRACT.md

Update:

`docs/API_CONTRACT.md`

Replace any previously proposed generic response formats with the actual response conventions found in `go-starter-service`.

Requirements:

1. Document the actual success response.
2. Document the actual error response.
3. Document the actual pagination response.
4. Document authentication behavior.
5. Document request and response examples.
6. Document HTTP status codes.
7. Document application-specific error codes.
8. Document query parameter conventions.
9. Document date and timestamp formats.
10. Document nullable and optional fields.

Every example must be consistent with the actual Go implementation.

Clearly distinguish:
- Verified backend behavior.
- Proposed frontend conventions.
- Backend features that are not yet implemented.

Do not document hypothetical endpoints as existing backend functionality.

## 4. Update TypeScript API Types

Review and adjust the frontend types under:

`src/lib/api/`
`src/types/`

Create or update types to accurately represent the Go response structure.

Requirements:
- Use TypeScript interfaces and generics appropriately.
- Match actual JSON field names.
- Preserve nullable fields.
- Correctly represent pagination metadata.
- Correctly represent error responses.
- Avoid unnecessary transformations.
- Avoid using `any`.

Keep API response types separate from UI component types.

If UI components require different structures, implement explicit mapping or adapter functions in the service layer.

## 5. Update API Client

Review:

`src/lib/api/client.ts`

Ensure the API client correctly handles the actual Go response structure.

Requirements:
- Centralized API base URL.
- HTTP methods: GET, POST, PUT, PATCH, DELETE.
- Query parameters.
- Request headers.
- JSON serialization and parsing.
- Authentication headers or cookies according to the actual backend contract.
- HTTP error handling.
- Application-level error handling.
- Request cancellation.
- Consistent error propagation.

Do not assume HTTP 200 always means application-level success if the backend uses additional success indicators.

Do not silently discard error messages or application error codes.

## 6. Update Service Layer

Review all service modules:

- `auth.service.ts`
- `user.service.ts`
- `product.service.ts`
- `order.service.ts`
- `dashboard.service.ts`

Ensure:
- All services follow the updated contract.
- Mock and real API modes return compatible structures.
- Pages do not call fetch directly.
- API-specific details remain outside UI components.
- Data transformation is handled in the service layer.

If an endpoint does not exist in `go-starter-service`, keep it documented as a frontend integration placeholder rather than pretending it is already supported.

## 7. Update Backend Integration Documentation

Update:

`docs/BACKEND_INTEGRATION.md`

Explain how to connect this React starter to the Go backend.

Include:
- Backend URL configuration.
- Environment variables.
- API client configuration.
- Authentication integration.
- Request and response handling.
- Error handling.
- Pagination.
- Search and filtering.
- CORS requirements.
- File upload considerations.
- Troubleshooting common integration issues.

Explain any differences between mock mode and real API mode.

---

# PART C — COMPLETE README DOCUMENTATION

## 8. Create a Comprehensive README.md

The root `README.md` must become the main documentation entry point for this starter.

Write it for developers who may have never used this project before.

Use clear explanations, practical examples, and step-by-step instructions.

Do not write a README that only describes the project's technology stack.

The README should cover the following sections.

### 8.1 Project Introduction

Explain:
- What this project is.
- Why this starter exists.
- What problems it solves.
- Who should use it.
- What features are included.
- How it can be reused across multiple projects.

Clearly state that this is a reusable frontend dashboard foundation, not a complete business application.

### 8.2 Features

Document available features:

- React + Vite + TypeScript.
- Tailwind CSS.
- Reusable UI components.
- Dashboard layout.
- Authentication UI.
- Mock authentication.
- Protected routes.
- Dark mode.
- Light mode.
- System theme preference.
- Responsive navigation.
- Dashboard analytics.
- Data tables.
- Search and debounce.
- Filtering and pagination.
- API client.
- Mock API services.
- REST API integration preparation.

Only list features that actually exist in the repository.

### 8.3 Technology Stack

Document actual dependencies and versions from `package.json`.

Include:
- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- React Router.
- Lucide React.
- Recharts.
- Other relevant dependencies.

Do not list packages that are not installed.

### 8.4 Prerequisites

Explain required development tools:

- Node.js.
- npm.
- Git.
- Code editor.

Use actual version requirements from project configuration.

Include commands to verify installations:

```bash
node --version
npm --version
git --version
```

### 8.5 Installation & Setup

Provide a complete step-by-step guide.

Example:

```bash
git clone <repository-url>
cd <project-directory>
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Then explain each environment variable.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_USE_MOCK_API=true
```

Explain:
- How to run development mode.
- How to build production.
- How to preview production.
- How to run linting and type checks if available.

Use actual scripts from `package.json`.

Do not invent npm scripts.

### 8.6 Project Structure

Document the actual source code structure.

Explain the responsibilities of important directories:

- `components/`
- `layouts/`
- `pages/`
- `routes/`
- `hooks/`
- `contexts/`
- `services/`
- `mocks/`
- `lib/`
- `types/`
- `constants/`
- `assets/`
- `docs/`

Use the actual project structure rather than an idealized structure that does not exist.

Include a directory tree.

Explain where developers should put new features.

### 8.7 How to Customize This Starter for a New Project

This is one of the most important sections.

Provide a practical step-by-step guide for turning this starter into a new application.

#### A. Rename the Project

Explain how to rename:
- Project directory.
- `package.json` name.
- README title.
- Browser document title.
- Application name.
- Vite-related configuration where necessary.
- Git repository remote.

Provide commands and examples.

Example:

```bash
npm pkg set name="my-new-dashboard"
```

Explain how to verify the changes.

#### B. Change Branding

Explain how to replace:
- Application logo.
- Application name.
- Sidebar branding.
- Login page branding.
- Authentication promotional content.
- Favicon.
- Browser title.

Identify the actual files responsible for branding.

Prefer centralized application configuration rather than hardcoding branding in multiple components.

If not already implemented, create a reusable configuration such as:

`src/config/app.config.ts`

Example:

```ts
export const appConfig = {
  name: "My Application",
  description: "My Application Dashboard",
  shortName: "MyApp",
};
```

Adapt this example to the actual project architecture.

#### C. Change Theme Colors

Explain how to customize:
- Primary color.
- Background.
- Surface.
- Foreground.
- Border.
- Success.
- Warning.
- Danger.
- Dark mode colors.

Identify the actual CSS variables or theme configuration files.

Explain how to preserve consistency across light and dark modes.

#### D. Change Navigation

Explain how to:
- Add a navigation item.
- Remove a navigation item.
- Rename a navigation item.
- Change its icon.
- Add a new route.
- Group navigation items.
- Add role-based navigation in the future.

Prefer centralized navigation configuration where practical.

#### E. Add a New Page

Provide a complete example of adding a new page.

For example:

`/invoices`

Explain:
1. Create the page component.
2. Register the route.
3. Add navigation configuration.
4. Create page-specific types.
5. Create a service module.
6. Add mock data if needed.
7. Connect the page to the API.
8. Test the page.

#### F. Remove Unused Features

Explain how to safely remove:
- Demo pages.
- Mock data.
- Unused navigation.
- Unused UI components.
- Unnecessary dependencies.

Mention important dependencies and shared components that should not be removed without checking their usage.

#### G. Customize Authentication

Explain:
- How mock authentication works.
- How to change authentication UI.
- How to replace mock authentication with a Go backend.
- Where to configure login and logout.
- Where to implement the current-user request.
- Where to configure token or cookie handling according to the backend contract.

Clearly explain that frontend mock authentication is not production security.

### 8.8 API Integration Guide

Explain how to connect a new backend.

Include:
- Configure `VITE_API_BASE_URL`.
- Disable mock API mode.
- Update service modules.
- Define request and response types.
- Handle API errors.
- Configure authentication.
- Configure CORS on the backend.

Use `docs/API_CONTRACT.md` as the authoritative frontend/backend integration reference.

Explain how to adapt the contract when a future project uses a different backend.

### 8.9 Mock Data Guide

Explain:
- Where mock data lives.
- How to add new mock records.
- How mock services work.
- How search and pagination work.
- How to replace mock services with real services.

Ensure developers understand that UI pages should not import mock data directly.

### 8.10 Theme Customization

Explain:
- How to enable or disable theme options.
- How theme persistence works.
- How to customize light mode.
- How to customize dark mode.
- How to customize system preference.
- How to add new theme tokens.

### 8.11 Reusable Component Guide

Document important reusable components.

For each component, explain:
- Purpose.
- Location.
- Basic usage.
- Important props.

Prioritize:
- Button.
- Input.
- Card.
- Badge.
- Modal.
- Dropdown.
- DataTable.
- Pagination.
- StatCard.
- EmptyState.
- Skeleton.

Include practical code examples.

### 8.12 Development Guidelines

Explain the conventions developers should follow:

- Reuse existing components.
- Keep business logic separate from presentation.
- Use TypeScript.
- Keep API calls inside services.
- Keep mock data separated.
- Follow the existing design system.
- Use the reusable debounce hook.
- Maintain dark and light mode compatibility.
- Keep components focused.
- Avoid unnecessary dependencies.

Reference `AGENTS.md` for AI coding agent instructions.

### 8.13 Troubleshooting

Document common issues:

- npm install failures.
- Port already in use.
- Environment variables not loading.
- API connection failures.
- CORS errors.
- Authentication redirect issues.
- Dark mode not persisting.
- Build failures.
- TypeScript errors.

Provide practical solutions.

### 8.14 Production Build & Deployment

Explain:
- Production build.
- Output directory.
- Environment configuration.
- Static hosting.
- Nginx deployment considerations.
- SPA fallback routing.
- API URL configuration.

Do not include secrets in frontend environment variables.

### 8.15 Documentation Index

At the end of README, provide links to:

- `AGENTS.md`
- `DESIGN_BRIEF.md`
- `docs/API_CONTRACT.md`
- `docs/BACKEND_INTEGRATION.md`
- `docs/UI_UX_AUDIT.md` if present.
- Other relevant documentation.

---

# PART D — REUSABILITY & PROJECT STANDARDIZATION

## 9. Centralize Project Configuration

Evaluate whether project-specific configuration is scattered across multiple files.

If necessary, centralize:

- Application name.
- Application description.
- Branding.
- Navigation.
- Theme defaults.
- API configuration.

Avoid creating excessive configuration abstractions.

A new project should require minimal changes to customize its identity.

## 10. Reusability Requirements

This starter will be used as the foundation for multiple future applications.

Therefore:

- Avoid hardcoded business-specific terminology.
- Keep generic dashboard components reusable.
- Keep project-specific mock data isolated.
- Keep branding configurable.
- Keep navigation configurable.
- Keep API services modular.
- Keep design tokens centralized.
- Keep authentication UI independent from backend implementation.
- Avoid unnecessary dependencies on a particular backend framework.

The starter should be easy to clone and customize without modifying its fundamental architecture.

## 11. README Accuracy Requirements

This is critical.

Before writing documentation:

1. Inspect actual source code.
2. Inspect `package.json`.
3. Inspect Vite configuration.
4. Inspect Tailwind configuration.
5. Inspect environment files.
6. Inspect routing.
7. Inspect API client and services.
8. Inspect authentication implementation.
9. Inspect theme implementation.
10. Inspect the actual Go backend response implementation if accessible.

Never document functionality that does not exist.

If a feature is only partially implemented, clearly explain its current status.

Do not use hypothetical file paths in instructions without verifying them.

All commands must be executable in the actual project environment.

## 12. Final Verification

After updating documentation and configuration:

- Verify all README file paths.
- Verify all documented npm commands.
- Verify environment variable names.
- Verify API examples against Go source code.
- Verify TypeScript types against the API contract.
- Verify that project renaming instructions are correct.
- Verify that branding customization instructions point to actual files.
- Run TypeScript checks.
- Run linting if available.
- Run production build.
- Ensure no existing functionality has been broken.

## 13. Expected Deliverables

Complete the following:

1. Updated `docs/API_CONTRACT.md`.
2. Updated `docs/BACKEND_INTEGRATION.md`.
3. Comprehensive root `README.md`.
4. Updated TypeScript API response types.
5. Updated API client and service modules if required.
6. Centralized application configuration if needed.
7. Updated `.env.example` if needed.
8. Updated documentation links and references.

Create or update any additional documentation only when genuinely useful.

## 14. Final Report

Provide:

- Go backend repository inspected.
- Actual response structure discovered.
- Important differences from the previous API contract.
- API files modified.
- README sections created.
- Configuration improvements.
- Instructions for creating a new project from this starter.
- Verification results.
- Remaining limitations.

Be transparent about anything that could not be verified.

Do not claim the API contract is aligned if the actual backend source was unavailable.

Start with repository discovery and source inspection. Then update the API contract, implementation types where necessary, and finally write the complete README documentation.