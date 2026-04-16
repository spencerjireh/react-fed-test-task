import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFilterStore } from '../stores/filter-store';
import type { Name } from '../types';

import { useFilteredNames } from './use-filtered-names';

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
  categories: ['funny'],
  macroCategories: ['Funny'],
});
const coco = buildName('c', 'Coco', {
  gender: ['F'],
  categories: ['funny'],
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

    act(() => useFilterStore.getState().setSelectedNameId('a'));
    act(() => useFilterStore.getState().setPage(3));
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

  it('keeps a name hitting only the macro set when rawCategories is also non-empty', () => {
    const { result } = renderHook(() => useFilteredNames(names));

    act(() => useFilterStore.getState().toggleMacro('International'));
    act(() => useFilterStore.getState().toggleRaw('funny'));

    expect(result.current.map((n) => n.id).sort()).toEqual(['a', 'b', 'c']);
  });

  it('keeps a name hitting only the raw set when macroCategories is also non-empty', () => {
    const { result } = renderHook(() => useFilteredNames(names));

    act(() => useFilterStore.getState().toggleMacro('Funny'));
    act(() => useFilterStore.getState().toggleRaw('greek'));

    expect(result.current.map((n) => n.id).sort()).toEqual(['a', 'b', 'c']);
  });
});
