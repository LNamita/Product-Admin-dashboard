import SearchInput from "./SearchInput";
import CategoryFilter from "./CategoryFilter";
import SortSelect from "./SortSelect";

export default function ProductsToolbar({ query, categories, onSearch, onCategoryChange, onSortChange }) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchInput value={query.q} onSearch={onSearch} />
        <CategoryFilter value={query.category} categories={categories} onChange={onCategoryChange} />
        <SortSelect sortBy={query.sortBy} order={query.order} onChange={onSortChange} />
      </div>
      {(query.q || query.category) && (
        <p className="text-xs text-slate-500">
          Search and category filter work one at a time: searching clears the category, and picking a
          category clears the search.
        </p>
      )}
    </div>
  );
}
