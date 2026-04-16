import { describe, expect, it } from 'vitest';

import type { RawName } from '../../types';
import { decorateName, decorateNames } from '../decorate-name';

// Real category IDs from the fixture data.
const CARTOON_ID = '019c8a34-3585-7249-b7c2-a4f85945291e';
const CELEBRITIES_ID = '019c8a34-35ed-737c-acff-a43af999817c';
const SHORT_NAMES_ID = '019c8a34-3621-715f-96e3-a9ce5aa5de45';
const UNKNOWN_ID = 'not-a-real-category-id';

function buildRaw(overrides: Partial<RawName> = {}): RawName {
  return {
    id: 'raw-1',
    title: 'Andromeda',
    definition: "<p>The hero of Homer's Iliad</p>",
    gender: ['F'],
    categories: [],
    ...overrides,
  };
}

describe('decorateName', () => {
  it('derives initial from the first character, uppercased', () => {
    expect(decorateName(buildRaw({ title: 'andromeda' })).initial).toBe('A');
    expect(decorateName(buildRaw({ title: 'Zeus' })).initial).toBe('Z');
  });

  it('strips HTML tags for definitionText', () => {
    const name = decorateName(
      buildRaw({ definition: '<p>Line one</p><br/>Line two' }),
    );
    expect(name.definitionText).toBe('Line oneLine two');
  });

  it('maps raw categories to macro categories via the map', () => {
    const name = decorateName(
      buildRaw({ categories: [CARTOON_ID, CELEBRITIES_ID] }),
    );
    expect(name.macroCategories).toEqual(['Famous']);
  });

  it('dedupes macro categories when multiple raws share a macro', () => {
    const name = decorateName(
      buildRaw({ categories: [CARTOON_ID, CELEBRITIES_ID, SHORT_NAMES_ID] }),
    );
    expect(new Set(name.macroCategories)).toEqual(
      new Set(['Famous', "Pet's size"]),
    );
    expect(name.macroCategories).toHaveLength(2);
  });

  it("falls through unmapped raw category IDs to 'Others'", () => {
    const name = decorateName(buildRaw({ categories: [UNKNOWN_ID] }));
    expect(name.macroCategories).toEqual(['Others']);
  });

  it('preserves every RawName field on the resulting Name', () => {
    const raw = buildRaw({ categories: [CARTOON_ID] });
    const name = decorateName(raw);
    expect(name.id).toBe(raw.id);
    expect(name.title).toBe(raw.title);
    expect(name.definition).toBe(raw.definition);
    expect(name.gender).toEqual(raw.gender);
    expect(name.categories).toEqual(raw.categories);
  });

  it('handles empty categories array without errors', () => {
    const name = decorateName(buildRaw({ categories: [] }));
    expect(name.macroCategories).toEqual([]);
  });
});

describe('decorateNames', () => {
  it('maps every input through decorateName', () => {
    const raws = [
      buildRaw({ id: 'a' }),
      buildRaw({ id: 'b', title: 'Bandit' }),
    ];
    const decorated = decorateNames(raws);
    expect(decorated).toHaveLength(2);
    expect(decorated[0].id).toBe('a');
    expect(decorated[1].initial).toBe('B');
  });
});
