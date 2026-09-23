// A tiny global message store, so any page can show "Product saved" etc.
let toasts = [];
const listeners = new Set();
let nextId = 1;

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getToasts() {
  return toasts;
}

const NO_TOASTS = [];
export function getServerToasts() {
  return NO_TOASTS;
}

export function dismissToast(id) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

export function showToast(message, type = "success") {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emit();
  setTimeout(() => dismissToast(id), 4000);
}
