# Project Instructions & Agent Guidelines

## Mandatory Frontend Architecture (`fe-architecture`)
Before planning, scaffolding, or executing any frontend code or tasks in this repository:
- **Consult the Skill:** Read [`.agents/skills/fe-architecture/SKILL.md`](.agents/skills/fe-architecture/SKILL.md) for strict folder contracts, data flow conventions, and code templates.
- **Enforce Layer Isolation:**
  - `page.tsx`: Server Component thin Suspense wrapper only.
  - `*-page-content.tsx`: Client Component route orchestration and layout.
  - `_components/`: Private to current route only.
  - `components/`: Shared UI components across routes.
  - `hooks/transactions/use-{domain}/`: Domain React Query hooks (`use-data-table.ts`, `use-get-one.ts`, `use-insert-one.ts`, `use-update-one.ts`, `use-delete-one.ts`).
  - `constants/`: `api-routers.ts` (with `:id` variables) and `query-keys.ts` (flat string keys).
  - No direct `axios`/`fetch` inside components or pages; use React Query hooks.
  - Route client requests through the internal BFF proxy (`/api/proxy`).
