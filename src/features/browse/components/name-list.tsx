import type { KeyboardEvent } from 'react';
import { useRef, useState } from 'react';
import { type ListRange, Virtuoso, type VirtuosoHandle } from 'react-virtuoso';

import { Skeleton } from '@/components/ui/skeleton';
import { PAGE_SIZE, VIEWPORT_HEIGHT } from '@/config/constants';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/cn';

import { useNames } from '../api/get-names';
import { useFilteredNames } from '../hooks/use-filtered-names';
import { useFilterStore } from '../stores/filter-store';

import { ChevronPair } from './chevron-pair';
import { NameListItem } from './name-list-item';

interface NameListProps {
  chevronSide?: 'left' | 'right';
  variant?: 'detail' | 'results';
}

function focusByTitle(title: string) {
  const selector = `[data-name-title="${CSS.escape(title)}"]`;
  const el = document.querySelector(selector);
  (el as HTMLElement | null)?.focus();
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
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const listHeight = isDesktop ? VIEWPORT_HEIGHT : '70vh';

  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);

  const lastRange = useRef<ListRange>({ startIndex: 0, endIndex: 0 });

  // Seed 0 so the first paint centers before rangeChanged fires.
  const [centerIndex, setCenterIndex] = useState(0);

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

  const jumpBy = (delta: number) => {
    const target = Math.max(
      0,
      Math.min(filtered.length - 1, lastRange.current.startIndex + delta),
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
    <div
      className={cn(
        'flex items-start gap-8 md:gap-[52px]',
        chevronSide === 'right' && 'flex-row-reverse',
      )}
      data-chevron-side={chevronSide}
    >
      <ChevronPair
        atTop={atTop}
        atBottom={atBottom}
        onPrev={() => jumpBy(-PAGE_SIZE)}
        onNext={() => jumpBy(PAGE_SIZE)}
      />
      <Virtuoso
        ref={virtuosoRef}
        data={filtered}
        initialTopMostItemIndex={anchor}
        rangeChanged={handleRangeChanged}
        atTopStateChange={setAtTop}
        atBottomStateChange={setAtBottom}
        style={{ height: listHeight }}
        className="scrollbar-none w-full"
        aria-label="Pet names"
        onKeyDown={handleKeyDown}
        itemContent={(index, name) => (
          <NameListItem
            name={name}
            isSelected={name.title === selectedNameTitle}
            onSelect={setSelectedNameTitle}
            centerDistance={centerEffect ? Math.abs(index - centerIndex) : null}
            variant={variant}
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
