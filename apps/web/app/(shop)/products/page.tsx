import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { ProductsPageContent } from "./products-page-content";

export default function ProductsPage() {
  return <Suspense fallback={<PageSkeleton />}><ProductsPageContent /></Suspense>;
}
