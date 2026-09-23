// DummyJSON only *pretends* to add, edit and delete: it answers with the
// changed product but never saves it. To still show the change in the app,
// every successful change is recorded here and applied on top of API data.
// It is saved in localStorage so it survives a page refresh.

const STORAGE_KEY = "productChanges";
const EMPTY = { created: [], updated: {}, deleted: [] };
// Ids for products made in this app. Far above DummyJSON's ids (1–194).
const LOCAL_ID_START = 100000;

let state = EMPTY;
let loaded = false;
const listeners = new Set();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) state = { ...EMPTY, ...saved };
  } catch {
    state = EMPTY;
  }
}

function save(next) {
  state = next; // always a new object, so React sees the change
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked: changes still live in memory for this visit
  }
  listeners.forEach((listener) => listener());
}

// ---- used by useSyncExternalStore ----
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function getSnapshot() {
  load();
  return state;
}
export function getServerSnapshot() {
  return EMPTY;
}

// ---- actions ----
export function isLocalProduct(id) {
  load();
  return state.created.some((p) => p.id === Number(id));
}

export function addLocalProduct(product) {
  load();
  const maxId = state.created.reduce((max, p) => Math.max(max, p.id), LOCAL_ID_START);
  const created = { ...product, id: maxId + 1, isLocal: true, rating: 0, reviews: [], images: [] };
  save({ ...state, created: [created, ...state.created] });
  return created;
}

export function updateLocalProduct(id, changes) {
  load();
  id = Number(id);
  if (isLocalProduct(id)) {
    save({ ...state, created: state.created.map((p) => (p.id === id ? { ...p, ...changes } : p)) });
  } else {
    save({ ...state, updated: { ...state.updated, [id]: { ...state.updated[id], ...changes } } });
  }
}

export function deleteLocalProduct(id) {
  load();
  id = Number(id);
  if (isLocalProduct(id)) {
    save({ ...state, created: state.created.filter((p) => p.id !== id) });
  } else {
    save({ ...state, deleted: [...new Set([...state.deleted, id])] });
  }
}

export function clearLocalChanges() {
  save(EMPTY);
}

// ---- applying changes to API data ----

/** One product: returns null if it was deleted in this app. */
export function applyToProduct(product, changes) {
  if (!product || changes.deleted.includes(product.id)) return null;
  const override = changes.updated[product.id];
  return override ? { ...product, ...override } : product;
}

function matchesQuery(product, { q, category }) {
  if (q) {
    const text = `${product.title} ${product.description ?? ""}`.toLowerCase();
    return text.includes(q.toLowerCase());
  }
  if (category) return product.category === category;
  return true;
}

/**
 * One page of API results: removes deleted products, applies edits, and
 * adds products created in this app to the top of page 1 (if they match
 * the current search or category). Page numbers and "Showing x–y of z"
 * still follow the server's numbers, so pagination stays correct.
 */
export function applyToList(data, query, changes) {
  const serverItems = data.products.map((p) => applyToProduct(p, changes)).filter(Boolean);
  const newItems = query.page === 1 ? changes.created.filter((p) => matchesQuery(p, query)) : [];

  return {
    products: [...newItems, ...serverItems],
    localCount: newItems.length,
  };
}
