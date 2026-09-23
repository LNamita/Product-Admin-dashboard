"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts } from "@/services/productService";

/**
 * Loads one page of products for the given query.
 *
 * Old responses can never overwrite new ones, for two reasons:
 *  1. When the query changes, the previous request is aborted (AbortController).
 *  2. Every request gets a number; a response is only used if its number is
 *     still the latest one. This also covers a response that already arrived
 *     but had not been handled yet.
 */
export default function useProducts(query) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);
  const latestRequest = useRef(0);

  const { page, limit, q, category, sortBy, order, delay } = query;

  useEffect(() => {
    const requestId = ++latestRequest.current;
    const controller = new AbortController();

    setState((prev) => ({ ...prev, status: "loading", error: null }));

    getProducts({ page, limit, q, category, sortBy, order, delay }, { signal: controller.signal })
      .then((data) => {
        if (requestId !== latestRequest.current) return; // a newer request exists
        setState({ status: "success", data, error: null });
      })
      .catch((error) => {
        if (error.canceled || requestId !== latestRequest.current) return;
        setState({ status: "error", data: null, error });
      });

    return () => controller.abort();
  }, [page, limit, q, category, sortBy, order, delay, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, retry };
}
