# AeroEdu — Frontend Rules & Access Control

**Version:** 1.0 · **Date:** 2026-10-04
**Status:** Enforced — PRs that violate these rules are rejected.

---

## 1. Access Control Rules

### 1.1 Three-Layer Authorization

| Layer | Where | Purpose | Enforcement |
|---|---|---|---|
| **Route Guard** | `ProtectedRoute` wrapper | Prevent access to unauthorized pages | Redirect to `/403` |
| **Element Guard** | `<Can permission="...">` | Hide buttons/actions user can't perform | Render `null` or fallback |
| **API Enforcement** | Backend | Actual security boundary | Server returns 403/404 |

**Rule:** Frontend guards are UX only. Never trust them for security. The API is the source of truth.

### 1.2 Page ID System

- Every page has a unique `page_id` (e.g., `students.list`, `billing.invoices`)
- The backend database (`page_permissions` table) controls which roles can access which page IDs
- On login, the API returns `accessible_pages: string[]`
- The frontend stores this in Zustand and checks it before rendering any route
- The `PAGE_REGISTRY` in `shared/config/page-registry.ts` is the contract — backend uses the same IDs

**Rule:** Adding a new page requires:
1. Adding the `page_id` to `PAGE_REGISTRY`
2. Adding the `page_id` to the backend `page_permissions` seed
3. Wrapping the route in `<ProtectedRoute pageId="...">`

### 1.3 Permission Naming Convention

```
{module}.{action}
```

| Action | Meaning |
|---|---|
| `view` | Can see the page/list |
| `create` | Can create new records |
| `edit` | Can modify existing records |
| `delete` | Can delete/deactivate records |
| `approve` | Can approve pending items |
| `export` | Can export data |
| `import` | Can bulk import data |
| `mark` | Can mark attendance |
| `generate` | Can generate PDFs/documents |

**Examples:** `students.view`, `students.create`, `attendance.mark`, `billing.approve_waiver`, `exams.generate_admit_cards`.

### 1.4 Role Hierarchy (Frontend Awareness)

| Level | Role | Frontend Implication |
|---|---|---|
| 100 | Super Admin | Sees everything (institute switcher) |
| 90 | Institute Admin | Sees all institute pages |
| 80 | Academic Director | Sees academics + staff, not billing |
| 70 | Exam Controller | Sees exams + admit cards, not billing |
| 70 | Accountant | Sees billing + invoices, not exams |
| 50 | Class Teacher | Sees own section + attendance + marks |
| 40 | Teacher | Sees own classes + marks entry |
| 30 | Receptionist | Sees students + admissions only |
| 10 | Student/Guardian | Sees own data only (portal) |

**Rule:** The frontend never assumes a role name. It checks permissions and page IDs. Roles are backend data, not frontend constants.

---

## 2. Component Rules

### 2.1 File Structure (Mandatory)

```
ComponentName/
├── ComponentName.tsx           ← JSX only
├── ComponentName.module.css    ← Styles only
├── ComponentName.test.tsx      ← Tests
├── ComponentName.types.ts      ← Types
└── index.ts                    ← Re-export
```

### 2.2 Component Rules

| # | Rule | Why |
|---|---|---|
| 1 | One component per file | Single responsibility |
| 2 | Max 200 lines per component | Readability |
| 3 | No business logic in components | Belongs in hooks |
| 4 | No direct API calls in components | Use hooks |
| 5 | No inline styles (`style={{}}`) | Use Tailwind or CSS Modules |
| 6 | No `any` type | Use proper types |
| 7 | Every prop typed | TypeScript strict mode |
| 8 | Every component has a test | Coverage |
| 9 | Shared components in `shared/components/ui/` | Reusability |
| 10 | Feature components in `features/*/components/` | Isolation |

### 2.3 Compound Components

For complex UI (tables, tabs, wizards), use the compound pattern:

```tsx
<Tabs defaultValue="general">
  <Tabs.List>
    <Tabs.Trigger value="general">General</Tabs.Trigger>
    <Tabs.Trigger value="branding">Branding</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="general">...</Tabs.Content>
  <Tabs.Content value="branding">...</Tabs.Content>
</Tabs>
```

**Rule:** Compound components share state via Context, not prop drilling.

---

## 3. Styling Rules

### 3.1 Three-Tier Styling (Mandatory)

| Tier | Where | What |
|---|---|---|
| **Tokens** | `styles/tokens.css` | CSS variables: spacing, colors, typography |
| **Tailwind** | Inline in JSX | Layout, spacing, typography, colors |
| **CSS Modules** | `Component.module.css` | Complex animations, pseudo-elements, print |

### 3.2 Styling Rules

