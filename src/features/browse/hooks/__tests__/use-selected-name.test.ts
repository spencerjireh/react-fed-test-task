import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFilterStore } from '../../stores/filter-store';
import type { Name } from '../../types';
import { useSelectedName } from '../use-selected-name';

function buildName(id: string, title: string): Name {
  return {
    id,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: [],
    categories: [],
    macroCategories: [],
  };
}

const names = [
  buildName('aaron-id', 'Aaron'),
  buildName('captain-id', 'Captain Hook'),
  buildName('xiang-id', 'Xiáng'),
];

vi.mock('../../api/get-names', () => ({
  useNames: () => ({ data: names }),
}));

beforeEach(() => {
  window.history.replaceState({}, '', '/');
  useFilterStore.setState({ selectedNameTitle: null });
});

describe('useSelectedName', () => {
  it('returns null when no title is selected', () => {
    const { result } = renderHook(() => useSelectedName());
    expect(result.current).toBeNull();
  });

  it('resolves a matching title to its Name record', () => {
    const { result } = renderHook(() => useSelectedName());
    act(() => useFilterStore.getState().setSelectedNameTitle('Aaron'));
    expect(result.current?.id).toBe('aaron-id');
    expect(result.current?.title).toBe('Aaron');
  });

  it('resolves a title with a space', () => {
    const { result } = renderHook(() => useSelectedName());
    act(() => useFilterStore.getState().setSelectedNameTitle('Captain Hook'));
    expect(result.current?.id).toBe('captain-id');
  });

  it('resolves a title with a non-ASCII accent', () => {
    const { result } = renderHook(() => useSelectedName());
    act(() => useFilterStore.getState().setSelectedNameTitle('Xiáng'));
    expect(result.current?.id).toBe('xiang-id');
  });

  it('returns null when the title does not match any name', () => {
    const { result } = renderHook(() => useSelectedName());
    act(() => useFilterStore.getState().setSelectedNameTitle('NoSuchName'));
    expect(result.current).toBeNull();
  });
});
