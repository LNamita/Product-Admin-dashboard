import Link from "next/link";

export default function RowActions({ product, onDelete }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Link href={`/products/${product.id}/edit`} className="font-medium text-indigo-600 hover:underline">
        Edit
      </Link>
      <button onClick={() => onDelete(product)} className="font-medium text-red-600 hover:underline">
        Delete
      </button>
    </div>
  );
}
