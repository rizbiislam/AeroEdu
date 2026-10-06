# AeroEdu — Frontend Plan (A to Z)

**Version:** 1.0 · **Date:** 2026-10-04
**Scope:** Stage 0 Local-First MVP — full frontend architecture
**Relationship to docs:** Extends `docs/01-ARCHITECTURE.md` §1 and `docs/01-CODING-STANDARDS-AND-CONVENTIONS.md` §3.4

---

## 1. Philosophy

The frontend is a **thin, role-aware rendering layer** over the backend API. Every business rule lives in the backend (`domain/` + `application/`). The frontend:

- Renders what the API returns
- Hides UI elements the user can't act on (UX, not security)
- Never trusts client-side state for authorization decisions
- Fetches permissions from the API on login; the API is the source of truth

**Two rules that govern everything:**

1. **If the API says no, the UI must not offer it.** Hidden buttons are convenience. Server-side checks are security. Both exist; neither replaces the other.
2. **Every screen is a composition of reusable pieces.** No screen is written from scratch.

---

## 2. Technology Stack (Locked)

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + TypeScript 5 | Component model, type safety |
| Build | Vite 5 | Fast dev server, modern bundling |
| Routing | React Router v6 | Nested routes, data loaders |
| Server State | TanStack Query v5 | Caching, background refetch, optimistic updates |
| Client State | Zustand | Auth context, UI preferences, sidebar state |
| Forms | React Hook Form + Zod | Performant, schema validation |
| HTTP | Axios | Interceptors for JWT refresh |
| Styling | Tailwind CSS 3 + CSS Modules | Utility classes + component-scoped overrides |
| Components | shadcn/ui (headless) | Accessible, unstyled primitives |
| i18n | react-i18next | Bengali + English |
| Icons | Lucide React | Tree-shakeable, consistent |
| Charts | Recharts | Dashboard analytics |
| PDF Viewer | react-pdf | In-browser admit card / report card preview |
| Testing | Vitest + React Testing Library + Playwright | Unit + integration + E2E |

---

## 3. Architecture — Feature-Based, Not Type-Based

The frontend mirrors the backend's bounded-context modules. Each feature is self-contained.

```
frontend/src/
├── app/                          ← APPLICATION SHELL
│   ├── App.tsx                   Root component
│   ├── router.tsx                Route definitions (lazy-loaded)
│   ├── providers.tsx             QueryClient, i18n, Auth, Theme
│   └── layout/                   AppShell, Sidebar, Header, Footer
│
├── features/                     ← FEATURE MODULES (mirror backend apps/)
│   ├── auth/
│   │   ├── api/                  API calls (login, refresh, logout)
│   │   ├── components/           LoginForm, MfaPrompt
│   │   ├── hooks/                useAuth, useLogin, usePermissions
│   │   ├── pages/                LoginPage, ForgotPasswordPage
│   │   ├── types.ts              User, LoginRequest, AuthResponse
│   │   └── index.ts              Public API — ONLY export from here
│   │
│   ├── students/
│   │   ├── api/                  getStudents, createStudent, importStudents
│   │   ├── components/
│   │   │   ├── StudentTable.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   ├── StudentProfileCard.tsx
│   │   │   └── ImportWizard/     Excel import (multi-step)
│   │   ├── hooks/                useStudents, useStudent, useImportStudents
│   │   ├── pages/                StudentListPage, StudentDetailPage, StudentImportPage
│   │   ├── types.ts
│   │   └── index.ts
│   │
│   ├── attendance/               Same structure
│   ├── examinations/             Same structure
│   ├── billing/                  Same structure
│   ├── academics/                Same structure
│   ├── staff/                    Same structure
│   ├── communication/            Same structure
│   └── dashboard/                Role-specific home screens
│
├── shared/                       ← CROSS-CUTTING (no business logic)
│   ├── components/               Design system primitives
│   │   ├── ui/                   Button, Input, Table, Modal, Badge, Card...
│   │   ├── layout/               PageHeader, PageContainer, Grid, Stack
│   │   └── feedback/             Toast, Alert, Spinner, EmptyState
│   ├── hooks/                    useDebounce, useLocalStorage, useMediaQuery
│   ├── lib/                      apiClient, formatters, permissions engine
│   ├── i18n/                     bn.json, en.json
│   ├── types/                    Global types (ApiError, Paginated<T>)
│   └── config/                   constants.ts, page-registry.ts
│
├── styles/                       ← GLOBAL STYLES ONLY
│   ├── globals.css               Reset, base typography, CSS variables
│   ├── tokens.css                Design tokens (spacing, colors, shadows)
│   └── print.css                 Print stylesheets for PDFs
│
└── main.tsx
```

**Rule:** Cross-feature imports are forbidden. A feature imports from `shared/` or `app/` — never from another feature. If two features need the same logic, it moves to `shared/`.

---

## 4. OOP Principles — Applied to React

React is functional by default, but the *principles* of OOP still govern good design. Here's how each maps:

