import { afterEach, describe, expect, it, vi } from 'vitest';

import { getJson, removeJson, setJson } from './local-storage';

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe('getJson', () => {
  it('returns null when the key is missing', () => {
    expect(getJson('missing')).toBeNull();
  });

  it('returns parsed JSON when the key is present', () => {
    window.localStorage.setItem('user', JSON.stringify({ name: 'Ada' }));
    expect(getJson<{ name: string }>('user')).toEqual({ name: 'Ada' });
  });

  it('returns null when the stored value is not valid JSON', () => {
    window.localStorage.setItem('broken', '{not-json');
    expect(getJson('broken')).toBeNull();
  });

  it('returns null if localStorage.getItem throws', () => {
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(getJson('anything')).toBeNull();
  });
});

describe('setJson', () => {
  it('writes a JSON-serialized value', () => {
    setJson('filter', { gender: 'Both', page: 0 });
    expect(window.localStorage.getItem('filter')).toBe(
      JSON.stringify({ gender: 'Both', page: 0 }),
    );
  });

  it('swallows quota errors without throwing', () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => setJson('filter', { page: 0 })).not.toThrow();
  });

  it('swallows serialization errors (e.g. BigInt)', () => {
    // JSON.stringify throws on BigInt — we should catch it, not propagate.
    expect(() => setJson('bad', { n: 1n })).not.toThrow();
  });
});

describe('removeJson', () => {
  it('removes the key', () => {
    window.localStorage.setItem('key', '"value"');
    removeJson('key');
    expect(window.localStorage.getItem('key')).toBeNull();
  });

  it('does not throw if removeItem throws', () => {
    vi.spyOn(window.localStorage, 'removeItem').mockImplementation(() => {
      throw new Error('denied');
    });
    expect(() => removeJson('key')).not.toThrow();
  });
});
