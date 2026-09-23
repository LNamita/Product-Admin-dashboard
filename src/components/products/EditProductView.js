"use client";

import { useRouter } from "next/navigation";
import useProduct from "@/hooks/useProduct";
import { updateProduct } from "@/services/productService";
import { updateLocalProduct } from "@/lib/localChanges";
import { showToast } from "@/lib/toast";
import { ErrorState, LoadingState } from "@/components/ui/StateViews";
import ProductForm from "./ProductForm";
import ProductNotFound from "./ProductNotFound";

export default function EditProductView({ id }) {
  const router = useRouter();
  const { status, product, error, retry } = useProduct(id);

  if (status === "loading") return <LoadingState label="Loading product…" />;
  if (status === "notFound") return <ProductNotFound />;
  if (status === "error") return <ErrorState message={error?.message} onRetry={retry} />;

  async function handleSubmit(payload) {
    // Products made in this app do not exist on the server, so a PUT would 404.
    if (!product.isLocal) await updateProduct(product.id, payload);
    updateLocalProduct(product.id, payload);
    showToast(`"${payload.title}" was saved.`);
    router.push(`/products/${product.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold">Edit product</h1>
      <ProductForm
        initialProduct={product}
        submitLabel="Save changes"
        cancelHref={`/products/${product.id}`}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