| OOP Principle | React Equivalent | Rule |
|---|---|---|
| **Encapsulation** | Feature folders + barrel exports (`index.ts`) | External code imports only from `features/x/index.ts`, never from `features/x/components/Foo` |
| **Abstraction** | Headless UI components | `<DataTable>` handles sorting/pagination; consumers pass column definitions |
| **Inheritance → Composition** | Compound components | `<Tabs>`, `<Tabs.List>`, `<Tabs.Panel>` — children compose, not extend |
| **Polymorphism** | Render props + slots | `<Button variant="primary\|danger\|ghost">` — one component, many behaviors |
| **Single Responsibility** | One component, one job | If a component fetches AND renders AND validates, split it |
| **Open/Closed** | Extend via props, not modification | New column type = new renderer function, not editing `<DataTable>` |
| **Dependency Inversion** | Hooks abstract data source | `useStudents()` returns data; the component doesn't know if it came from API or cache |

### 4.1 Compound Components Pattern

Used for complex UI units. Example — a `<DataTable>`:

```tsx
// shared/components/ui/DataTable/DataTable.tsx
export function DataTable<T>({ data, columns, isLoading, onRowClick }: DataTableProps<T>) {
  return (
    <table className={styles.table}>
      <DataTableHeader columns={columns} />
      <DataTableBody data={data} columns={columns} onRowClick={onRowClick} isLoading={isLoading} />
      <DataTablePagination />
    </table>
  );
}

// Consumers compose:
<DataTable
  data={students}
  columns={[
    { key: 'name', label: 'Name', render: (s) => s.fullName },
    { key: 'class', label: 'Class', render: (s) => s.className },
  ]}
  onRowClick={(s) => navigate(`/students/${s.id}`)}
/>
```

### 4.2 Custom Hooks as Service Layer

Hooks are the "services" of the frontend. They encapsulate all data-fetching logic:

```tsx
// features/students/hooks/useStudents.ts
export function useStudents(filters: StudentFilters) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentsApi.list(filters),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['students'] }),
  });
}
```

**Rule:** Components never call `axios` directly. They call hooks. Hooks call API modules. API modules call `apiClient`.

---

## 5. Role-Based Access Control (RBAC) — Frontend

### 5.1 Two Layers of Authorization

```
Layer 1: Route Guard       — Can this user reach this page at all?
Layer 2: Element Guard     — Can this user see this button/section?
Layer 3: API Enforcement   — Server says no regardless of UI (source of truth)
```

The frontend implements Layers 1 and 2 for UX. Layer 3 is the actual security boundary.

### 5.2 Permission Model

On login, the API returns the user's permissions:

```json
{
  "user": { "id": "...", "full_name": "...", "role": "Institute Admin" },
  "permissions": [
    "students.view",
    "students.create",
    "students.edit",
    "students.delete",
    "attendance.mark",
    "exams.view",
    "exams.create",
    "billing.view",
    "billing.create_invoice",
    "billing.record_payment",
    "billing.approve_waiver"
  ],
  "accessible_pages": [
    "dashboard",
    "students.list",
    "students.detail",
    "students.import",
    "attendance.mark",
    "exams.list",
    "billing.invoices",
    "billing.waivers",
    "settings.profile"
  ]
}
```

- `permissions` — granular action-level flags (what buttons to show)
- `accessible_pages` — page-level IDs (which routes to allow)
- Both are fetched from the API after login and stored in Zustand

### 5.3 Route Guard

```tsx
// app/router/ProtectedRoute.tsx
export function ProtectedRoute({ pageId, children }: { pageId: string; children: React.ReactNode }) {
  const { isAuthenticated, accessiblePages } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!accessiblePages.includes(pageId)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}

// Usage in router:
<Route path="/students" element={
  <ProtectedRoute pageId="students.list">
    <StudentListPage />
  </ProtectedRoute>
} />
```

### 5.4 Element Guard

```tsx
// shared/components/guards/Can.tsx
export function Can({ permission, children, fallback = null }: CanProps) {
  const { permissions } = useAuthStore();
  return permissions.includes(permission) ? <>{children}</> : <>{fallback}</>;
}

// Usage:
<Can permission="students.create">
  <Button onClick={openCreateModal}>Add Student</Button>
</Can>
```

### 5.5 Permission Hook

```tsx
// shared/hooks/usePermissions.ts
export function usePermissions() {
  const { permissions } = useAuthStore();

  const can = (permission: string) => permissions.includes(permission);
  const canAny = (perms: string[]) => perms.some(can);
  const canAll = (perms: string[]) => perms.every(can);

  return { can, canAny, canAll };
}

// Usage:
const { can } = usePermissions();
if (can('billing.approve_waiver')) { /* show approve button */ }
```

---

## 6. Page ID System — Database-Driven Access

### 6.1 Concept

Every page in the app has a **unique page ID**. The backend database stores which roles/users can access which page IDs. On login, the API returns the user's `accessible_pages` array. The frontend uses this to:

