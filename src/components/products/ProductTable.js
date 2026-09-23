import Link from "next/link";
import { formatCategory, formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import Rating from "./Rating";
import StockBadge from "./StockBadge";
import RowActions from "./RowActions";
import LocalBadge from "./LocalBadge";

const COLUMNS = ["Product", "Category", "Price", "Rating", "Stock", ""];

// Desktop view (md and up). The mobile view is ProductCards.
export default function ProductTable({ products, onDelete }) {
  return (
    <div className="hidden overflow-x-auto rounded-xl bg-white ring-1 ring-slate-200 md:block">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {COLUMNS.map((col) => (
              <th key={col} scope="col" className="px-4 py-3 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link href={`/products/${product.id}`} className="flex items-center gap-3">
                  <ProductImage src={product.thumbnail} alt={product.title} className="h-12 w-12 shrink-0 rounded-lg" />
                  <span className="font-medium hover:text-indigo-600">
                    {product.title}
                    {product.isLocal && <LocalBadge />}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{formatCategory(product.category)}</td>
              <td className="px-4 py-3 font-medium">{formatPrice(product.price)}</td>
              <td className="px-4 py-3">
                <Rating value={product.rating} />
              </td>
              <td className="px-4 py-3">
                <StockBadge stock={product.stock} />
              </td>
              <td className="px-4 py-3">
                <RowActions product={product} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
