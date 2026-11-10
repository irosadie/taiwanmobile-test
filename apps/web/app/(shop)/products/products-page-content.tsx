"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CartItem, ProductResponse } from "@repo/types";
import { cartQuantitySchema, checkoutPayloadSchema } from "@repo/schemas";
import { toast } from "sonner";
import { useDataTable } from "@/hooks/transactions/use-products";
import { useInsertOne } from "@/hooks/transactions/use-checkout";
import { useDebounce } from "@/hooks/utility/use-debounce";
import { useQueryParam } from "@/hooks/utility/use-query-param";
import { useLanguage } from "@/providers/language-provider";
import { ShopHeader } from "./_components/shop-header";
import { ProductSearchBar } from "./_components/product-search-bar";
import { ProductGrid } from "./_components/product-grid";
import { CartSheet } from "./_components/cart-sheet";
import { RemoveItemDialog } from "./_components/remove-item-dialog";
import { CheckoutDialog } from "./_components/checkout-dialog";

export function ProductsPageContent() {
  const { t } = useLanguage();
  const [urlSearch, setUrlSearch] = useQueryParam("search");
  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = useDebounce(search);
  const products = useDataTable({ search: debouncedSearch });
  const checkout = useInsertOne();
  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const checkoutLock = useRef(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState<CartItem | null>(null);
  useEffect(() => { setUrlSearch(debouncedSearch); }, [debouncedSearch, setUrlSearch]);
  useEffect(() => { setSearch(urlSearch); }, [urlSearch]);

  const summary = useMemo(() => cart.reduce((sum, item) => ({
    totalQuantity: sum.totalQuantity + item.quantity,
    totalPrice: sum.totalPrice + item.product.price * item.quantity,
  }), { totalQuantity: 0, totalPrice: 0 }), [cart]);

  function updateCart(update: (previous: CartItem[]) => CartItem[]) {
    if (checkoutLock.current) return;
    cartRef.current = update(cartRef.current);
    setCart(previous => update(previous));
  }
  function add(product: ProductResponse, quantity: number) {
    if (checkoutLock.current || !cartQuantitySchema.safeParse(quantity).success) return;
    const existing = cartRef.current.find(item => item.product.id === product.id);
    if (!cartQuantitySchema.safeParse((existing?.quantity ?? 0) + quantity).success) {
      toast.error(t("maxQuantityError")); return;
    }
    updateCart(previous => existing
      ? previous.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...previous, { product, quantity }]);
    const total = cartRef.current.reduce((sum, item) => sum + item.quantity, 0);
    toast.success(t("addedToCart", { product: product.name, quantity }), {
      description: t("cartItemCount", { count: total }),
      action: { label: t("viewCart"), onClick: () => setCartOpen(true) },
    });
  }
  function updateQuantity(id: number, quantity: number) {
    const item = cartRef.current.find(item => item.product.id === id);
    if (checkoutLock.current || !item) return;
    if (quantity === 0) { setRemoveItem(item); return; }
    if (!cartQuantitySchema.safeParse(quantity).success) return;
    updateCart(previous => previous.map(item => item.product.id === id ? { ...item, quantity } : item));
  }
  function adjustQuantity(id: number, delta: number) {
    const item = cartRef.current.find(item => item.product.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + delta);
  }
  function confirmCheckout() {
    if (checkoutLock.current) return;
    const payload = checkoutPayloadSchema.safeParse({ items: cartRef.current.map(item => ({ productId: item.product.id, quantity: item.quantity })) });
    if (!payload.success) { toast.error(t("cartValidationError")); return; }
    checkoutLock.current = true;
    checkout.mutate(payload.data, {
      onSuccess: () => {
        checkoutLock.current = false;
        updateCart(() => []);
        setCheckoutOpen(false); setCartOpen(false);
        toast.success(t("checkoutSuccess"));
      },
      onError: () => { toast.error(t("checkoutFailure")); },
      onSettled: () => { checkoutLock.current = false; },
    });
  }
  return (
    <div className="mx-auto w-full max-w-[1200px] bg-white p-2.5 min-[769px]:p-5">
      <ShopHeader totalQuantity={summary.totalQuantity} onOpenCart={() => setCartOpen(true)}>
        <ProductSearchBar value={search} onChange={setSearch} onClear={() => setSearch("")} />
      </ShopHeader>
      <main id="catalog" aria-label={t("productList")}>
        <ProductGrid products={products.data ?? []} isPending={products.isPending} isError={products.isError} onRetry={() => void products.refetch()} onClearSearch={() => setSearch("")} onAdd={add} />
      </main>
      <CartSheet open={cartOpen} onOpenChange={open => { if (!checkoutLock.current) setCartOpen(open); }} items={cart} summary={summary} onUpdateQuantity={updateQuantity} onAdjustQuantity={adjustQuantity} onRemove={setRemoveItem} onCheckout={() => setCheckoutOpen(true)} />
      <RemoveItemDialog item={removeItem} onOpenChange={open => { if (!open) setRemoveItem(null); }} onConfirm={() => { if (removeItem) updateCart(previous => previous.filter(item => item.product.id !== removeItem.product.id)); setRemoveItem(null); }} />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} items={cart} summary={summary} isPending={checkout.isPending} onConfirm={confirmCheckout} />
    </div>
  );
}
