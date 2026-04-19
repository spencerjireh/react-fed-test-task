import type { Gender, Letter, RawCategory } from '../types';

import {
  getFullyCheckedMacros,
  getRawIdsCoveredByMacros,
} from './macro-category-map';

const GENDER_WORDS: Record<Gender | 'Both', string> = {
  M: 'Male ',
  F: 'Female ',
  Both: '',
};

const LIST_FORMAT = new Intl.ListFormat('en-US', { type: 'conjunction' });

export function describeFilters(
  gender: Gender | 'Both',
  letter: Letter | null,
  rawCategories: ReadonlySet<string>,
  rawData: RawCategory[] | undefined,
): string {
  const macros = [...getFullyCheckedMacros(rawCategories)];
  const coveredByMacro = getRawIdsCoveredByMacros(macros);

  const standaloneRawNames = [...rawCategories]
    .filter((id) => !coveredByMacro.has(id))
    .map((id) => rawData?.find((c) => c.id === id)?.name)
    .filter((name): name is string => typeof name === 'string');

  const labels = [...macros, ...standaloneRawNames];

  const genderWord = GENDER_WORDS[gender];
  const letterClause = letter ? ` starting with ${letter}` : '';
  const categoryClause = labels.length
    ? ` in ${LIST_FORMAT.format(labels)}`
    : '';

  if (!genderWord && !letterClause && !categoryClause) {
    return 'No names match.';
  }

  return `No ${genderWord}names${letterClause}${categoryClause}.`;
}
