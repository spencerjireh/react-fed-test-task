import { useMemo } from 'react';

import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';

// Returns null when the title doesn't resolve — callers treat that as
// "show the hero", so a stale URL doesn't leave an empty detail pane.
export function useSelectedName(): Name | null {
  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const { data: names } = useNames();

  return useMemo(() => {
    if (!selectedNameTitle || !names) return null;
    return names.find((n) => n.title === selectedNameTitle) ?? null;
  }, [names, selectedNameTitle]);
}
