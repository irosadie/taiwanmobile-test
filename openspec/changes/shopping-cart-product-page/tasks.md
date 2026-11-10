# Tasks

## 1. Workspace Scaffolding & Shared Packages (`fe-architecture-foundation`)

- [x] 1.1 Initialize workspace structure with `apps/web` (Next.js App Router, TypeScript, Tailwind CSS), `packages/types` (`@repo/types`), and `packages/schemas` (`@repo/schemas`), and verify `pnpm install` (or `npm install`) resolves workspace dependencies cleanly.
- [x] 1.2 Create shared API response interfaces in `packages/types/src/index.ts` (`ProductResponse`, `CartItem`, `CartSummary`, `CheckoutResponse`) without `any`, and verify TypeScript compilation (`tsc --noEmit`) passes in `packages/types`.
- [x] 1.3 Create shared Zod validation schemas in `packages/schemas/src/index.ts` (`productSearchSchema`, `cartQuantitySchema`, `checkoutPayloadSchema`) with inferred types, and verify unit tests or schema parse checks validate positive integer quantities and reject invalid values.
- [x] 1.4 Install and configure shadcn/ui primitives in `apps/web/components/ui/` (`button`, `card`, `input`, `badge`, `sheet`, `dialog`, `alert-dialog`, `skeleton`, `sonner`) plus `apps/web/components/skeletons/page-skeleton.tsx`, and verify all shared UI components compile without errors.

## 2. BFF Proxy, Axios Client, Constants & Domain Hooks (`fe-architecture-foundation`)

- [x] 2.1 Create `apps/web/constants/api-routers.ts` and `apps/web/constants/query-keys.ts` with flat constant mappings for `products` and `checkout`, plus utilities in `apps/web/utils/` (`debounce.ts`, `path-variable.ts`, `format-currency.ts`), and verify unit tests pass for `debounce`, `pathVariable`, and `formatCurrency`.
- [x] 2.2 Configure `apps/web/services/axios/index.ts` pointing to `/api/proxy` with response unwrapping interceptors, `apps/web/auth.ts`, `apps/web/proxy.ts`, and `apps/web/app/api/proxy/[...path]/route.ts` serving the 8 products from `docs/index.html` (`GET /api/proxy/products`) and simulated checkout (`POST /api/proxy/checkout`), and verify API endpoints respond with expected JSON payloads.
- [x] 2.3 Implement domain React Query hooks in `apps/web/hooks/transactions/use-products/` (`use-data-table.ts`, `use-get-one.ts`, `index.ts`) and `apps/web/hooks/transactions/use-checkout/` (`use-insert-one.ts`, `index.ts`), plus utility hooks in `apps/web/hooks/utility/` (`use-query-param.ts`, `use-debounce.ts`), and verify zero direct `axios`/`fetch` calls exist outside `hooks/transactions/` and `services/axios/`.

## 3. Product Catalog & Debounced Search Box (`product-catalog`)

- [x] 3.1 Create route-private `_components/product-search-bar.tsx` with a search input, clear button, and 300ms debounce hooked to `useQueryParam` and `useDataTable`, and verify typing a keyword filters the product list after the debounce interval and clearing restores all 8 products.
- [x] 3.2 Create route-private `_components/product-card.tsx` and `_components/product-grid.tsx` with responsive Tailwind grid columns (`1` mobile, `2` tablet, `3–4` desktop), loading skeletons, error retry state, empty search state, and multi-quantity selector on each card, and verify responsive rendering and states across mobile and desktop viewports.

## 4. Shopping Cart, Multi-Quantity Updates, Total Quantity & Notifications (`shopping-cart`)

- [x] 4.1 Create route-private `_components/shop-header.tsx` and `_components/cart-sheet.tsx` displaying the total cart item quantity (`sum of item.quantity`) in the header badge and cart summary along with total price in `NT$`, and verify adding multiple products accurately updates total quantity and total price.
- [x] 4.2 Implement multi-quantity update controls in `_components/cart-sheet.tsx` and `_components/product-card.tsx` supporting both `-1`/`+1` steppers and direct numeric quantity input (`1..99`) backed by functional state updates (`setCart(prev => ...)`), and verify updating quantity by multiples (e.g. setting quantity to `5` or adding `3` at once) updates item subtotals and cart totals accurately without stale state loss.
- [x] 4.3 Integrate `Sonner` toast notifications in `products-page-content.tsx` when adding items to the shopping cart, and verify a toast notification appears with the product name and added quantity on every add-to-cart action.
- [x] 4.4 Create route-private `_components/remove-item-dialog.tsx` (`AlertDialog`) triggered when clicking the item delete button or reducing a cart item's quantity to `0`, and verify confirming removes the item while canceling preserves the item with its previous valid quantity (`>= 1`).

## 5. Checkout Confirmation Dialog & Route Orchestration (`checkout-flow`)

- [x] 5.1 Create route-private `_components/checkout-dialog.tsx` (`Dialog`/`AlertDialog`) showing the order summary (line items, total quantity, total `NT$` amount) and binding "Confirm Checkout" to `useInsertOne` from `hooks/transactions/use-checkout/`, and verify the dialog opens on checkout click, shows a loading state during the 2000ms simulated mutation, clears the cart on completion, and shows a success notification.
- [x] 5.2 Assemble `apps/web/app/(shop)/products/products-page-content.tsx` (Client Component orchestrator) and `apps/web/app/(shop)/products/page.tsx` (Server Component thin `Suspense` wrapper with `PageSkeleton` fallback) plus root `apps/web/app/page.tsx`, and verify `pnpm build` (or `npm run build`) and end-to-end user flows pass all architectural checklists in `fe-architecture/SKILL.md`.

## Workflow follow-up

- Archive the change with `openspec archive` after implementation and review are complete.

## 6. Original HTML Visual Fidelity

- [x] 6.1 Restore the original storefront and drawer styling from `docs/index.html`, preserve mandatory search/quantity/dialog behavior, compare desktop and mobile rendering, and verify unit tests, typecheck, and shopping E2E flows.
