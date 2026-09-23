const OPTIONS = [
  { value: "", label: "Default order" },
  { value: "title-asc", label: "Title: A → Z" },
  { value: "title-desc", label: "Title: Z → A" },
  { value: "price-asc", label: "Price: low → high" },
  { value: "price-desc", label: "Price: high → low" },
  { value: "rating-desc", label: "Rating: high → low" },
  { value: "rating-asc", label: "Rating: low → high" },
];

// One dropdown holds both the field and the direction, e.g. "price-desc".
export default function SortSelect({ sortBy, order, onChange }) {
  const value = sortBy ? `${sortBy}-${order}` : "";

  function handleChange(e) {
    const [nextSortBy = "", nextOrder = "asc"] = e.target.value.split("-");
    onChange(nextSortBy, nextOrder);
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      aria-label="Sort products"
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
