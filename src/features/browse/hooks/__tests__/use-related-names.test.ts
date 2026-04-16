import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('../../api/get-names', () => ({
  useNames: () => ({ data: names }),
}));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
});

describe('useRelatedNames', () => {
  it('returns [] when no name is selected', () => {
    const { result } = renderHook(() => useRelatedNames());
    expect(result.current).toEqual([]);
  });

  it('returns top-N related when a name is selected', () => {
    const { result } = renderHook(() => useRelatedNames());
    act(() => useFilterStore.getState().setSelectedNameTitle('Andromeda'));
    expect(result.current.map((n) => n.id)).toEqual(['two', 'one']);
  });

  it('updates when selectedNameTitle changes', () => {
    const { result } = renderHook(() => useRelatedNames());
    act(() => useFilterStore.getState().setSelectedNameTitle('Andromeda'));
    const first = result.current;
    act(() => useFilterStore.getState().setSelectedNameTitle('Astro'));
    expect(result.current).not.toBe(first);
  });

  it('keeps reference stable when unrelated store slices change', () => {
    const { result, rerender } = renderHook(() => useRelatedNames());
    act(() => useFilterStore.getState().setSelectedNameTitle('Andromeda'));
    const first = result.current;
    act(() => useFilterStore.getState().setLetter('Z'));
    act(() => useFilterStore.getState().setGender('F'));
    rerender();
    expect(result.current).toBe(first);
  });

  it('respects the limit parameter', () => {
    const { result } = renderHook(() => useRelatedNames(1));
    act(() => useFilterStore.getState().setSelectedNameTitle('Andromeda'));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].id).toBe('two');
  });

  it('returns [] when the selected title matches no name', () => {
    const { result } = renderHook(() => useRelatedNames());
    act(() => useFilterStore.getState().setSelectedNameTitle('NoSuchName'));
    expect(result.current).toEqual([]);
  });
});
