import { PAGE_SIZES } from "@/lib/productQuery";
import { getPageItems } from "@/lib/pagination";

const pageButton = "min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40";

export default function Pagination({ page, totalPages, limit, from, to, total, onPageChange, onLimitChange }) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
      <p className="text-slate-600">
        {total === 0 ? "No results" : `Showing ${from}–${to} of ${total}`}
      </p>

      <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1">
        <button
          className={`${pageButton} hover:bg-slate-200`}
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          ← Previous
        </button>

        {getPageItems(page, totalPages).map((item, i) =>
          item === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
              className={`${pageButton} ${item === page ? "bg-indigo-600 text-white" : "hover:bg-slate-200"}`}
            >
              {item}
            </button>
          )
        )}

        <button
          className={`${pageButton} hover:bg-slate-200`}
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next →
        </button>
      </nav>

      <label className="flex items-center gap-2 text-slate-600">
        Per page
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-2 py-1.5"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
