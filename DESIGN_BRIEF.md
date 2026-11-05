# DESIGN BRIEF — React Dashboard Starter

## 1. Project Vision

Create a modern, clean, and professional admin dashboard starter that can serve as the foundation for multiple future applications.

The dashboard should feel like a modern SaaS product rather than a traditional enterprise admin template.

The visual direction should emphasize:

- Minimalist interface.
- Clear information hierarchy.
- Comfortable whitespace.
- Consistent component styling.
- Professional typography.
- Excellent usability.
- Responsive experience.

The design must be generic enough to adapt to different industries and business requirements.

## 2. Design Inspiration

Use the following products as visual references:

- Linear — minimalist interface, typography, and spacing.
- Vercel Dashboard — clean navigation and structured content.
- Stripe Dashboard — data presentation and information hierarchy.
- shadcn/ui — component consistency and neutral visual language.

Do not directly copy these products. Use them as inspiration for the overall visual direction.

## 3. Visual Identity

### Color Palette

Use a neutral-first color system.

Primary:
- Slate / Zinc-based neutral colors.
- Dark foreground for important text.
- Blue or Indigo as the primary accent.

Suggested colors:

| Token | Color |
|---|---|
| Background | #F8FAFC |
| Surface | #FFFFFF |
| Foreground | #0F172A |
| Secondary Text | #64748B |
| Border | #E2E8F0 |
| Primary | #4F46E5 |
| Success | #16A34A |
| Warning | #D97706 |
| Danger | #DC2626 |

Use CSS variables or Tailwind theme tokens where appropriate.

Avoid using too many accent colors.

### Typography

Use a modern sans-serif font.

Preferred:
- Inter
- Geist Sans

Typography hierarchy:

- Page title: 24–28px, semibold.
- Section title: 16–18px, semibold.
- Card title: 14px, medium.
- Body: 14px.
- Supporting text: 12–13px.

Typography should remain consistent across all pages.

### Border Radius

Use a consistent radius system:

- Small elements: 6px.
- Inputs and buttons: 8px.
- Cards: 12px.
- Modals: 12–16px.

### Shadows

Use subtle shadows only when needed.

Prefer borders and background contrast over heavy shadows.

## 4. Dashboard Layout

Create a desktop-first dashboard layout that adapts to smaller screens.

### Sidebar

Desktop:
- Fixed or sticky sidebar.
- Width approximately 250px.
- Full-height layout.
- White or slightly tinted background.
- Right border.
- Brand/logo section at the top.
- Navigation grouped by category.
- User profile section at the bottom.

Navigation structure:

GENERAL
- Overview
- Analytics

MANAGEMENT
- Users
- Products
- Orders

PREFERENCES
- Settings

Sidebar behavior:
- Highlight active navigation.
- Use Lucide React icons.
- Smooth hover states.
- Support collapsible groups if necessary.
- Mobile sidebar should become a drawer.

### Header

The header should include:

- Breadcrumb or current page context.
- Search input.
- Notification icon.
- User avatar.
- Profile dropdown.

Header should be clean and compact.

Avoid excessive controls.

### Main Content

- Use a light neutral background.
- Consistent horizontal padding.
- Clear page titles.
- Supporting descriptions where appropriate.
- Consistent spacing between sections.

Desktop content should have sufficient breathing room without wasting space.

## 5. Dashboard Overview Page

The default landing page should demonstrate the capabilities of the starter.

### Page Heading

Title: Dashboard

Description: Overview of your workspace and recent activity.

Include a date range selector or period filter.

### Statistics Section

Create four statistic cards:

1. Total Revenue
2. Total Users
3. Total Orders
4. Conversion Rate

Each card should contain:

- Label.
- Main numeric value.
- Percentage change.
- Comparison period.
- Small trend indicator.

Use subtle green/red indicators for positive and negative trends.

### Analytics Section

Create a responsive chart area.

Include:
- Revenue overview chart.
- Period selector.
- Tooltip.
- Chart legend.
- Responsive dimensions.

Use realistic mock data.

Charts should be visually clean and easy to understand.

### Recent Activity

Create a compact activity section showing:

- User activity.
- Action description.
- Timestamp.
- Status indicator where appropriate.

### Recent Transactions

Create a data table with:

- Customer.
- Transaction ID.
- Date.
- Amount.
- Status.
- Actions.

Include:
- Search.
- Status filtering.
- Pagination.
- Empty state.

## 6. Reusable UI Components

The dashboard should demonstrate a reusable component system.

### Buttons

Variants:
- Primary.
- Secondary.
- Outline.
- Ghost.
- Destructive.

Sizes:
- Small.
- Medium.
- Large.

### Inputs

Include:
- Default state.
- Focus state.
- Disabled state.
- Error state.
- Helper text.

### Badges

Variants:
- Success.
- Warning.
- Danger.
- Neutral.
- Information.

### Cards

Use a consistent card design:
- White background.
- Subtle border.
- 12px radius.
- Consistent internal padding.

### Data Tables

Support:
- Column headers.
- Row hover.
- Status badges.
- Responsive overflow.
- Pagination.
- Loading state.
- Empty state.

## 7. Additional Pages

Create basic pages to demonstrate navigation and reusable components.

### Analytics
- Revenue chart.
- User growth chart.
- Performance statistics.
- Date filtering.

### Users
- User list.
- Search.
- Filters.
- Pagination.
- User status.

### Products
- Product list.
- Product image placeholder.
- Category.
- Price.
- Stock status.

### Settings
- Profile settings.
- Account information.
- Notification preferences.
- Appearance preferences.

These pages can initially use mock data.

## 8. Responsive Design

Desktop:
- Full sidebar.
- Horizontal header.
- Multi-column statistics.
- Full-width charts and tables.

Tablet:
- Collapsible sidebar.
- Two-column statistics.
- Adaptive chart layout.

Mobile:
- Drawer navigation.
- Compact header.
- Single-column statistics.
- Stacked content sections.
- Horizontally scrollable tables when necessary.
- Touch-friendly controls.

No horizontal overflow should occur at the page level.

## 9. Interaction and UX

All interactive elements should have appropriate states.

Include:
- Hover.
- Focus.
- Active.
- Disabled.
- Loading.
- Error.
- Empty.

Interactions should feel responsive and predictable.

Examples:
- Sidebar navigation changes the active page.
- Dropdowns open and close properly.
- Search filters the displayed mock data.
- Pagination changes table data.
- Date filters update chart data.
- Modal dialogs support closing and confirmation.

Avoid decorative elements that look interactive but do nothing.

## 10. Accessibility

- Use semantic HTML.
- Maintain sufficient color contrast.
- Provide accessible labels.
- Support keyboard navigation.
- Ensure visible focus indicators.
- Use appropriate ARIA attributes when necessary.

## 11. Technical Design Constraints

- Use React and TypeScript.
- Use Tailwind CSS.
- Use Lucide React for icons.
- Use reusable components.
- Keep mock data separated from components.
- Avoid unnecessary dependencies.
- Keep the design system centralized.
- Avoid hardcoding inconsistent styling across pages.

## 12. Final Expected Result

The final dashboard should look like a polished, production-ready SaaS admin interface.

It should be easy to:
- Clone for a new project.
- Change branding and colors.
- Add new navigation items.
- Add new dashboard pages.
- Connect a REST API.
- Replace mock data with real backend data.
- Extend reusable UI components.

The primary objective is not to build a complete business application, but to create a high-quality dashboard foundation that significantly reduces development time for future projects.