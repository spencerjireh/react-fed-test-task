import { describe, expect, it } from 'vitest';

import type { RawCategory } from '../../types';
import { describeFilters } from '../describe-filters';
import { getRawIdsForMacro } from '../macro-category-map';

const FAMOUS_RAW_IDS = getRawIdsForMacro('Famous');
const FUNNY_RAW_IDS = getRawIdsForMacro('Funny');
const FOOD_RAW_IDS = getRawIdsForMacro('Food and drinks');

const RAW_DATA: RawCategory[] = [
  { id: 'cat-funny', name: 'Funny stuff' },
  { id: 'cat-foodie', name: 'Foodie' },
  { id: 'cat-greek', name: 'Greek' },
  ...FAMOUS_RAW_IDS.map((id, i) => ({
    id,
    name: `FamousChild${i}`,
  })),
];

const noRaws = new Set<string>();

describe('describeFilters', () => {
  it('returns a safe default when nothing is filtered', () => {
    expect(describeFilters('Both', null, noRaws, RAW_DATA)).toBe(
      'No names match.',
    );
  });

  it('renders gender alone', () => {
    expect(describeFilters('M', null, noRaws, RAW_DATA)).toBe('No Male names.');
    expect(describeFilters('F', null, noRaws, RAW_DATA)).toBe(
      'No Female names.',
    );
  });

  it('renders letter alone', () => {
    expect(describeFilters('Both', 'Q', noRaws, RAW_DATA)).toBe(
      'No names starting with Q.',
    );
  });

  it('combines gender and letter', () => {
    expect(describeFilters('F', 'A', noRaws, RAW_DATA)).toBe(
      'No Female names starting with A.',
    );
  });

  it('lists a single macro category', () => {
    expect(
      describeFilters('Both', null, new Set(FAMOUS_RAW_IDS), RAW_DATA),
    ).toBe('No names in Famous.');
  });

  it('joins two categories with "and"', () => {
    expect(
      describeFilters(
        'Both',
        null,
        new Set([...FUNNY_RAW_IDS, ...FOOD_RAW_IDS]),
        RAW_DATA,
      ),
    ).toBe('No names in Funny and Food and drinks.');
  });

  it('joins three or more categories with Oxford comma', () => {
    expect(
      describeFilters(
        'Both',
        null,
        new Set([...FAMOUS_RAW_IDS, ...FUNNY_RAW_IDS, ...FOOD_RAW_IDS]),
        RAW_DATA,
      ),
    ).toBe('No names in Famous, Funny, and Food and drinks.');
  });

  it('resolves standalone raw IDs via rawData', () => {
    expect(
      describeFilters(
        'Both',
        null,
        new Set(['cat-foodie', 'cat-greek']),
        RAW_DATA,
      ),
    ).toBe('No names in Foodie and Greek.');
  });

  it('skips raw IDs already covered by a present macro', () => {
    expect(
      describeFilters('Both', null, new Set(FAMOUS_RAW_IDS), RAW_DATA),
    ).toBe('No names in Famous.');
  });

  it('mixes a macro with a raw from a different group', () => {
    expect(
      describeFilters(
        'F',
        null,
        new Set([...FAMOUS_RAW_IDS, 'cat-foodie']),
        RAW_DATA,
      ),
    ).toBe('No Female names in Famous and Foodie.');
  });

  it('drops raw IDs that rawData does not know (still loading)', () => {
    expect(
      describeFilters(
        'Both',
        null,
        new Set(['cat-foodie', 'unknown-id']),
        RAW_DATA,
      ),
    ).toBe('No names in Foodie.');
  });

  it('drops all raws when rawData is undefined', () => {
    expect(describeFilters('M', 'B', new Set(['cat-foodie']), undefined)).toBe(
      'No Male names starting with B.',
    );
  });

  it('renders the full sentence with everything set', () => {
    expect(describeFilters('F', 'Q', new Set(FAMOUS_RAW_IDS), RAW_DATA)).toBe(
      'No Female names starting with Q in Famous.',
    );
  });
});