- Filter the sidebar navigation
- Guard routes
- Hide/show dashboard widgets
- Conditionally render action buttons

### 6.2 Page Registry (Frontend)

A static registry maps page IDs to metadata. The backend uses the same IDs.

```typescript
// shared/config/page-registry.ts
export const PAGE_REGISTRY = {
  // Dashboard
  'dashboard': { path: '/', title: 'Dashboard', roles: ['all'] },

  // Students
  'students.list': { path: '/students', title: 'Students', roles: ['admin', 'teacher', 'receptionist'] },
  'students.detail': { path: '/students/:id', title: 'Student Profile', roles: ['admin', 'teacher'] },
  'students.create': { path: '/students/new', title: 'Enroll Student', roles: ['admin', 'receptionist'] },
  'students.import': { path: '/students/import', title: 'Bulk Import', roles: ['admin'] },
  'students.edit': { path: '/students/:id/edit', title: 'Edit Student', roles: ['admin', 'receptionist'] },

  // Attendance
  'attendance.mark': { path: '/attendance/mark', title: 'Mark Attendance', roles: ['admin', 'teacher'] },
  'attendance.report': { path: '/attendance/report', title: 'Attendance Report', roles: ['admin', 'teacher'] },

  // Examinations
  'exams.list': { path: '/exams', title: 'Exams', roles: ['admin', 'exam_controller'] },
  'exams.create': { path: '/exams/new', title: 'Create Exam', roles: ['admin', 'exam_controller'] },
  'exams.marks': { path: '/exams/:id/marks', title: 'Enter Marks', roles: ['admin', 'teacher'] },
  'exams.admit_cards': { path: '/exams/:id/admit-cards', title: 'Admit Cards', roles: ['admin', 'exam_controller'] },
  'exams.report_cards': { path: '/exams/:id/report-cards', title: 'Report Cards', roles: ['admin', 'exam_controller'] },

  // Billing
  'billing.fee_structures': { path: '/billing/fee-structures', title: 'Fee Structures', roles: ['admin', 'accountant'] },
  'billing.invoices': { path: '/billing/invoices', title: 'Invoices', roles: ['admin', 'accountant'] },
  'billing.waivers': { path: '/billing/waivers', title: 'Fee Waivers', roles: ['admin', 'accountant'] },
  'billing.payments': { path: '/billing/payments', title: 'Payments', roles: ['admin', 'accountant'] },
  'billing.review_queue': { path: '/billing/review-queue', title: 'Payment Review', roles: ['admin'] },

  // Staff
  'staff.list': { path: '/staff', title: 'Staff', roles: ['admin'] },
  'staff.create': { path: '/staff/new', title: 'Add Staff', roles: ['admin'] },
  'staff.roles': { path: '/staff/roles', title: 'Roles & Permissions', roles: ['admin'] },

  // Settings
  'settings.profile': { path: '/settings/profile', title: 'My Profile', roles: ['all'] },
  'settings.institute': { path: '/settings/institute', title: 'Institute Settings', roles: ['admin'] },
  'settings.academic_year': { path: '/settings/academic-year', title: 'Academic Year', roles: ['admin'] },

  // Communication
  'communication.announcements': { path: '/announcements', title: 'Announcements', roles: ['all'] },
  'communication.study_materials': { path: '/study-materials', title: 'Study Materials', roles: ['all'] },
} as const;

export type PageId = keyof typeof PAGE_REGISTRY;
```

### 6.3 How the Backend Controls Access

The backend has a `page_permissions` table (add to `docs/01-DATABASE-SCHEMA-DDL.md`):

```sql
CREATE TABLE page_permissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    page_id         VARCHAR(80) NOT NULL,       -- 'students.list', 'billing.invoices'
    role_id         UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    can_access      BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (institute_id, page_id, role_id)
);
```

When an Institute Admin edits a role in the UI, they check/uncheck pages. This writes to `page_permissions`. On login, the API joins `user_roles` → `role_permissions` → `page_permissions` to compute `accessible_pages`.

**Why this matters:** In the future, an institute can create a custom role that can access "students.list" but NOT "billing.invoices" — without any code change. The page registry is the contract; the database is the truth.

---

## 7. Page-by-Page Breakdown

Every page has: **ID**, **route**, **required permissions**, **data sources**, **layout spec**, and **component composition**.

### 7.1 Global Layout System

