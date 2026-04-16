import type { Name } from '../types';

/**
 * Related names. For a given name id, compute the top N other
 * names that share the most raw categories, breaking ties alphabetically by
 * title. Pure — safe to call with fixtures in tests.
 *
 * Returns an empty array when `currentId` has no match or when no other name
 * shares a raw category.
 */
export function relatedNames(
  names: Name[],
  currentId: string,
  limit = 3,
): Name[] {
  const current = names.find((n) => n.id === currentId);
  if (!current) return [];

  // Cache the current name's categories as a Set so the per-other-name
  // intersection cost is O(|other.categories|) instead of O(|a| * |b|).
  const currentCategorySet = new Set(current.categories);

  const withOverlap: Array<{ name: Name; overlap: number }> = [];
  for (const other of names) {
    if (other.id === currentId) continue;
    let overlap = 0;
    for (const rawId of other.categories) {
      if (currentCategorySet.has(rawId)) overlap += 1;
    }
    if (overlap > 0) withOverlap.push({ name: other, overlap });
  }

  withOverlap.sort((a, b) => {
    if (b.overlap !== a.overlap) return b.overlap - a.overlap;
    // Stable alphabetical tiebreak by title.
    return a.name.title.localeCompare(b.name.title);
  });

  return withOverlap.slice(0, limit).map((entry) => entry.name);
}
