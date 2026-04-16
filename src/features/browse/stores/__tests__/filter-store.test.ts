import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import {
  computeInitialState,
  LOCAL_STORAGE_KEY,
  serializeFilterStateToUrl,
  useFilterStore,
} from '../filter-store';

function resetUrl(): void {
  window.history.replaceState({}, '', '/');
}

beforeEach(() => {
  resetUrl();
  window.localStorage.clear();
});

describe('computeInitialState', () => {
  it('defaults to Both/null/empty when no URL or localStorage state exists', () => {
    const state = computeInitialState();
    expect(state.gender).toBe('Both');
    expect(state.letter).toBeNull();
    expect(state.macroCategories.size).toBe(0);
    expect(state.rawCategories.size).toBe(0);
    expect(state.selectedNameTitle).toBeNull();
    expect(state.page).toBe(0);
  });

  it('hydrates from URL when filter keys are present (URL wins over storage)', () => {
    window.history.replaceState({}, '', '/?g=F&l=C&mc=Famous,Funny&p=2');
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        gender: 'M',
        letter: 'Z',
        macroCategories: ['Joyful'],
        rawCategories: [],
        selectedNameTitle: null,
        page: 9,
      }),
    );
    const state = computeInitialState();
    expect(state.gender).toBe('F');
    expect(state.letter).toBe('C');
    expect(state.macroCategories).toEqual(new Set(['Famous', 'Funny']));
    expect(state.page).toBe(2);
  });

  it('hydrates from localStorage when URL has no filter keys', () => {
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        gender: 'M',
        letter: 'A',
        macroCategories: ['Famous'],
        rawCategories: ['raw-1'],
        selectedNameTitle: 'name-1',
        page: 4,
      }),
    );
    const state = computeInitialState();
    expect(state.gender).toBe('M');
    expect(state.letter).toBe('A');
    expect(state.macroCategories).toEqual(new Set(['Famous']));
    expect(state.rawCategories).toEqual(new Set(['raw-1']));
    expect(state.selectedNameTitle).toBe('name-1');
    expect(state.page).toBe(4);
  });

  it('drops invalid URL values (unknown gender, unknown macro)', () => {
    window.history.replaceState({}, '', '/?g=X&mc=Famous,NotAMacro,Joyful');
    const state = computeInitialState();
    expect(state.gender).toBe('Both');
    expect(state.macroCategories).toEqual(new Set(['Famous', 'Joyful']));
  });

  it('drops invalid localStorage payloads gracefully', () => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, '{not-json');
    expect(() => computeInitialState()).not.toThrow();
    expect(computeInitialState().gender).toBe('Both');
  });
});

describe('useFilterStore actions', () => {
  it('setGender updates the store and mirrors to localStorage', () => {
    act(() => useFilterStore.getState().setGender('F'));
    expect(useFilterStore.getState().gender).toBe('F');
    const stored = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}',
    );
    expect(stored.gender).toBe('F');
  });

  it('setLetter updates the store', () => {
    act(() => useFilterStore.getState().setLetter('K'));
    expect(useFilterStore.getState().letter).toBe('K');
  });

  it('setSelectedNameTitle updates the store', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('abc'));
    expect(useFilterStore.getState().selectedNameTitle).toBe('abc');
  });

  it('setPage updates the store', () => {
    act(() => useFilterStore.getState().setPage(7));
    expect(useFilterStore.getState().page).toBe(7);
  });

  it('toggleMacro produces a new Set reference each call', () => {
    const before = useFilterStore.getState().macroCategories;
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    const after = useFilterStore.getState().macroCategories;
    expect(after).not.toBe(before);
    expect(after.has('Famous')).toBe(true);
  });

  it('toggleMacro toggles on and off', () => {
    act(() => {
      useFilterStore.getState().toggleMacro('Famous');
    });
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(true);
    act(() => {
      useFilterStore.getState().toggleMacro('Famous');
    });
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(false);
  });

  it('toggleRaw produces a new Set and toggles membership', () => {
    const before = useFilterStore.getState().rawCategories;
    act(() => useFilterStore.getState().toggleRaw('raw-42'));
    const after = useFilterStore.getState().rawCategories;
    expect(after).not.toBe(before);
    expect(after.has('raw-42')).toBe(true);
  });

  it('clearFilters resets all filter slices but preserves selectedNameTitle', () => {
    act(() => {
      useFilterStore.getState().setGender('M');
      useFilterStore.getState().setLetter('A');
      useFilterStore.getState().toggleMacro('Famous');
      useFilterStore.getState().toggleRaw('raw-1');
      useFilterStore.getState().setSelectedNameTitle('name-123');
      useFilterStore.getState().setPage(3);
    });

    act(() => useFilterStore.getState().clearFilters());

    const s = useFilterStore.getState();
    expect(s.gender).toBe('Both');
    expect(s.letter).toBeNull();
    expect(s.macroCategories.size).toBe(0);
    expect(s.rawCategories.size).toBe(0);
    expect(s.page).toBe(0);
    // selectedNameTitle persists so the open detail pane doesn't get dismissed.
    expect(s.selectedNameTitle).toBe('name-123');
  });

  it('mirrors to localStorage on every mutation', () => {
    act(() => {
      useFilterStore.getState().toggleMacro('Joyful');
      useFilterStore.getState().toggleRaw('raw-xyz');
      useFilterStore.getState().setGender('F');
    });
    const stored = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY) ?? '{}',
    );
    expect(stored.gender).toBe('F');
    expect(stored.macroCategories).toContain('Joyful');
    expect(stored.rawCategories).toContain('raw-xyz');
  });
});

describe('serializeFilterStateToUrl', () => {
  it('returns empty string for the default state (nothing to share)', () => {
    expect(serializeFilterStateToUrl(useFilterStore.getState())).toBe('');
  });

  it('round-trips through URL encoding', () => {
    act(() => {
      useFilterStore.getState().setGender('F');
      useFilterStore.getState().setLetter('C');
      useFilterStore.getState().toggleMacro('Famous');
      useFilterStore.getState().toggleMacro('Funny');
      useFilterStore.getState().setPage(2);
    });
    const url = serializeFilterStateToUrl(useFilterStore.getState());
    window.history.replaceState({}, '', `/?${url}`);
    const hydrated = computeInitialState();
    expect(hydrated.gender).toBe('F');
    expect(hydrated.letter).toBe('C');
    expect(hydrated.macroCategories).toEqual(new Set(['Famous', 'Funny']));
    expect(hydrated.page).toBe(2);
  });

  it('omits page 0 and Both so the default state produces a clean URL', () => {
    act(() => useFilterStore.getState().setGender('Both'));
    act(() => useFilterStore.getState().setPage(0));
    expect(serializeFilterStateToUrl(useFilterStore.getState())).toBe('');
  });

  it('round-trips a title containing a space', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('Captain Hook'));
    const url = serializeFilterStateToUrl(useFilterStore.getState());
    window.history.replaceState({}, '', `/?${url}`);
    expect(computeInitialState().selectedNameTitle).toBe('Captain Hook');
  });

  it('round-trips a title with a non-ASCII accent', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('Xiáng'));
    const url = serializeFilterStateToUrl(useFilterStore.getState());
    window.history.replaceState({}, '', `/?${url}`);
    expect(computeInitialState().selectedNameTitle).toBe('Xiáng');
  });
});
