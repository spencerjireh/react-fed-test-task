import { useMemo } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';
import { relatedNames } from '../utils/related';

/**
 * Memoized related-names hook. Pulls `selectedNameId` from the store and
 * delegates to `relatedNames`. Returns an empty array when no name is
 * selected — the detail pane isn't rendering related names at that
 * point anyway (the Cover hero is showing instead), but returning `[]`
 * rather than `undefined` keeps callers simpler.
 */
export function useRelatedNames(names: Name[], limit = 3): Name[] {
  const selectedNameId = useFilterStore((s) => s.selectedNameId);

  return useMemo(() => {
    if (!selectedNameId) return [];
    return relatedNames(names, selectedNameId, limit);
  }, [names, selectedNameId, limit]);
}
