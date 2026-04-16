import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  computeInitialState,
  serializeFilterStateToUrl,
  useFilterStore,
} from '../filter-store';

function resetUrl(): void {
  window.history.replaceState({}, '', '/');
}

beforeEach(() => {
  resetUrl();
});

const FAMOUS_RAW_IDS = [
  '019c8a34-3585-7249-b7c2-a4f85945291e',
  '019c8a34-35ed-737c-acff-a43af999817c',
  '019c8a34-35f2-70b1-b866-69a4921d15a8',
  '019c8a34-360b-735c-88e7-5d86357a91a2',
  '019c8a34-3611-73a8-90ac-bbacd3959385',
  '019c8a34-3614-71a6-b955-df5540ecdfce',
  '019c8a34-361c-73fb-b8c9-db6b77d32feb',
] as const;
const CARTOON_ID = FAMOUS_RAW_IDS[0];
const DISNEY_ID = FAMOUS_RAW_IDS[2];
const UNUSUAL_ID = '019c8a34-362d-7087-99c4-1a4eb48d3f6b';

describe('computeInitialState', () => {
  it('defaults to Both/null/empty when the URL has no filter params', () => {
    const state = computeInitialState();
    expect(state.gender).toBe('Both');
    expect(state.letter).toBeNull();
    expect(state.macroCategories.size).toBe(0);
    expect(state.rawCategories.size).toBe(0);
    expect(state.selectedNameTitle).toBeNull();
  });

  it('hydrates from URL when filter keys are present', () => {
    window.history.replaceState({}, '', '/?g=F&l=C&mc=Famous,Funny');
    const state = computeInitialState();
    expect(state.gender).toBe('F');
    expect(state.letter).toBe('C');
    expect(state.macroCategories).toEqual(new Set(['Famous', 'Funny']));
  });

  it('drops invalid URL values (unknown gender, unknown macro)', () => {
    window.history.replaceState({}, '', '/?g=X&mc=Famous,NotAMacro,Joyful');
    const state = computeInitialState();
    expect(state.gender).toBe('Both');
    expect(state.macroCategories).toEqual(new Set(['Famous', 'Joyful']));
  });

  it('expands a macro-only URL so hydration pulls in all of its child raws', () => {
    window.history.replaceState({}, '', '/?mc=Famous');
    const state = computeInitialState();
    expect(state.macroCategories).toEqual(new Set(['Famous']));
    for (const id of FAMOUS_RAW_IDS)
      expect(state.rawCategories.has(id)).toBe(true);
  });

  it('promotes a macro when every child raw arrives via the URL without a mc= entry', () => {
    const rc = FAMOUS_RAW_IDS.join(',');
    window.history.replaceState({}, '', `/?rc=${rc}`);
    const state = computeInitialState();
    expect(state.macroCategories.has('Famous')).toBe(true);
  });
});

