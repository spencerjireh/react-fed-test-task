import { useMemo } from 'react';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';
import { relatedNames } from '../utils/related';

export function useRelatedNames(names: Name[], limit = 3): Name[] {
  const selectedNameId = useFilterStore((s) => s.selectedNameId);

  return useMemo(() => {
    if (!selectedNameId) return [];
    return relatedNames(names, selectedNameId, limit);
  }, [names, selectedNameId, limit]);
}