All pages sit inside an `AppShell`:

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (h: 56px, px: 24px, bg: surface, border-bottom)    │
│  ┌─────┐  ┌──────────────┐  ┌────────────────────────────┐  │
│  │Logo │  │ Institute    │  │          Search            │  │
│  └─────┘  │ Switcher     │  └────────────────────────────┘  │
│           └──────────────┘         ┌──────┐  ┌──────────┐  │
│                                    │ 🔔   │  │ Avatar   │  │
│                                    └──────┘  └──────────┘  │
├──────────┬──────────────────────────────────────────────────┤
│ SIDEBAR  │  MAIN CONTENT AREA                              │
│ (w:240px)│                                                  │
│          │  ┌────────────────────────────────────────────┐  │
│  Dashboard│  │ PageHeader                               │  │
│  Students │  │  Title (text-2xl, font-bold, mb:16px)    │  │
│  Attendance│  │  Breadcrumbs (text-sm, text-muted)       │  │
│  Exams   │  │  Actions (right-aligned, gap:8px)        │  │
│  Billing │  └────────────────────────────────────────────┘  │
│  Staff   │                                                  │
│  Settings│  ┌────────────────────────────────────────────┐  │
│          │  │ PageBody                                 │  │
│          │  │  (varies per page — see below)           │  │
│          │  └────────────────────────────────────────────┘  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

**Layout tokens (CSS variables):**

```css
/* styles/tokens.css */
:root {
  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;

  /* Layout */
  --sidebar-width: 240px;
  --sidebar-collapsed: 64px;
  --header-height: 56px;
  --content-max-width: 1440px;
  --content-padding-x: 24px;
  --content-padding-y: 20px;

  /* Colors */
  --color-primary: #1e40af;
  --color-primary-hover: #1d4ed8;
  --color-surface: #ffffff;
  --color-surface-subtle: #f8fafc;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-danger: #dc2626;
  --color-success: #16a34a;
  --color-warning: #d97706;

  /* Typography */
  --font-sans: 'Inter', 'Noto Sans Bengali', system-ui, sans-serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}
```

### 7.2 Page: Login (`auth.login`)

| Field | Value |
|---|---|
| **Route** | `/login` |
| **Page ID** | `auth.login` |
| **Access** | Public (no auth) |
| **Layout** | Responsive split brand and sign-in panels; institute chooser follows sign-in when an account has multiple institute memberships |
| **Components** | `LoginPortal`, email/password inputs, inline validation feedback, accessible institute choices |

```
Layout:
┌─────────────────────────────────────────┐
│                                         │
│         ┌───────────────────┐           │
│         │  [AeroEdu Logo]   │           │
│         │                   │           │
│         │  Sign In          │           │
│         │  ┌─────────────┐  │           │
│         │  │ Email       │  │           │
│         │  └─────────────┘  │           │
│         │  ┌─────────────┐  │           │
│         │  │ Password    │  │           │
│         │  └─────────────┘  │           │
│         │  [ Sign In    ]   │           │
│         │                   │           │
│         │  Forgot password? │           │
│         └───────────────────┘           │
│                                         │
└─────────────────────────────────────────┘

Sign-in: email + password, with a visible demo-only notice in this local prototype.
Institute selection: render only memberships returned for the authenticated account;
accounts with one institute enter it directly. Do not expose role/persona catalogs.
```

**Prototype status:** The current UI uses a clearly labeled mock authentication service, sample institute memberships, and local in-memory data for the implemented dashboard, institute directory, attendance, academics, examinations, billing, support, audit, routine, ID card, and administration screens. These screens demonstrate frontend flows only; some actions simulate results and do not persist to a server. They are not production authentication or authorization.

The existing prototype's role navigation is the inventory of screens available in this demo, not a statement that every milestone in this plan is complete. Student CRUD/import, real payments, API-backed permissions and institute memberships, and other API-dependent milestones still require implementation. When the backend endpoint is wired, replace the mock service with the API response and use its `accessible_pages` and institute memberships as the source of truth. Client-side checks remain UX only; the API must enforce access.

### 7.3 Page: Dashboard (`dashboard`)

| Field | Value |
|---|---|
| **Route** | `/` |
| **Page ID** | `dashboard` |
| **Access** | All authenticated users |
| **Layout** | Grid: 4 stat cards on top, then 2-column content |
| **Components** | `StatCard`, `AttendanceChart`, `RecentActivity`, `UpcomingExams` |

```
Layout (Admin view):
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Dashboard"              [Refresh]       │
├──────────────────────────────────────────────────────┤
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │Students│ │Teachers│ │Attendance│ │Dues   │        │
│ │  520   │ │   25   │ │  94%    │ │৳12,400│        │
│ └────────┘ └────────┘ └────────┘ └────────┘        │
│                                                      │
│ ┌─────────────────────────┐ ┌──────────────────────┐│
│ │  Attendance Trend       │ │  Recent Activity     ││
│ │  (Line chart, h:300px)  │ │  (Feed, h:300px)     ││
│ └─────────────────────────┘ └──────────────────────┘│
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │  Upcoming Exams (Table)                          ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘

Stat cards: grid-cols-4, gap:16px, p:16px, radius-md, bg-surface, shadow-sm
Charts: p:20px, bg-surface, radius-md, shadow-sm
```

### 7.4 Page: Student List (`students.list`)

