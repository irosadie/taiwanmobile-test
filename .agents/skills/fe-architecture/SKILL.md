---
name: fe-architecture
description: >
  Mandatory Next.js App Router frontend architecture standards, layer map, data flow contracts, and folder conventions.
  MUST be consulted by any agent before planning or executing frontend architecture, scaffolding, feature development,
  hook creation, routing, API integration, or UI component design.
---

# Frontend Architecture Standards (Next.js App Router)

This skill defines the strict architectural contracts, folder structure, and data flow for frontend applications under `apps/web`.
**Every AI agent MUST adhere to these contracts during both PLANNING and EXECUTION phases.**

---

## 1. apps/web — Layer Map

```
apps/web/
├── app/                    → Router: pages, layouts, route groups, route handlers
│   └── (group)/
│       └── feature/
│           ├── page.tsx                 → Server Component (thin Suspense wrapper only)
│           ├── feature-page-content.tsx → Client Component (route orchestration & state)
│           └── _components/             → Private components strictly for this route
├── auth.ts                 → NextAuth credentials config (server-only)
├── proxy.ts                → Route protection / redirect logic in edge layer
├── components/             → Reusable UI components (used in >1 page)
├── hooks/
│   ├── transactions/       → Data-fetching hooks grouped per domain
│   │   └── use-{domain}/   → One folder per domain
│   │       ├── use-data-table.ts  → React Query useQuery for paginated list
│   │       ├── use-get-one.ts     → React Query useQuery for single record
│   │       ├── use-insert-one.ts  → React Query useMutation for create
│   │       ├── use-update-one.ts  → React Query useMutation for update
│   │       ├── use-delete-one.ts  → React Query useMutation for delete
│   │       └── index.ts           → Re-export domain hooks
│   └── utility/            → Non-data utility hooks (e.g. useQueryParam)
├── services/
│   └── axios/              → Axios instance with interceptors (calls internal BFF proxy)
├── constants/
│   ├── api-routers.ts      → All API URL constants (use :id path variables)
│   └── query-keys.ts       → All React Query cache key constants (flat strings)
├── types/generals/         → FE-specific types not derived from API
├── configs/                → App-wide config (env, auth, etc.)
├── providers/              → React context providers
└── utils/                  → FE-specific helper functions (debounce, pathVariable, etc.)
```

---

## 2. End-to-End Data Flow

```
page.tsx (Server Component — thin Suspense wrapper)
  └─→ feature-page-content.tsx (Client Component — route state, hooks, layout)
      ├─→ _components/ (private form, table, dialog, drawer)
      └─→ Custom Hook (hooks/transactions/use-{domain}/)
          └─→ react-query useQuery / useMutation
              └─→ axios instance (services/axios/)
                  └─→ app/api/proxy/[...path]/route.ts (BFF Proxy)
                      └─→ Backend API Server
```

---

## 3. Strict Folder Contracts

### `app/` — Pages & Layouts
* **✅ Allowed:**
  * `page.tsx` must be a **thin Suspense wrapper** that imports and renders the `*-page-content.tsx` component.
  * Import `LoadingSpinner` or skeleton component for Suspense `fallback`.
  * Export `generateMetadata`, `generateStaticParams`.
  * Thin route handlers for auth or proxy under `app/api/`.
* **❌ Forbidden:**
  * Do NOT call `axios` or `fetch` directly.
  * Do NOT import from `services/` directly.
  * Do NOT put business logic or state management in `page.tsx`.
  * Do NOT place reusable cross-route components in `_components/` (use `components/` instead).

#### Standard Pattern for `page.tsx`:
```tsx
import { Suspense } from 'react';
import { FeaturePageContent } from './feature-page-content';
import { PageSkeleton } from '@/components/skeletons/page-skeleton';

export default function FeaturePage() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <FeaturePageContent />
    </Suspense>
  );
}
```

---

