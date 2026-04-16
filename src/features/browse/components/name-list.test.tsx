import { http, HttpResponse } from 'msw';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../stores/filter-store';
import { useFilterUrlSync } from '../stores/use-filter-url-sync';
import type { RawName } from '../types';

import { NameList } from './name-list';

// Virtuoso relies on ResizeObserver + layout measurement that jsdom can't
// provide — it would render zero items in a test. Replace it with a naive
// renderer that just maps over the data. Virtualization and scroll are
// verified via Playwright at the E2E layer.
vi.mock('react-virtuoso', () => ({
  Virtuoso: <T,>({
    data,
    itemContent,
  }: {
    data: T[];
    itemContent: (index: number, item: T) => ReactNode;
  }) => (
    <div>
      {data.map((item, i) => (
        <div key={i}>{itemContent(i, item)}</div>
      ))}
    </div>
  ),
  // The real module exports more — any unused exports are allowed here.
}));

function LocationProbe() {
  const location = useLocation();
  return (
    <div data-testid="location">{location.pathname + location.search}</div>
  );
}

/**
 * Mount `useFilterUrlSync` alongside `NameList` so the URL side-effect fires
 * when the store mutates. Without the hook, the store still updates but
 * nothing pushes to the router.
 */
function Harness() {
  useFilterUrlSync();
  return (
    <>
      <LocationProbe />
      <NameList />
    </>
  );
}

const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: [],
  },
  {
    id: 'benji-id',
    title: 'Benji',
    definition: '<p>A famous movie dog.</p>',
    gender: ['M'],
    categories: [],
  },
];

describe('NameList', () => {
  it('renders each name returned by useNames', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );

    renderApp(<Harness />);

    expect(
      await screen.findByRole('button', { name: 'Andromeda' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Benji' })).toBeInTheDocument();
  });

  it('clicking a name selects it in the store and mirrors to the URL', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );

    renderApp(<Harness />);

    const andromeda = await screen.findByRole('button', { name: 'Andromeda' });
    await userEvent.click(andromeda);

    expect(useFilterStore.getState().selectedNameId).toBe('andromeda-id');
    await waitFor(() => {
      expect(screen.getByTestId('location')).toHaveTextContent(
        'n=andromeda-id',
      );
    });
  });

  it('renders the empty-state copy when filtered results are zero', async () => {
    server.use(http.get('*/api/names', () => HttpResponse.json({ data: [] })));

    renderApp(<Harness />);

    expect(
      await screen.findByText(/no names match these filters/i),
    ).toBeInTheDocument();
  });
});
