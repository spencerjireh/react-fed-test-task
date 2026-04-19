import type { KeyboardEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { type ListRange, Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/cn';

import { useNames } from '../api/get-names';
import { useFilteredNames } from '../hooks/use-filtered-names';
import { useFilterStore } from '../stores/filter-store';
import { focusNameItem } from '../utils/focus-name-item';

import { ChevronPair } from './chevron-pair';
import { NameListItem } from './name-list-item';

const SKELETON_ROWS = 10;

interface NameListProps {
  chevronSide?: 'left' | 'right';
  variant?: 'detail' | 'results';
}

export function NameList({
  chevronSide = 'left',
  variant = 'detail',
}: NameListProps = {}) {
  const centerEffect = variant === 'results';
  const { data: names, isPending, isError } = useNames();
  const filtered = useFilteredNames(names ?? []);

  const selectedNameTitle = useFilterStore((s) => s.selectedNameTitle);
  const setSelectedNameTitle = useFilterStore((s) => s.setSelectedNameTitle);

  const virtuosoRef = useRef<VirtuosoHandle>(null);

  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const lastRange = useRef<ListRange>({ startIndex: 0, endIndex: 0 });

  // Seed 0 so the first paint centers before rangeChanged fires.
  const [centerIndex, setCenterIndex] = useState(0);

  const titleToIndex = useMemo(
    () => new Map(filtered.map((n, i) => [n.title, i])),
    [filtered],
  );

  if (isPending) return <NameListSkeleton />;
  if (isError) {
    return (
      <p className="py-4 text-neutral-mid">
        Couldn&rsquo;t load names. Reload to try again.
      </p>
    );
  }

  const anchor = selectedNameTitle
    ? Math.max(
        0,
        filtered.findIndex((n) => n.title === selectedNameTitle),
      )
    : 0;

  const handleRangeChanged = (range: ListRange) => {
    lastRange.current = range;

    if (centerEffect && filtered.length > 0) {
      const clampedEnd = Math.min(range.endIndex, filtered.length - 1);
      setCenterIndex(Math.floor((range.startIndex + clampedEnd) / 2));
    }
  };

  const jumpByPage = (direction: 1 | -1) => {
    const { startIndex, endIndex } = lastRange.current;
    // endIndex is inclusive; +1 gives the visible row count.
    const visibleCount = Math.max(1, endIndex - startIndex + 1);
    const target = Math.max(
      0,
      Math.min(filtered.length - 1, startIndex + direction * visibleCount),
    );
    virtuosoRef.current?.scrollToIndex({
      index: target,
      align: 'start',
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const focused = document.activeElement as HTMLElement | null;
    const currentTitle = focused?.getAttribute('data-name-title');
    const currentIndex = currentTitle
      ? (titleToIndex.get(currentTitle) ?? -1)
      : -1;
    if (currentIndex === -1) return;

    const step = event.key === 'ArrowDown' ? 1 : -1;
    const nextIndex = currentIndex + step;
    if (nextIndex < 0 || nextIndex >= filtered.length) return;

    event.preventDefault();
    const nextTitle = filtered[nextIndex].title;
    virtuosoRef.current?.scrollIntoView({
      index: nextIndex,
      done: () => focusNameItem(nextTitle),
    });
  };

  return (
    <div
      className={cn(
        'flex h-full min-h-0 items-stretch gap-8 md:gap-[52px]',
        chevronSide === 'right' && 'flex-row-reverse',
      )}
      data-chevron-side={chevronSide}
    >
      <ChevronPair
        atTop={atTop}
        atBottom={atBottom}
        onPrev={() => jumpByPage(-1)}
        onNext={() => jumpByPage(1)}
      />
      <Virtuoso
        ref={virtuosoRef}
        data={filtered}
        initialTopMostItemIndex={anchor}
        rangeChanged={handleRangeChanged}
        atTopStateChange={setAtTop}
        atBottomStateChange={setAtBottom}
        style={{ height: '100%' }}
        className="scrollbar-none w-full"
        aria-label="Pet names"
        onKeyDown={handleKeyDown}
        itemContent={(index, name) => (
          <NameListItem
            name={name}
            isSelected={name.title === selectedNameTitle}
            onSelect={setSelectedNameTitle}
            isCentered={centerEffect && index === centerIndex}
            variant={variant}
          />
        )}
      />
    </div>
  );
}

function NameListSkeleton() {
  return (
    <div className="flex h-full flex-col gap-3" aria-label="Loading names">
      {Array.from({ length: SKELETON_ROWS }).map((_, i) => (
        <Skeleton key={i} className="h-[45px] w-full" />
      ))}
    </div>
  );
}