describe('useFilterStore actions', () => {
  it('setGender updates the store', () => {
    act(() => useFilterStore.getState().setGender('F'));
    expect(useFilterStore.getState().gender).toBe('F');
  });

  it('setLetter updates the store', () => {
    act(() => useFilterStore.getState().setLetter('K'));
    expect(useFilterStore.getState().letter).toBe('K');
  });

  it('setSelectedNameTitle updates the store', () => {
    act(() => useFilterStore.getState().setSelectedNameTitle('abc'));
    expect(useFilterStore.getState().selectedNameTitle).toBe('abc');
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

  it('toggleMacro from empty pulls every child raw into the store', () => {
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    const s = useFilterStore.getState();
    expect(s.macroCategories.has('Famous')).toBe(true);
    for (const id of FAMOUS_RAW_IDS) expect(s.rawCategories.has(id)).toBe(true);
    expect(s.rawCategories.size).toBe(FAMOUS_RAW_IDS.length);
  });

  it('toggleMacro from fully-checked state clears both the macro and its raws', () => {
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    const s = useFilterStore.getState();
    expect(s.macroCategories.has('Famous')).toBe(false);
    for (const id of FAMOUS_RAW_IDS)
      expect(s.rawCategories.has(id)).toBe(false);
  });

  it('toggleRaw promotes the parent macro when the last missing child flips on', () => {
    act(() => {
      const toggle = useFilterStore.getState().toggleRaw;
      for (const id of FAMOUS_RAW_IDS) if (id !== CARTOON_ID) toggle(id);
    });
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(false);

    act(() => useFilterStore.getState().toggleRaw(CARTOON_ID));
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(true);
  });

  it('toggleRaw demotes the parent macro when any child flips off', () => {
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(true);

    act(() => useFilterStore.getState().toggleRaw(DISNEY_ID));
    const s = useFilterStore.getState();
    expect(s.macroCategories.has('Famous')).toBe(false);
    expect(s.rawCategories.has(DISNEY_ID)).toBe(false);
  });

  it('toggleRaw on Cartoon (Famous+Funny) can break Famous while Funny stays incomplete', () => {
    act(() => useFilterStore.getState().toggleMacro('Famous'));
    expect(useFilterStore.getState().macroCategories.has('Famous')).toBe(true);
    expect(useFilterStore.getState().macroCategories.has('Funny')).toBe(false);

    act(() => useFilterStore.getState().toggleRaw(CARTOON_ID));
    const s = useFilterStore.getState();
    expect(s.macroCategories.has('Famous')).toBe(false);
    expect(s.macroCategories.has('Funny')).toBe(false);
    expect(s.rawCategories.has(CARTOON_ID)).toBe(false);
  });

  it('toggleRaw on Unusual completes Funny when Cartoon and Disney are already in', () => {
    act(() => {
      useFilterStore.getState().toggleRaw(CARTOON_ID);
      useFilterStore.getState().toggleRaw(DISNEY_ID);
    });
    expect(useFilterStore.getState().macroCategories.has('Funny')).toBe(false);

    act(() => useFilterStore.getState().toggleRaw(UNUSUAL_ID));
    expect(useFilterStore.getState().macroCategories.has('Funny')).toBe(true);
  });

  it('goToResults writes gender=M and letter=A in a single subscribe tick', () => {
    const subscriber = vi.fn();
    const unsubscribe = useFilterStore.subscribe(subscriber);

    act(() => useFilterStore.getState().goToResults());

    // Two serial setters would emit two ticks and flash ?g=M in the URL between them.
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(useFilterStore.getState().gender).toBe('M');
    expect(useFilterStore.getState().letter).toBe('A');

    unsubscribe();
  });

  it('goToCover resets every slice including selectedNameTitle', () => {
    act(() => {
      useFilterStore.getState().setGender('M');
      useFilterStore.getState().setLetter('A');
      useFilterStore.getState().toggleMacro('Famous');
      useFilterStore.getState().toggleRaw('raw-9');
      useFilterStore.getState().setSelectedNameTitle('Ace');
    });

    act(() => useFilterStore.getState().goToCover());

    const s = useFilterStore.getState();
    expect(s.gender).toBe('Both');
    expect(s.letter).toBeNull();
    expect(s.macroCategories.size).toBe(0);
    expect(s.rawCategories.size).toBe(0);
    expect(s.selectedNameTitle).toBeNull();
  });

  it('goToCover from Results state serializes to a bare URL', () => {
    act(() => useFilterStore.getState().goToResults());
    act(() => useFilterStore.getState().goToCover());
    expect(serializeFilterStateToUrl(useFilterStore.getState())).toBe('');
  });

  it('goToCover writes every reset slice in a single subscribe tick', () => {
    act(() => useFilterStore.getState().goToResults());

    const subscriber = vi.fn();
    const unsubscribe = useFilterStore.subscribe(subscriber);

    act(() => useFilterStore.getState().goToCover());

    // Serial setters would flash partial URLs between ticks.
    expect(subscriber).toHaveBeenCalledTimes(1);

    unsubscribe();
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
    });
    const url = serializeFilterStateToUrl(useFilterStore.getState());
    window.history.replaceState({}, '', `/?${url}`);
    const hydrated = computeInitialState();
    expect(hydrated.gender).toBe('F');
    expect(hydrated.letter).toBe('C');
    expect(hydrated.macroCategories).toEqual(new Set(['Famous', 'Funny']));
  });

  it('omits Both so the default state produces a clean URL', () => {
    act(() => useFilterStore.getState().setGender('Both'));
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
