export const PAGE_SIZE = 11;
export const VIEWPORT_HEIGHT = 669;

// A–Z plus Ñ. Ñ is a Spanish-language artifact from the Figma; the current
// dataset has zero names starting with Ñ so it renders disabled in the
// letter strip. If future data includes Ñ names the UI picks them up
// automatically.
export const LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'Ñ',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
] as const;
