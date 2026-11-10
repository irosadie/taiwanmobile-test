import { Suspense } from "react";
import { PageSkeleton } from "@/components/skeletons/page-skeleton";
import { ProductsPageContent } from "./(shop)/products/products-page-content";

export default function HomePage() {
  return <Suspense fallback={<PageSkeleton />}><ProductsPageContent /></Suspense>;
}
