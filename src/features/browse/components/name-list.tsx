import { Virtuoso } from 'react-virtuoso';

import { Skeleton } from '@/components/ui/skeleton';
import { VIEWPORT_HEIGHT, PAGE_SIZE } from '@/config/constants';

import { useNames } from '../api/get-names';
import { useFilteredNames } from '../hooks/use-filtered-names';
import { useFilterStore } from '../stores/filter-store';

import { NameListItem } from './name-list-item';

/**
 * Master list of names.
 *
 * Data flow:
 *   useNames() → Name[] → useFilteredNames(names) → Name[] → Virtuoso
 *
 * Filter state is respected from day one even if filter controls aren't
 * yet visible: the store hydrates from URL on module load, so pasting
 * `/?g=M&l=A` must narrow the list immediately. Declining to call
 * `useFilteredNames` would break that contract.
 *
 * Chevron pagination (`virtuosoRef`, `rangeChanged` → `page`,
 * `initialTopMostItemIndex`) is additive — not yet wired here.
 */
export function NameList() {
  const { data: names, isPending, isError } = useNames();
  const filtered = useFilteredNames(names ?? []);

  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const setSelectedNameId = useFilterStore((s) => s.setSelectedNameId);

  if (isPending) return <NameListSkeleton />;
  if (isError) {
    return (
      <p className="py-4 text-neutral-mid">
        Couldn&rsquo;t load names. Reload to try again.
      </p>
    );
  }
  if (filtered.length === 0) {
    return (
      <p className="py-4 text-neutral-mid">No names match these filters.</p>
    );
  }

  return (
    <Virtuoso
      data={filtered}
      style={{ height: VIEWPORT_HEIGHT }}
      className="w-full"
      aria-label="Pet names"
      itemContent={(_, name) => (
        <NameListItem
          name={name}
          isSelected={name.id === selectedNameId}
          onSelect={setSelectedNameId}
        />
      )}
    />
  );
}

/**
 * Loading placeholder that matches a full viewport (PAGE_SIZE = 11 rows),
 * so the layout doesn't jump when data resolves.
 */
function NameListSkeleton() {
  return (
    <div
      className="flex flex-col gap-3"
      style={{ height: VIEWPORT_HEIGHT }}
      aria-label="Loading names"
    >
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Skeleton key={i} className="h-[45px] w-full" />
      ))}
    </div>
  );
}
