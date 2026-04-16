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
  description: string | null;
}

export type Letter = string;

export type MacroCategory =
  | 'Famous'
  | "Pet's size"
  | 'Joyful'
  | 'Funny'
  | 'Food and drinks'
  | 'International'
  | 'Others';

export interface Name extends RawName {
  initial: string;
  definitionText: string;
  macroCategories: MacroCategory[];
}
