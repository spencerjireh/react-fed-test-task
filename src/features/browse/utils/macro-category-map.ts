import type { MacroCategory } from '../types';

// Maps each raw category ID (from public/data/categories.json) to its
// single macro bucket. The Figma exposes 7 top-level filter dropdowns
// over 25 raw categories; each raw category lives in exactly one macro.
// Any raw ID not present in this map falls through to 'Others' via
// getMacroFor.
const CATEGORY_ID_TO_MACRO: Record<string, MacroCategory> = {
  // Famous
  '019c8a34-3585-7249-b7c2-a4f85945291e': 'Famous', // Cartoon
  '019c8a34-35ed-737c-acff-a43af999817c': 'Famous', // Celebrities
  '019c8a34-35f2-70b1-b866-69a4921d15a8': 'Famous', // Disney
  '019c8a34-360b-735c-88e7-5d86357a91a2': 'Famous', // Literary
  '019c8a34-3611-73a8-90ac-bbacd3959385': 'Famous', // Most Popular
  '019c8a34-3614-71a6-b955-df5540ecdfce': 'Famous', // Musical

  // Pet's size
  '019c8a34-3608-7310-857c-1c05bef421fc': "Pet's size", // Large
  '019c8a34-3624-7028-8af2-b9ad32f57ccb': "Pet's size", // Small
  '019c8a34-3621-715f-96e3-a9ce5aa5de45': "Pet's size", // Short Names

  // Joyful
  '019c8a34-3619-7134-a023-806d72219174': 'Joyful', // Optimistic
  '019c8a34-360e-727f-8ca1-81db96aba0f1': 'Joyful', // Magical and Mythical
  '019c8a34-361c-73fb-b8c9-db6b77d32feb': 'Joyful', // Regal

  // Funny
  '019c8a34-362d-7087-99c4-1a4eb48d3f6b': 'Funny', // Unusual

  // Food and drinks
  '019c8a34-35f6-70a9-bda7-5f0eaf8a07d5': 'Food and drinks', // Drinks
  '019c8a34-35fa-71aa-96d2-430cba480210': 'Food and drinks', // Foodie

  // International
  '019c8a34-35fe-70e0-92dd-bf88d629b6bd': 'International', // French
  '019c8a34-3602-72a8-9455-e08065e0777f': 'International', // Greek
  '019c8a34-3605-7035-a765-6369f4a01b7b': 'International', // Italian
  '019c8a34-361f-73d0-b3e4-ea8c48534146': 'International', // Scottish
  '019c8a34-3629-703f-a33b-e128ebf3945c': 'International', // Spanish
  '019c8a34-362f-7096-8883-def3ce86d797': 'International', // Norse
  '019c8a34-3632-730d-abe7-586246a7a24c': 'International', // German
  '019c8a34-3635-7045-94b9-50a8908e6c31': 'International', // Chinese

  // Others
  '019c8a34-3617-70d5-a0bf-80fcf53288d4': 'Others', // Nature
  '019c8a34-3627-7210-8e6c-478589659de5': 'Others', // Space and Science
};

/**
 * Look up the macro category for a raw category ID. Unmapped IDs fall through
 * to 'Others' so the UI never silently drops a name just because the map is
 * out of date.
 */
export function getMacroFor(rawCategoryId: string): MacroCategory {
  return CATEGORY_ID_TO_MACRO[rawCategoryId] ?? 'Others';
}
