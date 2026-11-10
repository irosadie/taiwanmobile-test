"use client";

import type { CartItem, CartSummary } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/format-currency";

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  summary: CartSummary;
  isPending: boolean;
  onConfirm: () => void;
}

export function CheckoutDialog({ open, onOpenChange, items, summary, isPending, onConfirm }: CheckoutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { if (!isPending) onOpenChange(nextOpen); }}>
      <DialogContent
        className={`max-h-[90dvh] overflow-y-auto ${isPending ? "[&>button]:hidden" : ""}`}
        onEscapeKeyDown={(event) => { if (isPending) event.preventDefault(); }}
        onInteractOutside={(event) => { if (isPending) event.preventDefault(); }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl">確認結帳</DialogTitle>
          <DialogDescription>請確認以下訂單明細。這是模擬結帳，不會收取費用。</DialogDescription>
        </DialogHeader>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.product.id} className="flex items-center justify-between gap-4 py-4 text-sm">
              <div className="min-w-0"><p className="font-medium">{item.product.name}</p><p className="mt-1 text-muted-foreground">{formatCurrency(item.product.price)} × {item.quantity}</p></div>
              <span className="shrink-0 font-medium tabular-nums">{formatCurrency(item.product.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-border py-4">
          <span>共 {summary.totalQuantity} 件商品</span>
          <strong className="text-xl tabular-nums">{formatCurrency(summary.totalPrice)}</strong>
        </div>
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">{isPending ? "訂單處理中，請稍候…" : "確認後即可完成模擬訂單。"}</p>
        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => onOpenChange(false)}>取消</Button>
          <Button disabled={isPending || items.length === 0} onClick={onConfirm}>
            {isPending && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {isPending ? "處理中…" : "確認結帳"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
