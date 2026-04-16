import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import {
  act,
  renderApp,
  screen,
  UrlSyncHarness,
  userEvent,
  waitFor,
} from '@/testing/test-utils';
import {
  resetVirtuosoStub,
  virtuosoCallbacks,
  virtuosoMethods,
} from '@/testing/virtuoso-stub';

import { useFilterStore } from '../../stores/filter-store';
import type { RawName } from '../../types';
import { NameList } from '../name-list';

vi.mock('react-virtuoso', async () => await import('@/testing/virtuoso-stub'));

function Harness({ children }: { children?: ReactNode }) {
  return <UrlSyncHarness>{children ?? <NameList />}</UrlSyncHarness>;
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
    resetVirtuosoStub();
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
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

    expect(useFilterStore.getState().selectedNameTitle).toBe('A00');
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent('n=A00');
    });
  });

  it('up chevron starts disabled and enables when atTopStateChange(false) fires', async () => {
    renderApp(<Harness />);
    await screen.findByRole('button', { name: 'A00' });

    const up = screen.getByRole('button', { name: 'Previous page' });
    expect(up).toBeDisabled();

    act(() => virtuosoCallbacks.atTopStateChange?.(false));
    expect(up).toBeEnabled();
  });

  it('down chevron disables when atBottomStateChange(true) fires', async () => {
    renderApp(<Harness />);
    await screen.findByRole('button', { name: 'A00' });

    const down = screen.getByRole('button', { name: 'Next page' });
    expect(down).toBeEnabled();

    act(() => virtuosoCallbacks.atBottomStateChange?.(true));
    expect(down).toBeDisabled();
  });

  it('clicking down jumps by the visible row count reported by rangeChanged', async () => {
    renderApp(<Harness />);
    await screen.findByRole('button', { name: 'A00' });

    // Simulate Virtuoso reporting rows 0..9 visible (10 rows on screen).
    act(() => virtuosoCallbacks.rangeChanged?.({ startIndex: 0, endIndex: 9 }));
    act(() => virtuosoCallbacks.atTopStateChange?.(false));

    const down = screen.getByRole('button', { name: 'Next page' });
    await userEvent.click(down);

    expect(virtuosoMethods.scrollToIndex).toHaveBeenCalledWith({
      index: 10,
      align: 'start',
      behavior: 'smooth',
    });
  });

  it('initialTopMostItemIndex anchors to selectedNameTitle when set', async () => {
    useFilterStore.setState({ selectedNameTitle: 'X23' });
    renderApp(<Harness />);

    await screen.findByRole('button', { name: 'A00' });
    expect(virtuosoCallbacks.initialTopMostItemIndex).toBe(23);
  });

  it('initialTopMostItemIndex falls back to 0 when selectedNameTitle is unknown', async () => {
    useFilterStore.setState({ selectedNameTitle: 'NoSuchName' });
    renderApp(<Harness />);

    await screen.findByRole('button', { name: 'A00' });
    expect(virtuosoCallbacks.initialTopMostItemIndex).toBe(0);
  });

  it('Virtuoso list uses the scrollbar-none utility', async () => {
    renderApp(<Harness />);

    const virtuoso = await screen.findByTestId('virtuoso');
    expect(virtuoso).toHaveClass('scrollbar-none');
  });

  it('ArrowDown on a focused list item moves focus to the next item', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{ArrowDown}');

    expect(virtuosoMethods.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ index: 1 }),
    );
    expect(screen.getByRole('button', { name: 'B01' })).toHaveFocus();
  });

  it('ArrowUp on the first item is a no-op', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{ArrowUp}');

    expect(virtuosoMethods.scrollIntoView).not.toHaveBeenCalled();
    expect(first).toHaveFocus();
  });

  it('Enter on a focused list item selects it', async () => {
    renderApp(<Harness />);

    const first = await screen.findByRole('button', { name: 'A00' });
    first.focus();
    await userEvent.keyboard('{Enter}');

    expect(useFilterStore.getState().selectedNameTitle).toBe('A00');
  });

  it('chevronSide="right" flips the chevron to the right edge of the flex row', async () => {
    renderApp(
      <Harness>
        <NameList chevronSide="right" />
      </Harness>,
    );

    await screen.findByRole('button', { name: 'A00' });

    const virtuoso = screen.getByTestId('virtuoso');
    const wrapper = virtuoso.parentElement!;
    expect(wrapper).toHaveAttribute('data-chevron-side', 'right');
    expect(wrapper).toHaveClass('flex-row-reverse');
  });

  it('chevronSide defaults to "left" (no flex-row-reverse)', async () => {
    renderApp(<Harness />);

    await screen.findByRole('button', { name: 'A00' });

    const wrapper = screen.getByTestId('virtuoso').parentElement!;
    expect(wrapper).toHaveAttribute('data-chevron-side', 'left');
    expect(wrapper).not.toHaveClass('flex-row-reverse');
  });

  it('variant="results" makes filtered[0] the centered red focal and renders neighbors as plain larger rows', async () => {
    renderApp(
      <Harness>
        <NameList variant="results" />
      </Harness>,
    );

    const first = await screen.findByRole('button', { name: 'A00' });
    expect(first).toHaveClass('text-red-main');
    expect(first).toHaveClass('text-center');
    expect(first).toHaveClass('md:text-[52px]');

    const second = screen.getByRole('button', { name: 'B01' });
    expect(second).toHaveClass('text-center');
    expect(second).toHaveClass('md:text-[40px]');
    expect(second).not.toHaveClass('text-red-main');
    expect(second).not.toHaveAttribute('style');

    const third = screen.getByRole('button', { name: 'C02' });
    expect(third).toHaveClass('text-center');
    expect(third).toHaveClass('md:text-[40px]');
    expect(third).not.toHaveAttribute('style');
  });
});
