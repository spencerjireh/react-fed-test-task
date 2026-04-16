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
      selectedNameTitle: 'name-42',
    });
    const params = new URLSearchParams(encoded);
    expect(params.get('g')).toBe('M');
    expect(params.get('l')).toBe('A');
    expect(params.get('mc')).toBe('Famous,Funny');
    expect(params.get('rc')).toBe('raw-1,raw-2');
    expect(params.get('n')).toBe('name-42');
  });

  it('omits empty arrays — absent keys, not empty keys', () => {
    expect(
      encodeFilterUrlParams({ macroCategories: [], rawCategories: [] }),
    ).toBe('');
  });

  it('omits undefined / empty-string slices', () => {
    expect(
      encodeFilterUrlParams({
        gender: '',
        letter: undefined,
        selectedNameTitle: '',
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
      'g=F&l=C&mc=Famous,Joyful&rc=abc,def&n=name-1',
    );
    expect(params).toEqual({
      gender: 'F',
      letter: 'C',
      macroCategories: ['Famous', 'Joyful'],
      rawCategories: ['abc', 'def'],
      selectedNameTitle: 'name-1',
    });
  });

  it('accepts a URLSearchParams instance directly', () => {
    const src = new URLSearchParams('g=M&l=A');
    expect(decodeFilterUrlParams(src)).toEqual({ gender: 'M', letter: 'A' });
  });

  it('skips empty-string slices (treats them as absent)', () => {
    expect(decodeFilterUrlParams('g=&l=')).toEqual({});
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
      selectedNameTitle: 'Aaron',
    };
    expect(decodeFilterUrlParams(encodeFilterUrlParams(input))).toEqual(input);
  });

  it('round-trips a title with a space', () => {
    const encoded = encodeFilterUrlParams({
      selectedNameTitle: 'Captain Hook',
    });
    expect(decodeFilterUrlParams(encoded).selectedNameTitle).toBe(
      'Captain Hook',
    );
  });

  it('round-trips a title with a non-ASCII accent', () => {
    const encoded = encodeFilterUrlParams({ selectedNameTitle: 'Xiáng' });
    expect(encoded).toContain('%C3%A1');
    expect(decodeFilterUrlParams(encoded).selectedNameTitle).toBe('Xiáng');
  });

  it('decodes a title written with %20 instead of + for spaces', () => {
    expect(decodeFilterUrlParams('n=Captain%20Hook').selectedNameTitle).toBe(
      'Captain Hook',
    );
  });
});

describe('hasFilterUrlParams', () => {
  it('returns true when any known key is present', () => {
    expect(hasFilterUrlParams('g=M')).toBe(true);
    expect(hasFilterUrlParams('l=A')).toBe(true);
    expect(hasFilterUrlParams('mc=Famous')).toBe(true);
  });

  it('returns false when no known keys are present', () => {
    expect(hasFilterUrlParams('')).toBe(false);
    expect(hasFilterUrlParams('foo=bar')).toBe(false);
    expect(hasFilterUrlParams('p=2')).toBe(false);
  });
});
