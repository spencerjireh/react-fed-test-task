export interface FilterUrlParams {
  gender?: string;
  letter?: string;
  macroCategories?: string[];
  rawCategories?: string[];
  selectedNameTitle?: string;
}

const KEYS = {
  gender: 'g',
  letter: 'l',
  macroCategories: 'mc',
  rawCategories: 'rc',
  selectedNameTitle: 'n',
} as const;

const FILTER_URL_KEYS = Object.values(KEYS);

// Returns `k=v&…` with no leading `?`.
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
  if (params.selectedNameTitle)
    search.set(KEYS.selectedNameTitle, params.selectedNameTitle);
  return search.toString();
}

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

  const n = search.get(KEYS.selectedNameTitle);
  if (n) result.selectedNameTitle = n;

  return result;
}

export function hasFilterUrlParams(input: URLSearchParams | string): boolean {
  const search =
    input instanceof URLSearchParams ? input : new URLSearchParams(input);
  return FILTER_URL_KEYS.some((k) => search.has(k));
}

function splitList(raw: string): string[] {
  // Drop empty tokens from stray commas.
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}
