import { useMemo } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';
import { filterNames } from '../utils/filter-names';

/**
 * Memoized filter hook. Reads the four filter slices from the store
 * individually so downstream renders only re-compute when something
 * that actually affects the result changes — unrelated mutations like
 * `setSelectedNameId` or `setPage` won't force a re-filter.
 *
 * The Set references change on every mutation (store actions construct
 * a new Set each time), so reference-equality is a correct memo key here.
 */
export function useFilteredNames(names: Name[]): Name[] {
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const macroCategories = useFilterStore((s) => s.macroCategories);
  const rawCategories = useFilterStore((s) => s.rawCategories);

  return useMemo(
    () =>
      filterNames(names, { gender, letter, macroCategories, rawCategories }),
    [names, gender, letter, macroCategories, rawCategories],
  );
}
