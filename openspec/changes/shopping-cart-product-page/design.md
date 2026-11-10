# Design

## Context

The reference implementation in `docs/index.html` is a single-file Traditional Chinese (`zh-TW`) storefront ("精品商店") containing 8 products (`無線藍牙耳機`, `智慧手錶`, `便攜式充電器`, `無線滑鼠`, `機械鍵盤`, `網路攝影機`, `USB隨身碟`, `桌面擴音器`) priced in `NT$`. It documents 16 code/UX defects (`問題1`–`問題16`) and requires 5 mandatory enhancements (search box UI, add-to-cart toast notifications, total cart quantity counting, multi-quantity updates, and confirmation dialogs for both item removal and checkout). See `proposal.md` for motivation.

All frontend code MUST strictly follow the `fe-architecture` skill (`apps/web`, `packages/types`, `packages/schemas`).

## Goals / Non-Goals

**Goals:**
- Implement the full `fe-architecture` layer map and end-to-end data flow (`page.tsx` → `products-page-content.tsx` → `_components/` + `hooks/transactions/` → `services/axios/` → `/api/proxy/[...path]`).
- Resolve all 16 documented defects in `docs/index.html` using Next.js App Router, React Query (`@tanstack/react-query`), Tailwind CSS, and shadcn/ui.
- Deliver all 5 mandatory tasks with deterministic state management, Zod schema validation, and accessible modal/drawer primitives.

**Non-Goals:**
- Persistent external database or payment gateway integration (checkout and product catalog remain simulated via the internal Next.js BFF API routes with realistic latency).
- Multi-user authentication enforcement on the public storefront page (though `auth.ts`, `proxy.ts`, and `/api/proxy/[...path]/route.ts` follow the `fe-architecture` structure).

## Decisions

### 1. Workspace & Layer Structure (`fe-architecture` Compliance)
- **Decision**: Organize the repository as a workspace containing `apps/web`, `packages/types` (`@repo/types`), and `packages/schemas` (`@repo/schemas`).
  ```
  apps/web/
  ├── app/
  │   ├── (shop)/
  │   │   └── products/
  │   │       ├── page.tsx                      → Server Component (thin Suspense wrapper only)
  │   │       ├── products-page-content.tsx     → Client Component (route orchestration, cart & modal states)
  │   │       └── _components/                  → Route-private components
  │   │           ├── shop-header.tsx           → Store header, search trigger/bar, cart button + total quantity badge
  │   │           ├── product-search-bar.tsx    → Debounced search input with clear button
  │   │           ├── product-grid.tsx          → Responsive 1/2/3/4-col grid + empty/error states
  │   │           ├── product-card.tsx          → Product card with multi-quantity selector & Add to Cart button
  │   │           ├── cart-sheet.tsx            → Slide-over Sheet showing cart items, multi-quantity input, total quantity & price
  │   │           ├── remove-item-dialog.tsx    → AlertDialog confirming item removal from cart
  │   │           └── checkout-dialog.tsx       → Dialog/AlertDialog confirming checkout with order summary & loading state
  │   ├── api/
  │   │   ├── (auth)/auth/[...nextauth]/route.ts → Thin NextAuth route handler
  │   │   └── proxy/[...path]/route.ts          → Internal BFF proxy forwarding/handling `/products` and `/checkout`
  │   └── page.tsx                              → Root redirect or entry to `/products`
  ├── auth.ts                                   → NextAuth configuration
  ├── proxy.ts                                  → Edge route protection helper
  ├── components/
  │   ├── ui/                                   → Shared shadcn/ui components (button, card, input, badge, sheet, dialog, alert-dialog, skeleton, sonner)
  │   └── skeletons/
  │       └── page-skeleton.tsx                 → Suspense & loading skeleton fallback
  ├── hooks/
  │   ├── transactions/
  │   │   ├── use-products/
  │   │   │   ├── use-data-table.ts             → React Query useQuery fetching filtered product list
  │   │   │   ├── use-get-one.ts                → React Query useQuery fetching single product by ID
  │   │   │   └── index.ts
  │   │   └── use-checkout/
  │   │       ├── use-insert-one.ts             → React Query useMutation for simulated checkout submission
  │   │       └── index.ts
  │   └── utility/
  │       ├── use-query-param.ts                → URL search param sync hook (`?search=...`)
  │       └── use-debounce.ts                   → Debounce value hook (300ms)
  ├── services/
  │   └── axios/
  │       └── index.ts                          → Shared Axios instance with baseURL `/api/proxy` and response interceptor
  ├── constants/
  │   ├── api-routers.ts                        → `products.index: '/products'`, `products.getOne: '/products/:id'`, `checkout.create: '/checkout'`
  │   └── query-keys.ts                         → `products.index: 'productsIndex'`, `products.detail: 'productsDetail'`
  ├── types/generals/
  │   └── index.ts                              → `DataTableParams`, `DataTableResponse<T>`, UI modal state types
  ├── configs/
  │   └── index.ts                              → Environment and app constants
  ├── providers/
  │   └── query-provider.tsx                    → TanStack QueryClientProvider + Sonner Toaster provider
  └── utils/
      ├── debounce.ts                           → Debounce utility function
      ├── path-variable.ts                      → `:id` path replacement utility
      └── format-currency.ts                    → `NT$` currency formatter
  ```
- **Rationale**: Directly satisfies every rule in `fe-architecture/SKILL.md`. `page.tsx` remains a pure Server Component with `<Suspense fallback={<PageSkeleton />}>`, while `products-page-content.tsx` orchestrates hooks and state without ever calling `axios` or `fetch` directly.
- **Alternatives Considered**: Single-app flat `src/` directory without `packages/types` or `packages/schemas`. Rejected because `fe-architecture` explicitly mandates `packages/types` (`@repo/types`) and `packages/schemas` (`@repo/schemas`).

