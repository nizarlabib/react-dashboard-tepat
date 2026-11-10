# Audit Action Plan

**Source:** `docs/UI_UX_AUDIT.md`, `docs/FRONTEND_AUDIT.md`  
**Priority classes:** P0 (critical), P1 (high), P2 (medium), P3 (low)

---

## Prioritized Tasks

| ID | Severity | Task | Affected Files | Dependencies | Acceptance Criteria |
|----|----------|------|----------------|--------------|---------------------|
| A1 | P1 | Add skip-to-content link | `src/layouts/DashboardLayout.tsx`, `src/components/layout/Header.tsx` | None | Keyboard Tab reaches main content; link visible on focus. |
| A2 | P1 | Add focus trap to Modal | `src/components/ui/Modal.tsx` | None | Focus cycles within modal on Tab; Escape closes; focus returns to trigger on close. |
| A3 | P2 | Honor `prefers-reduced-motion` | `src/index.css` | None | `animate-spin`/transitions disabled when reduced motion is preferred. |
| A4 | P2 | Expose loading state on initial data fetch | `src/pages/{dashboard,users,products,orders}*.tsx`, `src/components/data-display/DataTable.tsx` | None | Skeleton rows show during initial fetch; table not briefly empty. |
| A5 | P2 | Add Error Boundary | `src/components/feedback/ErrorBoundary.tsx` + wire into routes | None | Render errors do not unmount the whole app; fallback UI shown. |
| A6 | P3 | Wire AbortSignal into search requests | `src/lib/api/client.ts`, page services | None | Rapid search changes cancel prior in-flight requests. |
| A7 | P3 | Extract `useSearchableList` hook | `src/hooks/useSearchableList.ts` + refactor 4 pages | None | Search/filter/pagination logic not duplicated across pages. |
| A8 | P3 | Precise query param typing | `src/lib/api/client.ts` | None | Remove `as Record<string, unknown>` casts. |

---

## Implementation Order

1. **A1** — Skip link (quick, high a11y impact)
2. **A2** — Modal focus trap (high a11y impact)
3. **A3** — Reduced motion (accessibility compliance)
4. **A4** — Loading states (perceived performance)
5. **A5** — Error boundary (reliability)
6. **A6/A7/A8** — P3 refinements (optional, implement as time permits)

---

## Verification Steps

- `npm run lint` passes with no errors.
- `npm run build` passes (TypeScript + Vite).
- All routes return HTTP 200 in dev server.
- Keyboard navigation: Tab reaches skip link, modal focus trap works, Escape closes modals/dropdowns.
- Dark/light/theme persistence verified across routes.
- Search debounce: typing triggers filter only after 300ms inactivity; pagination resets to page 1.

---

## Acceptance Criteria (Project-Level)

- No TypeScript errors.
- No ESLint errors.
- Production build succeeds.
- All routes work.
- Authentication mock flow works (login → dashboard, logout → login).
- Theme persistence works across reloads.
- Search and pagination work on all data pages.
- Dropdowns and modals open/close correctly.
- Modal focus trap and focus return verified.