| Field | Value |
|---|---|
| **Route** | `/students` |
| **Page ID** | `students.list` |
| **Access** | `students.view` permission + page access |
| **Layout** | PageHeader → FilterBar → DataTable → Pagination |
| **Components** | `DataTable`, `StudentFilters`, `Pagination`, `Button`, `Badge` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader                                           │
│  "Students"              [Import Excel] [Add Student]│
│  Breadcrumb: Home / Students                         │
├──────────────────────────────────────────────────────┤
│ FilterBar (p:12px, bg-surface-subtle, radius-md, mb:16px)│
│  [Search] [Class ▼] [Section ▼] [Status ▼] [Clear]  │
├──────────────────────────────────────────────────────┤
│ DataTable                                            │
│ ┌────┬────────────┬───────┬───────┬──────┬────────┐  │
│ │ ☐  │ Name       │ Class │ Roll  │Status│Actions │  │
│ ├────┼────────────┼───────┼───────┼──────┼────────┤  │
│ │ ☐  │ Fatima R.  │ 10-A  │ 15    │Active│ ⋮      │  │
│ │ ☐  │ Nafis I.   │ 10-A  │ 16    │Active│ ⋮      │  │
│ └────┴────────────┴───────┴───────┴──────┴────────┘  │
│                                                      │
│ Pagination: [← Prev] Page 1 of 26 [Next →]          │
└──────────────────────────────────────────────────────┘

Table: w-full, text-sm, border-collapse
Header: bg-surface-subtle, font-medium, text-muted, h:40px, px:12px
Row: h:48px, border-b, hover:bg-surface-subtle
Actions: icon buttons, gap:4px
```

### 7.5 Page: Excel Import (`students.import`)

| Field | Value |
|---|---|
| **Route** | `/students/import` |
| **Page ID** | `students.import` |
| **Access** | `students.create` permission (Admin only) |
| **Layout** | Multi-step wizard: Download → Upload → Validate → Confirm → Success |
| **Components** | `ImportWizard`, `StepIndicator`, `FileDropZone`, `ValidationTable` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Bulk Import Students"                   │
│  Breadcrumb: Home / Students / Import                │
├──────────────────────────────────────────────────────┤
│ StepIndicator (mb:24px)                              │
│  ●─────●─────○─────○                                 │
│  1     2     3     4                                 │
│  Download Upload Review Confirm                      │
├──────────────────────────────────────────────────────┤
│ StepContent (min-h:400px, p:24px, bg-surface,        │
│              radius-md, shadow-sm)                   │
│                                                      │
│ [Step 1: Download template]                          │
│  📥 student_import_template.xlsx                     │
│  Required columns marked in red. 3 example rows.    │
│  [Download Template]                                 │
│                                                      │
│ [Step 2: Upload file]                                │
│  ┌────────────────────────────────────┐              │
│  │  ⬆ Drop file here or click browse  │              │
│  │    .xlsx or .csv · max 50 MB       │              │
│  └────────────────────────────────────┘              │
│                                                      │
│ [Step 3: Review errors]                              │
│  ⚠ 2 errors found                                    │
│  ┌─────┬──────────┬────────────────────────┐        │
│  │ Row │ Name     │ Error                  │        │
│  ├─────┼──────────┼────────────────────────┤        │
│  │ 47  │ Nafis    │ guardian_phone invalid │        │
│  │ 132 │ Rahim    │ admission_no duplicate │        │
│  └─────┴──────────┴────────────────────────┘        │
│  [Download error report] [Re-upload]                 │
│                                                      │
│ [Step 4: Confirm]                                    │
│  ✅ 498 valid rows                                   │
│  [Cancel]  [Import 498 Students]                     │
└──────────────────────────────────────────────────────┘
```

### 7.6 Page: Mark Attendance (`attendance.mark`)

| Field | Value |
|---|---|
| **Route** | `/attendance/mark` |
| **Page ID** | `attendance.mark` |
| **Access** | Class Teacher only (or Admin) |
| **Layout** | Section selector → Student grid with toggle |
| **Components** | `SectionSelector`, `AttendanceGrid`, `AttendanceToggle`, `BulkActions` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Mark Attendance"                        │
│  Date: 2026-10-04  [Class ▼] [Section ▼]            │
├──────────────────────────────────────────────────────┤
│ QuickActions (mb:16px)                               │
│  [Mark All Present] [Mark All Absent] [Reset]       │
├──────────────────────────────────────────────────────┤
│ AttendanceGrid                                       │
│ ┌────┬────────────┬──────┬────────┬────────┬──────┐│
│ │ #  │ Name       │ Roll │ Present│ Absent │ Late ││
│ ├────┼────────────┼──────┼────────┼────────┼──────┤│
│ │ 1  │ Fatima R.  │ 15   │   ●    │   ○    │  ○   ││
│ │ 2  │ Nafis I.   │ 16   │   ●    │   ○    │  ○   ││
│ │ 3  │ Rahim A.   │ 17   │   ○    │   ●    │  ○   ││
│ └────┴────────────┴──────┴────────┴────────┴──────┘│
│                                                      │
│ Summary: 28 present, 2 absent, 0 late               │
│ [Save Attendance]                                    │
└──────────────────────────────────────────────────────┘

