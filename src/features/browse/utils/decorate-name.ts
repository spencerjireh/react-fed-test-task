import type { Name, RawName } from '../types';

import { getMacroFor } from './macro-category-map';
import { stripHtml } from './strip-html';

export function decorateName(raw: RawName): Name {
  const macros = new Set(raw.categories.map(getMacroFor));
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
