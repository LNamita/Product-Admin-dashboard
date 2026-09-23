"use client";

import { useCallback, useState } from "react";
import { deleteProduct } from "@/services/productService";
import { deleteLocalProduct } from "@/lib/localChanges";
import { showToast } from "@/lib/toast";
import useSubmitGuard from "./useSubmitGuard";

/**
 * Holds the "which product are we about to delete?" state for the confirm
 * popup, and performs the delete when confirmed.
 */
export default function useDeleteProduct({ onDeleted } = {}) {
  const [target, setTarget] = useState(null);

  const [confirmDelete, deleting] = useSubmitGuard(async () => {
    if (!target) return;
    try {
      // Products made in this app never existed on the server.
      if (!target.isLocal) await deleteProduct(target.id);
      deleteLocalProduct(target.id);
      showToast(`"${target.title}" was deleted.`);
      setTarget(null);
      onDeleted?.(target);
    } catch (error) {
      showToast(error.message, "error");
    }
  });

  const askDelete = useCallback((product) => setTarget(product), []);
  const cancelDelete = useCallback(() => setTarget(null), []);

  return { target, askDelete, cancelDelete, confirmDelete, deleting };
}
