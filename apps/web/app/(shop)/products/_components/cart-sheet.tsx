"use client";

import { useEffect, useState } from "react";
import type { CartItem, CartSummary } from "@repo/types";
import { cartQuantitySchema } from "@repo/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/utils/format-currency";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  summary: CartSummary;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onAdjustQuantity: (id: number, delta: number) => void;
  onRemove: (item: CartItem) => void;
  onCheckout: () => void;
}

function CartRow({ item, onUpdateQuantity, onAdjustQuantity, onRemove }: Pick<CartSheetProps, "onUpdateQuantity" | "onAdjustQuantity" | "onRemove"> & { item: CartItem }) {
  const [draft, setDraft] = useState(String(item.quantity));
  useEffect(() => setDraft(String(item.quantity)), [item.quantity]);

  function commitQuantity() {
    if (!draft.trim()) {
      setDraft(String(item.quantity));
      return;
    }
    const quantity = Number(draft);
    if (Number.isFinite(quantity) && quantity <= 0) {
      setDraft(String(item.quantity));
      onRemove(item);
      return;
    }
    const result = cartQuantitySchema.safeParse(quantity);
    if (result.success) {
      onUpdateQuantity(item.product.id, quantity);
      setDraft(String(quantity));
    } else {
      setDraft(String(item.quantity));
    }
  }

  return (
    <li className="flex items-center border-b border-[#eee] py-[15px]" data-testid={`cart-item-${item.product.id}`}>
      <div aria-hidden="true" className="mr-[15px] flex size-[60px] shrink-0 items-center justify-center rounded bg-[#eee] text-xs text-[#999]">圖片</div>
      <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="mb-[5px] text-sm font-normal">{item.product.name}</h3>
          <p className="font-bold text-[#ff6b6b]">{formatCurrency(item.product.price)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => onRemove(item)} aria-label={`移除 ${item.product.name}`} className="shrink-0 text-muted-foreground hover:text-destructive">移除</Button>
      </div>
      <div className="mt-[5px] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="size-[25px] rounded-none bg-[#f0f0f0] p-0" aria-label={`減少 ${item.product.name} 數量`} onClick={() => onAdjustQuantity(item.product.id, -1)}>−</Button>
          <Input
            type="number"
            min={0}
            max={99}
            step={1}
            inputMode="numeric"
            aria-label={`${item.product.name} 購物車數量`}
            className="mx-1 h-[25px] w-9 rounded-none border-0 bg-transparent p-0 text-center text-sm font-bold shadow-none"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitQuantity}
            onKeyDown={(event) => {
              if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); }
              if (event.key === "Escape") {
                setDraft(String(item.quantity));
                event.stopPropagation();
              }
            }}
          />
          <Button variant="ghost" size="icon" className="size-[25px] rounded-none bg-[#f0f0f0] p-0" disabled={item.quantity >= 99} aria-label={`增加 ${item.product.name} 數量`} onClick={() => onAdjustQuantity(item.product.id, 1)}>+</Button>
        </div>
        <span className="text-sm font-bold tabular-nums">{formatCurrency(item.product.price * item.quantity)}</span>
      </div>
      </div>
    </li>
  );
}

export function CartSheet({ open, onOpenChange, items, summary, onUpdateQuantity, onAdjustQuantity, onRemove, onCheckout }: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent overlayClassName="bg-transparent backdrop-blur-none" className="block h-full w-full max-w-[400px] overflow-y-auto border-0 bg-white p-5 shadow-[-2px_0_10px_rgba(0,0,0,0.1)]">
        <SheetHeader className="mb-5 border-b border-[#ddd] pb-[15px] text-left">
          <SheetTitle className="text-2xl font-bold">購物車</SheetTitle>
          <SheetDescription className="sr-only">共 {summary.totalQuantity} 件商品</SheetDescription>
        </SheetHeader>
        <div className="min-h-0">
          {items.length === 0 ? (
            <div className="mt-[50px] text-center text-[#999]">
              <h3 className="text-base font-normal">購物車還是空的</h3>
            </div>
          ) : (
            <ul>{items.map((item) => <CartRow key={item.product.id} item={item} onUpdateQuantity={onUpdateQuantity} onAdjustQuantity={onAdjustQuantity} onRemove={onRemove} />)}</ul>
          )}
        </div>
        <div className="mt-5 border-t-2 border-[#ddd] pt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-[#999]"><span>商品數量</span><span>{summary.totalQuantity} 件</span></div>
          <div className="text-center text-2xl font-bold text-[#333]">總計: {formatCurrency(summary.totalPrice)}</div>
          <Button className="mt-[15px] h-auto w-full rounded px-[15px] py-[15px] text-base font-bold" disabled={items.length === 0} onClick={onCheckout}>結帳</Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">模擬結帳，不會收取任何費用。</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
