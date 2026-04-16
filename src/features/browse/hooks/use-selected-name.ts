import { useMemo } from 'react';

import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';

// Resolves the currently-selected title to its Name record, or null when the
// title is unset or doesn't match any known name. Callers use the null branch
// to fall back to the Cover hero rather than rendering an empty detail pane.
export function useSelectedName(): Name | null {
  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const { data: names } = useNames();

  return useMemo(() => {
    if (!selectedNameTitle || !names) return null;
    return names.find((n) => n.title === selectedNameTitle) ?? null;
  }, [names, selectedNameTitle]);
}
