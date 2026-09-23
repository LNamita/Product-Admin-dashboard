"use client";

import { useEffect, useState } from "react";
import { getCategories } from "@/services/productService";

// Categories rarely change, so they are fetched once and shared.
let cache = null;

export default function useCategories() {
  const [categories, setCategories] = useState(cache ?? []);
  const [loaded, setLoaded] = useState(Boolean(cache));

  useEffect(() => {
    if (cache) return;
    let active = true;
    getCategories()
      .then((list) => {
        cache = list;
        if (active) setCategories(list);
      })
      .catch(() => {
        // Not fatal: the filter just shows "All categories".
      })
      .finally(() => active && setLoaded(true));
    return () => {
      active = false;
    };
  }, []);

  return { categories, loaded };
}
