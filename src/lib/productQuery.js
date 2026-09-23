// Everything about reading and writing the list filters in the URL.
// The URL is the single source of truth for page, size, search, category and sort.

export const PAGE_SIZES = [10, 20, 50];
export const SORT_FIELDS = ["title", "price", "rating"];
export const DEFAULT_QUERY = {
  page: 1,
  limit: 10,
  q: "",
  category: "",
  sortBy: "",
  order: "asc",
  delay: "",
};

function toPositiveInt(value, fallback) {
  // Only plain digits are accepted, so "abc", "-3", "2.5" and "1e3" fall back.
  if (!/^\d+$/.test(value ?? "")) return fallback;
  const n = Number(value);
  return n >= 1 ? n : fallback;
}

/** Turn raw URLSearchParams into a safe, always-valid query object. */
export function parseQuery(searchParams) {
  const get = (key) => searchParams.get(key) ?? "";

  const limit = Number(get("limit"));
  const sortBy = get("sortBy");
  const q = get("q").trim().slice(0, 100);

  return {
    page: toPositiveInt(get("page"), 1),
    limit: PAGE_SIZES.includes(limit) ? limit : DEFAULT_QUERY.limit,
    q,
    // Search and category cannot be combined by the API. If a link has
    // both, search wins and category is dropped.
    category: q ? "" : get("category").trim(),
    sortBy: SORT_FIELDS.includes(sortBy) ? sortBy : "",
    order: get("order") === "desc" ? "desc" : "asc",
    // Optional test helper passed to DummyJSON (max 5s).
    delay: /^\d+$/.test(get("delay")) ? String(Math.min(Number(get("delay")), 5000)) : "",
  };
}

/** Build a clean query string, leaving out values that equal the defaults. */
export function buildQueryString(query) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value === "" || value === null || value === undefined) return;
    if (value === DEFAULT_QUERY[key]) return;
    if (key === "order" && !query.sortBy) return;
    params.set(key, String(value));
  });
  const str = params.toString();
  return str ? `?${str}` : "";
}
