# Proposal

## Why

The legacy single-file product display page (`docs/index.html`) suffers from 16 documented architectural, UX, and performance defects—including broken mobile responsiveness (`1200px` fixed width), global variable pollution, imperative full-DOM re-renders, un-debounced search logic without a UI input, inability to update item quantities in multiples, lack of user feedback notifications when adding items, and abrupt `alert()`-based checkout/removal without confirmation dialogs or loading states. Migrating this application to a modern **Next.js App Router** stack with **shadcn/ui** and **Tailwind CSS** under the strict `fe-architecture` standard resolves these defects while delivering a maintainable, type-safe shopping experience.

## What Changes

- **Migrate Legacy HTML/JS to Next.js App Router + shadcn/ui + Tailwind CSS**: Replace imperative DOM manipulation and global state in `docs/index.html` with a modular Next.js App Router architecture (`apps/web`, `packages/types`, `packages/schemas`) adhering strictly to the `fe-architecture` skill contracts.
- **Responsive Product Catalog & Debounced Search Box**:
  - Implement a responsive product grid (`1` column on mobile, `2` on tablet, `3–4` on desktop) replacing the fixed `1200px` layout.
  - Add an interactive search box with debounced keyword filtering (`utils/debounce` and URL query sync via `useQueryParam`) so users can easily find products by name without full-DOM thrashing.
  - Provide loading skeletons, empty search states, and error recovery states powered by React Query (`hooks/transactions/use-products/`).
- **Enhanced Shopping Cart & Multi-Quantity Updates**:
  - Implement a slide-over shopping cart drawer (`Sheet` component) with automatic focus management and outside-click dismissal.
  - Fix the inability to update quantities by multiples: support direct numeric quantity input, multi-quantity selection when adding/updating items, and functional state updates so rapid or batch updates (`+N`, `-N`, or direct input of `N`) update accurately without stale state issues.
  - Calculate and prominently display the **total quantity** of items across the user's shopping cart in both the header badge and cart summary, alongside the total price (`NT$`).
- **Toast Notifications on Add-to-Cart**:
  - Trigger non-blocking toast notifications (`Sonner` / `Toast`) whenever a user adds one or multiple items to the shopping cart, displaying the product name, added quantity, and current cart count.
- **Confirmation Dialogs for Item Removal & Checkout**:
  - Create a confirmation dialog (`AlertDialog`) before removing an item from the shopping cart (triggered via the item delete button or when reducing an item's quantity to `0`).
  - Create a checkout confirmation dialog (`Dialog` / `AlertDialog`) displaying the order summary (line items, total quantity, and total price in `NT$`) with simulated async checkout processing, loading state indicators, success notification, and cart reset.

## Capabilities

### New Capabilities
- `fe-architecture-foundation`: Next.js App Router layered architecture (`page.tsx` Suspense wrapper, `*-page-content.tsx` client orchestrator, `_components/`, `components/`, `hooks/transactions/`, `services/axios/`, `constants/`, `/api/proxy/[...path]`, `packages/types`, and `packages/schemas`).
- `product-catalog`: Product list display, responsive grid layout, loading/error/empty states, and debounced product search box functionality.
- `shopping-cart`: Shopping cart drawer management, adding items with toast notifications, updating item quantities by multiples or steppers, counting total cart quantity and total price, and item removal confirmation dialog.
- `checkout-flow`: Checkout confirmation dialog with order summary, simulated async checkout mutation with loading state, error handling, and post-checkout cart reset.

### Modified Capabilities
<!-- None - greenfield OpenSpec capability set -->

## Impact

- **Frontend Application (`apps/web`)**:
  - `app/(shop)/products/page.tsx` (or root `app/page.tsx` wrapper) and `products-page-content.tsx`
  - `app/(shop)/products/_components/` (route-private product grid, product card, search bar, cart drawer, remove-item dialog, checkout dialog)
  - `components/ui/` (shared shadcn/ui primitives: `Button`, `Card`, `Input`, `Badge`, `Sheet`, `Dialog`, `AlertDialog`, `Skeleton`, `Sonner`)
  - `hooks/transactions/use-products/` and `hooks/transactions/use-checkout/`
  - `hooks/utility/` (`use-query-param.ts`, `use-debounce.ts`)
  - `services/axios/`, `constants/api-routers.ts`, `constants/query-keys.ts`, and `app/api/proxy/[...path]/route.ts`
- **Shared Packages**:
  - `packages/types/`: Product, CartItem, CartSummary, and Checkout response TypeScript interfaces.
  - `packages/schemas/`: Zod schemas for quantity updates, search filter params, and checkout payloads.
