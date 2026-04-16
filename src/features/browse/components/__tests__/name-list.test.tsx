import { http, HttpResponse } from 'msw';
import type { KeyboardEventHandler, ReactNode, Ref } from 'react';
import { useImperativeHandle } from 'react';
import { useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import { useFilterUrlSync } from '../../stores/use-filter-url-sync';
import type { RawName } from '../../types';
import { NameList } from '../name-list';

// Virtuoso doesn't render in jsdom; stub renders items directly.
const scrollToIndex = vi.fn();
const scrollIntoView = vi.fn((opts: { index: number; done?: () => void }) =>
  opts.done?.(),
);
const captured = { initialTopMostItemIndex: undefined as number | undefined };

interface StubVirtuosoProps<T> {
  ref?: Ref<{
    scrollToIndex: typeof scrollToIndex;
    scrollIntoView: typeof scrollIntoView;
  }>;
  data: T[];
  itemContent: (index: number, item: T) => ReactNode;
  initialTopMostItemIndex?: number;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

vi.mock('react-virtuoso', () => ({
  Virtuoso: <T,>({
    ref,
    data,
    itemContent,
    initialTopMostItemIndex,
    onKeyDown,
  }: StubVirtuosoProps<T>) => {
    captured.initialTopMostItemIndex = initialTopMostItemIndex;
    useImperativeHandle(ref, () => ({ scrollToIndex, scrollIntoView }), []);
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div data-testid="virtuoso" onKeyDown={onKeyDown}>
        {data.map((item, i) => (
          <div key={i}>{itemContent(i, item)}</div>
        ))}
      </div>
    );
  },
}));

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

function Harness({ children }: { children?: ReactNode }) {
  useFilterUrlSync();
  return (
    <>
      <LocationProbe />
      {children ?? <NameList />}
    </>
  );
}

// 30 names gives us 3 pages at 11 rows per page.
const FIXTURE: RawName[] = Array.from({ length: 30 }).map((_, i) => {
  const ch = String.fromCharCode(65 + (i % 26));
  return {
    id: `name-${i}`,
    title: `${ch}${i.toString().padStart(2, '0')}`,
    definition: `<p>entry ${i}</p>`,
    gender: i % 2 === 0 ? ['M'] : ['F'],
    categories: [],
  };
});

describe('NameList', () => {
  beforeEach(() => {
    scrollToIndex.mockClear();
    scrollIntoView.mockClear();
    captured.initialTopMostItemIndex = undefined;
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameId: null,
      page: 0,
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders each name returned by useNames', async () => {
    renderApp(<Harness />);

    expect(
      await screen.findByRole('button', { name: 'A00' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'B01' })).toBeInTheDocument();
  });

  it('clicking a name selects it and mirrors to the URL', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    await userEvent.click(first);

    expect(useFilterStore.getState().selectedNameId).toBe('name-0');
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('n=name-0');
    });
  });

  it('renders the empty-state copy when filtered results are zero', async () => {
    server.use(http.get('*/api/names', () => HttpResponse.json({ data: [] })));

    renderApp(<Harness />);

    expect(
      await screen.findByText(/no names match these filters/i),
    ).toBeInTheDocument();
  });

  it('up chevron is disabled at page 0 and down chevron advances to index 11', async () => {
    renderApp(<Harness />);
    await screen.findByRole('button', { name: 'A00' });

    const up = screen.getByRole('button', { name: 'Previous 11 names' });
    const down = screen.getByRole('button', { name: 'Next 11 names' });
    expect(up).toBeDisabled();
    expect(down).toBeEnabled();

    await userEvent.click(down);

    expect(scrollToIndex).toHaveBeenCalledWith({
      index: 11,
      align: 'start',
      behavior: 'smooth',
    });
  });

  it('down chevron is disabled at the last page', async () => {
    useFilterStore.setState({ page: 2 });
    renderApp(<Harness />);
    await screen.findByRole('button', { name: 'A00' });

    const up = screen.getByRole('button', { name: 'Previous 11 names' });
    const down = screen.getByRole('button', { name: 'Next 11 names' });
    expect(down).toBeDisabled();
    expect(up).toBeEnabled();
  });

  it('hydrates initialTopMostItemIndex from store.page', async () => {
    useFilterStore.setState({ page: 2 });
    renderApp(<Harness />);

    await screen.findByRole('button', { name: 'A00' });
    expect(captured.initialTopMostItemIndex).toBe(22);
  });

  it('ArrowDown on a focused list item moves focus to the next item', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ index: 1 }),
    );
    expect(screen.getByRole('button', { name: 'B01' })).toHaveFocus();
  });

  it('ArrowUp on the first item is a no-op', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(first).toHaveFocus();
  });

  it('Enter on a focused list item selects it', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{Enter}');

    expect(useFilterStore.getState().selectedNameId).toBe('name-0');
  });
});
