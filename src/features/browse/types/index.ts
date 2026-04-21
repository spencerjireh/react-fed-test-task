export type Gender = 'M' | 'F';

export interface RawName {
  id: string;
  title: string;
  definition: string;
  gender: Gender[];
  categories: string[];
}

export interface RawCategory {
  id: string;
  name: string;
}

export type Letter = string;

export const MACRO_CATEGORIES = [
  'Famous',
  "Pet's size",
  'Joyful',
  'Funny',
  'Food and drinks',
  'International',
  'Others',
] as const;

export type MacroCategory = (typeof MACRO_CATEGORIES)[number];

export function isMacroCategory(value: string): value is MacroCategory {
  return (MACRO_CATEGORIES as readonly string[]).includes(value);
}

export interface Name extends RawName {
  initial: string;
  definitionText: string;
  macroCategories: MacroCategory[];
}
