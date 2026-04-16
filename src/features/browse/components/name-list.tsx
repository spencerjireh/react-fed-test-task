import { useRef } from 'react';
import { type ListRange, Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_SIZE, VIEWPORT_HEIGHT } from '@/config/constants';

import { useNames } from '../api/get-names';
import { useFilteredNames } from '../hooks/use-filtered-names';
import { useFilterStore } from '../stores/filter-store';

import { ChevronPair } from './chevron-pair';
import { NameListItem } from './name-list-item';

export function NameList() {
  const { data: names, isPending, isError } = useNames();
  const filtered = useFilteredNames(names ?? []);

  const selectedNameId = useFilterStore((s) => s.selectedNameId);
  const setSelectedNameId = useFilterStore((s) => s.setSelectedNameId);
  const page = useFilterStore((s) => s.page);
  const setPage = useFilterStore((s) => s.setPage);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

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

  const maxPage = Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1);

  const handleRangeChanged = ({ startIndex, endIndex }: ListRange) => {
    // Near the end of a short list, Virtuoso may clamp the start index.
    // Use `endIndex` so the last page still resolves to `maxPage`.
    const atEnd = endIndex >= filtered.length - 1 && filtered.length > 0;
    const next = atEnd ? maxPage : Math.floor(startIndex / PAGE_SIZE);
    if (next !== page) setPage(next);
  };

  const goToPage = (n: number) => {
    const clamped = Math.max(0, Math.min(n, maxPage));
    virtuosoRef.current?.scrollToIndex({
      index: clamped * PAGE_SIZE,
      align: 'start',
      behavior: 'smooth',
    });
  };

  return (
    <div className="flex items-start gap-8 md:gap-[52px]">
      <ChevronPair
        page={page}
        maxPage={maxPage}
        onPrev={() => goToPage(page - 1)}
        onNext={() => goToPage(page + 1)}
      />
      <Virtuoso
        ref={virtuosoRef}
        data={filtered}
        initialTopMostItemIndex={page * PAGE_SIZE}
        rangeChanged={handleRangeChanged}
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
    </div>
  );
}

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
