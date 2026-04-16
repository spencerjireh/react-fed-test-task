import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useFilterStore } from '../../stores/filter-store';
import type { Gender, Name } from '../../types';
import { useReconcileSelection } from '../use-reconcile-selection';

const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const CELEBRITIES_ID = '019c8a34-35ed-737c-acff-a43af999817c';

function buildName(overrides: Partial<Name>): Name {
  const title = overrides.title ?? 'Aaron';
  return {
    id: `${title}-id`,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: ['M'] as Gender[],
    categories: [CARTOON_ID],
    macroCategories: ['Famous', 'Funny'],
    ...overrides,
  };
}

const AARON = buildName({ title: 'Aaron', gender: ['M'] });
const BELLA = buildName({ title: 'Bella', gender: ['F'] });
const names = [AARON, BELLA];

let mockedData: Name[] | undefined = names;

vi.mock('../../api/get-names', () => ({
  useNames: () => ({ data: mockedData }),
}));

beforeEach(() => {
  mockedData = names;
  window.history.replaceState({}, '', '/');
});

describe('useReconcileSelection', () => {
  it('no-ops when names data is not yet available', () => {
    mockedData = undefined;
    useFilterStore.setState({ selectedNameTitle: 'Aaron' });

    renderHook(() => useReconcileSelection());

    expect(useFilterStore.getState().selectedNameTitle).toBe('Aaron');
  });

  it('no-ops when the selection still matches the current filters', () => {
    useFilterStore.setState({ selectedNameTitle: 'Aaron', letter: 'A' });

    renderHook(() => useReconcileSelection());

    expect(useFilterStore.getState().selectedNameTitle).toBe('Aaron');
  });

  it('clears the selection when the letter filter no longer matches', () => {
    useFilterStore.setState({ selectedNameTitle: 'Aaron' });

    const { rerender } = renderHook(() => useReconcileSelection());

    act(() => useFilterStore.getState().setLetter('B'));
    rerender();

    expect(useFilterStore.getState().selectedNameTitle).toBeNull();
  });

  it('clears the selection when the gender filter excludes the name', () => {
    useFilterStore.setState({ selectedNameTitle: 'Aaron' });

    const { rerender } = renderHook(() => useReconcileSelection());

    act(() => useFilterStore.getState().setGender('F'));
    rerender();

    expect(useFilterStore.getState().selectedNameTitle).toBeNull();
  });

  it('clears the selection when a category filter narrows past it', () => {
    useFilterStore.setState({ selectedNameTitle: 'Aaron' });

    const { rerender } = renderHook(() => useReconcileSelection());

    act(() =>
      useFilterStore.setState({ rawCategories: new Set([CELEBRITIES_ID]) }),
    );
    rerender();

    expect(useFilterStore.getState().selectedNameTitle).toBeNull();
  });

  it('clears the selection when the title refers to a name that does not exist', () => {
    useFilterStore.setState({ selectedNameTitle: 'Ghost' });

    renderHook(() => useReconcileSelection());

    expect(useFilterStore.getState().selectedNameTitle).toBeNull();
  });
});
