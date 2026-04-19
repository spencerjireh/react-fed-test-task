import type { KeyboardEventHandler, ReactNode, Ref } from 'react';
import { useImperativeHandle } from 'react';
import { vi } from 'vitest';

interface VirtuosoListRange {
  startIndex: number;
  endIndex: number;
}

interface VirtuosoMethods {
  scrollToIndex: (...args: unknown[]) => void;
  scrollIntoView: (opts: { index: number; done?: () => void }) => void;
}

export const virtuosoCallbacks = {
  initialTopMostItemIndex: undefined as number | undefined,
  atTopStateChange: undefined as ((value: boolean) => void) | undefined,
  atBottomStateChange: undefined as ((value: boolean) => void) | undefined,
  rangeChanged: undefined as ((range: VirtuosoListRange) => void) | undefined,
};

export const virtuosoMethods = {
  scrollToIndex: vi.fn(),
  scrollIntoView: vi.fn((opts: { index: number; done?: () => void }) =>
    opts.done?.(),
  ),
};

export function resetVirtuosoStub(): void {
  virtuosoCallbacks.initialTopMostItemIndex = undefined;
  virtuosoCallbacks.atTopStateChange = undefined;
  virtuosoCallbacks.atBottomStateChange = undefined;
  virtuosoCallbacks.rangeChanged = undefined;
  virtuosoMethods.scrollToIndex.mockClear();
  virtuosoMethods.scrollIntoView.mockClear();
}

interface StubProps<T> {
  ref?: Ref<VirtuosoMethods>;
  data: T[];
  itemContent: (index: number, item: T) => ReactNode;
  initialTopMostItemIndex?: number;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  atTopStateChange?: (value: boolean) => void;
  atBottomStateChange?: (value: boolean) => void;
  rangeChanged?: (range: VirtuosoListRange) => void;
  className?: string;
}

export function Virtuoso<T>({
  ref,
  data,
  itemContent,
  initialTopMostItemIndex,
  onKeyDown,
  atTopStateChange,
  atBottomStateChange,
  rangeChanged,
  className,
}: StubProps<T>) {
  /* eslint-disable react-hooks/immutability */
  virtuosoCallbacks.initialTopMostItemIndex = initialTopMostItemIndex;
  virtuosoCallbacks.atTopStateChange = atTopStateChange;
  virtuosoCallbacks.atBottomStateChange = atBottomStateChange;
  virtuosoCallbacks.rangeChanged = rangeChanged;
  /* eslint-enable react-hooks/immutability */
  useImperativeHandle(ref, () => virtuosoMethods, []);
  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div data-testid="virtuoso" className={className} onKeyDown={onKeyDown}>
      {data.map((item, i) => (
        <div key={i}>{itemContent(i, item)}</div>
      ))}
    </div>
  );
}
