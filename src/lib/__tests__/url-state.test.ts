import { describe, expect, it } from 'vitest';

import {
  decodeFilterUrlParams,
  encodeFilterUrlParams,
  hasFilterUrlParams,
} from '../url-state';

describe('encodeFilterUrlParams', () => {
  it('returns an empty string when no params are set', () => {
    expect(encodeFilterUrlParams({})).toBe('');
  });

  it('encodes each slice to its short key', () => {
    const encoded = encodeFilterUrlParams({
      gender: 'M',
      letter: 'A',
      macroCategories: ['Famous', 'Funny'],
      rawCategories: ['raw-1', 'raw-2'],
      selectedNameId: 'name-42',
      page: 3,
    });
    const params = new URLSearchParams(encoded);
    expect(params.get('g')).toBe('M');
    expect(params.get('l')).toBe('A');
    expect(params.get('mc')).toBe('Famous,Funny');
    expect(params.get('rc')).toBe('raw-1,raw-2');
    expect(params.get('n')).toBe('name-42');
    expect(params.get('p')).toBe('3');
  });

  it('omits empty arrays — absent keys, not empty keys', () => {
    expect(
      encodeFilterUrlParams({ macroCategories: [], rawCategories: [] }),
    ).toBe('');
  });

  it('omits page 0 as a default', () => {
    expect(encodeFilterUrlParams({ page: 0 })).toBe('');
  });

  it('keeps pages greater than 0', () => {
    expect(encodeFilterUrlParams({ page: 1 })).toBe('p=1');
  });

  it('omits undefined / empty-string slices', () => {
    expect(
      encodeFilterUrlParams({
        gender: '',
        letter: undefined,
        selectedNameId: '',
      }),
    ).toBe('');
  });
});

describe('decodeFilterUrlParams', () => {
  it('returns an empty object for an empty search', () => {
    expect(decodeFilterUrlParams('')).toEqual({});
  });

  it('ignores unknown keys', () => {
    expect(decodeFilterUrlParams('foo=bar&baz=qux')).toEqual({});
  });

  it('parses every slice it recognizes', () => {
    const params = decodeFilterUrlParams(
      'g=F&l=C&mc=Famous,Joyful&rc=abc,def&n=name-1&p=5',
    );
    expect(params).toEqual({
      gender: 'F',
      letter: 'C',
      macroCategories: ['Famous', 'Joyful'],
      rawCategories: ['abc', 'def'],
      selectedNameId: 'name-1',
      page: 5,
    });
  });

  it('accepts a URLSearchParams instance directly', () => {
    const src = new URLSearchParams('g=M&p=2');
    expect(decodeFilterUrlParams(src)).toEqual({ gender: 'M', page: 2 });
  });

  it('skips empty-string slices (treats them as absent)', () => {
    expect(decodeFilterUrlParams('g=&l=')).toEqual({});
  });

  it('drops invalid page values', () => {
    expect(decodeFilterUrlParams('p=-1').page).toBeUndefined();
    expect(decodeFilterUrlParams('p=abc').page).toBeUndefined();
    expect(decodeFilterUrlParams('p=NaN').page).toBeUndefined();
  });

  it('keeps page=0 when explicitly provided', () => {
    // Redundant with defaults, but decoding should be lossless for valid ints.
    expect(decodeFilterUrlParams('p=0').page).toBe(0);
  });

  it('skips empty tokens in macroCategories and rawCategories', () => {
    expect(decodeFilterUrlParams('mc=,Famous,,Funny,').macroCategories).toEqual(
      ['Famous', 'Funny'],
    );
    expect(decodeFilterUrlParams('rc=,,').rawCategories).toBeUndefined();
  });

  it('decodes URL-encoded values transparently', () => {
    // "Food and drinks" contains spaces, which URLSearchParams percent-encodes.
    const encoded = encodeFilterUrlParams({
      macroCategories: ['Food and drinks', "Pet's size"],
    });
    expect(decodeFilterUrlParams(encoded).macroCategories).toEqual([
      'Food and drinks',
      "Pet's size",
    ]);
  });
});

describe('round-trip', () => {
  it('preserves any valid input through encode → decode', () => {
    const input = {
      gender: 'F',
      letter: 'Ñ',
      macroCategories: ['Famous', "Pet's size"],
      rawCategories: ['019c8a34-3585-7249-b7c2-a4f85945291e'],
      selectedNameId: '019c8a34-3f34-70c8-8f5e-3657bb9b328b',
      page: 7,
    };
    expect(decodeFilterUrlParams(encodeFilterUrlParams(input))).toEqual(input);
  });
});

describe('hasFilterUrlParams', () => {
  it('returns true when any known key is present', () => {
    expect(hasFilterUrlParams('g=M')).toBe(true);
    expect(hasFilterUrlParams('p=0')).toBe(true);
    expect(hasFilterUrlParams('mc=Famous')).toBe(true);
  });

  it('returns false when no known keys are present', () => {
    expect(hasFilterUrlParams('')).toBe(false);
    expect(hasFilterUrlParams('foo=bar')).toBe(false);
  });
});
