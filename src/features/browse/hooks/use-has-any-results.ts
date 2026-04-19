import { useMemo } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';
import { matchesFilters } from '../utils/filter-names';

export function useHasAnyResults(names: Name[]): boolean {
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const rawCategories = useFilterStore((s) => s.rawCategories);

  return useMemo(
    () =>
      names.some((n) => matchesFilters(n, { gender, letter, rawCategories })),
    [names, gender, letter, rawCategories],
  );
}
