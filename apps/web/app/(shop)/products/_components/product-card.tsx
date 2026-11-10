"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { ProductResponse } from "@repo/types";
import { cartQuantitySchema } from "@repo/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format-currency";
import { useLanguage } from "@/providers/language-provider";

type ProductCardProps = {
  product: ProductResponse;
  onAdd: (product: ProductResponse, quantity: number) => void;
};

export function ProductCard({ product, onAdd }: ProductCardProps) {
  const { locale, t } = useLanguage();
  const [selection, setSelection] = useState({ quantity: 1, draft: "1" });
  const { quantity, draft } = selection;

  function commitQuantity() {
    const parsed = cartQuantitySchema.safeParse(draft.trim() ? Number(draft) : NaN);
    if (parsed.success) {
      setSelection({ quantity: parsed.data, draft: String(parsed.data) });
      return parsed.data;
    }
    setSelection((previous) => ({ ...previous, draft: String(previous.quantity) }));
    return quantity;
  }

  function stepQuantity(change: number) {
    setSelection((previous) => {
      const next = Math.max(1, Math.min(99, previous.quantity + change));
      return { quantity: next, draft: String(next) };
    });
  }

  return (
    <Card className="gap-0 rounded-[8px] border-[#ddd] bg-white p-[15px] shadow-[0_2px_4px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5">
      <div role="img" aria-label={`${product.name} ${t("productPreview")}`} className="legacy-product-image mb-2.5 flex h-[200px] w-full items-center justify-center rounded bg-[#eee] text-[#999]">{t("productImageLoading")}</div>
      <CardContent className="p-0">
        <h3 className="mb-2 text-lg leading-[normal] font-bold text-[#333]">{product.name}</h3>
        <div className="mb-[15px] flex flex-wrap items-center justify-between gap-2">
          <p className="text-xl leading-[normal] font-bold text-[#ff6b6b]">{formatCurrency(product.price, locale)}</p>
          <div className="flex items-center" aria-label={t("selectQuantity")}>
            <Button type="button" variant="ghost" size="icon" className="size-[25px] rounded-none bg-[#f0f0f0] p-0" aria-label={t("decreaseProductQuantity", { product: product.name })} disabled={quantity <= 1} onClick={() => stepQuantity(-1)}><Minus aria-hidden="true" className="size-3" /></Button>
            <Input type="number" inputMode="numeric" min={1} max={99} step={1} aria-label={t("productQuantity", { product: product.name })} value={draft} onChange={(event) => { const value = event.target.value; setSelection((previous) => ({ ...previous, draft: value })); }} onBlur={commitQuantity} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} className="h-[25px] w-8 rounded-none border-0 bg-transparent p-0 text-center text-sm font-bold shadow-none" />
            <Button type="button" variant="ghost" size="icon" className="size-[25px] rounded-none bg-[#f0f0f0] p-0" aria-label={t("increaseProductQuantity", { product: product.name })} disabled={quantity >= 99} onClick={() => stepQuantity(1)}><Plus aria-hidden="true" className="size-3" /></Button>
          </div>
        </div>
        <Button type="button" className="h-auto w-full rounded bg-[#4caf50] px-[15px] py-2.5 text-sm font-normal text-white hover:bg-[#45a049]" aria-label={t("addProductToCartAriaLabel", { product: product.name })} onClick={() => onAdd(product, commitQuantity())}>{t("addToCart")}</Button>
      </CardContent>
    </Card>
  );
}
