import type { KeyboardEvent } from 'react';
import { useRef } from 'react';
import { type ListRange, Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_SIZE, VIEWPORT_HEIGHT } from '@/config/constants';
import { useMediaQuery } from '@/hooks/use-media-query';

import { useNames } from '../api/get-names';
import { useFilteredNames } from '../hooks/use-filtered-names';
import { useFilterStore } from '../stores/filter-store';

import { ChevronPair } from './chevron-pair';
import { NameListItem } from './name-list-item';

function focusByTitle(title: string) {
  const selector = `[data-name-title="${CSS.escape(title)}"]`;
  const el = document.querySelector(selector);
  (el as HTMLElement | null)?.focus();
}

export function NameList() {
  const { data: names, isPending, isError } = useNames();
  const filtered = useFilteredNames(names ?? []);

  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);
  const page = useFilterStore((s) => s.page);
  const setPage = useFilterStore((s) => s.setPage);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const listHeight = isDesktop ? VIEWPORT_HEIGHT : '70vh';

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

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const focused = document.activeElement as HTMLElement | null;
    const currentTitle = focused?.getAttribute('data-name-title');
    const currentIndex = currentTitle
      ? filtered.findIndex((n) => n.title === currentTitle)
      : -1;
    if (currentIndex === -1) return;

    const step = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = currentIndex + step;
    if (nextIndex < 0 || nextIndex >= filtered.length) return;

    event.preventDefault();
    const nextTitle = filtered[nextIndex].title;
    virtuosoRef.current?.scrollIntoView({
      index: nextIndex,
      done: () => focusByTitle(nextTitle),
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
        style={{ height: listHeight }}
        className="w-full"
        aria-label="Pet names"
        onKeyDown={handleKeyDown}
        itemContent={(_, name) => (
          <NameListItem
            name={name}
            isSelected={name.title === selectedNameTitle}
            onSelect={setSelectedNameTitle}
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