Toggle: 32px circle, green/red/amber, transition 150ms
Row: h:52px, hover:bg-surface-subtle
Save button: sticky bottom, h:44px, bg-primary
```

### 7.7 Page: Mark Entry (`exams.marks`)

| Field | Value |
|---|---|
| **Route** | `/exams/:id/marks` |
| **Page ID** | `exams.marks` |
| **Access** | Teacher (assigned subject) or Exam Controller |
| **Layout** | Subject selector → Editable grid |
| **Components** | `SubjectSelector`, `MarksGrid`, `MarksInput`, `GradeDisplay` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Enter Marks — First Term 2026"          │
│  [Subject ▼] [Class ▼]  Max Marks: 100              │
├──────────────────────────────────────────────────────┤
│ MarksGrid (table with inline editing)                │
│ ┌────┬────────────┬──────┬────────┬───────┬───────┐ │
│ │ #  │ Name       │ Roll │ Marks  │ Grade │ Status│ │
│ ├────┼────────────┼──────┼────────┼───────┼───────┤ │
│ │ 1  │ Fatima R.  │ 15   │ [78 ]  │  A    │ ✅    │ │
│ │ 2  │ Nafis I.   │ 16   │ [72 ]  │  B    │ ✅    │ │
│ │ 3  │ Rahim A.   │ 17   │ [    ] │  —    │ ⏳    │ │
│ └────┴────────────┴──────┴────────┴───────┴───────┘ │
│                                                      │
│ Progress: 28/30 entered                              │
│ [Save Draft]  [Submit Marks]                         │
└──────────────────────────────────────────────────────┘

Input: w:80px, h:36px, text-center, border, radius-sm
Grade: auto-calculated, badge with color (A=green, B=blue, C=amber, F=red)
Auto-save: debounced 2s after last edit
```

### 7.8 Page: Invoice List (`billing.invoices`)

| Field | Value |
|---|---|
| **Route** | `/billing/invoices` |
| **Page ID** | `billing.invoices` |
| **Access** | Accountant + Admin |
| **Layout** | Stats row → FilterBar → DataTable |
| **Components** | `StatCard`, `DataTable`, `InvoiceStatusBadge`, `BulkActions` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Invoices"           [Generate Invoices] │
├──────────────────────────────────────────────────────┤
│ Stats (grid-cols-4, gap:16px, mb:16px)              │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐        │
│ │Total   │ │Paid    │ │Pending │ │Overdue │        │
│ │৳45,200 │ │৳32,800 │ │৳8,400  │ │৳4,000  │        │
│ └────────┘ └────────┘ └────────┘ └────────┘        │
├──────────────────────────────────────────────────────┤
│ FilterBar: [Search] [Class ▼] [Status ▼] [Month ▼] │
├──────────────────────────────────────────────────────┤
│ DataTable                                            │
│ ┌────┬────────────┬──────────┬────────┬───────┬────┐│
│ │ ☐  │ Invoice #  │ Student  │ Amount │ Status│Due ││
│ ├────┼────────────┼──────────┼────────┼───────┼────┤│
│ │ ☐  │ INV-0142   │ Fatima R.│ ৳1,500 │ Paid  │Mar ││
│ │ ☐  │ INV-0143   │ Nafis I. │ ৳1,500 │Pending│Mar ││
│ └────┴────────────┴──────────┴────────┴───────┴────┘│
└──────────────────────────────────────────────────────┘

