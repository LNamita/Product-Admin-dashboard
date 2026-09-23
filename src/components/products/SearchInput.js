"use client";

import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/useDebounce";

/**
 * Search box. The text updates instantly while typing, but `onSearch`
 * (which changes the URL and calls the API) only runs after the user
 * has stopped typing for 400 ms.
 */
export default function SearchInput({ value, onSearch }) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text.trim(), 400);
  const lastSent = useRef(value);

  // Send the debounced text up, but only when it is really new.
  useEffect(() => {
    if (debounced !== lastSent.current) {
      lastSent.current = debounced;
      onSearch(debounced);
    }
  }, [debounced, onSearch]);

  // The URL changed from outside (Back button, category chosen, shared link):
  // show that value in the box. Our own updates are skipped via lastSent,
  // so the box is never reset while the user is still typing.
  useEffect(() => {
    if (value !== lastSent.current) {
      lastSent.current = value;
      setText(value);
    }
  }, [value]);

  function clear() {
    setText("");
    lastSent.current = "";
    onSearch("");
  }

  return (
    <div className="relative flex-1">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">⌕</span>
      <input
        type="search"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products…"
        aria-label="Search products"
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-9 pl-8 text-sm outline-none focus:ring-2 focus:ring-indigo-500 [&::-webkit-search-cancel-button]:hidden"
      />
      {text && (
        <button
          onClick={clear}
          aria-label="Clear search"
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded px-1.5 text-slate-400 hover:text-slate-700"
        >
          ✕
        </button>
      )}
    </div>
  );
}