### `app/api/(auth)/auth/[...nextauth]/route.ts` — NextAuth Route Handler
* **✅ Allowed:**
  * Wrap `NextAuth(authOptions)` and export handlers `GET` and `POST`.
  * Stay thin as the App Router entrypoint for authentication.
* **❌ Forbidden:**
  * Do NOT put login business logic directly in the route handler.
  * Do NOT call backend auth directly here if logic already lives in `auth.ts`.

---

### `app/api/proxy/[...path]/route.ts` — Internal BFF Proxy
* **✅ Allowed:**
  * Forward browser requests to the backend API.
  * Attach bearer token retrieved from the NextAuth session.
  * Refresh access token and update session cookies when expired.
  * Pass public auth endpoints (login/refresh) without bearer token.
* **❌ Forbidden:**
  * Do NOT put feature business logic here.
  * Do NOT add domain-specific response transformations at this route level.
  * Do NOT make this route a stateful cache or business orchestration point.

---

### `proxy.ts` — Edge Route Protection
* **✅ Allowed:**
  * Redirect unauthenticated guests to the login page for protected routes.
  * Redirect authenticated users from `/login` to the default landing page.
  * Read cookies/session token for lightweight route guarding.
  * Read configuration from `auth.ts` and `configs/auth-server.ts`.
* **❌ Forbidden:**
  * Do NOT put application business logic here.
  * Do NOT fetch business data or call internal APIs to render pages.
  * Do NOT put main auth credentials configuration here (keep it in `auth.ts`).

---

### `*-page-content.tsx` — Main Client Component
* **✅ Allowed:**
  * Route orchestration: all `useState`, `useEffect`, and custom hooks.
  * Import and call custom hooks from `hooks/transactions/use-{domain}/`.
  * Define table column definitions (`columns` array).
  * Handle forms using `react-hook-form` + Zod schemas.
  * Dialog/drawer modal visibility states.
  * URL query param sync via `useQueryParam`.
  * Confirmations (e.g. SweetAlert2 / confirmation dialogs).
* **❌ Forbidden:**
  * Do NOT call `axios` or `fetch` directly.
  * Do NOT import from `services/` directly.

---

### `_components/` — Route-Private Components
* **✅ Allowed:**
  * Focused, presentational components used **strictly** by the current route.
  * Route-specific toolbar, table, form dialog, drawer, filter bar, or custom card.
* **❌ Forbidden:**
  * Do NOT import or reuse components from another route's `_components/`. If needed across routes, move to `components/`.
  * Do NOT call `axios` or `fetch` directly.

---

### `components/` — Reusable UI Components
* **✅ Allowed:**
  * Generic UI components shared across more than one route (Button, Modal, Input, DataTable, etc.).
  * Accept props, render JSX.
  * `useState` / `useEffect` strictly for internal local UI state (e.g. dropdown open/close).
* **❌ Forbidden:**
  * Do NOT call `axios` or `fetch` directly.
  * Do NOT import domain data-fetching hooks from `hooks/transactions/`.
  * Do NOT hardcode API URLs or React Query cache keys.

---

### `hooks/transactions/use-{domain}/` — Domain Data Hooks
* **✅ Allowed:**
  * One folder per domain entity (e.g. `use-users/`, `use-products/`).
  * Separate file per operation:
    * `use-data-table.ts` → Fetch paginated/filtered list via React Query `useQuery`.
    * `use-get-one.ts` → Fetch single item by ID via React Query `useQuery`.
    * `use-insert-one.ts` → Mutation to create item via React Query `useMutation`.
    * `use-update-one.ts` → Mutation to update item via React Query `useMutation`.
    * `use-delete-one.ts` → Mutation to delete item via React Query `useMutation`.
    * `index.ts` → Re-export all hooks in the domain.
  * Call the shared `axios` instance directly inside the hook (no need for redundant service wrapper files).
  * Use `queryKeys` and `apiRouters` from `constants/`.
