"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/language-provider";

type ShopHeaderProps = {
  totalQuantity: number;
  onOpenCart: () => void;
  children: ReactNode;
};

export function ShopHeader({ totalQuantity, onOpenCart, children }: ShopHeaderProps) {
  const { locale, setLocale, t } = useLanguage();
  return (
    <header className="mb-[30px] flex flex-wrap items-center justify-between gap-4 bg-[#333] p-5 text-white">
      <h1 className="text-[32px] font-bold">{t("shopName")}</h1>
      <div className="order-last w-full sm:order-none sm:w-auto sm:flex-1 sm:px-4">{children}</div>
      <div className="flex items-center gap-3">
        <label className="sr-only" htmlFor="language-selector">{t("selectLanguage")}</label>
        <select id="language-selector" value={locale} onChange={(event) => setLocale(event.target.value as typeof locale)} className="h-10 rounded border border-white/40 bg-[#333] px-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          <option value="zh-TW">中文（台灣）</option>
          <option value="id">Bahasa Indonesia</option>
        </select>
        <Button type="button" className="relative h-auto rounded-[5px] bg-[#ff6b6b] p-2.5 text-base font-normal text-white hover:bg-[#ff5656]" onClick={onOpenCart} aria-label={t("openCartAriaLabel", { count: totalQuantity })}>
          <span aria-hidden="true">🛒</span> {t("cartButton")}
          <Badge className="absolute -right-[5px] -top-[5px] flex size-[25px] min-w-[25px] justify-center rounded-full border-0 bg-white p-0 text-xs font-bold text-[#ff6b6b]" aria-label={t("cartTotalQuantityAriaLabel")}>{totalQuantity}</Badge>
        </Button>
      </div>
    </header>
  );
}
