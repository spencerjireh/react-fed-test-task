import type { Name } from '../types';

export function relatedNames(
  names: Name[],
  currentId: string,
  limit = 3,
): Name[] {
  const current = names.find((n) => n.id === currentId);
  if (!current) return [];

  // Use a Set so overlap checks stay cheap.
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
    return a.name.title.localeCompare(b.name.title);
  });

  return withOverlap.slice(0, limit).map((entry) => entry.name);
}
