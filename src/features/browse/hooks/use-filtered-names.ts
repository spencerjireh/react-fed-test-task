import { useMemo } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';
import { filterNames } from '../utils/filter-names';

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
