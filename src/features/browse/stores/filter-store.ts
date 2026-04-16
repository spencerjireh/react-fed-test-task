import { create } from 'zustand';

import {
  decodeFilterUrlParams,
  encodeFilterUrlParams,
  type FilterUrlParams,
  hasFilterUrlParams,
} from '@/utils/url-state';

import {
  type Gender,
  isMacroCategory,
  type Letter,
  MACRO_CATEGORIES,
  type MacroCategory,
} from '../types';
import {
  getMacrosFor,
  getRawIdForName,
  getRawIdsCoveredByMacros,
  getRawIdsForMacro,
  getRawNameForId,
} from '../utils/macro-category-map';

export interface FilterState {
  gender: Gender | 'Both';
  letter: Letter | null;
  macroCategories: Set<MacroCategory>;
  rawCategories: Set<string>;
  selectedNameTitle: string | null;
}

interface FilterActions {
  setGender: (gender: Gender | 'Both') => void;
  setLetter: (letter: Letter | null) => void;
  toggleMacro: (macro: MacroCategory) => void;
  toggleRaw: (rawCategoryId: string) => void;
  setSelectedNameTitle: (title: string | null) => void;
  goToResults: () => void;
  goToCover: () => void;
  clearFilters: () => void;
}

type FilterStore = FilterState & FilterActions;

function isGender(value: string): value is Gender {
  return value === 'M' || value === 'F';
}

const DEFAULT_STATE: FilterState = {
  gender: 'Both',
  letter: null,
  macroCategories: new Set(),
  rawCategories: new Set(),
  selectedNameTitle: null,
};

const COVER_TO_RESULTS_SEED: Pick<FilterState, 'gender' | 'letter'> = {
  gender: 'M',
  letter: 'A',
};

function reconcileMacros(rawCategories: Set<string>): Set<MacroCategory> {
  const next = new Set<MacroCategory>();
  for (const macro of MACRO_CATEGORIES) {
    const childIds = getRawIdsForMacro(macro);
    if (childIds.length === 0) continue;
    if (childIds.every((id) => rawCategories.has(id))) {
      next.add(macro);
    }
  }
  return next;
}

function canonicalize(
  macroCategories: Set<MacroCategory>,
  rawCategories: Set<string>,
): { macroCategories: Set<MacroCategory>; rawCategories: Set<string> } {
  const raws = new Set(rawCategories);
  for (const macro of macroCategories) {
    for (const id of getRawIdsForMacro(macro)) raws.add(id);
  }
  return { macroCategories: reconcileMacros(raws), rawCategories: raws };
}

function fromUrlParams(params: FilterUrlParams): FilterState {
  const gender: Gender | 'Both' =
    params.gender && isGender(params.gender) ? params.gender : 'Both';
  const letter = params.letter ?? null;
  const macros = new Set(
    (params.macroCategories ?? []).filter(isMacroCategory),
  );
  const raws = new Set(
    (params.rawCategories ?? [])
      .map(getRawIdForName)
      .filter((id): id is string => typeof id === 'string'),
  );
  const synced = canonicalize(macros, raws);
  return {
    gender,
    letter,
    macroCategories: synced.macroCategories,
    rawCategories: synced.rawCategories,
    selectedNameTitle: params.selectedNameTitle ?? null,
  };
}

export function computeInitialState(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  const search = window.location.search;
  return hasFilterUrlParams(search)
    ? fromUrlParams(decodeFilterUrlParams(search))
    : DEFAULT_STATE;
}

export function serializeFilterStateToUrl(state: FilterState): string {
  const covered = getRawIdsCoveredByMacros(state.macroCategories);
  const standaloneRawNames = [...state.rawCategories]
    .filter((id) => !covered.has(id))
    .map(getRawNameForId)
    .filter((name): name is string => typeof name === 'string');
  return encodeFilterUrlParams({
    gender: state.gender === 'Both' ? undefined : state.gender,
    letter: state.letter ?? undefined,
    macroCategories: state.macroCategories.size
      ? [...state.macroCategories]
      : undefined,
    rawCategories: standaloneRawNames.length ? standaloneRawNames : undefined,
    selectedNameTitle: state.selectedNameTitle ?? undefined,
  });
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...computeInitialState(),

  setGender: (gender) => set({ gender }),

  setLetter: (letter) => set({ letter }),

  toggleMacro: (macro) =>
    set((s) => {
      const childIds = getRawIdsForMacro(macro);
      const fullyChecked =
        s.macroCategories.has(macro) &&
        childIds.every((id) => s.rawCategories.has(id));

      const nextMacros = new Set(s.macroCategories);
      const nextRaws = new Set(s.rawCategories);

      if (fullyChecked) {
        nextMacros.delete(macro);
        for (const id of childIds) nextRaws.delete(id);
      } else {
        nextMacros.add(macro);
        for (const id of childIds) nextRaws.add(id);
      }

      return { macroCategories: nextMacros, rawCategories: nextRaws };
    }),

  toggleRaw: (rawCategoryId) =>
    set((s) => {
      const nextRaws = new Set(s.rawCategories);
      if (nextRaws.has(rawCategoryId)) nextRaws.delete(rawCategoryId);
      else nextRaws.add(rawCategoryId);

      const nextMacros = new Set(s.macroCategories);
      for (const macro of getMacrosFor(rawCategoryId)) {
        const childIds = getRawIdsForMacro(macro);
        if (childIds.length > 0 && childIds.every((id) => nextRaws.has(id))) {
          nextMacros.add(macro);
        } else {
          nextMacros.delete(macro);
        }
      }

      return { macroCategories: nextMacros, rawCategories: nextRaws };
    }),

  setSelectedNameTitle: (selectedNameTitle) => set({ selectedNameTitle }),

  // One set() so the URL only navigates once (no ?g=M flash before ?l=A).
  goToResults: () => set(COVER_TO_RESULTS_SEED),

  goToCover: () =>
    set({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
    }),

  clearFilters: () =>
    set({
      gender: 'Both',
      macroCategories: new Set(),
      rawCategories: new Set(),
    }),
}));
