import type { FilterState } from '../stores/filter-store';
import type { Name } from '../types';

/** Pure filter predicate for the browse list. */
export function filterNames(
  names: Name[],
  state: Pick<
    FilterState,
    'gender' | 'letter' | 'macroCategories' | 'rawCategories'
  >,
): Name[] {
  return names.filter((n) => {
    // Names without gender still match M, F, and Both.
    if (state.gender !== 'Both' && n.gender.length > 0) {
      if (!n.gender.includes(state.gender)) return false;
    }

    if (state.letter && n.initial !== state.letter) return false;

    // Category matches are OR'd across macro and raw selections.
    if (state.macroCategories.size > 0 || state.rawCategories.size > 0) {
      const macroHit = n.macroCategories.some((m) =>
        state.macroCategories.has(m),
      );
      const rawHit = n.categories.some((r) => state.rawCategories.has(r));
      if (!macroHit && !rawHit) return false;
    }

    return true;
  });
}