| # | Rule | Why |
|---|---|---|
| 1 | No inline `style={{}}` | Breaks CSP, hard to maintain |
| 2 | No global CSS beyond `styles/globals.css` | Scoping |
| 3 | No `!important` | Specificity war |
| 4 | Use design tokens, not magic numbers | Consistency |
| 5 | Every component has its own `.module.css` if needed | Isolation |
| 6 | Print styles go in `styles/print.css` | Centralized |
| 7 | Responsive: mobile-first (Tailwind default) | Progressive enhancement |
| 8 | Dark mode: via CSS variables, not separate stylesheets | Maintainability |
| 9 | No CSS-in-JS (styled-components, emotion) | Runtime overhead |
| 10 | Class names: camelCase in modules, kebab-case in global | Convention |

### 3.3 Spacing Scale (Use These, Nothing Else)

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
```

**Rule:** Tailwind's `p-4` maps to `16px` — consistent with `--space-4`. Never use arbitrary values like `p-[13px]`.

### 3.4 Color Palette (Use These, Nothing Else)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#1e40af` | Buttons, links, active states |
| `--color-surface` | `#ffffff` | Cards, modals |
| `--color-surface-subtle` | `#f8fafc` | Table headers, filter bars |
| `--color-border` | `#e2e8f0` | Borders, dividers |
| `--color-text` | `#0f172a` | Body text |
| `--color-text-muted` | `#64748b` | Secondary text |
| `--color-danger` | `#dc2626` | Errors, destructive actions |
| `--color-success` | `#16a34a` | Success, paid status |
| `--color-warning` | `#d97706` | Warnings, pending status |

---

## 4. State Management Rules

| State Type | Tool | Where |
|---|---|---|
| Server data | TanStack Query | Feature hooks |
| Auth | Zustand | `features/auth/store.ts` |
| UI preferences | Zustand | `shared/stores/ui.ts` |
| Form state | React Hook Form | Component-local |
| Modal | `useState` | Component-local |
| URL state | `useSearchParams` | Page-level |

**Rules:**
1. Never use `useState` for server data
2. Never use TanStack Query for UI state
3. Never use Redux (Zustand is simpler)
4. Every query has a `queryKey` that includes filters
5. Every mutation invalidates related queries on success

---

## 5. Routing Rules

| # | Rule |
|---|---|
| 1 | Every route is lazy-loaded (`React.lazy`) |
| 2 | Every authenticated route wrapped in `<ProtectedRoute pageId="...">` |
| 3 | 404 page for unknown routes |
| 4 | 403 page for unauthorized access |
| 5 | Redirect to `/login` if not authenticated |
| 6 | Redirect to `/` if authenticated and visiting `/login` |
| 7 | Breadcrumbs on every page |
| 8 | URL reflects state (filters, pagination in query params) |

---

## 6. API Interaction Rules

| # | Rule |
|---|---|
| 1 | All API calls go through `shared/lib/apiClient.ts` |
| 2 | `apiClient` handles JWT refresh automatically |
| 3 | No `axios` calls outside feature `api/` modules |
| 4 | Every API function has a typed response |
| 5 | Errors are typed (`ApiError`) and handled by TanStack Query |
| 6 | Loading states use skeletons, not spinners (where possible) |
| 7 | Optimistic updates for mutations where UX benefits |
| 8 | Every mutation has `onError` handler |

---

## 7. i18n Rules

| # | Rule |
|---|---|
| 1 | No hardcoded strings in components |
| 2 | Every user-visible string uses `t('key')` |
| 3 | Keys are namespaced: `students.title`, `billing.invoice.status.paid` |
| 4 | Bengali (`bn.json`) and English (`en.json`) always in sync |
| 5 | Numbers formatted per locale (`Intl.NumberFormat`) |
| 6 | Dates formatted per locale (`Intl.DateTimeFormat`) |
| 7 | Currency formatted as `৳1,500.00` (BDT) |
| 8 | RTL not needed (Bengali is LTR) |

---

## 8. Testing Rules

| # | Rule |
|---|---|
| 1 | Every shared component has a test |
| 2 | Every feature page has an integration test |
| 3 | Every critical journey has an E2E test |
| 4 | Every page passes axe-core accessibility |
| 5 | No `data-testid` unless necessary (prefer roles) |
| 6 | Tests use MSW for API mocking |
| 7 | Tests run in CI on every PR |
| 8 | Coverage threshold: 70% shared, 50% features |

---

## 9. Performance Rules

| # | Rule |
|---|---|
| 1 | Lazy-load every route |
| 2 | Virtualize tables >100 rows |
| 3 | Debounce search inputs (300ms) |
| 4 | Memoize expensive computations |
| 5 | `staleTime: 30_000` on queries |
| 6 | Prefetch on hover |
| 7 | No barrel imports from `shared/` in features |
| 8 | Bundle size < 500KB gzipped |
| 9 | Lighthouse score > 90 on every page |

---

## 10. Code Beautification & Separation Rules

### 10.1 HTML/JSX Rules

| # | Rule |
|---|---|
| 1 | JSX only in `.tsx` files |
| 2 | No `<style>` tags in JSX |
| 3 | No `<script>` tags in JSX |
| 4 | Max 200 lines per component |
| 5 | Extract sub-components when a component exceeds 150 lines |
| 6 | Use `React.Fragment` (`<>...</>`) over unnecessary `<div>` |
| 7 | Every JSX element with >3 props gets one prop per line |
| 8 | Self-closing tags for elements without children |

