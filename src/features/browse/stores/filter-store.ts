import { create } from 'zustand';

import {
  decodeFilterUrlParams,
  encodeFilterUrlParams,
  type FilterUrlParams,
  hasFilterUrlParams,
} from '@/lib/url-state';

import type { Gender, Letter, MacroCategory } from '../types';

export interface FilterState {
  gender: Gender | 'Both';
  letter: Letter | null;
  macroCategories: Set<MacroCategory>;
  rawCategories: Set<string>;
  selectedNameTitle: string | null;
  page: number;
}

export interface FilterActions {
  setGender: (gender: Gender | 'Both') => void;
  setLetter: (letter: Letter | null) => void;
  toggleMacro: (macro: MacroCategory) => void;
  toggleRaw: (rawCategoryId: string) => void;
  setSelectedNameTitle: (title: string | null) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
}

export type FilterStore = FilterState & FilterActions;

const VALID_MACRO_CATEGORIES: readonly MacroCategory[] = [
  'Famous',
  "Pet's size",
  'Joyful',
  'Funny',
  'Food and drinks',
  'International',
  'Others',
];

function isMacroCategory(value: string): value is MacroCategory {
  return (VALID_MACRO_CATEGORIES as readonly string[]).includes(value);
}

function isGender(value: string): value is Gender {
  return value === 'M' || value === 'F';
}

function isLetter(value: string): value is Letter {
  return value.length > 0;
}

const DEFAULT_STATE: FilterState = {
  gender: 'Both',
  letter: null,
  macroCategories: new Set(),
  rawCategories: new Set(),
  selectedNameTitle: null,
  page: 0,
};

function fromUrlParams(params: FilterUrlParams): FilterState {
  const gender: Gender | 'Both' =
    params.gender && isGender(params.gender) ? params.gender : 'Both';
  const letter =
    params.letter && isLetter(params.letter) ? params.letter : null;
  return {
    gender,
    letter,
    macroCategories: new Set(
      (params.macroCategories ?? []).filter(isMacroCategory),
    ),
    rawCategories: new Set(params.rawCategories ?? []),
    selectedNameTitle: params.selectedNameTitle ?? null,
    page: typeof params.page === 'number' && params.page >= 0 ? params.page : 0,
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
  return encodeFilterUrlParams({
    gender: state.gender === 'Both' ? undefined : state.gender,
    letter: state.letter ?? undefined,
    macroCategories: state.macroCategories.size
      ? [...state.macroCategories]
      : undefined,
    rawCategories: state.rawCategories.size
      ? [...state.rawCategories]
      : undefined,
    selectedNameTitle: state.selectedNameTitle ?? undefined,
    page: state.page || undefined,
  });
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...computeInitialState(),

  setGender: (gender) => set({ gender }),

  setLetter: (letter) => set({ letter }),

  toggleMacro: (macro) =>
    set((s) => {
      const next = new Set(s.macroCategories);
      if (next.has(macro)) next.delete(macro);
      else next.add(macro);
      return { macroCategories: next };
    }),

  toggleRaw: (rawCategoryId) =>
    set((s) => {
      const next = new Set(s.rawCategories);
      if (next.has(rawCategoryId)) next.delete(rawCategoryId);
      else next.add(rawCategoryId);
      return { rawCategories: next };
    }),

  setSelectedNameTitle: (selectedNameTitle) => set({ selectedNameTitle }),

  setPage: (page) => set({ page }),

  clearFilters: () =>
    set({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      page: 0,
    }),
}));
