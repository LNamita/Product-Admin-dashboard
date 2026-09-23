"use client";

import { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import useProductQuery from "@/hooks/useProductQuery";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import useLocalChanges from "@/hooks/useLocalChanges";
import useDeleteProduct from "@/hooks/useDeleteProduct";
import { applyToList } from "@/lib/localChanges";
import { getTotalPages } from "@/lib/pagination";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/StateViews";
import Button from "@/components/ui/Button";
import ProductsToolbar from "./ProductsToolbar";
import ProductTable from "./ProductTable";
import ProductCards from "./ProductCards";
import Pagination from "./Pagination";
import DeleteProductDialog from "./DeleteProductDialog";

export default function ProductsView() {
  const [query, setQuery] = useProductQuery();
  const { categories, loaded: categoriesLoaded } = useCategories();
  const changes = useLocalChanges();
  const { status, data, error, retry } = useProducts(query);
  const { target, askDelete, cancelDelete, confirmDelete, deleting } = useDeleteProduct();

  const view = useMemo(() => (data ? applyToList(data, query, changes) : null), [data, query, changes]);
  const totalPages = data ? getTotalPages(data.total, query.limit) : 1;
  const pageTooHigh = status === "success" && query.page > totalPages;

  // ?page=999 -> jump to the last page that really exists.
  useEffect(() => {
    if (pageTooHigh) setQuery({ page: totalPages }, { replace: true });
  }, [pageTooHigh, totalPages, setQuery]);

  // ?category=not-real -> drop the unknown category.
  useEffect(() => {
    if (categoriesLoaded && categories.length && query.category && !categories.some((c) => c.slug === query.category)) {
      setQuery({ category: "", page: 1 }, { replace: true });
    }
  }, [categoriesLoaded, categories, query.category, setQuery]);

  const handleSearch = useCallback((q) => setQuery({ q, category: "", page: 1 }, { replace: true }), [setQuery]);
  const handleCategory = (category) => setQuery({ category, q: "", page: 1 });
  const handleSort = (sortBy, order) => setQuery({ sortBy, order, page: 1 });
  const handleLimit = (limit) => setQuery({ limit, page: 1 });
  const handlePage = (page) => {
    setQuery({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const clearFilters = () => setQuery({ q: "", category: "", page: 1 });

  function renderContent() {
    if (status === "error") return <ErrorState message={error?.message} onRetry={retry} />;
    if (status === "loading" || !view || pageTooHigh) return <LoadingState label="Loading products…" />;

    if (view.products.length === 0 && data.total === 0) {
      const filtered = query.q || query.category;
      return (
        <EmptyState
          title="No products found"
          message={filtered ? "Try a different search word or category." : "There are no products yet."}
          action={filtered && <Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
        />
      );
    }

    const from = data.total === 0 ? 0 : data.skip + 1;
    const to = data.skip + data.products.length;

    return (
      <div className="space-y-4">
        {view.localCount > 0 && (
          <p className="text-xs text-indigo-700">
            {view.localCount} product{view.localCount > 1 ? "s" : ""} you added {view.localCount > 1 ? "are" : "is"} shown at the top.
          </p>
        )}
        {view.products.length === 0 ? (
          <EmptyState title="Nothing left on this page" message="You deleted every product on this page." />
        ) : (
          <>
            <ProductTable products={view.products} onDelete={askDelete} />
            <ProductCards products={view.products} onDelete={askDelete} />
          </>
        )}
        <Pagination
          page={query.page}
          totalPages={totalPages}
          limit={query.limit}
          from={from}
          to={to}
          total={data.total}
          onPageChange={handlePage}
          onLimitChange={handleLimit}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/products/new"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Add product
        </Link>
      </div>

      <ProductsToolbar
        query={query}
        categories={categories}
        onSearch={handleSearch}
        onCategoryChange={handleCategory}
        onSortChange={handleSort}
      />

      {renderContent()}

      <DeleteProductDialog product={target} deleting={deleting} onConfirm={confirmDelete} onCancel={cancelDelete} />
    </div>
  );
}
