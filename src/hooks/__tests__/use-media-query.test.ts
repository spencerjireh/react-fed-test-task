import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from '../use-media-query';

type ChangeHandler = (event: MediaQueryListEvent) => void;

function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<ChangeHandler>();
  const mql = {
    matches: initialMatches,
    media: '',
    onchange: null,
    addEventListener: vi.fn((_: string, h: ChangeHandler) => listeners.add(h)),
    removeEventListener: vi.fn((_: string, h: ChangeHandler) =>
      listeners.delete(h),
    ),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  } as unknown as MediaQueryList;

  const fire = (matches: boolean) => {
    (mql as unknown as { matches: boolean }).matches = matches;
    const event = { matches } as MediaQueryListEvent;
    listeners.forEach((h) => h(event));
  };

  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  );
  window.matchMedia = window.matchMedia ?? (() => mql);
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: () => mql,
  });

  return { mql, fire };
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the initial match from matchMedia', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('re-renders when the media query result changes', () => {
    const { fire } = stubMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(max-width: 767px)'));
    expect(result.current).toBe(false);

    act(() => fire(true));
    expect(result.current).toBe(true);

    act(() => fire(false));
    expect(result.current).toBe(false);
  });

  it('cleans up the change listener on unmount', () => {
    const { mql } = stubMatchMedia(true);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1280px)'));
    unmount();
    expect(mql.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    );
  });
});
