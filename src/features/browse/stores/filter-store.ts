import { create } from 'zustand';

import { LETTERS } from '@/config/constants';
import { getJson, setJson } from '@/lib/local-storage';
import {
  decodeFilterUrlParams,
  encodeFilterUrlParams,
  type FilterUrlParams,
  hasFilterUrlParams,
} from '@/lib/url-state';

import type { Gender, Letter, MacroCategory } from '../types';

/**
 * Filter store. Holds the entire shareable/hydratable UI state for the
 * browse feature: which gender is selected, which letter narrows the
 * list, which macro + raw categories are toggled on, which name is
 * selected for the detail pane, and which page the chevron pagination
 * is on.
 *
 * - `gender` is a three-valued union. `'Both'` is the no-filter state.
 *   `null` is never a valid value.
 * - `macroCategories` and `rawCategories` are `Set`s; actions MUST construct
 *   a new Set on mutation so Zustand's reference-equality check triggers
 *   subscribed re-renders.
 * - `selectedNameId === null` triggers the Cover hero treatment.
 *
 * Hydration precedence runs once at module load:
 *   URL params → localStorage → defaults.
 *
 * Write-through:
 *   - localStorage mirror happens *inside* each action (pure JS, no React).
 *   - URL mirror happens in `useFilterUrlSync` (separate React hook) because
 *     it needs `useNavigate`. Decoupling means the store has zero React
 *     Router dependency.
 */

export interface FilterState {
  gender: Gender | 'Both';
  letter: Letter | null;
  macroCategories: Set<MacroCategory>;
  rawCategories: Set<string>;
  selectedNameId: string | null;
  page: number;
}

export interface FilterActions {
  setGender: (gender: Gender | 'Both') => void;
  setLetter: (letter: Letter | null) => void;
  toggleMacro: (macro: MacroCategory) => void;
  toggleRaw: (rawCategoryId: string) => void;
  setSelectedNameId: (id: string | null) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
}

export type FilterStore = FilterState & FilterActions;

export const LOCAL_STORAGE_KEY = 'filter-state';

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
  return (LETTERS as readonly string[]).includes(value);
}

const DEFAULT_STATE: FilterState = {
  gender: 'Both',
  letter: null,
  macroCategories: new Set(),
  rawCategories: new Set(),
  selectedNameId: null,
  page: 0,
};

/**
 * Serialize state → plain JSON for localStorage. Sets become arrays.
 * Kept separate from the URL encoding because localStorage preserves the
 * exact shape (including defaults), while URLs elide defaults.
 */
interface PersistedFilterState {
  gender: Gender | 'Both';
  letter: Letter | null;
  macroCategories: string[];
  rawCategories: string[];
  selectedNameId: string | null;
  page: number;
}

function toPersisted(state: FilterState): PersistedFilterState {
  return {
    gender: state.gender,
    letter: state.letter,
    macroCategories: [...state.macroCategories],
    rawCategories: [...state.rawCategories],
    selectedNameId: state.selectedNameId,
    page: state.page,
  };
}

function fromPersisted(persisted: PersistedFilterState): FilterState {
  const gender: Gender | 'Both' =
    persisted.gender === 'M' || persisted.gender === 'F'
      ? persisted.gender
      : 'Both';
  const letter =
    persisted.letter && isLetter(persisted.letter) ? persisted.letter : null;
  return {
    gender,
    letter,
    macroCategories: new Set(
      (persisted.macroCategories ?? []).filter(isMacroCategory),
    ),
    rawCategories: new Set(persisted.rawCategories ?? []),
    selectedNameId:
      typeof persisted.selectedNameId === 'string'
        ? persisted.selectedNameId
        : null,
    page:
      Number.isFinite(persisted.page) && persisted.page >= 0
        ? persisted.page
        : 0,
  };
}

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
    selectedNameId: params.selectedNameId ?? null,
    page: typeof params.page === 'number' && params.page >= 0 ? params.page : 0,
  };
}

/**
 * Build the starting state at module load. URL wins if any filter key is
 * present; otherwise localStorage; otherwise defaults.
 */
export function computeInitialState(): FilterState {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  const search = window.location.search;
  if (hasFilterUrlParams(search)) {
    return fromUrlParams(decodeFilterUrlParams(search));
  }

  const stored = getJson<PersistedFilterState>(LOCAL_STORAGE_KEY);
  if (stored) return fromPersisted(stored);

  return DEFAULT_STATE;
}

/** Mirror state into localStorage after every mutation. Best-effort. */
function persist(state: FilterState): void {
  setJson(LOCAL_STORAGE_KEY, toPersisted(state));
}

/**
 * Produce the next state the way Zustand expects — returning the patched
 * slice — while also mirroring the *full* next state to localStorage as a
 * side effect. Using this helper inside every action keeps the persist call
 * centralized instead of scattered.
 */
function withPersist<P extends Partial<FilterState>>(
  state: FilterState,
  patch: P,
): P {
  persist({ ...state, ...patch });
  return patch;
}

/** Encode the current state to a URL query string (used by useFilterUrlSync). */
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
    selectedNameId: state.selectedNameId ?? undefined,
    page: state.page || undefined,
  });
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...computeInitialState(),

  setGender: (gender) => set((s) => withPersist(s, { gender })),

  setLetter: (letter) => set((s) => withPersist(s, { letter })),

  toggleMacro: (macro) =>
    set((s) => {
      const next = new Set(s.macroCategories);
      if (next.has(macro)) next.delete(macro);
      else next.add(macro);
      return withPersist(s, { macroCategories: next });
    }),

  toggleRaw: (rawCategoryId) =>
    set((s) => {
      const next = new Set(s.rawCategories);
      if (next.has(rawCategoryId)) next.delete(rawCategoryId);
      else next.add(rawCategoryId);
      return withPersist(s, { rawCategories: next });
    }),

  setSelectedNameId: (selectedNameId) =>
    set((s) => withPersist(s, { selectedNameId })),

  setPage: (page) => set((s) => withPersist(s, { page })),

  clearFilters: () =>
    // clearFilters resets every *filter* slice; selectedNameId stays so the
    // user's currently-open detail pane survives a "clear filters" click.
    // page resets because the list is about to change shape.
    set((s) =>
      withPersist(s, {
        gender: 'Both',
        letter: null,
        macroCategories: new Set(),
        rawCategories: new Set(),
        page: 0,
      }),
    ),
}));
