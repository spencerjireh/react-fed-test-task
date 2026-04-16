import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';

import { useFilteredNames } from './use-filtered-names';
import { useSelectedName } from './use-selected-name';

export type BrowseState = 'cover' | 'results' | 'empty-results' | 'detail';

export function useBrowseState(): BrowseState {
  const selected = useSelectedName();
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const macroCount = useFilterStore((s) => s.macroCategories.size);
  const rawCount = useFilterStore((s) => s.rawCategories.size);
  const { data: names } = useNames();
  const filtered = useFilteredNames(names ?? []);

  if (selected) return 'detail';

  const hasAnyFilter =
    gender !== 'Both' || letter !== null || macroCount > 0 || rawCount > 0;
  if (!hasAnyFilter) return 'cover';

  if (!names) return 'results';
  return filtered.length === 0 ? 'empty-results' : 'results';
}
