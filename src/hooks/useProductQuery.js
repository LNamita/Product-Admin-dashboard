"use client";

import { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildQueryString, parseQuery } from "@/lib/productQuery";

/**
 * Reads the list filters from the URL and gives back a function to change them.
 * Bad values (e.g. ?page=abc or ?limit=7) are fixed and the URL is cleaned up.
 */
export default function useProductQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawString = searchParams.toString();

  const query = useMemo(() => parseQuery(new URLSearchParams(rawString)), [rawString]);

  const setQuery = useCallback(
    (changes, { replace = false } = {}) => {
      const next = { ...query, ...changes };
      const url = pathname + buildQueryString(next);
      if (replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    },
    [query, pathname, router]
  );

  // If the URL had invalid values, rewrite it to the cleaned version.
  useEffect(() => {
    const clean = buildQueryString(query).replace(/^\?/, "");
    const current = new URLSearchParams(rawString);
    const sorted = (p) => [...p.entries()].sort().join("&");
    if (sorted(current) !== sorted(new URLSearchParams(clean))) {
      router.replace(pathname + (clean ? `?${clean}` : ""), { scroll: false });
    }
  }, [query, rawString, pathname, router]);

  return [query, setQuery];
}
