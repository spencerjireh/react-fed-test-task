import { useFilterStore } from '../stores/filter-store';

import { useSelectedName } from './use-selected-name';

export type BrowseState = 'cover' | 'results' | 'detail';

export function useBrowseState(): BrowseState {
  const selected = useSelectedName();
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const macroCount = useFilterStore((s) => s.macroCategories.size);
  const rawCount = useFilterStore((s) => s.rawCategories.size);

  if (selected) return 'detail';

  const hasAnyFilter =
    gender !== 'Both' || letter !== null || macroCount > 0 || rawCount > 0;

  return hasAnyFilter ? 'results' : 'cover';
}
