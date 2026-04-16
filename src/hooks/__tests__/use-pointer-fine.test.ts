import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePointerFine } from '../use-pointer-fine';

function stubMatchMedia(fine: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query === '(pointer: fine)' ? fine : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

describe('usePointerFine', () => {
  it('delegates to the `(pointer: fine)` media query', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => usePointerFine());
    expect(result.current).toBe(true);
  });

  it('returns false for coarse-pointer devices', () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => usePointerFine());
    expect(result.current).toBe(false);
  });
});
