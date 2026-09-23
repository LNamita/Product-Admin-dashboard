/**
 * Which page buttons to show. Always shows the first and last page, the
 * current page and one page on each side; gaps become "…".
 *   getPageItems(1, 20)  -> [1, 2, 3, "…", 20]
 *   getPageItems(10, 20) -> [1, "…", 9, 10, 11, "…", 20]
 */
export function getPageItems(current, totalPages, siblings = 1) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(2, current - siblings);
  const end = Math.min(totalPages - 1, current + siblings);
  const items = [1];

  if (start > 2) items.push("…");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push("…");

  items.push(totalPages);
  return items;
}

export function getTotalPages(total, limit) {
  return Math.max(1, Math.ceil(total / limit));
}
