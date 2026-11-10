"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ShopHeaderProps = {
  totalQuantity: number;
  onOpenCart: () => void;
  children: ReactNode;
};

export function ShopHeader({ totalQuantity, onOpenCart, children }: ShopHeaderProps) {
  return (
    <header className="mb-[30px] flex flex-wrap items-center justify-between gap-4 bg-[#333] p-5 text-white">
      <h1 className="text-[32px] font-bold">精品商店</h1>
      <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:px-4">{children}</div>
      <Button type="button" className="relative h-auto rounded-[5px] bg-[#ff6b6b] p-2.5 text-base font-normal text-white hover:bg-[#ff5656]" onClick={onOpenCart} aria-label={`開啟購物車，共 ${totalQuantity} 件商品`}>
        <span aria-hidden="true">🛒</span> 購物車
        <Badge className="absolute -right-[5px] -top-[5px] flex size-[25px] min-w-[25px] justify-center rounded-full border-0 bg-white p-0 text-xs font-bold text-[#ff6b6b]" aria-label="購物車總數量">{totalQuantity}</Badge>
      </Button>
    </header>
  );
}
