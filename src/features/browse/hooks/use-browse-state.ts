import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';

import { useHasAnyResults } from './use-has-any-results';
import { useSelectedName } from './use-selected-name';

export type BrowseState = 'cover' | 'results' | 'empty-results' | 'detail';

export function useBrowseState(): BrowseState {
  const selected = useSelectedName();
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const rawCount = useFilterStore((s) => s.rawCategories.size);
  const { data: names } = useNames();
  const hasAnyResults = useHasAnyResults(names ?? []);

  if (selected) return 'detail';

  const hasAnyFilter = gender !== 'Both' || letter !== null || rawCount > 0;
  if (!hasAnyFilter) return 'cover';

  if (!names) return 'results';
  return hasAnyResults ? 'results' : 'empty-results';
}