### 2. Fixing Quantity Updates by Multiples & Functional Cart State
- **Decision**:
  1. **Functional State Updates**: All cart state updates in `products-page-content.tsx` (or a dedicated cart utility hook) use React functional state setters (`setCart((prev) => ...)`), preventing stale state closures during rapid clicks or batch updates.
  2. **Multi-Quantity Support in Two Places**:
     - **Product Card**: Provide a quantity selector (`1`..`99`, with `-`/`+` buttons and direct numeric `<Input type="number" />`) next to "Add to Cart" so users can add multiples of an item in one action (`addToCart(product, quantityToAdd)`).
     - **Cart Sheet Item Row**: Replace the read-only `<span class="quantity-display">` between `-` and `+` buttons with an editable numeric `<Input type="number" min={1} max={99} />` (validated with `cartQuantitySchema` from `@repo/schemas`) plus quick multiple steppers (`-1` / `+1` and direct multi-digit entry).
  3. **Zero/Removal Interception**: If a user clicks `-` when `quantity === 1`, types `0` into the quantity input, or clicks the trash/remove icon button, the cart item is NOT immediately spliced. Instead, `pendingRemoveItem` state is set, opening `RemoveItemDialog` (`AlertDialog`). Only upon clicking "Confirm" is the item removed; clicking "Cancel" leaves the item at its existing valid quantity (`>= 1`).
- **Rationale**: Directly addresses the mandatory task *"Fix quantity couldn't update by multiples"* and *"Create dialog window when user want to checkout or remove item from shopping cart"*.

### 3. Counting Total Cart Quantity vs. Distinct Items
- **Decision**: Compute cart totals via `useMemo` from `cart`:
  - `totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0)`
  - `totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)`
  Display `totalQuantity` in the header cart badge, the Cart Sheet header/footer summary (`共 X 件商品`), and the Checkout Confirmation Dialog.
- **Rationale**: Satisfies *"Count total quantity for user's shopping cart"* and avoids the legacy `updateCartDisplay()` imperative DOM recalculation (`問題11`).

### 4. Debounced Search Box with URL Query Parameter Sync
- **Decision**: Implement `ProductSearchBar` in `_components/product-search-bar.tsx` bound to local input state, debounced via `useDebounce(searchTerm, 300)` (or `utils/debounce`), synced with URL query parameters via `hooks/utility/use-query-param.ts`, and passed into `useDataTable({ search: debouncedSearch })` in `hooks/transactions/use-products/use-data-table.ts`.
- **Rationale**: Fixes `問題9` (un-debounced search function and missing search input in HTML) while following the `fe-architecture` data flow contract.

### 5. Toast Notifications on Add-to-Cart (`Sonner`)
- **Decision**: Use shadcn/ui `Sonner` (`toast.success(...)`) triggered when `handleAddToCart(product, quantity)` executes. The toast displays the product name, added quantity (`+${quantity}`), and current total quantity in cart, with a quick action button to open the cart drawer.
- **Rationale**: Fixes `問題10` (no user feedback after adding to cart) and satisfies *"Create notifications when user add item to the shopping cart"*.

### 6. Checkout Confirmation Dialog & Async Mutation (`use-checkout`)
- **Decision**:
  - Clicking "結帳 (Checkout)" in `CartSheet` opens `CheckoutDialog` (`_components/checkout-dialog.tsx`).
  - `CheckoutDialog` displays the itemized order summary, `totalQuantity`, and `totalPrice` (`NT$`).
  - Confirming triggers `useInsertOne()` from `hooks/transactions/use-checkout/use-insert-one.ts`, which sends a `POST` request via `axiosInstance` to `apiRouters.checkout.create` (`/api/proxy/checkout`).
  - The BFF proxy route simulates the 2000ms processing delay (matching `docs/index.html`), returning a typed `CheckoutResponse`.
  - While `isPending` is true, dialog buttons show a spinner and are disabled (`問題12`). On `onSuccess`, the cart is cleared, both the dialog and cart drawer close, and a success toast notification is shown.

## Risks / Trade-offs

- **[Risk] Rapid numeric input typing in Cart Sheet could trigger premature `0` removal dialog while user is mid-typing (e.g., clearing `1` before typing `5`)** → **Mitigation**: Buffer the local text input inside the cart item row and commit/validate the numeric value on `onBlur` or `Enter` key (while `+` and `-` buttons commit immediately). If the committed value on blur/Enter is `<= 0`, open the `RemoveItemDialog`; if empty/NaN on blur, revert to the previous valid quantity.
- **[Risk] Simulated BFF latency (1500ms products load, 2000ms checkout) could feel slow during repeated search filtering** → **Mitigation**: Apply initial 1500ms latency on initial catalog fetch or handle instantaneous client-side/cached filtering alongside React Query `placeholderData: keepPreviousData` so search feels responsive after initial load.

### Visual fidelity correction
The supplied `docs/index.html` is the visual source of truth. Preserve its 1200px white container, #333 header, #ff6b6b cart/price/checkout accents, #4caf50 add buttons, 200px gray image placeholders, 8px card corners, 20px desktop grid gaps, and 400px drawer. Required search sits in the header and quantity controls share the price row. Remove the earlier editorial hero/footer and icon-based product previews. Keep responsive sizing, accessible shadcn dialogs, and all existing data/state contracts. See `design-qa.md` for same-viewport source comparisons and verification.
