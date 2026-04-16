import { useQuery } from '@tanstack/react-query';

import type { RawCategory } from '../types';

import { API_BASE } from './client';

/**
 * Fetch the full categories collection.
 *
 * Unused in the current UI — wired alongside `useNames` / `useLetters`
 * so category-dropdown work doesn't also have to build the API layer.
 * Same plain-fetch shape as `get-names.ts`; no decoration since
 * categories are consumed as-is.
 */
export async function fetchCategories(): Promise<RawCategory[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error(`fetch categories: ${res.status}`);
  const { data } = (await res.json()) as { data: RawCategory[] };
  return data;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}
