import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useFilterStore } from '../../stores/filter-store';
import type { Name } from '../../types';
import { useRelatedNames } from '../use-related-names';

function buildName(id: string, title: string, categories: string[] = []): Name {
  return {
    id,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: [],
    categories,
    macroCategories: [],
  };
}

const current = buildName('current', 'Andromeda', ['a', 'b']);
const twoOverlap = buildName('two', 'Astro', ['a', 'b']);
const oneOverlap = buildName('one', 'Beta', ['a']);
const noOverlap = buildName('zero', 'Zebra', ['z']);

const names = [current, twoOverlap, oneOverlap, noOverlap];

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('useRelatedNames', () => {
  it('returns [] when no name is selected', () => {
    const { result } = renderHook(() => useRelatedNames(names));
    expect(result.current).toEqual([]);
  });

  it('returns top-N related when a name is selected', () => {
    const { result } = renderHook(() => useRelatedNames(names));
    act(() => useFilterStore.getState().setSelectedNameId('current'));
    expect(result.current.map((n) => n.id)).toEqual(['two', 'one']);
  });

  it('updates when selectedNameId changes', () => {
    const { result } = renderHook(() => useRelatedNames(names));
    act(() => useFilterStore.getState().setSelectedNameId('current'));
    const first = result.current;
    act(() => useFilterStore.getState().setSelectedNameId('two'));
    expect(result.current).not.toBe(first);
  });

  it('keeps reference stable when unrelated store slices change', () => {
    const { result, rerender } = renderHook(() => useRelatedNames(names));
    act(() => useFilterStore.getState().setSelectedNameId('current'));
    const first = result.current;
    act(() => useFilterStore.getState().setPage(5));
    act(() => useFilterStore.getState().setGender('F'));
    rerender();
    expect(result.current).toBe(first);
  });

  it('respects the limit parameter', () => {
    const { result } = renderHook(() => useRelatedNames(names, 1));
    act(() => useFilterStore.getState().setSelectedNameId('current'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('two');
  });
});
