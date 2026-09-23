"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useProduct from "@/hooks/useProduct";
import useDeleteProduct from "@/hooks/useDeleteProduct";
import { formatCategory, formatPrice } from "@/lib/format";
import { ErrorState, LoadingState } from "@/components/ui/StateViews";
import Button from "@/components/ui/Button";
import ImageGallery from "./ImageGallery";
import ReviewList from "./ReviewList";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import LocalBadge from "./LocalBadge";
import ProductNotFound from "./ProductNotFound";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductDetails({ id }) {
  const router = useRouter();
  const { status, product, error, retry } = useProduct(id);
  const { target, askDelete, cancelDelete, confirmDelete, deleting } = useDeleteProduct({
    onDeleted: () => router.replace("/products"),
  });

  if (status === "loading") return <LoadingState label="Loading product…" />;
  if (status === "notFound") return <ProductNotFound />;
  if (status === "error") return <ErrorState message={error?.message} onRetry={retry} />;

  // Show the thumbnail first if it is not already one of the images
  // (e.g. a new image URL was set in the edit form).
  const gallery = product.images ?? [];
  const images =
    product.thumbnail && !gallery.includes(product.thumbnail) ? [product.thumbnail, ...gallery] : gallery;

  return (
    <div className="space-y-8">
      <button onClick={() => router.back()} className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back
      </button>

      <div className="grid gap-8 md:grid-cols-2">
        <ImageGallery images={images} title={product.title} />

        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-500">
              {formatCategory(product.category)}
              {product.brand && ` · ${product.brand}`}
            </p>
            <h1 className="text-2xl font-semibold">
              {product.title}
              {product.isLocal && <LocalBadge />}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.discountPercentage > 0 && (
              <span className="rounded bg-emerald-50 px-2 py-0.5 text-sm font-medium text-emerald-700">
                -{product.discountPercentage}%
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Rating value={product.rating} />
            <StockBadge stock={product.stock} />
          </div>

          <p className="leading-relaxed text-slate-700">{product.description || "No description."}</p>

          <div className="flex gap-2 pt-2">
            <Link
              href={`/products/${product.id}/edit`}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Edit
            </Link>
            <Button variant="danger" onClick={() => askDelete(product)}>
              Delete
            </Button>
          </div>
        </div>
      </div>

      <ReviewList reviews={product.reviews} />

      <DeleteProductDialog product={target} deleting={deleting} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}
