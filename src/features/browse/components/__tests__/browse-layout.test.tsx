import { http, HttpResponse } from 'msw';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

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

vi.mock('react-virtuoso', async () => await import('@/testing/virtuoso-stub'));

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
    });
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
  });

  it('renders the Cover hero when no name is selected', async () => {
    stubMatchMedia(true);
    renderApp(<BrowseLayout />);

    expect(await screen.findByText('I NEED')).toBeInTheDocument();
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
    expect(screen.queryByText('I NEED')).not.toBeInTheDocument();
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

  it('Escape on desktop clears the selection and restores focus to the list item', async () => {
    stubMatchMedia(true);
    useFilterStore.setState({
      gender: 'F',
      selectedNameTitle: 'Andromeda',
    });

    renderApp(<BrowseLayout />);

    const listItem = await screen.findByRole('button', { name: 'Andromeda' });

    await userEvent.keyboard('{Escape}');

    await waitFor(() => {
      expect(useFilterStore.getState().selectedNameTitle).toBeNull();
    });
    await waitFor(() => expect(listItem).toHaveFocus());
  });

  it('renders EmptyResults when filters exclude every name', async () => {
    stubMatchMedia(true);
    useFilterStore.setState({ gender: 'F', letter: 'Z' });

    renderApp(<BrowseLayout />);

    expect(
      await screen.findByRole('heading', { name: /no luck/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/female names starting with z/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId('results-puppy-img')).toBeInTheDocument();
  });

  it('Clear filters in EmptyResults resets gender + categories but keeps letter', async () => {
    stubMatchMedia(true);
    useFilterStore.setState({
      gender: 'F',
      letter: 'Z',
      macroCategories: new Set(['Famous']),
    });

    renderApp(<BrowseLayout />);

    const button = await screen.findByRole('button', {
      name: /clear filters/i,
    });
    await userEvent.click(button);

    await waitFor(() => {
      const state = useFilterStore.getState();
      expect(state.gender).toBe('Both');
      expect(state.macroCategories.size).toBe(0);
      expect(state.letter).toBe('Z');
    });
  });
});
