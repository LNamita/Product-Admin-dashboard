export default function StockBadge({ stock = 0 }) {
  const style =
    stock === 0
      ? "bg-red-50 text-red-700"
      : stock < 10
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";
  const label = stock === 0 ? "Out of stock" : `${stock} in stock`;
  return <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>;
}
