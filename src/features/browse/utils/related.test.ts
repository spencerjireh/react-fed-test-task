import { describe, expect, it } from 'vitest';

import type { Name } from '../types';

import { relatedNames } from './related';

function buildName(id: string, title: string, categories: string[] = []): Name {
  return {
    id,
    title,
    initial: title[0].toUpperCase(),
    definition: '',
    definitionText: '',
    gender: [],
    categories,
    macroCategories: [],
  };
}

const current = buildName('current', 'Andromeda', ['cat-a', 'cat-b', 'cat-c']);
const twoOverlap = buildName('two-a', 'Astro', ['cat-a', 'cat-b']);
const twoOverlapBLater = buildName('two-b', 'Beta', ['cat-a', 'cat-b']);
const oneOverlap = buildName('one-a', 'Cosmo', ['cat-a']);
const oneOverlapZ = buildName('one-z', 'Zed', ['cat-c']);
const threeOverlap = buildName('three', 'Zephyr', ['cat-a', 'cat-b', 'cat-c']);
const noOverlap = buildName('none', 'Unrelated', ['cat-x']);

describe('relatedNames', () => {
  it('returns [] when the current id is not found', () => {
    expect(relatedNames([current], 'missing-id')).toEqual([]);
  });

  it('returns [] when no other name shares a category', () => {
    expect(relatedNames([current, noOverlap], 'current')).toEqual([]);
  });

  it('excludes the current name from its own related list', () => {
    const result = relatedNames([current, twoOverlap], 'current');
    expect(result.every((n) => n.id !== 'current')).toBe(true);
  });

  it('orders by overlap descending', () => {
    const names = [current, oneOverlap, threeOverlap, twoOverlap];
    const result = relatedNames(names, 'current');
    expect(result.map((n) => n.id)).toEqual(['three', 'two-a', 'one-a']);
  });

  it('tie-breaks alphabetically by title when overlap is equal', () => {
    const names = [current, twoOverlapBLater, twoOverlap];
    const result = relatedNames(names, 'current');
    // Both have overlap 2; Astro precedes Beta alphabetically.
    expect(result.map((n) => n.title)).toEqual(['Astro', 'Beta']);
  });

  it('respects the limit parameter (default 3)', () => {
    const names = [current, oneOverlap, twoOverlap, threeOverlap, oneOverlapZ];
    expect(relatedNames(names, 'current')).toHaveLength(3);
    expect(relatedNames(names, 'current', 2)).toHaveLength(2);
    expect(relatedNames(names, 'current', 10)).toHaveLength(4);
  });

  it('ignores names with no category overlap entirely', () => {
    const names = [current, twoOverlap, noOverlap];
    const result = relatedNames(names, 'current');
    expect(result.map((n) => n.id)).toEqual(['two-a']);
  });
});
