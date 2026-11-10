# AGENTS.md

## Project Overview

This project is a reusable React Dashboard Starter built with React, Vite, TypeScript, and Tailwind CSS.

The goal is to establish a consistent, scalable, and maintainable foundation for building future admin dashboards and SaaS applications without repeating the initial setup.

The project should prioritize:
- Reusable UI components.
- Consistent design system.
- Clean and maintainable code.
- Type safety.
- Responsive layouts.
- Developer experience.
- Easy customization for future projects.

## Technology Stack

Use the following technologies:

- React for UI development.
- Vite for development and production builds.
- TypeScript for static typing.
- Tailwind CSS for styling.
- Lucide React for icons.
- React Router for client-side routing.

Do not introduce additional libraries without a clear requirement.

## Development Principles

### 1. Component Architecture

- Build reusable components instead of duplicating UI.
- Keep components focused on a single responsibility.
- Avoid unnecessarily large components.
- Separate business logic from presentation where appropriate.
- Use composition when building complex UI components.

### 2. TypeScript

- Use TypeScript throughout the project.
- Avoid `any` whenever possible.
- Define interfaces or types for component props.
- Use strict typing for reusable components.
- Avoid unnecessary type assertions.

### 3. Styling

- Use Tailwind CSS as the primary styling solution.
- Avoid inline styles unless necessary.
- Maintain consistent spacing, typography, colors, and border radius.
- Prefer design tokens or CSS variables for shared design values.
- Avoid arbitrary values when an existing design token can be reused.

### 4. Icons

- Use `lucide-react` for all interface icons.
- Do not use emoji as interface icons.
- Keep icon sizes consistent.
- Use icons with appropriate accessibility labels when needed.

### 5. Routing

- Use React Router for navigation.
- Keep route definitions organized.
- Support nested dashboard layouts.
- Separate public routes and protected routes when authentication is introduced.
- Navigation links should have consistent active states.

### 6. State Management

- Prefer React built-in state management for local component state.
- Use Context API only when state needs to be shared across multiple components.
- Do not introduce global state libraries without a clear requirement.

### 7. Responsive Design

All pages must support:
- Desktop.
- Tablet.
- Mobile.

The sidebar should transform into a mobile navigation drawer on smaller screens.

Tables and data-heavy components should handle smaller screens gracefully.

### 8. Code Quality

- Use descriptive component and variable names.
- Keep files organized by responsibility.
- Avoid unnecessary abstractions.
- Avoid duplicated logic.
- Remove unused imports and variables.
- Ensure the project builds without TypeScript errors.
- Do not leave placeholder functionality that appears interactive but does nothing.

## Project Structure

Follow this suggested structure:

```text
src/
├── assets/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── data-display/
│   └── feedback/
├── layouts/
│   ├── DashboardLayout.tsx
│   └── AuthLayout.tsx
├── pages/
│   ├── dashboard/
│   ├── users/
│   ├── settings/
│   └── not-found/
├── routes/
│   └── index.tsx
├── hooks/
├── contexts/
├── lib/
├── types/
├── constants/
├── App.tsx
└── main.tsx
```

Adapt the structure when necessary, but keep responsibilities separated.

## Reusable Components

Build reusable components for common dashboard requirements:

### Layout
- DashboardLayout
- Sidebar
- Header
- Breadcrumb
- PageContainer

### UI
- Button
- Input
- Select
- Textarea
- Checkbox
- Switch
- Badge
- Dropdown
- Modal
- Tooltip
- Tabs

### Data Display
- DataTable
- Pagination
- StatCard
- Avatar
- EmptyState
- Skeleton
- ChartContainer

### Feedback
- Toast
- Alert
- ConfirmationDialog
- LoadingState

Components should have flexible props and sensible defaults.

Do not build every possible component upfront. Prioritize components needed by the starter dashboard.

## Dashboard Features

The starter should include:

- Dashboard overview page.
- Sidebar navigation.
- Header with search.
- Notification area.
- User profile dropdown.
- Breadcrumb navigation.
- Statistics cards.
- Charts and data visualization.
- Recent activity.
- Recent data table.
- Settings page.
- Responsive mobile navigation.

Use mock data initially. Do not implement backend integration unless explicitly requested.

## Design Consistency

Follow the design specifications in `DESIGN_BRIEF.md`.

Important:
- Keep the visual language consistent across pages.
- Reuse existing components.
- Do not introduce random colors or spacing values.
- Avoid excessive shadows, gradients, and decorative elements.
- Prioritize usability and information hierarchy.

## AI Agent Workflow

Before implementing a feature:

1. Inspect the existing project structure.
2. Understand existing components and styling conventions.
3. Identify reusable components.
4. Plan the implementation.
5. Implement incrementally.
6. Verify TypeScript and production build.
7. Report files changed and summarize implementation.

For larger features:
- Create or update `issue.md` with implementation requirements.
- Break the task into manageable steps.
- Implement each step incrementally.
- Verify the result before moving forward.

## Important Rules

- Do not unnecessarily rewrite existing working code.
- Do not replace the existing technology stack without approval.
- Do not install dependencies without justification.
- Do not duplicate components that already exist.
- Do not use hardcoded mock data directly inside