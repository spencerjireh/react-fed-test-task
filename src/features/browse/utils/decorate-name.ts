import type { Name, RawName } from '../types';

import { getMacroFor } from './macro-category-map';
import { stripHtml } from './strip-html';

/**
 * Turn a RawName (as delivered by /api/names) into a display-ready Name
 * by computing the three derived fields the UI reads: `initial`,
 * `definitionText`, and `macroCategories`.
 *
 * Pure — call it inside a memoized selector (e.g. TanStack Query's
 * `select`) so the per-name work happens exactly once per data fetch.
 */
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
