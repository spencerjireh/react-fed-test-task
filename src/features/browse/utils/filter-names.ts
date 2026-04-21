import type { FilterState } from '../stores/filter-store';
import type { Name } from '../types';

export function matchesFilters(
  name: Name,
  state: Pick<FilterState, 'gender' | 'letter' | 'rawCategories'>,
): boolean {
  if (state.gender !== 'Both' && name.gender.length > 0) {
    if (!name.gender.includes(state.gender)) return false;
  }
  if (state.letter && name.initial !== state.letter) return false;
  if (state.rawCategories.size > 0) {
    const hit = name.categories.some((r) => state.rawCategories.has(r));
    if (!hit) return false;
  }
  return true;
}

export function filterNames(
  names: Name[],
  state: Pick<FilterState, 'gender' | 'letter' | 'rawCategories'>,
): Name[] {
  return names.filter((n) => matchesFilters(n, state));
}