Status badges: Paid=green, Pending=amber, Overdue=red, Cancelled=gray
```

### 7.9 Page: Payment Review Queue (`billing.review_queue`)

| Field | Value |
|---|---|
| **Route** | `/billing/review-queue` |
| **Page ID** | `billing.review_queue` |
| **Access** | Admin only |
| **Layout** | List of pending bank payments with approve/reject |
| **Components** | `ReviewCard`, `ApprovalActions`, `VerificationDetails` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Payment Review Queue"                   │
│  "3 payments awaiting your review"                   │
├──────────────────────────────────────────────────────┤
│ ReviewCard (mb:12px, p:16px, bg-surface, radius-md) │
│ ┌──────────────────────────────────────────────────┐│
│ │ 🏦 HBL-BD  · ৳3,000.00  · Fatima Rahman (10-A)  ││
│ │ Bank Ref: HBL-TXN-20261003-98765                 ││
│ │ Invoices: INV-0142 (৳1,500) + INV-0157 (৳1,500) ││
│ │ Verified: ✅ 2026-10-03 09:25:49                ││
│ │ [View Details]  [Approve]  [Reject]             ││
│ └──────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────┐│
│ │ 🏦 BRAC-BD · ৳2,000.00 · Nafis Iqbal (10-A)     ││
│ │ ...                                              ││
│ └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

### 7.10 Page: Settings (`settings.institute`)

| Field | Value |
|---|---|
| **Route** | `/settings/institute` |
| **Page ID** | `settings.institute` |
| **Access** | Admin only |
| **Layout** | Tabbed sections |
| **Components** | `Tabs`, `Form`, `ImageUpload`, `ColorPicker` |

```
Layout:
┌──────────────────────────────────────────────────────┐
│ PageHeader: "Institute Settings"                     │
├──────────────────────────────────────────────────────┤
│ Tabs: [General] [Branding] [Academic] [Billing]     │
├──────────────────────────────────────────────────────┤
│ TabContent (p:24px, bg-surface, radius-md)           │
│                                                      │
│ [General]                                            │
│  ┌─────────────────────────────────────────────┐    │
│  │ Institute Name    [Dhaka National Model...] │    │
│  │ EIIN              [108245]                  │    │
│  │ Exam Board        [Dhaka Board ▼]           │    │
│  │ Contact Email     [admin@dhakamodel.edu.bd] │    │
│  │ Contact Phone     [01712345678]             │    │
│  │ Timezone          [Asia/Dhaka ▼]            │    │
│  │ Locale            [bn-BD ▼]                 │    │
│  └─────────────────────────────────────────────┘    │
│  [Save Changes]                                      │
└──────────────────────────────────────────────────────┘
```

---

## 8. CSS Architecture — Separation of Concerns

### 8.1 Three-Tier Styling

```
Tier 1: Design Tokens (CSS variables in styles/tokens.css)
  → Global values: spacing, colors, typography, shadows

Tier 2: Tailwind Utility Classes (inline in JSX)
  → 90% of styling lives here: flex, grid, p-4, text-lg, bg-white

Tier 3: CSS Modules (Component.module.css)
  → Component-specific overrides, complex animations, print styles
```

### 8.2 File Naming Convention

```
Component/
├── Component.tsx           ← JSX only — no <style> blocks
├── Component.module.css    ← Scoped CSS for this component
├── Component.test.tsx      ← Unit tests
├── Component.types.ts      ← TypeScript types
└── index.ts                ← Re-export
```

### 8.3 Example — StudentForm

```tsx
// features/students/components/StudentForm/StudentForm.tsx
import styles from './StudentForm.module.css';

export function StudentForm({ initialData, onSubmit }: StudentFormProps) {
  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Full Name</label>
        <input className={styles.input} {...register('fullName')} />
      </div>
      <div className={styles.actions}>
        <Button type="submit" variant="primary">Save</Button>
        <Button type="button" variant="ghost">Cancel</Button>
      </div>
    </form>
  );
}
```

```css
/* features/students/components/StudentForm/StudentForm.module.css */
.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.fieldGroup {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text);
}

.input {
  height: 40px;
  padding: 0 var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--text-base);
}

.input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
```

### 8.4 What Goes Where

| Concern | Tailwind | CSS Module | Token |
|---|---|---|---|
| Layout (flex, grid, gap) | ✅ | | |
| Spacing (p, m, space) | ✅ | | |
| Colors (text, bg, border) | ✅ | | |
| Typography (text-sm, font-bold) | ✅ | | |
| Responsive (md:, lg:) | ✅ | | |
| Hover/focus states | ✅ | | |
| Complex animations | | ✅ | |
| Print styles | | ✅ | |
| Pseudo-elements (::before) | | ✅ | |
| Component-scoped overrides | | ✅ | |
| Global values | | | ✅ |
| Theme (dark mode) | ✅ | | ✅ |

### 8.5 Print Styles

For admit cards, report cards, invoices:

```css
/* styles/print.css */
@media print {
  .no-print { display: none !important; }
  .print-only { display: block !important; }
  body { font-size: 12pt; }
  .page-break { page-break-after: always; }
  @page { margin: 15mm; size: A4; }
}
```

**Rule:** Print styles go in `styles/print.css`, not in component modules. Components add classes like `no-print` or `page-break`.

---

## 9. Component Design System

### 9.1 Atomic Hierarchy

```
Atoms (shared/components/ui/)
  Button, Input, Badge, Avatar, Spinner, Icon

Molecules (shared/components/ui/)
  FormField (Label + Input + Error), SearchBar, StatCard,
  Pagination, EmptyState, ConfirmDialog

Organisms (features/*/components/)
  StudentTable, AttendanceGrid, InvoiceForm, ImportWizard

Templates (app/layout/)
  AppShell, AuthLayout, PrintLayout

Pages (features/*/pages/)
  StudentListPage, AttendanceMarkPage, InvoiceListPage
```

### 9.2 Component API Conventions

```tsx
// Every shared component follows this pattern:
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

