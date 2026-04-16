import type { Gender, Letter, MacroCategory, RawCategory } from '../types';

import { getRawIdsForMacro } from './macro-category-map';

const GENDER_WORDS: Record<Gender | 'Both', string> = {
  M: 'Male ',
  F: 'Female ',
  Both: '',
};

function joinAnd(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const head = items.slice(0, -1).join(', ');
  return `${head}, and ${items[items.length - 1]}`;
}

export function describeFilters(
  gender: Gender | 'Both',
  letter: Letter | null,
  macroCategories: Set<MacroCategory>,
  rawCategories: Set<string>,
  rawData: RawCategory[] | undefined,
): string {
  const macros = [...macroCategories];

  const coveredByMacro = new Set<string>();
  for (const macro of macros) {
    for (const id of getRawIdsForMacro(macro)) coveredByMacro.add(id);
  }

  const standaloneRawNames = [...rawCategories]
    .filter((id) => !coveredByMacro.has(id))
    .map((id) => rawData?.find((c) => c.id === id)?.name)
    .filter((name): name is string => typeof name === 'string');

  const labels = [...macros, ...standaloneRawNames];

  const genderWord = GENDER_WORDS[gender];
  const letterClause = letter ? ` starting with ${letter}` : '';
  const categoryClause = labels.length ? ` in ${joinAnd(labels)}` : '';

  if (!genderWord && !letterClause && !categoryClause) {
    return 'No names match.';
  }

  return `No ${genderWord}names${letterClause}${categoryClause}.`;
}
