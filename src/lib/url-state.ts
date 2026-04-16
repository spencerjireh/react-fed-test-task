/**
 * Filter-state URL serialization.
 *
 * This module is schema-aware (it knows the 6 short keys) but type-generic:
 * values flow as strings, numbers, and string arrays, not as domain types
 * like Gender / MacroCategory. The filter store layer (features/browse)
 * handles domain validation on the decoded primitives. Keeping URL mechanics
 * here and validation there respects the ESLint zone that forbids lib/ from
 * importing feature types.
 *
 * URL schema: /?g=M&l=A&mc=Famous,Funny&rc=<id>,<id>&n=<id>&p=2
 *
 * Empty values are omitted from the encoded query so shared URLs stay
 * clean. Parsing is lenient: missing or malformed values are dropped,
 * never thrown.
 */

export interface FilterUrlParams {
  gender?: string;
  letter?: string;
  macroCategories?: string[];
  rawCategories?: string[];
  selectedNameId?: string;
  page?: number;
}

// Short query-string keys. Kept in one place so the encode/decode pair
// cannot drift from each other.
const KEYS = {
  gender: 'g',
  letter: 'l',
  macroCategories: 'mc',
  rawCategories: 'rc',
  selectedNameId: 'n',
  page: 'p',
} as const;

/** The keys recognized as filter-state keys in a URL. */
export const FILTER_URL_KEYS = Object.values(KEYS);

/**
 * Encode filter params to a query string (no leading '?'). Omits any slice
 * that is undefined, empty-string, empty-array, or page 0 so shared URLs
 * don't carry default-value noise.
 */
export function encodeFilterUrlParams(params: FilterUrlParams): string {
  const search = new URLSearchParams();
  if (params.gender) search.set(KEYS.gender, params.gender);
  if (params.letter) search.set(KEYS.letter, params.letter);
  if (params.macroCategories && params.macroCategories.length > 0) {
    search.set(KEYS.macroCategories, params.macroCategories.join(','));
  }
  if (params.rawCategories && params.rawCategories.length > 0) {
    search.set(KEYS.rawCategories, params.rawCategories.join(','));
  }
  if (params.selectedNameId)
    search.set(KEYS.selectedNameId, params.selectedNameId);
  if (params.page !== undefined && params.page > 0) {
    search.set(KEYS.page, String(params.page));
  }
  return search.toString();
}

/**
 * Decode a query string or URLSearchParams into filter params. Unknown keys
 * are ignored. Malformed slices (invalid page number, etc.) are dropped
 * silently — callers merge the result with their defaults.
 */
export function decodeFilterUrlParams(
  input: URLSearchParams | string,
): FilterUrlParams {
  const search =
    input instanceof URLSearchParams ? input : new URLSearchParams(input);
  const result: FilterUrlParams = {};

  const g = search.get(KEYS.gender);
  if (g) result.gender = g;

  const l = search.get(KEYS.letter);
  if (l) result.letter = l;

  const mc = search.get(KEYS.macroCategories);
  if (mc) {
    const tokens = splitList(mc);
    if (tokens.length > 0) result.macroCategories = tokens;
  }

  const rc = search.get(KEYS.rawCategories);
  if (rc) {
    const tokens = splitList(rc);
    if (tokens.length > 0) result.rawCategories = tokens;
  }

  const n = search.get(KEYS.selectedNameId);
  if (n) result.selectedNameId = n;

  const p = search.get(KEYS.page);
  if (p !== null) {
    const parsed = Number.parseInt(p, 10);
    if (Number.isFinite(parsed) && parsed >= 0) result.page = parsed;
  }

  return result;
}

/** True if the URL has any of our filter keys — used for hydration precedence. */
export function hasFilterUrlParams(input: URLSearchParams | string): boolean {
  const search =
    input instanceof URLSearchParams ? input : new URLSearchParams(input);
  return FILTER_URL_KEYS.some((k) => search.has(k));
}

function splitList(raw: string): string[] {
  // Accept trailing / leading / consecutive commas; drop empty tokens.
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
