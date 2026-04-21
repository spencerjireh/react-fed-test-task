import { useEffect } from 'react';

import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';
import { filterNames } from '../utils/filter-names';

export function useReconcileSelection(): void {
  const { data: names } = useNames();
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);

  // Clearing selection here runs as a separate setState from the filter change, so URL-sync fires twice per narrowing event (both with { replace: true }).
  useEffect(() => {
    if (!names || !selectedNameTitle) return;
    const selected = names.find((n) => n.title === selectedNameTitle);
    if (!selected) {
      setSelectedNameTitle(null);
      return;
    }
    const matches = filterNames([selected], {
      gender,
      letter,
      rawCategories,
    });
    if (matches.length === 0) setSelectedNameTitle(null);
  }, [
    names,
    selectedNameTitle,
    gender,
    letter,
    rawCategories,
    setSelectedNameTitle,
  ]);
}
