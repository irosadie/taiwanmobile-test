---
trigger: always_on
description: Mandatory Next.js App Router frontend architectural rules. All agents MUST consult and follow the fe-architecture skill when planning or executing frontend features.
---

## Frontend Architecture Enforcement (`fe-architecture`)

Whenever planning, designing, scaffolding, modifying, or executing frontend code in `apps/web`:

1. **Mandatory Skill Consultation:**
   - Always read and strictly adhere to [`fe-architecture`](file:///Users/binarydev/Program/Interview/taiwanmobile/.agents/skills/fe-architecture/SKILL.md).

2. **Core Invariants:**
   - **`page.tsx`:** Thin Suspense wrapper ONLY. Never write direct data fetching, business logic, or complex state here. Always delegate to `*-page-content.tsx`.
   - **Data Fetching:** Always through React Query custom hooks inside `hooks/transactions/use-{domain}/`. Never call `axios` or `fetch` directly in pages or components.
   - **BFF Proxy:** All client-side requests go to `/api/proxy/[...path]`. Never manually attach auth tokens client-side; the proxy injects the NextAuth session token.
   - **Components:** Route-private components belong strictly in `_components/`. Reusable cross-route components belong in `apps/web/components/`. No cross-route imports from another route's `_components/`.
   - **Constants:** All API endpoints must use `:id` variables in `constants/api-routers.ts`. All React Query cache keys must use flat strings in `constants/query-keys.ts`.
   - **Validation & Types:** Form schemas and payload types live in `packages/schemas/` (Zod). API response types live in `packages/types/`.
