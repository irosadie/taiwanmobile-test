"use client";

import { PackageSearch, RefreshCw } from "lucide-react";
import type { ProductResponse } from "@repo/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: ProductResponse[];
  isPending: boolean;
  isError: boolean;
  onRetry: () => void;
  onClearSearch: () => void;
  onAdd: (product: ProductResponse, quantity: number) => void;
};

export function ProductGrid({ products, isPending, isError, onRetry, onClearSearch, onAdd }: ProductGridProps) {
  if (isPending) {
    return (
      <div aria-label="商品載入中" aria-busy="true" className="mb-[30px] grid grid-cols-1 gap-2.5 sm:grid-cols-2 min-[769px]:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => <div key={index} className="overflow-hidden rounded-lg border bg-white"><Skeleton className="h-[200px] rounded-none" /><div className="space-y-4 p-5"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-5 w-1/2" /><Skeleton className="mt-8 h-10 w-full" /></div></div>)}
      </div>
    );
  }
  if (isError) {
    return <div role="alert" className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed bg-white px-6 text-center"><RefreshCw aria-hidden="true" className="mb-4 size-8 text-muted-foreground" /><h3 className="font-semibold">商品載入失敗</h3><p className="mb-5 mt-2 text-sm text-muted-foreground">暫時無法取得商品，請稍後再試。</p><Button type="button" variant="outline" onClick={onRetry}>重新載入</Button></div>;
  }
  if (!products.length) {
    return <div role="status" className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed bg-white px-6 text-center"><PackageSearch aria-hidden="true" className="mb-4 size-10 stroke-[1.25] text-muted-foreground" /><h3 className="font-semibold">找不到符合的商品</h3><p className="mb-5 mt-2 text-sm text-muted-foreground">試試其他關鍵字，或看看全部精選商品。</p><Button type="button" variant="outline" onClick={onClearSearch}>清除搜尋</Button></div>;
  }
  return <div aria-label="商品列表" className="mb-[30px] grid grid-cols-1 gap-2.5 sm:grid-cols-2 min-[769px]:gap-5 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} onAdd={onAdd} />)}</div>;
}
