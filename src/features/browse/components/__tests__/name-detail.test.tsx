import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';

import { server } from '@/testing/mocks/server';
import { renderApp, screen, userEvent, waitFor } from '@/testing/test-utils';

import { useFilterStore } from '../../stores/filter-store';
import type { RawName } from '../../types';
import { NameDetail } from '../name-detail';

// Overlap fixture: Andromeda (selected) shares two categories with Apollo,
// one each with Ares and Atlas, none with Boris. Top-3 should sort by
// overlap DESC, then title ASC: Apollo, Ares, Atlas.
const FIXTURE: RawName[] = [
  {
    id: 'andromeda-id',
    title: 'Andromeda',
    definition: '<p>The hero of Homer&rsquo;s Iliad.</p>',
    gender: ['F'],
    categories: ['cat1', 'cat2'],
  },
  {
    id: 'apollo-id',
    title: 'Apollo',
    definition: '<p>Greek god of the sun.</p>',
    gender: ['M'],
    categories: ['cat1', 'cat2'],
  },
  {
    id: 'atlas-id',
    title: 'Atlas',
    definition: '<p>Titan who holds the sky.</p>',
    gender: ['M'],
    categories: ['cat1'],
  },
  {
    id: 'ares-id',
    title: 'Ares',
    definition: '<p>Greek god of war.</p>',
    gender: ['M'],
    categories: ['cat2'],
  },
  {
    id: 'boris-id',
    title: 'Boris',
    definition: '<p>Unrelated.</p>',
    gender: ['M'],
    categories: ['cat3'],
  },
];

describe('NameDetail', () => {
  it('renders nothing when no name is selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );

    renderApp(<NameDetail />);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
  });

  it('renders the title and stripped description when a name is selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    expect(
      await screen.findByRole('heading', { name: 'Andromeda', level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText(/The hero of Homer.*Iliad\./)).toBeInTheDocument();
  });

  it('shows the top-3 related names dash-joined in overlap-then-alpha order', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    await screen.findByRole('heading', { name: 'Andromeda' });
    await waitFor(() => {
      expect(screen.getByText('Apollo - Ares - Atlas')).toBeInTheDocument();
    });
    expect(screen.queryByText(/Boris/)).not.toBeInTheDocument();
  });

  it('updates document.title to "{name} - Pet Names" when selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    await screen.findByRole('heading', { name: 'Andromeda' });
    await waitFor(() => {
      expect(document.title).toBe('Andromeda - Pet Names');
    });
  });

  it('moves focus to the heading when a name is selected', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    renderApp(<NameDetail />);

    const heading = await screen.findByRole('heading', {
      name: 'Andromeda',
      level: 2,
    });
    await waitFor(() => expect(heading).toHaveFocus());
  });

  it('Escape clears the selection and restores focus to the list item', async () => {
    server.use(
      http.get('*/api/names', () => HttpResponse.json({ data: FIXTURE })),
    );
    useFilterStore.setState({ selectedNameTitle: 'Andromeda' });

    // Stand-in list-item for the focus-restore query to find.
    const stubItem = document.createElement('button');
    stubItem.setAttribute('data-name-title', 'Andromeda');
    stubItem.textContent = 'Andromeda';
    document.body.appendChild(stubItem);

    renderApp(<NameDetail />);

    const heading = await screen.findByRole('heading', { name: 'Andromeda' });
    await waitFor(() => expect(heading).toHaveFocus());

    await userEvent.keyboard('{Escape}');

    expect(useFilterStore.getState().selectedNameTitle).toBeNull();
    await waitFor(() => expect(stubItem).toHaveFocus());

    stubItem.remove();
  });
});
