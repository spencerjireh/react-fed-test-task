import { useEffect } from 'react';

import { useNames } from '../api/get-names';
import { useFilterStore } from '../stores/filter-store';
import { filterNames } from '../utils/filter-names';

export function useReconcileSelection(): void {
  const { data: names } = useNames();
  const gender = useFilterStore((s) => s.gender);
  const letter = useFilterStore((s) => s.letter);
  const macroCategories = useFilterStore((s) => s.macroCategories);
  const rawCategories = useFilterStore((s) => s.rawCategories);
  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);

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
      macroCategories,
      rawCategories,
    });
    if (matches.length === 0) setSelectedNameTitle(null);
  }, [
    names,
    selectedNameTitle,
    gender,
    letter,
    macroCategories,
    rawCategories,
    setSelectedNameTitle,
  ]);
}
