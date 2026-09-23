import { useCallback, useRef, useState } from "react";

/**
 * Wraps an async submit function so it can only run once at a time.
 * A ref is used (not only state) because state updates are async:
 * two very fast clicks could both see `loading === false`, but the
 * ref flips synchronously, so the second click is ignored.
 */
export default function useSubmitGuard(fn) {
  const inFlight = useRef(false);
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    async (...args) => {
      if (inFlight.current) return;
      inFlight.current = true;
      setLoading(true);
      try {
        return await fn(...args);
      } finally {
        inFlight.current = false;
        setLoading(false);
      }
    },
    [fn]
  );

  return [run, loading];
}