* **❌ Forbidden:**
  * Do NOT include JSX or UI markup inside hooks.
  * Do NOT bundle all CRUD operations into a single massive hook file.
  * Do NOT hardcode API URLs or query key strings (always use `constants/`).

#### Standard Pattern for `use-data-table.ts`:
```ts
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/services/axios';
import { apiRouters } from '@/constants/api-routers';
import { queryKeys } from '@/constants/query-keys';
import type { DataTableResponse, DataTableParams } from '@/types/generals';
import type { UserResponse } from '@repo/types';

export function useDataTable(params: DataTableParams) {
  return useQuery<DataTableResponse<UserResponse>>({
    queryKey: [queryKeys.users.index, params],
    queryFn: async () => {
      const response = await axiosInstance.get(apiRouters.users.index, { params });
      return response.data;
    },
  });
}
```

---

### `hooks/utility/` — Utility Hooks
* **✅ Allowed:**
  * Reusable client utilities (e.g. `useQueryParam` wrapping `useSearchParams`, `useRouter`, and `usePathname`).
* **❌ Forbidden:**
  * Do NOT contain domain data-fetching or backend API calls.

---

### `services/axios/` — Axios Client Instance
* **✅ Allowed:**
  * Configure single Axios client pointing to internal BFF proxy base URL (`/api/proxy`).
  * Response interceptors to unwrap `{ data, meta }` payloads.
  * Interceptor for automatic `401` handling / redirecting to login.
* **❌ Forbidden:**
  * Do NOT create separate "service functions" per endpoint (hooks handle this directly).
  * Do NOT put domain business logic inside interceptors.
  * Do NOT manually attach Bearer token on client side (the BFF proxy route injects it server-side).

---

### `constants/` — Application Constants
* **✅ Allowed:**
  * `api-routers.ts`: Flat object mapping endpoints with `:id` path variables.
  * `query-keys.ts`: Flat string constants for React Query cache keys.
* **❌ Forbidden:**
  * Do NOT define helper functions inside `api-routers.ts` (use `pathVariable()` utility from `utils/`).
  * Do NOT read raw `process.env` in constants (use `configs/`).
  * Do NOT put business logic in constants.

#### Standard Pattern for Constants:
```ts
// constants/api-routers.ts
export const apiRouters = {
  users: {
    index: '/users',
    getOne: '/users/:id',
    create: '/users',
    update: '/users/:id',
    delete: '/users/:id',
  },
} as const;

// constants/query-keys.ts
export const queryKeys = {
  users: {
    index: 'usersIndex',
    detail: 'usersDetail',
  },
} as const;
```

---

### `packages/schemas/` — Zod Shared Schemas
* **✅ Allowed:**
  * Zod schemas for form validation and request payloads.
  * Export inferred TypeScript types (`type UserFormPayload = z.infer<typeof userSchema>`).
  * Status/type constant arrays + label mappings (`getUserStatusLabel()`).
* **❌ Forbidden:**
  * Do NOT import frontend or backend-specific dependencies.
  * Do NOT make API calls or include execution logic.

---

### `packages/types/` — API Response Types
* **✅ Allowed:**
  * Clean TypeScript `interface` or `type` definitions representing backend API responses.
  * Re-exported through `index.ts`.
* **❌ Forbidden:**
  * Do NOT use `any`.
  * Do NOT define form request schemas/payloads here (use `packages/schemas/`).

---

## 4. Checklist for AI Agents (Planning & Execution)

Before outputting code or plans, verify:
1. [ ] Is `page.tsx` solely a thin Suspense wrapper around `*-page-content.tsx`?
2. [ ] Are API calls executed exclusively inside `hooks/transactions/use-{domain}/` via React Query?
3. [ ] Are components in `_components/` strictly private to the route, and shared ones in `components/`?
4. [ ] Are all URLs using `apiRouters` and React Query keys using `queryKeys`?
5. [ ] Is client-side authentication handled via the internal `/api/proxy` BFF route?
6. [ ] Are validation rules defined with Zod schemas in `packages/schemas/`?
