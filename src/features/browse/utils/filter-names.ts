import type { FilterState } from '../stores/filter-store';
import type { Name } from '../types';

/**
 * Filter predicate. Pure — safe to call with fixtures in tests.
 *
 * Notes:
 *   - `gender === 'Both'` means no gender filter. An empty gender array on
 *     the Name always passes the gender check — this is the "Marley"
 *     exception, where the lone gender-less entry is intentionally
 *     visible under M, F, and Both rather than hidden.
 *   - The letter predicate is a direct equality against the precomputed
 *     `initial` on the decorated Name.
 *   - Category filtering is OR across the two levels (macro union raw).
 *     A name matches if any of its macroCategories is in the selected set
 *     OR any of its raw category ids is in the selected set.
 */
export function filterNames(
  names: Name[],
  state: Pick<
    FilterState,
    'gender' | 'letter' | 'macroCategories' | 'rawCategories'
  >,
): Name[] {
  return names.filter((n) => {
    // Gender — empty gender array matches any gender (the Marley exception).
    if (state.gender !== 'Both' && n.gender.length > 0) {
      if (!n.gender.includes(state.gender)) return false;
    }

    // Letter
    if (state.letter && n.initial !== state.letter) return false;

    // Categories — OR across macro and raw levels. Only apply the filter if
    // at least one category is selected; empty Sets mean "no category filter".
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