// Extends native HTML attributes where sensible
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}
```

### 9.3 Shared Component Inventory (Build These First)

| Component | Props | Used By |
|---|---|---|
| `Button` | variant, size, isLoading, leftIcon | Everywhere |
| `Input` | label, error, hint, type | Every form |
| `Select` | options, value, onChange, placeholder | Filters, forms |
| `Checkbox` | checked, onChange, label | Tables, forms |
| `Modal` | isOpen, onClose, title, size | Dialogs |
| `DataTable` | columns, data, isLoading, onRowClick | Every list page |
| `Pagination` | page, totalPages, onPageChange | Every list page |
| `Badge` | variant, children | Status indicators |
| `Card` | title, children, footer | Dashboard widgets |
| `Tabs` | tabs, activeTab, onChange | Settings, detail pages |
| `Toast` | type, message, duration | Notifications |
| `Spinner` | size, color | Loading states |
| `EmptyState` | icon, title, description, action | Empty lists |
| `ConfirmDialog` | isOpen, title, message, onConfirm | Destructive actions |
| `PageHeader` | title, breadcrumbs, actions | Every page |
| `FilterBar` | children | Every list page |
| `FormField` | label, error, hint, children | Every form |

---

## 10. State Management Rules

| State Type | Tool | Where |
|---|---|---|
| Server data (students, invoices) | TanStack Query | Feature hooks |
| Auth (user, tokens, permissions) | Zustand | `features/auth/store.ts` |
| UI preferences (sidebar, theme) | Zustand | `shared/stores/ui.ts` |
| Form state | React Hook Form | Component-local |
| Modal open/close | `useState` | Component-local |
| URL state (filters, pagination) | React Router `useSearchParams` | Page-level |

**Rule:** Never use `useState` for server data. Never use TanStack Query for UI state.

---

## 11. Error Handling

```tsx
// Every API call returns a typed response:
type ApiResponse<T> = { data: T } | { error: ApiError };

// API client throws on error; TanStack Query catches:
const { data, error, isLoading } = useStudents(filters);

if (isLoading) return <TableSkeleton />;
if (error) return <ErrorState error={error} onRetry={refetch} />;
if (!data?.results.length) return <EmptyState title="No students" />;

return <StudentTable data={data.results} />;
```

**Error boundaries:** Wrap every route in an `<ErrorBoundary>`. A crash on one page doesn't take down the app.

---

## 12. Testing Strategy

| Level | Tool | What |
|---|---|---|
| Unit | Vitest + React Testing Library | Shared components, hooks, utils |
| Integration | Vitest + MSW (Mock Service Worker) | Feature pages with mocked API |
| E2E | Playwright | Critical journeys: login → enroll → attendance → invoice |
| Accessibility | axe-core (Playwright integration) | Every page passes WCAG 2.1 AA |
| Visual | Chromatic (optional, Stage 1) | Component regression |

**Coverage target:** 70% on shared components, 50% on feature pages.

---

## 13. i18n Strategy

```json
// shared/i18n/bn.json
{
  "students": {
    "title": "শিক্ষার্থী",
    "add": "নতুন শিক্ষার্থী",
    "import": "এক্সেল থেকে আমদানি",
    "columns": {
      "name": "নাম",
      "class": "শ্রেণী",
      "roll": "রোল"
    }
  }
}
```

```tsx
const { t } = useTranslation();
<h1>{t('students.title')}</h1>
```

**Rule:** No hardcoded strings in components. Every user-visible string comes from `t()`.

---

## 14. Performance Rules

| Rule | Why |
|---|---|
| Lazy-load every route | Smaller initial bundle |
| `React.lazy` + `Suspense` per feature | Load students code only when visiting students |
| Memoize expensive computations | `useMemo` for derived data |
| Virtualize tables >100 rows | `@tanstack/react-virtual` |
| Debounce search inputs (300ms) | Fewer API calls |
| `staleTime: 30_000` on queries | Reduce redundant fetches |
| Prefetch on hover | Faster navigation |
| No barrel imports from `shared/` in features | Prevents circular deps |

---

## 15. Build Order (Frontend Milestones)

| # | Milestone | Deliverable |
|---|---|---|
| F0 | Vite + React + TS scaffold | Runs at `:5173` |
| F1 | Design tokens + Tailwind + shared UI primitives | Button, Input, Modal work |
| F2 | AppShell (sidebar, header) + routing | Navigation works |
| F3 | Auth (login, token refresh, route guard) | Login → dashboard |
| F4 | Student list + detail + create form | CRUD works |
| F5 | Excel import wizard | Upload → validate → commit |
| F6 | Attendance marking grid | Bulk mark works |
| F7 | Exam + marks entry grid | Marks entry works |
| F8 | Invoice list + payment recording | Billing works |
| F9 | Payment review queue | Bank payment review |
| F10 | Settings + staff management | Admin works |
| F11 | Dashboard (role-specific) | Charts + stats |
| F12 | i18n (Bengali + English) | Language toggle |
| F13 | Print styles (admit cards, report cards) | PDFs render |

---

**Bottom line:** This frontend plan mirrors the backend's clean architecture — feature modules, shared primitives, enforced boundaries. Every page has a page ID that the database controls. Every component is reusable. Every style is separated. OOP principles apply to composition, encapsulation, and single responsibility.
```

---