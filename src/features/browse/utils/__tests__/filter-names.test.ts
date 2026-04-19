import { describe, expect, it } from 'vitest';

import type { FilterState } from '../../stores/filter-store';
import type { Name } from '../../types';
import { filterNames } from '../filter-names';

// Small fixture set for each filter branch.
function buildName(
  partial: Partial<Name> & { id: string; title: string },
): Name {
  return {
    id: partial.id,
    title: partial.title,
    initial: partial.initial ?? partial.title[0].toUpperCase(),
    definition: partial.definition ?? '',
    definitionText: partial.definitionText ?? '',
    gender: partial.gender ?? [],
    categories: partial.categories ?? [],
    macroCategories: partial.macroCategories ?? [],
  };
}

function buildState(
  overrides: Partial<
    Pick<FilterState, 'gender' | 'letter' | 'rawCategories'>
  > = {},
): Pick<FilterState, 'gender' | 'letter' | 'rawCategories'> {
  return {
    gender: 'Both',
    letter: null,
    rawCategories: new Set<string>(),
    ...overrides,
  };
}

const andromeda = buildName({
  id: 'andromeda',
  title: 'Andromeda',
  gender: ['F'],
  categories: ['cat-greek'],
  macroCategories: ['International'],
});

const alpha = buildName({
  id: 'alpha',
  title: 'Alpha',
  gender: ['M'],
  categories: ['cat-large'],
  macroCategories: ["Pet's size"],
});

const bandit = buildName({
  id: 'bandit',
  title: 'Bandit',
  gender: ['M', 'F'],
  categories: ['cat-funny'],
  macroCategories: ['Funny'],
});

const marley = buildName({
  id: 'marley',
  title: 'Marley',
  gender: [],
  categories: ['cat-optimistic'],
  macroCategories: ['Joyful'],
});

const names = [andromeda, alpha, bandit, marley];

describe('filterNames — gender', () => {
  it("returns everything when gender is 'Both'", () => {
    expect(filterNames(names, buildState({ gender: 'Both' }))).toHaveLength(4);
  });

  it("'M' keeps males, 'Both' names, and empty-gender names", () => {
    const result = filterNames(names, buildState({ gender: 'M' }));
    expect(result.map((n) => n.id)).toEqual(['alpha', 'bandit', 'marley']);
  });

  it("'F' keeps females, 'Both' names, and empty-gender names", () => {
    const result = filterNames(names, buildState({ gender: 'F' }));
    expect(result.map((n) => n.id)).toEqual(['andromeda', 'bandit', 'marley']);
  });
});

describe('filterNames — letter', () => {
  it('returns everything when letter is null', () => {
    expect(filterNames(names, buildState({ letter: null }))).toHaveLength(4);
  });

  it('keeps only names starting with the selected letter', () => {
    const result = filterNames(names, buildState({ letter: 'A' }));
    expect(result.map((n) => n.id)).toEqual(['andromeda', 'alpha']);
  });

  it('returns empty when no name matches the letter', () => {
    expect(filterNames(names, buildState({ letter: 'Z' }))).toEqual([]);
  });
});

describe('filterNames — categories', () => {
  it('no filter returns everything when rawCategories are empty', () => {
    expect(filterNames(names, buildState())).toHaveLength(4);
  });

  it('rawCategories restricts to names whose categories intersect the set', () => {
    const result = filterNames(
      names,
      buildState({ rawCategories: new Set(['cat-optimistic']) }),
    );
    expect(result.map((n) => n.id)).toEqual(['marley']);
  });

  it('multiple raws OR within the category axis', () => {
    const result = filterNames(
      names,
      buildState({
        rawCategories: new Set(['cat-optimistic', 'cat-greek']),
      }),
    );
    expect(new Set(result.map((n) => n.id))).toEqual(
      new Set(['marley', 'andromeda']),
    );
  });
});

describe('filterNames — composition', () => {
  it('combines gender + letter + categories', () => {
    const result = filterNames(
      names,
      buildState({
        gender: 'F',
        letter: 'A',
        rawCategories: new Set(['cat-greek']),
      }),
    );
    expect(result.map((n) => n.id)).toEqual(['andromeda']);
  });

  it('returns empty when filters exclude everyone', () => {
    expect(
      filterNames(
        names,
        buildState({
          letter: 'Z',
          rawCategories: new Set(['cat-optimistic']),
        }),
      ),
    ).toEqual([]);
  });
});
