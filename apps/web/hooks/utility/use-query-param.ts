"use client";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
export function useQueryParam(key: string, fallback = "") {
  const params = useSearchParams();
  const value = params.get(key) ?? fallback;
  const setValue = useCallback((next: string) => {
    const url = new URL(window.location.href);
    if (next) url.searchParams.set(key, next); else url.searchParams.delete(key);
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [key]);
  return [value, setValue] as const;
}
