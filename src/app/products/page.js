import { Suspense } from "react";
import ProductsView from "@/components/products/ProductsView";
import { LoadingState } from "@/components/ui/StateViews";

export const metadata = { title: "Products · Product Admin" };

export default function ProductsPage() {
  return (
    // ProductsView reads the URL with useSearchParams, which needs Suspense.
    <Suspense fallback={<LoadingState />}>
      <ProductsView />
    </Suspense>
  );
}
