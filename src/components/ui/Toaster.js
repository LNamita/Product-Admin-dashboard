"use client";

import { useSyncExternalStore } from "react";
import { dismissToast, getServerToasts, getToasts, subscribe } from "@/lib/toast";

const STYLES = {
  success: "bg-emerald-600",
  error: "bg-red-600",
};

export default function Toaster() {
  const toasts = useSyncExternalStore(subscribe, getToasts, getServerToasts);

  return (
    <div aria-live="polite" className="fixed right-4 bottom-4 left-4 z-50 flex flex-col items-end gap-2 sm:left-auto">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${STYLES[toast.type]}`}
        >
          <p className="flex-1">{toast.message}</p>
          <button onClick={() => dismissToast(toast.id)} aria-label="Dismiss" className="opacity-80 hover:opacity-100">
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
