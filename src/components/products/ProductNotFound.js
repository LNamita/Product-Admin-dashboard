import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
      <p className="text-6xl font-bold text-slate-300">404</p>
      <h1 className="text-xl font-semibold">Product not found</h1>
      <p className="text-sm text-slate-500">This product does not exist or was deleted.</p>
      <Link href="/products" className="text-sm font-medium text-indigo-600 hover:underline">
        ← Back to products
      </Link>
    </div>
  );
}
