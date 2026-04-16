import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFilterStore } from '../../stores/filter-store';
import type { Name } from '../../types';
import { useBrowseState } from '../use-browse-state';

function buildName(title: string): Name {
  return {
    id: `${title}-id`,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: [],
    categories: [],
    macroCategories: [],
  };
}

const names = [buildName('Aaron'), buildName('Ace')];

vi.mock('../../api/get-names', () => ({
  useNames: () => ({ data: names }),
}));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  useFilterStore.setState({
    gender: 'Both',
    letter: null,
    macroCategories: new Set(),
    rawCategories: new Set(),
    selectedNameTitle: null,
  });
});

describe('useBrowseState', () => {
  it('returns "cover" for bare defaults', () => {
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('cover');
  });

  it('returns "results" when gender is narrowed', () => {
    act(() => useFilterStore.getState().setGender('M'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('results');
  });

  it('returns "results" when a letter is set', () => {
    act(() => useFilterStore.getState().setLetter('A'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('results');
  });

  it('returns "results" when a macro category is toggled on', () => {
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('results');
  });

  it('returns "results" when a raw category is toggled on', () => {
    act(() => useFilterStore.getState().toggleRaw('raw-1'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('results');
  });

  it('returns "detail" when selection resolves — even with no filters', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('Aaron'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('detail');
  });

  it('returns "detail" when selection resolves AND filters are set', () => {
    act(() => {
      useFilterStore.getState().setGender('M');
      useFilterStore.getState().setLetter('A');
      useFilterStore.getState().setSelectedNameTitle('Aaron');
    });
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('detail');
  });

  it('returns "cover" when the selected title does not resolve and no filters are set', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('NoSuchName'));
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('cover');
  });

  it('returns "results" when the selected title does not resolve but filters are set', () => {
    act(() => {
      useFilterStore.getState().setLetter('A');
      useFilterStore.getState().setSelectedNameTitle('NoSuchName');
    });
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('results');
  });

  it('goToResults transitions cover → results', () => {
    const { result } = renderHook(() => useBrowseState());
    expect(result.current).toBe('cover');
    act(() => useFilterStore.getState().goToResults());
    expect(result.current).toBe('results');
  });
});
