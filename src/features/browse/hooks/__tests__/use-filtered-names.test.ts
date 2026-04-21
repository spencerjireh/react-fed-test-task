import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFilterStore } from '../../stores/filter-store';
import type { Name } from '../../types';
import { getRawIdsForMacro } from '../../utils/macro-category-map';
import { useFilteredNames } from '../use-filtered-names';

const FUNNY_RAW_IDS = getRawIdsForMacro('Funny');
const ANY_FUNNY_ID = FUNNY_RAW_IDS[0];

function buildName(
  id: string,
  title: string,
  overrides: Partial<Name> = {},
): Name {
  return {
    id,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: [],
    categories: [],
    macroCategories: [],
    ...overrides,
  };
}

const andromeda = buildName('a', 'Andromeda', {
  gender: ['F'],
  categories: ['greek'],
  macroCategories: ['International'],
});
const bandit = buildName('b', 'Bandit', {
  gender: ['M'],
  categories: [ANY_FUNNY_ID],
  macroCategories: ['Funny'],
});
const coco = buildName('c', 'Coco', {
  gender: ['F'],
  categories: [ANY_FUNNY_ID],
  macroCategories: ['Funny'],
});

const names = [andromeda, bandit, coco];

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('useFilteredNames', () => {
  it("returns everything when the store is at its default ('Both', no filters)", () => {
    const { result } = renderHook(() => useFilteredNames(names));
    expect(result.current).toHaveLength(3);
  });

  it('updates when gender changes', () => {
    const { result } = renderHook(() => useFilteredNames(names));
    act(() => useFilterStore.getState().setGender('F'));
    expect(result.current.map((n) => n.id)).toEqual(['a', 'c']);
  });

  it('updates when a macro category is toggled on', () => {
    const { result } = renderHook(() => useFilteredNames(names));
    act(() => useFilterStore.getState().toggleMacro('Funny'));
    expect(result.current.map((n) => n.id)).toEqual(['b', 'c']);
  });

  it('keeps reference stable when unrelated store slices change', () => {
    const { result, rerender } = renderHook(() => useFilteredNames(names));
    const first = result.current;

    act(() => useFilterStore.getState().setSelectedNameTitle('a'));
    act(() => useFilterStore.getState().setSelectedNameTitle('b'));
    rerender();

    expect(result.current).toBe(first);
  });

  it('produces a new array when filter input changes', () => {
    const { result } = renderHook(() => useFilteredNames(names));
    const first = result.current;
    act(() => useFilterStore.getState().setLetter('A'));
    expect(result.current).not.toBe(first);
    expect(result.current.map((n) => n.id)).toEqual(['a']);
  });
});
