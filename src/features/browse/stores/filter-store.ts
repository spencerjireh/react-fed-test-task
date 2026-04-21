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
  type MacroCategory,
} from '../types';
import {
  getFullyCheckedMacros,
  getRawIdForName,
  getRawIdsCoveredByMacros,
  getRawIdsForMacro,
  getRawNameForId,
} from '../utils/macro-category-map';

export interface FilterState {
  gender: Gender | 'Both';
  letter: Letter | null;
  rawCategories: ReadonlySet<string>;
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
  rawCategories: new Set(),
  selectedNameTitle: null,
};

const COVER_TO_RESULTS_SEED: Pick<FilterState, 'gender' | 'letter'> = {
  gender: 'M',
  letter: 'A',
};

function fromUrlParams(params: FilterUrlParams): FilterState {
  const gender: Gender | 'Both' =
    params.gender && isGender(params.gender) ? params.gender : 'Both';
  const letter = params.letter ?? null;
  const macros = new Set(
    (params.macroCategories ?? []).filter(isMacroCategory),
  );
  const rawCategories = new Set(
    (params.rawCategories ?? [])
      .map(getRawIdForName)
      .filter((id): id is string => typeof id === 'string'),
  );
  for (const macro of macros) {
    for (const id of getRawIdsForMacro(macro)) rawCategories.add(id);
  }
  return {
    gender,
    letter,
    rawCategories,
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
  const fullyCheckedMacros = getFullyCheckedMacros(state.rawCategories);
  const covered = getRawIdsCoveredByMacros(fullyCheckedMacros);
  const standaloneRawNames = [...state.rawCategories]
    .filter((id) => !covered.has(id))
    .map(getRawNameForId)
    .filter((name): name is string => typeof name === 'string');
  return encodeFilterUrlParams({
    gender: state.gender === 'Both' ? undefined : state.gender,
    letter: state.letter ?? undefined,
    macroCategories: fullyCheckedMacros.size
      ? [...fullyCheckedMacros]
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
        childIds.length > 0 && childIds.every((id) => s.rawCategories.has(id));
      const nextRaws = new Set(s.rawCategories);

      if (fullyChecked) {
        for (const id of childIds) nextRaws.delete(id);
      } else {
        for (const id of childIds) nextRaws.add(id);
      }

      return { rawCategories: nextRaws };
    }),

  toggleRaw: (rawCategoryId) =>
    set((s) => {
      const nextRaws = new Set(s.rawCategories);
      if (nextRaws.has(rawCategoryId)) nextRaws.delete(rawCategoryId);
      else nextRaws.add(rawCategoryId);

      return { rawCategories: nextRaws };
    }),

  setSelectedNameTitle: (selectedNameTitle) => set({ selectedNameTitle }),

  // One set() so the URL only navigates once (no ?g=M flash before ?l=A).
  goToResults: () => set(COVER_TO_RESULTS_SEED),

  goToCover: () =>
    set({
      gender: 'Both',
      letter: null,
      rawCategories: new Set(),
      selectedNameTitle: null,
    }),

  clearFilters: () =>
    set({
      gender: 'Both',
      rawCategories: new Set(),
    }),
}));