### 10.2 CSS Separation Rules

| # | Rule |
|---|---|
| 1 | Tailwind for layout/spacing/typography (90%) |
| 2 | CSS Modules for complex/component-specific styles (10%) |
| 3 | Design tokens for global values |
| 4 | No CSS in `.tsx` files |
| 5 | No global styles except `globals.css` and `tokens.css` |
| 6 | Print styles in `print.css` only |
| 7 | CSS Modules named `Component.module.css` |
| 8 | One CSS Module per component |
| 9 | No `@import` in component modules |
| 10 | Use CSS variables, not hardcoded values |

### 10.3 Import Order (Enforced)

```tsx
// 1. React
import React, { useState } from 'react';

// 2. Third-party
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

// 3. Shared
import { Button } from '@/shared/components/ui/Button';
import { usePermissions } from '@/shared/hooks/usePermissions';

// 4. Feature
import { useStudents } from '../../hooks/useStudents';
import { StudentTable } from '../../components/StudentTable';

// 5. Types
import type { Student } from '../../types';

// 6. Styles
import styles from './StudentListPage.module.css';
```

### 10.4 Naming Conventions

| Element | Convention | Example |
|---|---|---|
| Component file | PascalCase | `StudentForm.tsx` |
| Component name | PascalCase | `StudentForm` |
| Hook file | camelCase, `use` prefix | `useStudents.ts` |
| Hook name | camelCase, `use` prefix | `useStudents` |
| CSS Module | PascalCase + `.module.css` | `StudentForm.module.css` |
| CSS class | camelCase | `.fieldGroup` |
| Type file | PascalCase + `.types.ts` | `Student.types.ts` |
| Test file | PascalCase + `.test.tsx` | `StudentForm.test.tsx` |
| Page | PascalCase + `Page` suffix | `StudentListPage.tsx` |
| API module | camelCase | `studentsApi.ts` |
| Store | camelCase + `Store` suffix | `authStore.ts` |

---

## 11. Git & PR Rules

| # | Rule |
|---|---|
| 1 | Branch naming: `feature/AE-123-student-list` |
| 2 | Commit messages: `feat(students): add bulk import wizard` |
| 3 | Every PR has a description with screenshots |
| 4 | Every PR passes CI (lint, type-check, test) |
| 5 | Every PR has at least one reviewer |
| 6 | No `console.log` in production code |
| 7 | No commented-out code |
| 8 | No `TODO` without a ticket reference |

---

## 12. What Gets Rejected in Code Review

| Violation | Why |
|---|---|
| Hardcoded strings | i18n violation |
| Inline styles | Styling violation |
| API calls in components | Architecture violation |
| `any` type | Type safety violation |
| Missing route guard | Access control violation |
| Missing permission check on action buttons | Access control violation |
| No test | Testing violation |
| Global CSS outside `styles/` | Styling violation |
| Business logic in component | Architecture violation |
| Cross-feature import | Isolation violation |
| Missing page ID on new route | Access control violation |
| `!important` in CSS | Specificity violation |
| Magic numbers in styles | Token violation |
| `console.log` | Debugging violation |

---

**Bottom line:** These rules enforce the frontend plan. They are non-negotiable. A PR that violates any of them is rejected — no exceptions, no "we'll fix it later."
```

---

## Summary

| File | Purpose | Length |
|---|---|---|
| `_project/FRONTEND-PLAN.md` | Complete A-to-Z frontend architecture: folder structure, OOP principles, RBAC, page IDs, page-by-page breakdown, styling, components, state, testing, build order | ~800 lines |
| `_project/FRONTEND-RULES.md` | Enforceable rules: access control, component rules, styling rules, state rules, routing rules, code beautification, PR checklist | ~400 lines |

**Key design decisions:**

1. **Feature-based architecture** — mirrors backend bounded contexts. Cross-feature imports forbidden.
2. **Page ID system** — every page has a unique ID controlled by the database. The backend returns `accessible_pages` on login. The frontend uses this to filter navigation and guard routes.
3. **Three-tier styling** — Tailwind for 90%, CSS Modules for 10%, design tokens for global values. No inline styles. No CSS-in-JS.
4. **Compound components** — complex UI units (tables, tabs, wizards) use the compound pattern for flexibility.
5. **Hooks as services** — custom hooks encapsulate all data fetching. Components never call APIs directly.
6. **Separation of concerns** — JSX in `.tsx`, styles in `.module.css`, types in `.types.ts`, tests in `.test.tsx`. One component per folder.
7. **OOP principles applied** — encapsulation via barrel exports, abstraction via headless components, composition over inheritance, single responsibility per component.

**Next step:** Create `_project/FRONTEND-PLAN.md` and `_project/FRONTEND-RULES.md`, then start with Milestone F0 (Vite + React + TS scaffold).