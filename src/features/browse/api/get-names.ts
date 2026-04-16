import { useQuery } from '@tanstack/react-query';

import type { Name, RawName } from '../types';
import { decorateNames } from '../utils/decorate-name';

import { API_BASE } from './client';

/**
 * Fetch the full names collection and return decorated `Name[]`.
 *
 * --------
 * DESIGN NOTE — where does decoration happen?
 * --------
 * `decorateNames(raws)` turns each RawName into a Name (adds `initial`,
 * `definitionText`, `macroCategories`). Three places it could live:
 *
 *   1. Inside `queryFn` (this file). Cache holds decorated Name[];
 *      consumers get Name[] directly. Decoration runs exactly once per
 *      successful fetch.
 *   2. Inside a `select: decorateNames` option on `useQuery`. TanStack
 *      memoizes `select` by *function reference* — an inline arrow
 *      (`select: (raws) => decorateNames(raws)`) creates a new reference
 *      every render and re-decorates. A module-level reference works but
 *      now you've moved the decoration to module scope anyway.
 *   3. At the call site (every consumer: `useMemo(decorateNames(raw))`).
 *      Couples every consumer to the decoration detail; easy to forget.
 *
 * We pick (1).
 *
 * Why `throw` on non-ok responses? TanStack Query relies on a thrown
 * error to flip the query into `isError`. Returning `null`/`undefined`
 * on failure would silently mask it.
 */
export async function fetchNames(): Promise<Name[]> {
  const res = await fetch(`${API_BASE}/names`);
  if (!res.ok) throw new Error(`fetch names: ${res.status}`);
  const { data } = (await res.json()) as { data: RawName[] };

  // Decoration happens HERE, inside queryFn. The cached value is already
  // `Name[]` — consumers never need to remember to decorate.
  return decorateNames(data);
}

export function useNames() {
  return useQuery({
    queryKey: ['names'],
    queryFn: fetchNames,
    staleTime: Infinity,
  });
}
