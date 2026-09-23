import Link from "next/link";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import RowActions from "./RowActions";
import LocalBadge from "./LocalBadge";

// Mobile view (below md). The desktop view is ProductTable.
export default function ProductCards({ products, onDelete }) {
  return (
    <ul className="grid gap-3 md:hidden">
      {products.map((product) => (
        <li key={product.id} className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
          <Link href={`/products/${product.id}`} className="shrink-0">
            <ProductImage src={product.thumbnail} alt={product.title} className="h-20 w-20 rounded-lg" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${product.id}`} className="block truncate font-medium">
              {product.title}
              {product.isLocal && <LocalBadge />}
            </Link>
            <p className="text-xs text-slate-500">{formatCategory(product.category)}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold">{formatPrice(product.price)}</span>
              <Rating value={product.rating} />
              <StockBadge stock={product.stock} />
            </div>
            <div className="mt-2">
              <RowActions product={product} onDelete={onDelete} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
