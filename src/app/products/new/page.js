"use client";

import { useRouter } from "next/navigation";
import { addProduct } from "@/services/productService";
import { addLocalProduct } from "@/lib/localChanges";
import { showToast } from "@/lib/toast";
import ProductForm from "@/components/products/ProductForm";

export default function NewProductPage() {
  const router = useRouter();

  async function handleSubmit(payload) {
    // The API checks the data and answers with a fake id (always 195),
    // but does not save it. We keep our own copy with a unique local id.
    const saved = await addProduct(payload);
    const { id: _serverId, ...rest } = saved;
    const product = addLocalProduct({ ...payload, ...rest });
    showToast(`"${product.title}" was added.`);
    router.push("/products");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <h1 className="text-2xl font-semibold">Add product</h1>
      <ProductForm submitLabel="Add product" cancelHref="/products" onSubmit={handleSubmit} />
    </div>
  );
}
