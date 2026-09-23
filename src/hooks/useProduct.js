"use client";

import { useCallback, useEffect, useState } from "react";
import { getProduct } from "@/services/productService";
import { applyToProduct } from "@/lib/localChanges";
import useLocalChanges from "./useLocalChanges";

/**
 * Loads one product by id. status is one of:
 * "loading" | "success" | "notFound" | "error"
 */
export default function useProduct(id) {
  const changes = useLocalChanges();
  const [state, setState] = useState({ status: "loading", product: null, error: null });
  const [reloadKey, setReloadKey] = useState(0);

  const validId = /^\d+$/.test(String(id));
  const local = validId && changes.created.some((p) => p.id === Number(id));

  useEffect(() => {
    // Wrong ids and products made in this app never hit the API.
    if (!validId || local) return;

    const controller = new AbortController();
    setState({ status: "loading", product: null, error: null });

    getProduct(id, { signal: controller.signal })
      .then((product) => setState({ status: "success", product, error: null }))
      .catch((error) => {
        if (error.canceled) return;
        setState({ status: error.status === 404 ? "notFound" : "error", product: null, error });
      });

    return () => controller.abort();
  }, [id, validId, local, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  if (!validId) return { status: "notFound", product: null, retry };

  if (local) {
    const product = changes.created.find((p) => p.id === Number(id));
    return product ? { status: "success", product, retry } : { status: "notFound", product: null, retry };
  }

  if (state.status === "success") {
    const product = applyToProduct(state.product, changes);
    return product ? { ...state, product, retry } : { status: "notFound", product: null, retry };
  }

  return { ...state, retry };
}
