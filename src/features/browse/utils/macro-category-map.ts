import categoriesJson from '@/testing/mocks/data/categories.json';

import {
  isMacroCategory,
  type MacroCategory,
  type RawCategory,
} from '../types';

interface FilterGroup {
  id: string;
  label: string;
  categoryIds: string[];
}

const FILTER_GROUPS = categoriesJson.filterGroups as FilterGroup[];

const CATEGORY_ID_TO_MACROS: Record<string, readonly MacroCategory[]> = (() => {
  const map: Record<string, MacroCategory[]> = {};
  for (const group of FILTER_GROUPS) {
    if (!isMacroCategory(group.label)) continue;
    for (const rawId of group.categoryIds) {
      (map[rawId] ??= []).push(group.label);
    }
  }
  return map;
})();

const MACRO_TO_RAW_IDS: Record<MacroCategory, readonly string[]> = (() => {
  const map: Partial<Record<MacroCategory, string[]>> = {};
  for (const group of FILTER_GROUPS) {
    if (!isMacroCategory(group.label)) continue;
    (map[group.label] ??= []).push(...group.categoryIds);
  }
  return map as Record<MacroCategory, readonly string[]>;
})();

const OTHERS_FALLBACK: readonly MacroCategory[] = ['Others'];

export function getMacrosFor(rawCategoryId: string): readonly MacroCategory[] {
  return CATEGORY_ID_TO_MACROS[rawCategoryId] ?? OTHERS_FALLBACK;
}

export function getRawsForMacro(
  macro: MacroCategory,
  allRaws: RawCategory[],
): RawCategory[] {
  return allRaws
    .filter((raw) => getMacrosFor(raw.id).includes(macro))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getRawIdsForMacro(macro: MacroCategory): readonly string[] {
  return MACRO_TO_RAW_IDS[macro] ?? [];
}
