import api from "@/lib/axios";

// Only the fields the list needs, so pages load faster.
const LIST_FIELDS = "title,category,price,rating,stock,thumbnail";

/**
 * Fetch one page of products.
 * DummyJSON has three different list endpoints, so this picks the right one:
 *   - search text  -> /products/search?q=
 *   - category     -> /products/category/:slug
 *   - otherwise    -> /products
 * Search and category are never sent together (the API cannot combine them).
 */
export async function getProducts({ page, limit, q, category, sortBy, order, delay }, { signal } = {}) {
  let url = "/products";
  const params = {
    limit,
    skip: (page - 1) * limit,
    select: LIST_FIELDS,
  };

  if (q) {
    url = "/products/search";
    params.q = q;
  } else if (category) {
    url = `/products/category/${encodeURIComponent(category)}`;
  }

  if (sortBy) {
    params.sortBy = sortBy;
    params.order = order;
  }

  // Test helper: DummyJSON can slow down its answer (e.g. &delay=2000).
  if (delay) params.delay = delay;

  const { data } = await api.get(url, { params, signal });
  return data; // { products, total, skip, limit }
}

export async function getProduct(id, { signal } = {}) {
  const { data } = await api.get(`/products/${id}`, { signal });
  return data;
}

export async function getCategories() {
  const { data } = await api.get("/products/categories");
  return data; // [{ slug, name, url }]
}

export async function addProduct(product) {
  const { data } = await api.post("/products/add", product);
  return data;
}

export async function updateProduct(id, changes) {
  const { data } = await api.put(`/products/${id}`, changes);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}
