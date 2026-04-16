import type { Name, RawName } from '../types';

import { getMacrosFor } from './macro-category-map';
import { stripHtml } from './strip-html';

export function decorateName(raw: RawName): Name {
  const macros = new Set(raw.categories.flatMap(getMacrosFor));
  return {
    ...raw,
    initial: raw.title.charAt(0).toUpperCase(),
    definitionText: stripHtml(raw.definition),
    macroCategories: [...macros],
  };
}

export function decorateNames(raws: RawName[]): Name[] {
  return raws.map(decorateName);
}
