import { http, HttpResponse } from 'msw';
import type { ReactNode, Ref } from 'react';
import { useImperativeHandle } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawName } from '../../types';
import { BrowseLayout } from '../browse-layout';

function stubMatchMedia(isDesktop: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string) => ({
      matches: query.includes('min-width: 768px') ? isDesktop : !isDesktop,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}

interface StubVirtuosoProps<T> {
  ref?: Ref<{ scrollToIndex: (args: unknown) => void }>;
  data: T[];
  itemContent: (index: number, item: T) => ReactNode;
}

vi.mock('react-virtuoso', () => ({
  Virtuoso: <T,>({ ref, data, itemContent }: StubVirtuosoProps<T>) => {
    useImperativeHandle(ref, () => ({ scrollToIndex: () => {} }), []);
    return (
      <div data-testid="virtuoso">
        {data.map((item, i) => (
          <div key={i}>{itemContent(i, item)}</div>
        ))}
      </div>
    );
  },
}));

const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: ['shared'],
  },
  {
    id: 'achilles-id',
    title: 'Achilles',
    definition: '<p>Greek warrior.</p>',
    gender: ['M'],
    categories: ['shared'],
  },
];

describe('BrowseLayout', () => {
  beforeEach(() => {
    useFilterStore.setState({
      gender: 'Both',
      letter: null,
      macroCategories: new Set(),
      rawCategories: new Set(),
      selectedNameTitle: null,
      page: 0,
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders the Cover hero when no name is selected', async () => {
    stubMatchMedia(true);
    renderApp(<BrowseLayout />);

    expect(await screen.findByText(/I NEED\s+A NAME/)).toBeInTheDocument();
    expect(
      screen.queryByRole('region', { name: 'Selected name details' }),
    ).not.toBeInTheDocument();
  });

  it('renders the master-detail pane when a name is selected', async () => {
    stubMatchMedia(true);
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<BrowseLayout />);

    expect(
      await screen.findByRole('region', { name: 'Selected name details' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/I NEED\s+A NAME/)).not.toBeInTheDocument();
  });

  it('wraps the filter chrome in a navigation landmark', async () => {
    stubMatchMedia(true);
    renderApp(<BrowseLayout />);

    const nav = await screen.findByRole('navigation', {
      name: 'Filter pet names',
    });
    expect(nav).toBeInTheDocument();
  });

  it('renders the detail inside a dialog on mobile', async () => {
    stubMatchMedia(false);
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<BrowseLayout />);

    await screen.findByRole('region', { name: 'Selected name details' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render a dialog on desktop', async () => {
    stubMatchMedia(true);
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<BrowseLayout />);

    await screen.findByRole('region', { name: 'Selected name details' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
